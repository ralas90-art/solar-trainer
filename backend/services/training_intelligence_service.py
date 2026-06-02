"""
SeptiVolt Training Intelligence Service

Orchestrates prediction generation, idempotent DB upserts, GHL sync,
and audit logging for the Training Intelligence Engine v1.

This is the only module that writes to the database. The prediction_engine
is pure and stateless. This service assembles the RepSnapshotContext from
live DB data, calls the engine, and persists results.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from sqlmodel import Session, select, func

from models.user import User, UserRole, UserStats, CoachingFlag, SimulationSession, Company
from models.enterprise_hierarchy import Branch
from models.curriculum import Curriculum
from models.progress import UserCurriculumProgress
from models.certifications import UserCertification
from models.user_invitations import SyncAuditLog
from models.training_predictions import (
    TrainingPrediction, PredictionAuditLog,
    PRED_STATUS_ACTIVE, PRED_STATUS_EXPIRED,
    AUDIT_GENERATED, AUDIT_UPDATED, AUDIT_EXPIRED, AUDIT_REFRESHED,
    AUDIT_DISMISSED, AUDIT_RESOLVED, AUDIT_GHL_SYNCED, AUDIT_GHL_FAILED,
)
from services.prediction_engine import RepSnapshotContext, PredictionResult, run_prediction_engine

# Lazy import to avoid circular imports at module load
def _get_thresholds(session: Session, company_id: str) -> dict:
    try:
        from routers.command_center import get_company_thresholds
        return get_company_thresholds(session, company_id)
    except Exception:
        return {
            "inactive_days": 7,
            "at_risk_quiz_threshold": 75,
            "at_risk_sim_threshold": 75,
            "certification_eligible_threshold": 82,
        }


# ─── Snapshot Assembly ────────────────────────────────────────────────────────

def _build_snapshot(session: Session, rep: User, thresholds: dict, rank: int, total_reps: int) -> RepSnapshotContext:
    """Assembles all training signal data for one rep into a RepSnapshotContext."""

    # Curriculum progress
    progress = session.exec(
        select(UserCurriculumProgress).where(
            UserCurriculumProgress.user_id == rep.username,
            UserCurriculumProgress.company_id == rep.company_id,
        ).order_by(UserCurriculumProgress.updated_at.desc())
    ).first()

    prog_pct = progress.progress_percentage if progress else 0.0
    quiz_avg = progress.quiz_average if progress else 0.0
    sim_avg  = progress.sim_average_score if progress else 0.0
    curr_status = progress.status if progress else "not_started"

    # Last 5 simulation sessions (chronological)
    recent_sims = session.exec(
        select(SimulationSession).where(
            SimulationSession.user_id == rep.username,
            SimulationSession.company_id == rep.company_id,
            SimulationSession.is_demo == False,
        ).order_by(SimulationSession.created_at.desc()).limit(5)
    ).all()
    recent_sims = list(reversed(recent_sims))  # oldest-first for trend calculation

    recent_scores = [s.score for s in recent_sims]

    # Inactivity
    last_sim_dt = recent_sims[-1].created_at if recent_sims else None
    days_inactive = (datetime.utcnow() - last_sim_dt).days if last_sim_dt else 9999

    # Sim score trend (slope)
    from services.prediction_engine import _slope
    sim_slope = _slope(recent_scores) if len(recent_scores) >= 2 else 0.0

    # Consecutive failures
    failed_consecutive = 0
    for s in reversed(recent_sims):
        if not s.passed:
            failed_consecutive += 1
        else:
            break

    # UserStats
    stats = session.get(UserStats, rep.username)
    total_score = stats.total_score if stats else 0
    current_streak = stats.current_streak if stats else 0

    # Passed scenario count (from scenario_progress JSON)
    passed_scenarios = 0
    if stats and stats.scenario_progress:
        try:
            sp = json.loads(stats.scenario_progress)
            passed_scenarios = sum(1 for v in sp.values() if isinstance(v, dict) and v.get("passed"))
        except Exception:
            pass

    # Coaching flags
    flags = session.exec(
        select(CoachingFlag).where(
            CoachingFlag.user_id == rep.username,
            CoachingFlag.company_id == rep.company_id,
            CoachingFlag.is_active == True,
        )
    ).all()

    active_flag_count = len(flags)
    high_severity_count = len([f for f in flags if f.severity == "high"])
    flag_type_counts: Dict[str, int] = {}
    for f in flags:
        flag_type_counts[f.flag_type] = flag_type_counts.get(f.flag_type, 0) + 1
    repeated = [ft for ft, count in flag_type_counts.items() if count >= 2]

    # Certification
    active_cert = session.exec(
        select(UserCertification).where(
            UserCertification.user_id == rep.username,
            UserCertification.company_id == rep.company_id,
            UserCertification.status == "ACTIVE",
        )
    ).first()

    return RepSnapshotContext(
        user_id=rep.username,
        company_id=rep.company_id or "",
        branch_id=rep.branch_id,
        team_id=rep.team_id,
        progress_percentage=prog_pct,
        quiz_average=quiz_avg,
        sim_average=sim_avg,
        curriculum_status=curr_status,
        recent_sim_scores=recent_scores,
        last_activity_date=last_sim_dt,
        days_inactive=days_inactive,
        sim_score_trend=sim_slope,
        failed_consecutive=failed_consecutive,
        total_score=total_score,
        current_streak=current_streak,
        passed_scenarios=passed_scenarios,
        active_flag_count=active_flag_count,
        high_severity_flag_count=high_severity_count,
        repeated_flag_types=repeated,
        has_active_certification=active_cert is not None,
        thresholds=thresholds,
        company_rep_count=max(total_reps, 1),
        company_rep_rank=rank,
    )


# ─── Idempotent Upsert ────────────────────────────────────────────────────────

def _upsert_prediction(
    session: Session,
    result: PredictionResult,
    rep: User,
    existing: Optional[TrainingPrediction],
) -> Tuple[TrainingPrediction, str]:
    """
    Creates or updates a TrainingPrediction row.
    Returns (record, action) where action is AUDIT_GENERATED or AUDIT_UPDATED.
    """
    now = datetime.utcnow()

    if existing:
        # Update if score changed significantly (>= 3 points) or severity changed
        score_delta = abs(existing.score - result.score)
        severity_changed = existing.severity != result.severity
        if score_delta < 3 and not severity_changed:
            return existing, "noop"  # skip — not significant enough to update

        existing.score = result.score
        existing.severity = result.severity
        existing.confidence = result.confidence
        existing.explanation_en = result.explanation_en
        existing.explanation_es = result.explanation_es
        existing.recommended_action_en = result.recommended_action_en
        existing.recommended_action_es = result.recommended_action_es
        existing.ghl_tags = json.dumps(result.ghl_tags)
        existing.ghl_custom_fields = json.dumps(result.ghl_custom_fields)
        existing.generated_at = now
        existing.expires_at = now + timedelta(days=30)
        existing.ghl_synced = False  # mark for re-sync if severity escalated
        session.add(existing)
        return existing, AUDIT_UPDATED
    else:
        pred = TrainingPrediction(
            company_id=rep.company_id or "",
            branch_id=rep.branch_id,
            team_id=rep.team_id,
            user_id=rep.username,
            prediction_type=result.prediction_type,
            score=result.score,
            severity=result.severity,
            confidence=result.confidence,
            explanation_en=result.explanation_en,
            explanation_es=result.explanation_es,
            recommended_action_en=result.recommended_action_en,
            recommended_action_es=result.recommended_action_es,
            ghl_tags=json.dumps(result.ghl_tags),
            ghl_custom_fields=json.dumps(result.ghl_custom_fields),
            status=PRED_STATUS_ACTIVE,
        )
        session.add(pred)
        session.flush()  # get the ID before audit log
        return pred, AUDIT_GENERATED


def _write_audit(session: Session, prediction_id: str, action: str, performed_by: str, notes: Optional[str] = None):
    log = PredictionAuditLog(
        prediction_id=prediction_id,
        action=action,
        performed_by=performed_by,
        notes=notes,
    )
    session.add(log)


# ─── GHL Sync ─────────────────────────────────────────────────────────────────

def _sync_prediction_to_ghl(session: Session, pred: TrainingPrediction, rep: User):
    """
    Syncs high-severity prediction to GHL. Non-blocking — logs failure but does not raise.
    """
    try:
        from services.ghl_sync import GHLSyncService
        tags = json.loads(pred.ghl_tags or "[]")
        GHLSyncService.sync_contact(
            db_session=session,
            user_id=pred.user_id,
            company_id=pred.company_id,
            email=rep.email or f"{rep.username}@company.com",
            first_name=rep.username.capitalize(),
            last_name="Rep",
            role=rep.role,
            training_status="in_progress",
            extra_tags=tags,
        )
        pred.ghl_synced = True
        pred.ghl_synced_at = datetime.utcnow()
        session.add(pred)

        # Log sync in SyncAuditLog
        audit = SyncAuditLog(
            company_id=pred.company_id,
            user_id=pred.user_id,
            provider="gohighlevel",
            sync_type=f"prediction_{pred.prediction_type}",
            status="success",
        )
        session.add(audit)
        _write_audit(session, pred.id, AUDIT_GHL_SYNCED, "system", f"Tags: {tags}")
    except Exception as e:
        print(f"[INTELLIGENCE-GHL] Sync failed for {pred.user_id} ({pred.prediction_type}): {e}")
        _write_audit(session, pred.id, AUDIT_GHL_FAILED, "system", str(e)[:200])


# ─── Core Service Functions ───────────────────────────────────────────────────

def generate_predictions_for_user(
    session: Session,
    rep: User,
    thresholds: Optional[dict] = None,
    rank: int = 1,
    total_reps: int = 1,
) -> List[TrainingPrediction]:
    """
    Runs the prediction engine for one rep. Idempotently upserts results.
    Returns the list of active TrainingPrediction records for this rep.
    """
    if not thresholds:
        thresholds = _get_thresholds(session, rep.company_id or "")

    ctx = _build_snapshot(session, rep, thresholds, rank, total_reps)
    raw_results = run_prediction_engine(ctx)
    persisted: List[TrainingPrediction] = []

    for result in raw_results:
        # Idempotency: look up existing active prediction for this (user, type)
        existing = session.exec(
            select(TrainingPrediction).where(
                TrainingPrediction.user_id == rep.username,
                TrainingPrediction.company_id == rep.company_id,
                TrainingPrediction.prediction_type == result.prediction_type,
                TrainingPrediction.status == PRED_STATUS_ACTIVE,
            )
        ).first()

        pred, action = _upsert_prediction(session, result, rep, existing)

        if action == "noop":
            persisted.append(pred)
            continue

        _write_audit(session, pred.id, action, "system",
                     f"score={result.score:.1f}, severity={result.severity}, confidence={result.confidence:.2f}")

        # Auto-sync high severity to GHL
        if result.severity == "high":
            _sync_prediction_to_ghl(session, pred, rep)

        persisted.append(pred)

    return persisted


def generate_predictions_for_company(
    session: Session,
    company_id: str,
    requested_by: str = "system",
) -> Dict[str, int]:
    """
    Runs prediction engine for all SALES_REP users in a company.
    Returns summary dict: {added, updated, noop, failed}.
    """
    thresholds = _get_thresholds(session, company_id)

    reps = session.exec(
        select(User).where(
            User.company_id == company_id,
            User.role == UserRole.SALES_REP,
            User.is_active == True,
        ).order_by(User.username)
    ).all()

    total_reps = len(reps)
    # Build rank by total_score
    stats_map: Dict[str, int] = {}
    all_stats = session.exec(
        select(UserStats).where(UserStats.user_id.in_([r.username for r in reps]))
    ).all()
    for s in all_stats:
        stats_map[s.user_id] = s.total_score
    sorted_reps = sorted(reps, key=lambda r: stats_map.get(r.username, 0), reverse=True)
    rank_map = {r.username: i + 1 for i, r in enumerate(sorted_reps)}

    summary = {"added": 0, "updated": 0, "noop": 0, "failed": 0, "total_reps": total_reps}

    for rep in reps:
        try:
            before_count = session.exec(
                select(func.count(TrainingPrediction.id)).where(
                    TrainingPrediction.user_id == rep.username,
                    TrainingPrediction.company_id == company_id,
                    TrainingPrediction.status == PRED_STATUS_ACTIVE,
                )
            ).first() or 0

            generate_predictions_for_user(
                session, rep,
                thresholds=thresholds,
                rank=rank_map.get(rep.username, 1),
                total_reps=total_reps,
            )

            after_count = session.exec(
                select(func.count(TrainingPrediction.id)).where(
                    TrainingPrediction.user_id == rep.username,
                    TrainingPrediction.company_id == company_id,
                    TrainingPrediction.status == PRED_STATUS_ACTIVE,
                )
            ).first() or 0

            delta = after_count - before_count
            if delta > 0:
                summary["added"] += delta
            else:
                summary["updated"] += 1
        except Exception as e:
            print(f"[INTELLIGENCE-SVC] Failed prediction for {rep.username}: {e}")
            summary["failed"] += 1

    session.commit()
    return summary


def generate_predictions_for_team(session: Session, team_id: str, company_id: str) -> Dict[str, int]:
    """Runs predictions for all reps in a specific team."""
    reps = session.exec(
        select(User).where(
            User.team_id == team_id,
            User.company_id == company_id,
            User.role == UserRole.SALES_REP,
            User.is_active == True,
        )
    ).all()

    thresholds = _get_thresholds(session, company_id)
    total_reps = len(reps)
    summary = {"added": 0, "updated": 0, "failed": 0, "total_reps": total_reps}

    for rank, rep in enumerate(reps, start=1):
        try:
            generate_predictions_for_user(session, rep, thresholds=thresholds, rank=rank, total_reps=total_reps)
            summary["added"] += 1
        except Exception as e:
            print(f"[INTELLIGENCE-SVC] Team prediction failed for {rep.username}: {e}")
            summary["failed"] += 1

    session.commit()
    return summary


def expire_stale_predictions(session: Session, company_id: Optional[str] = None) -> int:
    """
    Marks ACTIVE predictions as EXPIRED when expires_at < now.
    Writes audit logs for each expired record. Returns count.
    """
    now = datetime.utcnow()
    stmt = select(TrainingPrediction).where(
        TrainingPrediction.status == PRED_STATUS_ACTIVE,
        TrainingPrediction.expires_at < now,
    )
    if company_id:
        stmt = stmt.where(TrainingPrediction.company_id == company_id)

    stale = session.exec(stmt).all()
    for pred in stale:
        pred.status = PRED_STATUS_EXPIRED
        session.add(pred)
        _write_audit(session, pred.id, AUDIT_EXPIRED, "system",
                     f"Auto-expired after {(now - pred.generated_at).days} days")

    session.commit()
    return len(stale)


def dismiss_prediction(session: Session, prediction_id: str, dismissed_by: str) -> TrainingPrediction:
    """Dismisses an active prediction. Writes audit log."""
    pred = session.get(TrainingPrediction, prediction_id)
    if not pred:
        raise ValueError(f"Prediction '{prediction_id}' not found.")
    if pred.status != PRED_STATUS_ACTIVE:
        raise ValueError(f"Cannot dismiss prediction with status '{pred.status}'.")
    pred.status = "dismissed"
    pred.dismissed_by = dismissed_by
    pred.dismissed_at = datetime.utcnow()
    session.add(pred)
    _write_audit(session, pred.id, AUDIT_DISMISSED, dismissed_by)
    session.commit()
    return pred


def resolve_prediction(session: Session, prediction_id: str, resolved_by: str, notes: Optional[str] = None) -> TrainingPrediction:
    """Resolves a prediction with optional manager notes. Writes audit log."""
    pred = session.get(TrainingPrediction, prediction_id)
    if not pred:
        raise ValueError(f"Prediction '{prediction_id}' not found.")
    if pred.status not in (PRED_STATUS_ACTIVE, "dismissed"):
        raise ValueError(f"Cannot resolve prediction with status '{pred.status}'.")
    pred.status = "resolved"
    pred.resolved_by = resolved_by
    pred.resolved_at = datetime.utcnow()
    session.add(pred)
    _write_audit(session, pred.id, AUDIT_RESOLVED, resolved_by, notes)
    session.commit()
    return pred


def refresh_predictions(session: Session, company_id: str, requested_by: str = "system") -> Dict[str, int]:
    """
    Full refresh cycle for a company:
    1. Expire stale predictions
    2. Generate new predictions for all reps
    Returns combined summary.
    """
    expired_count = expire_stale_predictions(session, company_id=company_id)
    gen_summary = generate_predictions_for_company(session, company_id, requested_by=requested_by)
    gen_summary["expired"] = expired_count
    gen_summary["refreshed_by"] = requested_by
    return gen_summary

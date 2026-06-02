"""
SeptiVolt Enterprise Manager Command Center Router
Provides multi-tenant, company-scoped endpoints for metrics, rankings, and actions.
"""
from datetime import date, datetime, timedelta
import json
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select, func

from database import get_session
from models.user import (
    User, UserStats, UserRole, Company, Team,
    SimulationSession, Debrief, CoachingFlag
)
from models.enterprise_hierarchy import Branch
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress
from models.certifications import Certification, UserCertification
from models.user_invitations import UserInvitation, InvitationStatus
from services.email import EmailService
from services.ghl_sync import GHLSyncService

router = APIRouter(prefix="/api/v1/command-center", tags=["command-center"])

# ─── Future-Friendly Threshold Structure (V1 Config) ─────────────────────────

def get_company_thresholds(session: Session, company_id: str) -> dict:
    """
    Returns custom thresholds if defined, falling back to V1 defaults.
    In the future, this can query CompanyProfile or a separate configuration table.
    """
    return {
        "inactive_days": 7,
        "at_risk_quiz_threshold": 75,
        "at_risk_sim_threshold": 75,
        "certification_eligible_threshold": 82
    }

# ─── Auth & Tenant Security Guards ───────────────────────────────────────────

def _get_requesting_user(session: Session, x_user_id: str) -> User:
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication header 'X-User-Id'."
        )
    user = session.exec(select(User).where(User.username == x_user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session user not found."
        )
    return user

def _require_manager_or_admin(user: User):
    # Admins and managers only
    allowed = {UserRole.SUPER_ADMIN, UserRole.DEALER_ADMIN, UserRole.BRANCH_MANAGER, UserRole.TRAINER, UserRole.ADMIN, UserRole.MANAGER}
    if user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Manager or Admin permissions required."
        )

# ─── Helper Functions ────────────────────────────────────────────────────────

def _safe_json_parse(raw: Optional[str], fallback: Any) -> Any:
    if not raw:
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback

# ─── Endpoint 1: Executive Dashboard (Phase 1) ────────────────────────────────

@router.get("/executive")
def get_executive_summary(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    # 1. Total Users
    users_stmt = select(User).where(User.company_id == company_id, User.is_active == True)
    company_users = session.exec(users_stmt).all()
    total_users = len(company_users)
    rep_usernames = [u.username for u in company_users if u.role == UserRole.SALES_REP]

    # 2. Active Users (Active in last 30 days)
    cutoff = datetime.utcnow() - timedelta(days=30)
    active_reps_stmt = select(SimulationSession.user_id).where(
        SimulationSession.company_id == company_id,
        SimulationSession.created_at >= cutoff
    ).distinct()
    active_usernames = set(session.exec(active_reps_stmt).all())
    active_users_count = len([u for u in company_users if u.username in active_usernames or u.role != UserRole.SALES_REP])

    # 3. Pending Invitations
    invites_stmt = select(func.count(UserInvitation.id)).where(
        UserInvitation.company_id == company_id,
        UserInvitation.status == InvitationStatus.PENDING
    )
    pending_invites = session.exec(invites_stmt).first() or 0

    # 4. Courses Assigned
    assignments_stmt = select(func.count(CurriculumAssignment.id)).where(
        CurriculumAssignment.company_id == company_id
    )
    courses_assigned = session.exec(assignments_stmt).first() or 0

    # 5. Courses Completed & Completion Rate
    completed_stmt = select(func.count(UserCurriculumProgress.id)).where(
        UserCurriculumProgress.company_id == company_id,
        UserCurriculumProgress.status == "completed"
    )
    courses_completed = session.exec(completed_stmt).first() or 0
    completion_rate = round((courses_completed / max(1, courses_assigned)) * 100, 1)

    # 6. Certification Rate
    certs_stmt = select(func.count(UserCertification.id)).where(
        UserCertification.company_id == company_id
    )
    certs_count = session.exec(certs_stmt).first() or 0
    certification_rate = round((certs_count / max(1, len(rep_usernames))) * 100, 1)

    # 7. Averages (Quiz and Simulation)
    progress_stmt = select(UserCurriculumProgress).where(UserCurriculumProgress.company_id == company_id)
    progress_records = session.exec(progress_stmt).all()
    
    quiz_scores = [p.quiz_average for p in progress_records if p.quiz_average > 0]
    sim_scores = [p.sim_average_score for p in progress_records if p.sim_average_score > 0]
    
    avg_quiz = round(sum(quiz_scores) / len(quiz_scores), 1) if quiz_scores else 0.0
    avg_sim = round(sum(sim_scores) / len(sim_scores), 1) if sim_scores else 0.0

    # 8. Leaderboard Summary (Top 5)
    stats_stmt = select(UserStats).where(UserStats.user_id.in_(rep_usernames)).order_by(UserStats.total_score.desc()).limit(5)
    leaderboard_records = session.exec(stats_stmt).all()
    leaderboard = []
    for stat in leaderboard_records:
        rep_user = next((u for u in company_users if u.username == stat.user_id), None)
        leaderboard.append({
            "username": stat.user_id,
            "email": rep_user.email if rep_user else "",
            "total_score": stat.total_score,
            "streak": stat.current_streak
        })

    # 9. Prediction intelligence summary
    from models.training_predictions import TrainingPrediction, PRED_STATUS_ACTIVE
    high_risk_count = session.exec(
        select(func.count(TrainingPrediction.id)).where(
            TrainingPrediction.company_id == company_id,
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
            TrainingPrediction.prediction_type == "certification_failure_risk",
            TrainingPrediction.severity == "high",
        )
    ).first() or 0
    churn_risk_count = session.exec(
        select(func.count(TrainingPrediction.id)).where(
            TrainingPrediction.company_id == company_id,
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
            TrainingPrediction.prediction_type == "churn_risk",
        )
    ).first() or 0
    promotion_ready_count = session.exec(
        select(func.count(TrainingPrediction.id)).where(
            TrainingPrediction.company_id == company_id,
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
            TrainingPrediction.prediction_type == "promotion_ready",
        )
    ).first() or 0

    return {
        "total_users": total_users,
        "active_users": active_users_count,
        "pending_invitations": pending_invites,
        "courses_assigned": courses_assigned,
        "courses_completed": courses_completed,
        "completion_rate": completion_rate,
        "certification_rate": certification_rate,
        "avg_quiz_score": avg_quiz,
        "avg_sim_score": avg_sim,
        "leaderboard": leaderboard,
        # Phase 8: Training Intelligence summary
        "intelligence": {
            "high_risk_cert_count": high_risk_count,
            "churn_risk_count": churn_risk_count,
            "promotion_ready_count": promotion_ready_count,
        }
    }

# ─── Endpoint 2: Branch Performance (Phase 2) ───────────────────────────────

@router.get("/branches")
def get_branch_performance(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    branches = session.exec(select(Branch).where(Branch.company_id == company_id)).all()
    results = []

    for branch in branches:
        branch_users = session.exec(select(User).where(User.branch_id == branch.id, User.is_active == True)).all()
        user_count = len(branch_users)
        rep_usernames = [u.username for u in branch_users if u.role == UserRole.SALES_REP]

        if not rep_usernames:
            results.append({
                "branch_id": branch.id,
                "branch_name": branch.name,
                "users": user_count,
                "completion_rate": 0.0,
                "avg_quiz_score": 0.0,
                "avg_sim_score": 0.0,
                "certification_rate": 0.0,
                "training_velocity_days": 0.0,
                "health_score": 0.0
            })
            continue

        # Progress aggregations
        progress = session.exec(
            select(UserCurriculumProgress).where(UserCurriculumProgress.user_id.in_(rep_usernames))
        ).all()

        completion_rate = round(sum(p.progress_percentage for p in progress) / len(progress), 1) if progress else 0.0
        quiz_vals = [p.quiz_average for p in progress if p.quiz_average > 0]
        sim_vals = [p.sim_average_score for p in progress if p.sim_average_score > 0]
        
        avg_quiz = round(sum(quiz_vals) / len(quiz_vals), 1) if quiz_vals else 0.0
        avg_sim = round(sum(sim_vals) / len(sim_vals), 1) if sim_vals else 0.0

        # Certifications rate
        certs_count = session.exec(
            select(func.count(UserCertification.id)).where(UserCertification.user_id.in_(rep_usernames))
        ).first() or 0
        cert_rate = round((certs_count / len(rep_usernames)) * 100, 1)

        # Training velocity (Average days to complete)
        completed_progress = [p for p in progress if p.status == "completed" and p.completed_at and p.started_at]
        if completed_progress:
            velocities = [(p.completed_at - p.started_at).days for p in completed_progress]
            velocity = round(sum(velocities) / len(velocities), 1)
        else:
            velocity = 0.0

        # Health Score = (0.35 * completion_rate) + (0.25 * avg_sim) + (0.20 * avg_quiz) + (0.20 * cert_rate)
        health_score = round(
            (0.35 * completion_rate) +
            (0.25 * avg_sim) +
            (0.20 * avg_quiz) +
            (0.20 * cert_rate),
            1
        )

        results.append({
            "branch_id": branch.id,
            "branch_name": branch.name,
            "users": user_count,
            "completion_rate": completion_rate,
            "avg_quiz_score": avg_quiz,
            "avg_sim_score": avg_sim,
            "certification_rate": cert_rate,
            "training_velocity_days": velocity,
            "health_score": health_score
        })

    # Sort rankings automatically by health score descending
    results.sort(key=lambda x: x["health_score"], reverse=True)
    for idx, r in enumerate(results):
        r["branch_ranking"] = idx + 1

    return results

# ─── Endpoint 3: Team Performance (Phase 3) ──────────────────────────────────

@router.get("/teams")
def get_team_performance(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    teams = session.exec(select(Team).where(Team.company_id == company_id)).all()
    results = []

    for team in teams:
        team_users = session.exec(select(User).where(User.team_id == team.id, User.is_active == True)).all()
        user_count = len(team_users)
        rep_usernames = [u.username for u in team_users if u.role == UserRole.SALES_REP]

        # Resolve Manager Details
        manager_name = "Unassigned"
        if team.manager_id:
            mgr = session.get(User, team.manager_id)
            if mgr:
                manager_name = mgr.username

        if not rep_usernames:
            results.append({
                "team_id": team.id,
                "team_name": team.name,
                "manager": manager_name,
                "users": user_count,
                "completion_rate": 0.0,
                "certification_rate": 0.0,
                "avg_sim_score": 0.0,
                "health_score": 0.0
            })
            continue

        progress = session.exec(
            select(UserCurriculumProgress).where(UserCurriculumProgress.user_id.in_(rep_usernames))
        ).all()

        completion_rate = round(sum(p.progress_percentage for p in progress) / len(progress), 1) if progress else 0.0
        sim_vals = [p.sim_average_score for p in progress if p.sim_average_score > 0]
        avg_sim = round(sum(sim_vals) / len(sim_vals), 1) if sim_vals else 0.0

        certs_count = session.exec(
            select(func.count(UserCertification.id)).where(UserCertification.user_id.in_(rep_usernames))
        ).first() or 0
        cert_rate = round((certs_count / len(rep_usernames)) * 100, 1)

        # Team Health Score = (0.4 * completion_rate) + (0.4 * avg_sim) + (0.2 * certification_rate)
        health_score = round(
            (0.4 * completion_rate) +
            (0.4 * avg_sim) +
            (0.2 * cert_rate),
            1
        )

        results.append({
            "team_id": team.id,
            "team_name": team.name,
            "manager": manager_name,
            "users": user_count,
            "completion_rate": completion_rate,
            "certification_rate": cert_rate,
            "avg_sim_score": avg_sim,
            "health_score": health_score
        })

    # Sort rankings automatically by health score descending
    results.sort(key=lambda x: x["health_score"], reverse=True)
    return results

# ─── Endpoint 4: Rep Performance & Filters (Phase 4) ─────────────────────────

@router.get("/reps")
def get_reps_performance(
    branch_id: Optional[str] = None,
    team_id: Optional[str] = None,
    filter_type: Optional[str] = None,  # needs_coaching | certification_ready | inactive | top_performers
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"
    thresholds = get_company_thresholds(session, company_id)

    # Basic scoping
    stmt = select(User).where(User.company_id == company_id, User.role == UserRole.SALES_REP, User.is_active == True)
    if branch_id:
        stmt = stmt.where(User.branch_id == branch_id)
    if team_id:
        stmt = stmt.where(User.team_id == team_id)

    reps = session.exec(stmt).all()
    results = []

    for rep in reps:
        # Load progress records
        progress = session.exec(
            select(UserCurriculumProgress).where(
                UserCurriculumProgress.user_id == rep.username,
                UserCurriculumProgress.company_id == company_id
            )
        ).first()

        # Load certification records
        certs = session.exec(
            select(UserCertification).where(UserCertification.user_id == rep.username)
        ).all()

        # Load active flags
        active_flags = session.exec(
            select(CoachingFlag).where(
                CoachingFlag.user_id == rep.username,
                CoachingFlag.company_id == company_id,
                CoachingFlag.is_active == True
            )
        ).all()

        # Resolve latest activity date
        latest_sim = session.exec(
            select(SimulationSession.created_at)
            .where(SimulationSession.user_id == rep.username, SimulationSession.company_id == company_id)
            .order_by(SimulationSession.created_at.desc())
        ).first()
        last_active = latest_sim.isoformat() if latest_sim else "Never"

        # KPI progress scores
        prog_pct = progress.progress_percentage if progress else 0.0
        quiz_avg = progress.quiz_average if progress else 0.0
        sim_avg = progress.sim_average_score if progress else 0.0

        # Calculations for Rep Risk Score
        risk_score = 0
        if latest_sim and (datetime.utcnow() - latest_sim).days >= thresholds["inactive_days"]:
            risk_score += 30
        elif not latest_sim:
            risk_score += 30
        if quiz_avg > 0 and quiz_avg < thresholds["at_risk_quiz_threshold"]:
            risk_score += 30
        if sim_avg > 0 and sim_avg < thresholds["at_risk_sim_threshold"]:
            risk_score += 40

        # Coaching score based on flags
        coaching_score = 0
        for f in active_flags:
            if f.severity == "high":
                coaching_score = max(coaching_score, 100)
            elif f.severity == "medium":
                coaching_score = max(coaching_score, 50)
            else:
                coaching_score = max(coaching_score, 10)

        # Team name resolve
        team_name = "None"
        if rep.team_id:
            tm = session.get(Team, rep.team_id)
            if tm:
                team_name = tm.name

        rep_item = {
            "username": rep.username,
            "email": rep.email,
            "role": rep.role,
            "team_name": team_name,
            "progress_percentage": prog_pct,
            "quiz_average": quiz_avg,
            "sim_average": sim_avg,
            "certifications_count": len(certs),
            "last_activity": last_active,
            "risk_score": risk_score,
            "coaching_score": coaching_score,
            "active_flags_count": len(active_flags)
        }

        # Apply specific logic-filters
        if filter_type == "needs_coaching":
            # Rep has active flags or high risk
            if len(active_flags) > 0 or risk_score >= 60:
                results.append(rep_item)
        elif filter_type == "certification_ready":
            # Progress > 95%, quiz and sim averages above threshold, not yet certified
            if prog_pct >= 95.0 and quiz_avg >= thresholds["certification_eligible_threshold"] and sim_avg >= thresholds["certification_eligible_threshold"] and len(certs) == 0:
                results.append(rep_item)
        elif filter_type == "inactive":
            # No activity in thresholds inactive days
            if latest_sim and (datetime.utcnow() - latest_sim).days >= thresholds["inactive_days"]:
                results.append(rep_item)
            elif not latest_sim:
                results.append(rep_item)
        elif filter_type == "top_performers":
            # overall average sim/quiz above 85
            if quiz_avg >= 85.0 and sim_avg >= 85.0:
                results.append(rep_item)
        else:
            # Default no filter
            results.append(rep_item)

    return results

# ─── Endpoint 5: AI Coaching Intelligence Scan (Phase 5) ──────────────────────

@router.get("/coaching")
def scan_and_get_coaching_alerts(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """
    Evaluates rules dynamically, creates database alerts/flags, and returns active flags.
    """
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"
    thresholds = get_company_thresholds(session, company_id)

    # Fetch all reps in company
    reps = session.exec(
        select(User).where(User.company_id == company_id, User.role == UserRole.SALES_REP, User.is_active == True)
    ).all()

    for rep in reps:
        progress = session.exec(
            select(UserCurriculumProgress).where(
                UserCurriculumProgress.user_id == rep.username,
                UserCurriculumProgress.company_id == company_id
            )
        ).first()

        quiz_avg = progress.quiz_average if progress else 0.0
        sim_avg = progress.sim_average_score if progress else 0.0

        latest_sim = session.exec(
            select(SimulationSession)
            .where(SimulationSession.user_id == rep.username, SimulationSession.company_id == company_id)
            .order_by(SimulationSession.created_at.desc())
        ).first()

        # Rule 1: Low Quiz Average
        if quiz_avg > 0 and quiz_avg < thresholds["at_risk_quiz_threshold"]:
            existing = session.exec(
                select(CoachingFlag).where(
                    CoachingFlag.user_id == rep.username,
                    CoachingFlag.company_id == company_id,
                    CoachingFlag.flag_type == "low_score",
                    CoachingFlag.is_active == True
                )
            ).first()
            if not existing:
                flag = CoachingFlag(
                    user_id=rep.username,
                    company_id=company_id,
                    flag_type="low_score",
                    severity="medium",
                    title_en="Low Quiz Performance",
                    title_es="Bajo rendimiento en exámenes",
                    reason_en=f"Overall quiz average is {quiz_avg}%, which is below the {thresholds['at_risk_quiz_threshold']}% threshold.",
                    reason_es=f"El promedio general de exámenes es {quiz_avg}%, por debajo del límite del {thresholds['at_risk_quiz_threshold']}%.",
                    recommended_actions_json=json.dumps([
                        "Schedule a 10-minute concept review huddle",
                        "Recommend retaking Foundations or Objection stack quizzes"
                    ])
                )
                session.add(flag)

        # Rule 2: Simulator Struggles (Fail scenario 3 times consecutively)
        if latest_sim:
            recent_attempts = session.exec(
                select(SimulationSession)
                .where(SimulationSession.user_id == rep.username, SimulationSession.scenario_id == latest_sim.scenario_id)
                .order_by(SimulationSession.created_at.desc())
                .limit(3)
            ).all()
            if len(recent_attempts) >= 3 and all(not attempt.passed for attempt in recent_attempts):
                existing = session.exec(
                    select(CoachingFlag).where(
                        CoachingFlag.user_id == rep.username,
                        CoachingFlag.company_id == company_id,
                        CoachingFlag.flag_type == "at_risk",
                        CoachingFlag.is_active == True
                    )
                ).first()
                if not existing:
                    flag = CoachingFlag(
                        user_id=rep.username,
                        company_id=company_id,
                        flag_type="at_risk",
                        severity="high",
                        title_en="Simulator Obstacle",
                        title_es="Obstáculo en Simulador",
                        reason_en=f"Failed scenario '{latest_sim.scenario_name}' 3 consecutive times.",
                        reason_es=f"Falló el escenario '{latest_sim.scenario_name}' 3 veces consecutivas.",
                        recommended_actions_json=json.dumps([
                            "Conduct direct 1-on-1 objection roleplay",
                            "Review simulation debrief strengths & improvements checklist"
                        ])
                    )
                    session.add(flag)
                    # Trigger GoHighLevel alert
                    try:
                        GHLSyncService.sync_contact(
                            db_session=session,
                            user_id=rep.username,
                            company_id=company_id,
                            email=rep.email,
                            first_name=rep.username,
                            last_name="Trainee",
                            role=UserRole.SALES_REP,
                            training_status="at_risk"
                        )
                    except Exception as e:
                        print(f"[GHL-TRIGGER ERROR] Failed GHL alert dispatch: {e}")

        # Rule 3: Inactive 7+ Days
        last_date = latest_sim.created_at if latest_sim else None
        if last_date and (datetime.utcnow() - last_date).days >= thresholds["inactive_days"]:
            existing = session.exec(
                select(CoachingFlag).where(
                    CoachingFlag.user_id == rep.username,
                    CoachingFlag.company_id == company_id,
                    CoachingFlag.flag_type == "stale_activity",
                    CoachingFlag.is_active == True
                )
            ).first()
            if not existing:
                flag = CoachingFlag(
                    user_id=rep.username,
                    company_id=company_id,
                    flag_type="stale_activity",
                    severity="medium",
                    title_en="Inactive Roster Alert",
                    title_es="Alerta de Inactividad",
                    reason_en=f"No training or simulation activity recorded in the last {(datetime.utcnow() - last_date).days} days.",
                    reason_es=f"No se ha registrado actividad de simulación en los últimos {(datetime.utcnow() - last_date).days} días.",
                    recommended_actions_json=json.dumps([
                        "Send a magic-link login nudge reminder email",
                        "Assign clear training milestones for this week"
                    ])
                )
                session.add(flag)

        # Rule 4: Certification Eligible
        if progress and progress.progress_percentage >= 95.0 and quiz_avg >= thresholds["certification_eligible_threshold"] and sim_avg >= thresholds["certification_eligible_threshold"]:
            certs = session.exec(
                select(UserCertification).where(UserCertification.user_id == rep.username)
            ).all()
            if not certs:
                existing = session.exec(
                    select(CoachingFlag).where(
                        CoachingFlag.user_id == rep.username,
                        CoachingFlag.company_id == company_id,
                        CoachingFlag.flag_type == "custom",
                        CoachingFlag.is_active == True,
                        CoachingFlag.title_en == "Certification Eligible"
                    )
                ).first()
                if not existing:
                    flag = CoachingFlag(
                        user_id=rep.username,
                        company_id=company_id,
                        flag_type="custom",
                        severity="low",
                        title_en="Certification Eligible",
                        title_es="Elegible para Certificación",
                        reason_en="Passed all required modules and averages. Ready for certification issue.",
                        reason_es="Aprobó todos los módulos y promedios requeridos. Listo para emisión de certificación.",
                        recommended_actions_json=json.dumps([
                            "Review rep's final assessment transcripts",
                            "Issue certification from the action panel"
                        ])
                    )
                    session.add(flag)

    session.commit()

    # Get active flags for company
    active_flags = session.exec(
        select(CoachingFlag).where(CoachingFlag.company_id == company_id, CoachingFlag.is_active == True)
    ).all()

    return [
        {
            "id": f.id,
            "user_id": f.user_id,
            "flag_type": f.flag_type,
            "severity": f.severity,
            "title": f.title_en,
            "reason": f.reason_en,
            "recommended_actions": _safe_json_parse(f.recommended_actions_json, []),
            "created_at": f.created_at.isoformat()
        }
        for f in active_flags
    ]

# ─── Endpoint 6: Actions Center (Phase 6) ────────────────────────────────────

class AssignRequest(BaseModel):
    target_type: str  # company | branch | team | user
    target_id: str
    curriculum_id: Optional[str] = None
    certification_id: Optional[str] = None

@router.post("/actions/assign")
def assign_training(
    body: AssignRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    if body.curriculum_id:
        # Verify Curriculum exists
        curr = session.get(Curriculum, body.curriculum_id)
        if not curr:
            curr = Curriculum(id=body.curriculum_id, name=body.curriculum_id.replace("_", " ").title())
            session.add(curr)
            session.flush()

        # Add Assignment
        assignment = CurriculumAssignment(
            company_id=company_id,
            curriculum_id=body.curriculum_id,
            target_type=body.target_type,
            target_id=body.target_id,
            assigned_by=user.username
        )
        session.add(assignment)

        # Apply to progress tracking records
        rep_usernames = []
        if body.target_type == "user":
            rep_usernames.append(body.target_id)
        elif body.target_type == "team":
            reps = session.exec(select(User).where(User.team_id == body.target_id, User.company_id == company_id)).all()
            rep_usernames.extend([r.username for r in reps])
        elif body.target_type == "branch":
            reps = session.exec(select(User).where(User.branch_id == body.target_id, User.company_id == company_id)).all()
            rep_usernames.extend([r.username for r in reps])
        else: # company
            reps = session.exec(select(User).where(User.company_id == company_id)).all()
            rep_usernames.extend([r.username for r in reps])

        for username in rep_usernames:
            progress = session.exec(
                select(UserCurriculumProgress).where(
                    UserCurriculumProgress.user_id == username,
                    UserCurriculumProgress.curriculum_id == body.curriculum_id
                )
            ).first()
            if not progress:
                progress = UserCurriculumProgress(
                    user_id=username,
                    company_id=company_id,
                    curriculum_id=body.curriculum_id,
                    status="not_started",
                    progress_percentage=0.0
                )
                session.add(progress)

    if body.certification_id:
        # Direct issue/assignment
        if body.target_type != "user":
            raise HTTPException(status_code=400, detail="Certifications must be assigned directly to individual users.")
        
        # Verify user
        target_rep = session.exec(select(User).where(User.username == body.target_id)).first()
        if not target_rep or target_rep.company_id != company_id:
            raise HTTPException(status_code=404, detail="Target user not found.")

        # Ensure Certification exists
        cert = session.get(Certification, body.certification_id)
        if not cert:
            cert = Certification(id=body.certification_id, name=body.certification_id.replace("_", " ").title(), curriculum_id="solar_fundamentals_v1")
            session.add(cert)
            session.flush()

        # Issue user certification
        issued = UserCertification(
            id=str(uuid.uuid4()),
            user_id=body.target_id,
            company_id=company_id,
            certification_id=body.certification_id,
            verification_hash=str(uuid.uuid4())
        )
        session.add(issued)

        # Trigger GoHighLevel contact update
        try:
            GHLSyncService.sync_contact(
                db_session=session,
                user_id=body.target_id,
                company_id=company_id,
                email=target_rep.email,
                first_name=target_rep.username,
                last_name="Trainee",
                role=target_rep.role,
                training_status="completed"
            )
        except Exception as e:
            print(f"[GHL-TRIGGER ERROR] Failed GHL sync: {e}")

    session.commit()
    return {"status": "ok", "message": "Assignment processed successfully."}

class RemindRequest(BaseModel):
    username: str

@router.post("/actions/remind")
def send_reminder_nudge(
    body: RemindRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    target = session.exec(select(User).where(User.username == body.username, User.company_id == company_id)).first()
    if not target or not target.email:
        raise HTTPException(status_code=404, detail="Target user with email not found.")

    # Call SMTP delivery
    EmailService.send_email(
        to_email=target.email,
        subject="Action Required: Resume SeptiVolt Training",
        html_content=f"""
        <h3>Hello {target.username},</h3>
        <p>Your manager <strong>{user.username}</strong> has sent you a nudge to resume your training curriculum.</p>
        <p>Log back in and complete your daily challenge sessions to maintain your streak.</p>
        <a href="https://septivolt.com/login" style="display:inline-block;padding:12px 24px;background:#FF5722;color:white;text-decoration:none;font-weight:bold;border-radius:8px;">Open Sales Training Lobby</a>
        """
    )

    return {"status": "ok", "message": "Nudge notification sent successfully."}

# ─── Endpoint 7: Report Generation & Exports (Phase 8) ─────────────────────────

@router.get("/reports/export")
def export_command_center_report(
    report_type: str,  # roster | branches | teams
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    csv_data = []

    if report_type == "roster":
        csv_data.append("Username,Email,Role,Team,Progress,Quiz Avg,Sim Avg,Risk Score")
        reps = get_reps_performance(x_user_id=x_user_id, session=session)
        for r in reps:
            csv_data.append(f"{r['username']},{r['email']},{r['role']},{r['team_name']},{r['progress_percentage']},{r['quiz_average']},{r['sim_average']},{r['risk_score']}")

    elif report_type == "branches":
        csv_data.append("Branch Name,Users,Completion Rate,Quiz Avg,Sim Avg,Certs Rate,Health Score")
        branches = get_branch_performance(x_user_id=x_user_id, session=session)
        for b in branches:
            csv_data.append(f"{b['branch_name']},{b['users']},{b['completion_rate']},{b['avg_quiz_score']},{b['avg_sim_score']},{b['certification_rate']},{b['health_score']}")

    elif report_type == "teams":
        csv_data.append("Team Name,Manager,Users,Completion Rate,Sim Avg,Certs Rate,Health Score")
        teams = get_team_performance(x_user_id=x_user_id, session=session)
        for t in teams:
            csv_data.append(f"{t['team_name']},{t['manager']},{t['users']},{t['completion_rate']},{t['avg_sim_score']},{t['certification_rate']},{t['health_score']}")

    elif report_type == "predictions":
        from models.training_predictions import TrainingPrediction, PRED_STATUS_ACTIVE
        csv_data.append("Username,Team,Branch,Prediction Type,Severity,Score,Confidence,Explanation,Recommended Action,Generated At,Status")
        preds = session.exec(
            select(TrainingPrediction).where(
                TrainingPrediction.company_id == company_id,
                TrainingPrediction.status == PRED_STATUS_ACTIVE,
            ).order_by(TrainingPrediction.severity.desc(), TrainingPrediction.score.desc())
        ).all()
        for p in preds:
            explanation = (p.explanation_en or "").replace(",", ";")
            action = (p.recommended_action_en or "").replace(",", ";")
            csv_data.append(
                f"{p.user_id},{p.team_id or 'N/A'},{p.branch_id or 'N/A'},{p.prediction_type},{p.severity},{round(p.score, 1)},{round(p.confidence, 2)},{explanation},{action},{p.generated_at.isoformat()},{p.status}"
            )

    else:
        raise HTTPException(status_code=400, detail="Invalid report export type.")

    csv_string = "\n".join(csv_data)
    
    # Return as StreamingResponse
    def iter_csv():
        yield csv_string.encode("utf-8")

    filename = f"SeptiVolt_{report_type}_report_{date.today().isoformat()}.csv"
    return StreamingResponse(
        iter_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

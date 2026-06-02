"""
Training Intelligence Engine — API Router
Phase 8 — SeptiVolt v1

Endpoints:
  GET  /api/v1/training-intelligence/predictions    — list with filters
  GET  /api/v1/training-intelligence/summary        — executive summary
  POST /api/v1/training-intelligence/refresh        — trigger company scan
  POST /api/v1/training-intelligence/{id}/dismiss   — dismiss a prediction
  POST /api/v1/training-intelligence/{id}/resolve   — resolve a prediction
  POST /api/v1/training-intelligence/{id}/sync-ghl  — manual GHL sync
  POST /api/v1/training-intelligence/cron/refresh   — scheduled full scan
"""
import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select, func

from database import get_session
from models.user import User, UserRole, Company
from models.training_predictions import (
    TrainingPrediction, PredictionAuditLog,
    PRED_STATUS_ACTIVE, PRED_STATUS_DISMISSED, PRED_STATUS_RESOLVED,
    ALL_PREDICTION_TYPES,
)

router = APIRouter(prefix="/api/v1/training-intelligence", tags=["training-intelligence"])


# ─── Auth Guards ──────────────────────────────────────────────────────────────

def _get_user(session: Session, x_user_id: Optional[str]) -> User:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing authentication header 'X-User-Id'.")
    user = session.exec(select(User).where(User.username == x_user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Session user not found.")
    return user


def _require_manager(user: User):
    allowed = {
        UserRole.SUPER_ADMIN, UserRole.DEALER_ADMIN,
        UserRole.BRANCH_MANAGER, UserRole.TRAINER,
        UserRole.ADMIN, UserRole.MANAGER,
    }
    if user.role not in allowed:
        raise HTTPException(status_code=403, detail="Access denied: Manager or Admin permissions required.")


def _require_same_company(pred: TrainingPrediction, user: User):
    if pred.company_id != user.company_id and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Cross-company access denied.")


# ─── Serialization Helper ─────────────────────────────────────────────────────

def _serialize_prediction(pred: TrainingPrediction) -> Dict[str, Any]:
    ghl_tags_list = json.loads(pred.ghl_tags or "[]")
    return {
        "id": pred.id,
        "userId": pred.user_id,
        "companyId": pred.company_id,
        "branchId": pred.branch_id,
        "teamId": pred.team_id,
        "predictionType": pred.prediction_type,
        "score": pred.score,
        "severity": pred.severity,
        "confidence": pred.confidence,
        "explanationEn": pred.explanation_en,
        "explanationEs": pred.explanation_es,
        "recommendedActionEn": pred.recommended_action_en,
        "recommendedActionEs": pred.recommended_action_es,
        "ghlTags": ghl_tags_list,
        "ghlSynced": pred.ghl_synced,
        "ghlSyncedAt": pred.ghl_synced_at.isoformat() if pred.ghl_synced_at else None,
        "status": pred.status,
        "generatedAt": pred.generated_at.isoformat(),
        "expiresAt": pred.expires_at.isoformat(),
        "resolvedAt": pred.resolved_at.isoformat() if pred.resolved_at else None,
        "dismissedAt": pred.dismissed_at.isoformat() if pred.dismissed_at else None,
        "resolvedBy": pred.resolved_by,
        "dismissedBy": pred.dismissed_by,
    }


# ─── Endpoint 1: List Predictions ─────────────────────────────────────────────

@router.get("/predictions")
def list_predictions(
    prediction_type: Optional[str] = None,
    severity: Optional[str] = None,
    pred_status: Optional[str] = None,   # "active" | "dismissed" | "resolved" | "expired"
    branch_id: Optional[str] = None,
    team_id: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 100,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    List predictions scoped to the requesting manager's company.
    Supports filters by type, severity, status, branch, team, and rep.
    """
    manager = _get_user(session, x_user_id)
    _require_manager(manager)
    company_id = manager.company_id or "septivolt"

    stmt = select(TrainingPrediction).where(TrainingPrediction.company_id == company_id)

    if prediction_type and prediction_type in ALL_PREDICTION_TYPES:
        stmt = stmt.where(TrainingPrediction.prediction_type == prediction_type)
    if severity:
        stmt = stmt.where(TrainingPrediction.severity == severity)
    if pred_status:
        stmt = stmt.where(TrainingPrediction.status == pred_status)
    else:
        stmt = stmt.where(TrainingPrediction.status == PRED_STATUS_ACTIVE)
    if branch_id:
        stmt = stmt.where(TrainingPrediction.branch_id == branch_id)
    if team_id:
        stmt = stmt.where(TrainingPrediction.team_id == team_id)
    if user_id:
        stmt = stmt.where(TrainingPrediction.user_id == user_id)

    stmt = stmt.order_by(
        TrainingPrediction.severity.desc(),
        TrainingPrediction.score.desc(),
        TrainingPrediction.generated_at.desc(),
    ).limit(limit)

    results = session.exec(stmt).all()

    return {
        "companyId": company_id,
        "total": len(results),
        "predictions": [_serialize_prediction(p) for p in results],
    }


# ─── Endpoint 2: Executive Summary ────────────────────────────────────────────

@router.get("/summary")
def get_prediction_summary(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Executive-level prediction summary for the manager's company.
    Returns counts by type, severity, and trending team/branch risk.
    """
    manager = _get_user(session, x_user_id)
    _require_manager(manager)
    company_id = manager.company_id or "septivolt"

    active_preds = session.exec(
        select(TrainingPrediction).where(
            TrainingPrediction.company_id == company_id,
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
        )
    ).all()

    # Count by type
    type_counts: Dict[str, int] = {t: 0 for t in ALL_PREDICTION_TYPES}
    severity_counts = {"high": 0, "medium": 0, "low": 0}
    high_risk_reps = set()
    churn_reps = set()
    intervention_reps = set()
    promotion_reps = set()

    for p in active_preds:
        type_counts[p.prediction_type] = type_counts.get(p.prediction_type, 0) + 1
        severity_counts[p.severity] = severity_counts.get(p.severity, 0) + 1
        if p.prediction_type == "certification_failure_risk":
            high_risk_reps.add(p.user_id)
        if p.prediction_type == "churn_risk":
            churn_reps.add(p.user_id)
        if p.prediction_type == "manager_intervention_needed":
            intervention_reps.add(p.user_id)
        if p.prediction_type == "promotion_ready":
            promotion_reps.add(p.user_id)

    # Team risk summary
    team_risk: Dict[str, int] = {}
    for p in active_preds:
        if p.team_id and p.severity in ("high", "medium"):
            team_risk[p.team_id] = team_risk.get(p.team_id, 0) + 1

    teams_trending_down = sorted(team_risk.items(), key=lambda x: x[1], reverse=True)[:5]

    # Branch risk summary
    branch_risk: Dict[str, int] = {}
    for p in active_preds:
        if p.branch_id and p.severity == "high":
            branch_risk[p.branch_id] = branch_risk.get(p.branch_id, 0) + 1

    branches_at_risk = sorted(branch_risk.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "companyId": company_id,
        "totalActivePredictions": len(active_preds),
        "bySeverity": severity_counts,
        "byType": type_counts,
        "atRiskRepCount": len(high_risk_reps),
        "churnRiskRepCount": len(churn_reps),
        "interventionQueueCount": len(intervention_reps),
        "promotionReadyCount": len(promotion_reps),
        "teamsTrendingDown": [{"teamId": t, "highRiskCount": c} for t, c in teams_trending_down],
        "branchRiskSummary": [{"branchId": b, "highSeverityCount": c} for b, c in branches_at_risk],
        "generatedAt": datetime.utcnow().isoformat(),
    }


# ─── Endpoint 3: Refresh (Manager-triggered) ──────────────────────────────────

@router.post("/refresh")
def refresh_predictions_endpoint(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Triggers prediction refresh for the requesting manager's company scope.
    Idempotent — safe to call multiple times.
    """
    manager = _get_user(session, x_user_id)
    _require_manager(manager)
    company_id = manager.company_id or "septivolt"

    from services.training_intelligence_service import refresh_predictions
    summary = refresh_predictions(session, company_id=company_id, requested_by=manager.username)

    return {
        "success": True,
        "message": "Prediction refresh complete.",
        "summary": summary,
        "refreshedAt": datetime.utcnow().isoformat(),
    }


# ─── Endpoint 4: Dismiss Prediction ───────────────────────────────────────────

class DismissRequest(BaseModel):
    notes: Optional[str] = None


@router.post("/{prediction_id}/dismiss")
def dismiss_prediction_endpoint(
    prediction_id: str,
    body: DismissRequest = DismissRequest(),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    manager = _get_user(session, x_user_id)
    _require_manager(manager)

    pred = session.get(TrainingPrediction, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    _require_same_company(pred, manager)

    from services.training_intelligence_service import dismiss_prediction
    try:
        updated = dismiss_prediction(session, prediction_id, dismissed_by=manager.username)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "success": True,
        "message": f"Prediction '{prediction_id}' dismissed.",
        "status": updated.status,
        "dismissedAt": updated.dismissed_at.isoformat() if updated.dismissed_at else None,
    }


# ─── Endpoint 5: Resolve Prediction ───────────────────────────────────────────

class ResolveRequest(BaseModel):
    notes: Optional[str] = None


@router.post("/{prediction_id}/resolve")
def resolve_prediction_endpoint(
    prediction_id: str,
    body: ResolveRequest = ResolveRequest(),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    manager = _get_user(session, x_user_id)
    _require_manager(manager)

    pred = session.get(TrainingPrediction, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    _require_same_company(pred, manager)

    from services.training_intelligence_service import resolve_prediction
    try:
        updated = resolve_prediction(session, prediction_id, resolved_by=manager.username, notes=body.notes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "success": True,
        "message": f"Prediction '{prediction_id}' resolved.",
        "status": updated.status,
        "resolvedAt": updated.resolved_at.isoformat() if updated.resolved_at else None,
        "resolvedBy": updated.resolved_by,
    }


# ─── Endpoint 6: Manual GHL Sync ─────────────────────────────────────────────

@router.post("/{prediction_id}/sync-ghl")
def sync_ghl_endpoint(
    prediction_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Manually push a prediction to GHL (for medium/low severity where auto-sync is skipped)."""
    manager = _get_user(session, x_user_id)
    _require_manager(manager)

    pred = session.get(TrainingPrediction, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    _require_same_company(pred, manager)

    if pred.status != PRED_STATUS_ACTIVE:
        raise HTTPException(status_code=400, detail=f"Cannot sync prediction with status '{pred.status}'.")

    rep = session.exec(select(User).where(User.username == pred.user_id)).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Rep not found.")

    from services.training_intelligence_service import _sync_prediction_to_ghl
    _sync_prediction_to_ghl(session, pred, rep)
    session.commit()

    return {
        "success": True,
        "message": f"Prediction '{prediction_id}' synced to GHL.",
        "ghlSynced": pred.ghl_synced,
        "ghlSyncedAt": pred.ghl_synced_at.isoformat() if pred.ghl_synced_at else None,
    }


# ─── Endpoint 7: Cron Refresh (Scheduled) ────────────────────────────────────

@router.post("/cron/refresh")
def cron_refresh_endpoint(
    x_cron_secret: Optional[str] = Header(None, alias="X-Cron-Secret"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Scheduled full-company prediction refresh.
    Security: Requires X-Cron-Secret matching TRAINING_INTELLIGENCE_CRON_SECRET env var,
    or a super_admin session via X-User-Id.
    """
    cron_secret = os.getenv("TRAINING_INTELLIGENCE_CRON_SECRET", "")
    is_authorized = False

    if x_cron_secret and cron_secret and x_cron_secret == cron_secret:
        is_authorized = True
    elif x_user_id:
        try:
            user = _get_user(session, x_user_id)
            if user.role == UserRole.SUPER_ADMIN:
                is_authorized = True
        except Exception:
            pass

    if not is_authorized:
        raise HTTPException(status_code=403, detail="Unauthorized. Valid X-Cron-Secret or super_admin session required.")

    from services.training_intelligence_service import refresh_predictions, expire_stale_predictions

    # Load all active companies
    companies = session.exec(
        select(Company).where(Company.payment_status == "active")
    ).all()

    start = datetime.utcnow()
    total_summary = {
        "companiesScanned": len(companies),
        "predictionsAdded": 0,
        "predictionsUpdated": 0,
        "predictionsExpired": 0,
        "totalRepsScanned": 0,
        "failed": 0,
    }

    for company in companies:
        try:
            result = refresh_predictions(session, company_id=company.id, requested_by="cron")
            total_summary["predictionsAdded"] += result.get("added", 0)
            total_summary["predictionsUpdated"] += result.get("updated", 0)
            total_summary["predictionsExpired"] += result.get("expired", 0)
            total_summary["totalRepsScanned"] += result.get("total_reps", 0)
        except Exception as e:
            print(f"[CRON-INTELLIGENCE] Failed for company {company.id}: {e}")
            total_summary["failed"] += 1

    elapsed_ms = round((datetime.utcnow() - start).total_seconds() * 1000)
    total_summary["durationMs"] = elapsed_ms

    print(f"[CRON-INTELLIGENCE] Complete — {total_summary}")

    return {
        "success": True,
        "message": "Training intelligence cron refresh complete.",
        "summary": total_summary,
        "completedAt": datetime.utcnow().isoformat(),
    }

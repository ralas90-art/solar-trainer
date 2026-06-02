"""
Training Predictions Data Models
Phase 8 — SeptiVolt Training Intelligence Engine v1

Two tables:
  TrainingPrediction   — persists a prediction for a rep with lifecycle management
  PredictionAuditLog   — immutable audit trail for every action on a prediction
"""
from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


def _pred_id() -> str:
    return f"pred_{uuid.uuid4().hex[:12]}"


# ─── Prediction Type Constants ────────────────────────────────────────────────
# Used as string values in the prediction_type column.
# Keeping as constants avoids typos and makes queries consistent.

PRED_CERT_FAILURE    = "certification_failure_risk"
PRED_CHURN_RISK      = "churn_risk"
PRED_INTERVENTION    = "manager_intervention_needed"
PRED_RAPID_IMPROVE   = "rapid_improvement"
PRED_PROMOTION_READY = "promotion_ready"
PRED_TOP_PERFORMER   = "top_performer_forecast"

ALL_PREDICTION_TYPES = [
    PRED_CERT_FAILURE,
    PRED_CHURN_RISK,
    PRED_INTERVENTION,
    PRED_RAPID_IMPROVE,
    PRED_PROMOTION_READY,
    PRED_TOP_PERFORMER,
]

# ─── Status Constants ─────────────────────────────────────────────────────────

PRED_STATUS_ACTIVE    = "active"
PRED_STATUS_DISMISSED = "dismissed"
PRED_STATUS_RESOLVED  = "resolved"
PRED_STATUS_EXPIRED   = "expired"

# ─── Audit Action Constants ───────────────────────────────────────────────────

AUDIT_GENERATED  = "generated"
AUDIT_UPDATED    = "updated"
AUDIT_DISMISSED  = "dismissed"
AUDIT_RESOLVED   = "resolved"
AUDIT_EXPIRED    = "expired"
AUDIT_REFRESHED  = "refreshed"
AUDIT_GHL_SYNCED = "ghl_synced"
AUDIT_GHL_FAILED = "ghl_sync_failed"


class TrainingPrediction(SQLModel, table=True):
    """
    Persists a single prediction signal for a rep.

    Idempotency contract: At most ONE active prediction per (user_id, company_id, prediction_type).
    The service layer enforces this. On refresh, existing active predictions are updated (not duplicated).
    """
    __tablename__ = "training_predictions"

    id: str = Field(default_factory=_pred_id, primary_key=True)

    # Tenant isolation
    company_id: str = Field(index=True)
    branch_id: Optional[str] = Field(default=None, index=True)
    team_id: Optional[str] = Field(default=None, index=True)
    user_id: str = Field(index=True)  # username

    # Prediction type (one of ALL_PREDICTION_TYPES)
    prediction_type: str = Field(index=True)

    # Scoring
    score: float = Field(default=0.0)        # 0.0–100.0 risk/readiness intensity
    severity: str = Field(index=True)        # "high" | "medium" | "low"
    confidence: float = Field(default=0.0)  # 0.0–1.0

    # Human-readable bilingual content
    explanation_en: str = Field(default="")
    explanation_es: str = Field(default="")
    recommended_action_en: str = Field(default="")
    recommended_action_es: str = Field(default="")

    # GHL sync tracking
    ghl_tags: str = Field(default="[]")          # JSON list of tag strings
    ghl_custom_fields: str = Field(default="{}")  # JSON dict of field → value
    ghl_synced: bool = Field(default=False)
    ghl_synced_at: Optional[datetime] = Field(default=None)

    # Lifecycle
    status: str = Field(default=PRED_STATUS_ACTIVE, index=True)
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(days=30)
    )
    resolved_at: Optional[datetime] = Field(default=None)
    dismissed_at: Optional[datetime] = Field(default=None)
    resolved_by: Optional[str] = Field(default=None)   # manager username
    dismissed_by: Optional[str] = Field(default=None)  # manager username


class PredictionAuditLog(SQLModel, table=True):
    """
    Immutable audit trail for every action taken on a TrainingPrediction.
    Written on: generated, updated, dismissed, resolved, expired, ghl_synced.
    """
    __tablename__ = "prediction_audit_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    prediction_id: str = Field(index=True)  # FK to training_predictions.id
    action: str = Field(index=True)         # one of AUDIT_* constants
    performed_by: str = Field(default="system")  # username or "system" / "cron"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = Field(default=None)

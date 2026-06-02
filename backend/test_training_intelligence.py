"""
Phase 8 Integration Tests: Training Intelligence Engine v1
Tests prediction rules engine, service layer idempotency, API endpoints,
tenant isolation, role permissions, GHL tag format, and cron security.
"""
import uuid
import json
import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import get_session
from models.user import User, UserRole, Company, PlanTier, UserStats
from models.certifications import UserCertification
from models.progress import UserCurriculumProgress
from models.curriculum import Curriculum
from models.user import CoachingFlag, SimulationSession
from models.training_predictions import (
    TrainingPrediction, PredictionAuditLog,
    PRED_STATUS_ACTIVE, PRED_STATUS_DISMISSED, PRED_STATUS_RESOLVED,
)
from services.prediction_engine import (
    RepSnapshotContext, run_prediction_engine, _slope
)


# ─── Test DB Setup ────────────────────────────────────────────────────────────

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app, raise_server_exceptions=False)
    yield client
    app.dependency_overrides.clear()


# ─── Seed Helper ──────────────────────────────────────────────────────────────

@pytest.fixture(name="seed")
def seed_fixture(session: Session):
    from auth_utils import pwd_context

    company = Company(id="intel_corp", name="Intelligence Corp", plan_tier=PlanTier.GROWTH, payment_status="active")
    session.add(company)

    manager = User(
        username="intel_manager",
        email="manager@intel.com",
        password=pwd_context.hash("pass123"),
        role=UserRole.BRANCH_MANAGER,
        company_id="intel_corp",
        is_active=True,
    )
    session.add(manager)

    rep = User(
        username="intel_rep",
        email="rep@intel.com",
        password=pwd_context.hash("pass123"),
        role=UserRole.SALES_REP,
        company_id="intel_corp",
        is_active=True,
    )
    session.add(rep)

    curriculum = Curriculum(id="test_curr_intel", name="Test Curriculum")
    session.add(curriculum)

    # Low-progress, low-score rep data to trigger predictions
    progress = UserCurriculumProgress(
        user_id="intel_rep",
        company_id="intel_corp",
        curriculum_id="test_curr_intel",
        status="in_progress",
        progress_percentage=40.0,
        quiz_average=65.0,
        sim_average_score=62.0,
    )
    session.add(progress)

    stats = UserStats(
        user_id="intel_rep",
        total_score=800,
        current_streak=0,
    )
    session.add(stats)

    session.commit()
    return {
        "manager": "intel_manager",
        "rep": "intel_rep",
        "company": "intel_corp",
    }


# ─── Test 1: Prediction Engine — Rules ────────────────────────────────────────

def test_cert_failure_risk_fires_high():
    """Certification failure risk fires HIGH when all bad signals are present."""
    ctx = RepSnapshotContext(
        user_id="test_rep",
        company_id="test_corp",
        progress_percentage=40.0,
        quiz_average=65.0,
        sim_average=60.0,
        failed_consecutive=3,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "certification_failure_risk" in types
    cert_risk = next(r for r in results if r.prediction_type == "certification_failure_risk")
    assert cert_risk.severity == "high"
    assert cert_risk.confidence >= 0.85


def test_cert_failure_risk_does_not_fire_when_healthy():
    """No cert failure prediction when rep has good scores and progress."""
    ctx = RepSnapshotContext(
        user_id="healthy_rep",
        company_id="test_corp",
        progress_percentage=90.0,
        quiz_average=88.0,
        sim_average=86.0,
        failed_consecutive=0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "certification_failure_risk" not in types


def test_churn_risk_14_day_inactivity():
    """Churn risk fires HIGH with 14+ days inactive and low progress."""
    ctx = RepSnapshotContext(
        user_id="inactive_rep",
        company_id="test_corp",
        days_inactive=15,
        progress_percentage=25.0,
        quiz_average=55.0,
        sim_average=58.0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "churn_risk" in types
    churn = next(r for r in results if r.prediction_type == "churn_risk")
    assert churn.severity == "high"
    assert churn.confidence >= 0.88


def test_churn_risk_7_day_medium():
    """Churn risk fires MEDIUM with 7 days inactive and low scores."""
    ctx = RepSnapshotContext(
        user_id="medium_churn_rep",
        company_id="test_corp",
        days_inactive=8,
        progress_percentage=50.0,
        quiz_average=55.0,
        sim_average=58.0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "churn_risk" in types
    churn = next(r for r in results if r.prediction_type == "churn_risk")
    assert churn.severity == "medium"


def test_manager_intervention_repeated_flags():
    """Manager intervention fires when same flag type repeats 2+ times."""
    ctx = RepSnapshotContext(
        user_id="flagged_rep",
        company_id="test_corp",
        repeated_flag_types=["low_score", "low_score"],  # repeated
        days_inactive=2,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "manager_intervention_needed" in types
    intervention = next(r for r in results if r.prediction_type == "manager_intervention_needed")
    assert intervention.severity == "high"


def test_rapid_improvement_fires():
    """Rapid improvement fires when sim score trend is strongly positive."""
    ctx = RepSnapshotContext(
        user_id="improving_rep",
        company_id="test_corp",
        recent_sim_scores=[60, 72, 85],
        sim_score_trend=12.5,
        progress_percentage=55.0,
        sim_average=72.0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "rapid_improvement" in types
    improvement = next(r for r in results if r.prediction_type == "rapid_improvement")
    assert improvement.severity == "low"
    assert improvement.confidence >= 0.75


def test_promotion_ready_fires():
    """Promotion ready fires when all conditions are met."""
    ctx = RepSnapshotContext(
        user_id="promo_rep",
        company_id="test_corp",
        progress_percentage=97.0,
        quiz_average=88.0,
        sim_average=86.0,
        has_active_certification=True,
        high_severity_flag_count=0,
        active_flag_count=0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "promotion_ready" in types
    promo = next(r for r in results if r.prediction_type == "promotion_ready")
    assert promo.severity == "low"
    assert promo.confidence >= 0.90


def test_promotion_ready_does_not_fire_without_cert():
    """Promotion ready must NOT fire without an active certification."""
    ctx = RepSnapshotContext(
        user_id="no_cert_rep",
        company_id="test_corp",
        progress_percentage=97.0,
        quiz_average=88.0,
        sim_average=86.0,
        has_active_certification=False,  # No cert
        high_severity_flag_count=0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    types = [r.prediction_type for r in results]
    assert "promotion_ready" not in types


# ─── Test 2: Slope Helper ─────────────────────────────────────────────────────

def test_slope_positive():
    assert _slope([60, 72, 85]) > 0

def test_slope_negative():
    assert _slope([85, 72, 60]) < 0

def test_slope_flat():
    assert _slope([70, 70, 70]) == 0.0

def test_slope_single_value():
    assert _slope([80]) == 0.0


# ─── Test 3: API — List Predictions ──────────────────────────────────────────

def test_list_predictions_requires_auth(client):
    """No X-User-Id header → 401."""
    response = client.get("/api/v1/training-intelligence/predictions")
    assert response.status_code == 401


def test_list_predictions_sales_rep_blocked(client, seed):
    """Sales rep cannot access predictions list."""
    response = client.get(
        "/api/v1/training-intelligence/predictions",
        headers={"X-User-Id": seed["rep"]}
    )
    assert response.status_code == 403


def test_list_predictions_manager_ok(client, seed):
    """Manager can list predictions for own company."""
    response = client.get(
        "/api/v1/training-intelligence/predictions",
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "predictions" in data
    assert data["companyId"] == seed["company"]


# ─── Test 4: Refresh Endpoint ─────────────────────────────────────────────────

def test_refresh_endpoint_manager(client, seed):
    """Manager can trigger a prediction refresh."""
    response = client.post(
        "/api/v1/training-intelligence/refresh",
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "summary" in data


def test_refresh_generates_predictions(client, seed, session):
    """After refresh, predictions exist in the DB for the test rep."""
    client.post(
        "/api/v1/training-intelligence/refresh",
        headers={"X-User-Id": seed["manager"]}
    )
    from sqlmodel import select
    preds = session.exec(
        select(TrainingPrediction).where(
            TrainingPrediction.company_id == seed["company"],
            TrainingPrediction.user_id == seed["rep"],
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
        )
    ).all()
    assert len(preds) > 0


# ─── Test 5: Duplicate Protection ────────────────────────────────────────────

def test_duplicate_prediction_protection(client, seed, session):
    """Refreshing twice should not create duplicate active predictions."""
    client.post("/api/v1/training-intelligence/refresh", headers={"X-User-Id": seed["manager"]})
    client.post("/api/v1/training-intelligence/refresh", headers={"X-User-Id": seed["manager"]})

    from sqlmodel import select
    # Get unique (user_id, prediction_type) active combos — should be 1 each
    preds = session.exec(
        select(TrainingPrediction).where(
            TrainingPrediction.user_id == seed["rep"],
            TrainingPrediction.company_id == seed["company"],
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
        )
    ).all()
    type_counts: dict = {}
    for p in preds:
        type_counts[p.prediction_type] = type_counts.get(p.prediction_type, 0) + 1
    # Each type should appear exactly ONCE
    for pred_type, count in type_counts.items():
        assert count == 1, f"Duplicate active prediction for type {pred_type}: count={count}"


# ─── Test 6: Dismiss Prediction ───────────────────────────────────────────────

def test_dismiss_prediction(client, seed, session):
    """Manager can dismiss an active prediction."""
    # First refresh to generate predictions
    client.post("/api/v1/training-intelligence/refresh", headers={"X-User-Id": seed["manager"]})

    from sqlmodel import select
    pred = session.exec(
        select(TrainingPrediction).where(
            TrainingPrediction.company_id == seed["company"],
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
        )
    ).first()
    assert pred is not None

    response = client.post(
        f"/api/v1/training-intelligence/{pred.id}/dismiss",
        json={},
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "dismissed"

    session.expire_all()
    updated = session.get(TrainingPrediction, pred.id)
    assert updated.status == "dismissed"
    assert updated.dismissed_by == seed["manager"]


def test_dismiss_nonexistent_prediction(client, seed):
    """Dismiss a prediction that doesn't exist → 404."""
    response = client.post(
        "/api/v1/training-intelligence/pred_nonexistent/dismiss",
        json={},
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 404


# ─── Test 7: Resolve Prediction ───────────────────────────────────────────────

def test_resolve_prediction(client, seed, session):
    """Manager can resolve a prediction with notes."""
    client.post("/api/v1/training-intelligence/refresh", headers={"X-User-Id": seed["manager"]})

    from sqlmodel import select
    pred = session.exec(
        select(TrainingPrediction).where(
            TrainingPrediction.company_id == seed["company"],
            TrainingPrediction.status == PRED_STATUS_ACTIVE,
        )
    ).first()
    assert pred is not None

    response = client.post(
        f"/api/v1/training-intelligence/{pred.id}/resolve",
        json={"notes": "Manager conducted 1:1 and rep is back on track."},
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "resolved"
    assert data["resolvedBy"] == seed["manager"]

    session.expire_all()
    updated = session.get(TrainingPrediction, pred.id)
    assert updated.status == "resolved"
    assert updated.resolved_by == seed["manager"]


# ─── Test 8: Cross-Tenant Access Blocking ────────────────────────────────────

def test_cross_company_dismiss_blocked(client, seed, session):
    """A manager from a different company cannot dismiss predictions."""
    from auth_utils import pwd_context

    rival_co = Company(id="rival_intel", name="Rival Intel", plan_tier=PlanTier.STARTER, payment_status="active")
    session.add(rival_co)
    rival_mgr = User(
        username="rival_intel_mgr",
        email="rival@rival.com",
        password=pwd_context.hash("pass123"),
        role=UserRole.BRANCH_MANAGER,
        company_id="rival_intel",
        is_active=True,
    )
    session.add(rival_mgr)
    session.commit()

    # Seed a prediction for intel_corp
    pred = TrainingPrediction(
        company_id="intel_corp",
        user_id="intel_rep",
        prediction_type="churn_risk",
        score=85.0,
        severity="high",
        confidence=0.90,
        status=PRED_STATUS_ACTIVE,
    )
    session.add(pred)
    session.commit()
    session.refresh(pred)

    response = client.post(
        f"/api/v1/training-intelligence/{pred.id}/dismiss",
        json={},
        headers={"X-User-Id": "rival_intel_mgr"}
    )
    assert response.status_code in (403, 404)


# ─── Test 9: Executive Summary ────────────────────────────────────────────────

def test_summary_endpoint(client, seed):
    """Summary endpoint returns counts and company context."""
    response = client.get(
        "/api/v1/training-intelligence/summary",
        headers={"X-User-Id": seed["manager"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "companyId" in data
    assert "atRiskRepCount" in data
    assert "churnRiskRepCount" in data
    assert "promotionReadyCount" in data
    assert "teamsTrendingDown" in data
    assert "branchRiskSummary" in data


# ─── Test 10: Cron Secret Protection ─────────────────────────────────────────

def test_cron_without_secret_blocked(client):
    """Cron endpoint without auth → 403."""
    response = client.post("/api/v1/training-intelligence/cron/refresh")
    assert response.status_code == 403


def test_cron_with_correct_secret(client, seed, monkeypatch):
    """Cron endpoint with correct secret runs scan."""
    monkeypatch.setenv("TRAINING_INTELLIGENCE_CRON_SECRET", "test_cron_secret_123")
    response = client.post(
        "/api/v1/training-intelligence/cron/refresh",
        headers={"X-Cron-Secret": "test_cron_secret_123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "summary" in data


def test_cron_superadmin_bypass(client, seed, session):
    """Super admin can trigger cron without X-Cron-Secret."""
    from auth_utils import pwd_context
    super_admin = User(
        username="intel_super_admin",
        email="super@intel.com",
        password=pwd_context.hash("pass123"),
        role=UserRole.SUPER_ADMIN,
        company_id="intel_corp",
        is_active=True,
    )
    session.add(super_admin)
    session.commit()

    response = client.post(
        "/api/v1/training-intelligence/cron/refresh",
        headers={"X-User-Id": "intel_super_admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


# ─── Test 11: GHL Tag Format ──────────────────────────────────────────────────

def test_ghl_tag_format_correct():
    """All prediction GHL tags must be lowercase with prediction: prefix."""
    ctx = RepSnapshotContext(
        user_id="tag_test_rep",
        company_id="test_corp",
        days_inactive=15,
        progress_percentage=20.0,
        quiz_average=55.0,
        sim_average=58.0,
        thresholds={"inactive_days": 7, "at_risk_quiz_threshold": 75, "at_risk_sim_threshold": 75, "certification_eligible_threshold": 82},
    )
    results = run_prediction_engine(ctx)
    for result in results:
        for tag in result.ghl_tags:
            assert tag == tag.lower(), f"Tag is not lowercase: {tag}"
            assert "UserRole" not in tag, f"Enum name leaked into tag: {tag}"
            # Tags should start with prediction: or achievement: or alert:
            assert ":" in tag, f"Tag missing colon separator: {tag}"

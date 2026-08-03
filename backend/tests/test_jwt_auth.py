import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

import models
import main
from database import get_session
from models.user import User, UserRole, Company, PlanTier
from auth_utils import generate_signed_token, verify_signed_token_payload

# Setup in-memory SQLite database for test isolation
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

def override_get_session():
    with Session(engine) as session:
        yield session

client = TestClient(main.app)

@pytest.fixture(name="session", autouse=True)
def setup_db():
    main.app.dependency_overrides[get_session] = override_get_session
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Seed test companies
        cresca = Company(id="cresca_test", name="Cresca Test", plan_tier=PlanTier.GROWTH)
        rival = Company(id="rival_corp_test", name="Rival Corp", plan_tier=PlanTier.STARTER)
        session.add(cresca)
        session.add(rival)

        # Seed test users
        admin_user = User(
            username="cresca_admin",
            email="admin@cresca.test",
            password="hashed_password",
            role=UserRole.ADMIN,
            company_id="cresca_test"
        )
        rival_user = User(
            username="rival_admin",
            email="admin@rival.test",
            password="hashed_password",
            role=UserRole.ADMIN,
            company_id="rival_corp_test"
        )
        super_admin_user = User(
            username="super_admin_user",
            email="super@septivolt.com",
            password="hashed_password",
            role=UserRole.SUPER_ADMIN,
            company_id="septivolt"
        )
        rep_user = User(
            username="cresca_rep",
            email="rep@cresca.test",
            password="hashed_password",
            role=UserRole.SALES_REP,
            company_id="cresca_test"
        )
        session.add(admin_user)
        session.add(rival_user)
        session.add(super_admin_user)
        session.add(rep_user)
        session.commit()
    yield
    SQLModel.metadata.drop_all(engine)
    main.app.dependency_overrides.clear()

# ─── PHASE 1A TESTS ───────────────────────────────────────────────────────────

def test_missing_auth_header_returns_401():
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        json={"enabled_verticals": ["solar", "core_sales"]}
    )
    assert res.status_code == 401


def test_spoofed_x_user_id_alone_returns_401():
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"X-User-Id": "cresca_admin"},
        json={"enabled_verticals": ["solar", "core_sales"]}
    )
    assert res.status_code == 401


def test_invalid_jwt_signature_returns_401():
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"Authorization": "Bearer invalid.jwt.signature"},
        json={"enabled_verticals": ["solar", "core_sales"]}
    )
    assert res.status_code == 401


def test_expired_jwt_returns_401():
    expired_token = generate_signed_token("cresca_admin", expires_in=-100)
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"Authorization": f"Bearer {expired_token}"},
        json={"enabled_verticals": ["solar", "core_sales"]}
    )
    assert res.status_code == 401


def test_valid_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"Authorization": f"Bearer {token}"},
        json={"enabled_verticals": ["solar", "core_sales", "roofing"]}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["company_id"] == "cresca_test"


def test_valid_wrong_company_jwt_returns_403():
    token = generate_signed_token("rival_admin", role="admin", company_id="rival_corp_test")
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"Authorization": f"Bearer {token}"},
        json={"enabled_verticals": ["solar", "core_sales"]}
    )
    assert res.status_code == 403


def test_super_admin_cross_tenant_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.patch(
        "/api/v1/companies/cresca_test/enabled-verticals",
        headers={"Authorization": f"Bearer {token}"},
        json={"enabled_verticals": ["solar", "roofing"]}
    )
    assert res.status_code == 200


def test_token_contains_expected_claims():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    payload = verify_signed_token_payload(token)
    assert payload is not None
    assert payload["sub"] == "cresca_admin"
    assert payload["role"] == "admin"
    assert payload["company_id"] == "cresca_test"

# ─── PHASE 1B TESTS ───────────────────────────────────────────────────────────

def test_org_roster_missing_token_returns_401():
    res = client.get("/api/v1/companies/cresca_test/roster")
    assert res.status_code == 401


def test_org_roster_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/companies/cresca_test/roster",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_org_roster_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/companies/cresca_test/roster",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_org_roster_wrong_company_jwt_returns_403():
    token = generate_signed_token("rival_admin", role="admin", company_id="rival_corp_test")
    res = client.get(
        "/api/v1/companies/cresca_test/roster",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


def test_team_templates_missing_token_returns_401():
    res = client.get("/api/v1/team-templates")
    assert res.status_code == 401


def test_team_templates_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/team-templates",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_team_templates_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/team-templates",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_team_templates_super_admin_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.get(
        "/api/v1/team-templates",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

# ─── PHASE 1C TESTS ───────────────────────────────────────────────────────────

def test_invitations_missing_token_returns_401():
    res = client.get("/api/v1/invitations")
    assert res.status_code == 401


def test_invitations_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/invitations",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_invitations_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/invitations",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_command_center_missing_token_returns_401():
    res = client.get("/api/v1/command-center/executive")
    assert res.status_code == 401


def test_command_center_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/command-center/executive",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_command_center_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/command-center/executive",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_command_center_super_admin_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.get(
        "/api/v1/command-center/executive",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

# ─── PHASE 1D TESTS (TRAINING INTELLIGENCE, KPIS, CERTIFICATIONS) ────────────

def test_training_intelligence_missing_token_returns_401():
    res = client.get("/api/v1/training-intelligence/predictions")
    assert res.status_code == 401


def test_training_intelligence_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/training-intelligence/predictions",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_training_intelligence_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/training-intelligence/predictions",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_kpis_missing_token_returns_401():
    res = client.get("/api/v1/kpis/definitions")
    assert res.status_code == 401


def test_kpis_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/kpis/definitions",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_kpis_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/kpis/definitions",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_certifications_missing_token_returns_401():
    res = client.get("/api/v1/certifications/snapshot")
    assert res.status_code == 401


def test_certifications_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/certifications/snapshot",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_certifications_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/certifications/snapshot",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_certifications_public_verify_hash_endpoint():
    res = client.get("/api/v1/certifications/verify/non_existent_hash")
    # Public endpoint returns 404 for missing hash, NOT 401 unauthorized
    assert res.status_code == 404

# ─── PHASE 2 TESTS (CLEANUP: ADMIN, ENTERPRISE, BILLING, ANALYTICS SNAPSHOT) ──

def test_admin_integration_status_missing_token_returns_401():
    res = client.get("/api/v1/admin/integration-status")
    assert res.status_code == 401


def test_admin_integration_status_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/admin/integration-status",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_admin_integration_status_super_admin_jwt_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.get(
        "/api/v1/admin/integration-status",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_enterprise_leads_missing_token_returns_401():
    res = client.get("/enterprise/leads")
    assert res.status_code == 401


def test_enterprise_leads_spoofed_x_user_id_returns_401():
    res = client.get(
        "/enterprise/leads",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_enterprise_leads_super_admin_jwt_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.get(
        "/enterprise/leads",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200


def test_billing_checkout_missing_token_returns_401():
    res = client.post("/billing/create-checkout-session?company_id=cresca_test&tier=growth")
    assert res.status_code == 401


def test_billing_checkout_spoofed_x_user_id_returns_401():
    res = client.post(
        "/billing/create-checkout-session?company_id=cresca_test&tier=growth",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_billing_checkout_same_company_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.post(
        "/billing/create-checkout-session?company_id=cresca_test&tier=growth",
        headers={"Authorization": f"Bearer {token}"}
    )
    # 400 is expected because price IDs are unconfigured in test env, but NOT 401/403
    assert res.status_code in (200, 400)


def test_billing_checkout_wrong_company_returns_403():
    token = generate_signed_token("rival_admin", role="admin", company_id="rival_corp_test")
    res = client.post(
        "/billing/create-checkout-session?company_id=cresca_test&tier=growth",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


def test_analytics_snapshot_missing_token_returns_401():
    res = client.get("/api/v1/analytics/snapshot")
    assert res.status_code == 401


def test_analytics_snapshot_spoofed_x_user_id_returns_401():
    res = client.get(
        "/api/v1/analytics/snapshot",
        headers={"X-User-Id": "cresca_admin"}
    )
    assert res.status_code == 401


def test_analytics_snapshot_valid_jwt_allowed():
    token = generate_signed_token("cresca_admin", role="admin", company_id="cresca_test")
    res = client.get(
        "/api/v1/analytics/snapshot",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert res.json()["userId"] == "cresca_admin"


def test_analytics_snapshot_regular_user_impersonation_enforced_to_self():
    token = generate_signed_token("cresca_rep", role="sales_rep", company_id="cresca_test")
    res = client.get(
        "/api/v1/analytics/snapshot?user_id=cresca_admin",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    # Regular rep cannot impersonate admin; response is scoped to cresca_rep
    assert res.json()["userId"] == "cresca_rep"


def test_enterprise_update_ai_missing_internal_secret_returns_401():
    res = client.post(
        "/enterprise/inquiry/1/update-ai",
        json={"score": 90, "priority": "high", "research": "Great lead"}
    )
    assert res.status_code == 401


def test_enterprise_update_ai_wrong_internal_secret_returns_401():
    res = client.post(
        "/enterprise/inquiry/1/update-ai",
        headers={"X-Internal-Secret": "wrong_secret"},
        json={"score": 90, "priority": "high", "research": "Great lead"}
    )
    assert res.status_code == 401


def test_enterprise_update_ai_valid_internal_secret_allowed():
    res = client.post(
        "/enterprise/inquiry/1/update-ai",
        headers={"X-Internal-Secret": "septivolt_ai_internal_secret_2026"},
        json={"score": 90, "priority": "high", "research": "Great lead"}
    )
    # 404 is expected because inquiry 1 is not in test DB, but NOT 401 unauthorized
    assert res.status_code == 404

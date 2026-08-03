import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

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

main.app.dependency_overrides[get_session] = override_get_session
client = TestClient(main.app)

@pytest.fixture(name="session", autouse=True)
def setup_db():
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
            email="sa@septivolt.test",
            password="hashed_password",
            role=UserRole.SUPER_ADMIN,
            company_id="septivolt"
        )
        session.add(admin_user)
        session.add(rival_user)
        session.add(super_admin_user)
        session.commit()
    yield
    SQLModel.metadata.drop_all(engine)

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

# ─── PHASE 1B TESTS (ORGANIZATION & TEAM TEMPLATES) ───────────────────────────

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
    assert "roster" in res.json()


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
    assert isinstance(res.json(), list)


def test_team_templates_super_admin_allowed():
    token = generate_signed_token("super_admin_user", role="super_admin", company_id="septivolt")
    res = client.get(
        "/api/v1/team-templates",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

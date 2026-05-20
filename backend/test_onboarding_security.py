"""
SeptiVolt Phase 6D: Onboarding and Security Access Control Tests
==============================================================
Validates role gating, tenant isolation, and secure password behavior.
"""
import json
from fastapi.testclient import TestClient
from sqlmodel import Session, select

# Inject test database url if not set
import os
test_db_file = "test_onboarding.db"
if os.path.exists(test_db_file):
    try:
        os.remove(test_db_file)
    except:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{test_db_file}"

from database import engine
from main import app
from models.user import User, Company, PlanTier, UserRole, UserStats, Team
from models.company_settings import CompanyProfile, CompanyIntegration, CompanySalesAsset, CompanySetupState
from sqlmodel import SQLModel

client = TestClient(app)

from database import get_session

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    import models
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Create companies
        c1 = Company(id="c1_test", name="Company 1", plan_tier=PlanTier.GROWTH)
        c2 = Company(id="c2_test", name="Company 2", plan_tier=PlanTier.STARTER)
        session.add(c1)
        session.add(c2)
        
        # Create users
        # 1. Super Admin
        sa = User(username="super_admin", password="password", role=UserRole.ADMIN, company_id="septivolt")
        # 2. Company 1 Admin
        c1_admin = User(username="c1_admin", password="password", role=UserRole.ADMIN, company_id="c1_test")
        # 3. Company 1 Manager
        c1_mgr = User(username="c1_mgr", password="password", role=UserRole.MANAGER, company_id="c1_test")
        # 4. Company 1 Sales Rep
        c1_rep = User(username="c1_rep", password="password", role=UserRole.SALES_REP, company_id="c1_test")
        # 5. Company 2 Admin
        c2_admin = User(username="c2_admin", password="password", role=UserRole.ADMIN, company_id="c2_test")
        
        session.add(sa)
        session.add(c1_admin)
        session.add(c1_mgr)
        session.add(c1_rep)
        session.add(c2_admin)
        session.commit()

def test_role_gating():
    print("\n--- Running Test: Role Gating ---")
    
    # 1. Sales Rep attempting to create a user -> should be 403
    payload = {
        "username": "new_user_1",
        "email": "new1@septivolt.com",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "c1_rep"}
    res = client.post("/api/v1/companies/c1_test/members", json=payload, headers=headers)
    print(f"Rep User Creation Response: {res.status_code} {res.text}")
    assert res.status_code == 403
    assert "Sales reps are not allowed" in res.json()["detail"]

    # 2. Manager attempting to create a user -> should succeed (200)
    payload = {
        "username": "new_user_mgr_created",
        "email": "mgr_c@septivolt.com",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "c1_mgr"}
    res = client.post("/api/v1/companies/c1_test/members", json=payload, headers=headers)
    print(f"Manager User Creation Response: {res.status_code} {res.json().get('status')}")
    assert res.status_code == 200
    assert res.json()["action"] == "created"
    assert "temp_password" in res.json()


def test_tenant_isolation():
    print("\n--- Running Test: Tenant Isolation ---")
    
    # 1. Company 2 Admin trying to create user in Company 1 -> should be 403
    payload = {
        "username": "c2_intruder",
        "email": "intruder@septivolt.com",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "c2_admin"}
    res = client.post("/api/v1/companies/c1_test/members", json=payload, headers=headers)
    print(f"Cross-Tenant Member Creation: {res.status_code} {res.text}")
    assert res.status_code == 403

    # 2. Super Admin trying to create user in Company 1 -> should succeed (200)
    payload = {
        "username": "sa_created_user",
        "email": "sa@septivolt.com",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "super_admin"}
    res = client.post("/api/v1/companies/c1_test/members", json=payload, headers=headers)
    print(f"Super Admin Cross-Tenant Creation: {res.status_code}")
    assert res.status_code == 200


def test_readiness_calculation():
    print("\n--- Running Test: Readiness Calculation ---")
    
    # Check initial readiness score for c1_test (should be 25 because c1_test has users now)
    headers = {"X-User-Id": "c1_admin"}
    res = client.get("/api/v1/companies/c1_test/readiness", headers=headers)
    data = res.json()
    print(f"Readiness Score: {data['readiness_score']}")
    print(f"Checkpoints: {json.dumps(data['checkpoints'], indent=2)}")
    
    # Score should be 25 because roster is populated (we created c1_admin, etc.)
    # Profile, Integration, Assets are not set up yet
    assert data["readiness_score"] == 25
    assert data["checkpoints"]["roster"]["completed"] is True
    assert data["checkpoints"]["profile"]["completed"] is False
    assert data["checkpoints"]["integration"]["completed"] is False
    assert data["checkpoints"]["assets"]["completed"] is False


def test_password_security_and_reset():
    print("\n--- Running Test: Temporary Password and Reset ---")
    
    # Create user via Manager
    payload = {
        "username": "test_reset_user",
        "email": "reset@septivolt.com",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "c1_admin"}
    res = client.post("/api/v1/companies/c1_test/members", json=payload, headers=headers)
    temp_password = res.json()["temp_password"]
    
    # Log in with temporary password
    login_payload = {
        "identifier": "test_reset_user",
        "password": temp_password
    }
    res = client.post("/login", json=login_payload)
    print(f"Login response with temp password: {res.json()}")
    assert res.json()["temporary_password_required"] is True
    
    # Reset password
    reset_payload = {
        "username": "test_reset_user",
        "old_password": temp_password,
        "new_password": "NewSecurePassword2026!"
    }
    res = client.post("/api/v1/user/reset-password", json=reset_payload)
    print(f"Reset Password response: {res.json()}")
    assert res.status_code == 200
    
    # Log in again with new password
    login_payload["password"] = "NewSecurePassword2026!"
    res = client.post("/login", json=login_payload)
    assert res.json()["temporary_password_required"] is False
    print("Temporary password reset test passed!")


def test_team_management():
    print("Testing team endpoints...")
    # 1. Create a team
    payload = {"name": "Test Team Alpha"}
    headers = {"X-User-Id": "c1_admin"}
    res = client.post("/api/v1/companies/c1_test/teams", json=payload, headers=headers)
    assert res.status_code == 200
    team_id = res.json()["id"]
    assert res.json()["name"] == "Test Team Alpha"
    
    # 2. List teams
    res = client.get("/api/v1/companies/c1_test/teams", headers=headers)
    assert res.status_code == 200
    teams = res.json()
    assert any(t["id"] == team_id for t in teams)
    
    # 3. Rename team
    update_payload = {"name": "Test Team Omega"}
    res = client.put(f"/api/v1/companies/c1_test/teams/{team_id}", json=update_payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Test Team Omega"
    
    # 4. Assign rep to team
    assign_payload = {"team_id": team_id}
    res = client.put("/api/v1/user/c1_rep/team", json=assign_payload, headers=headers)
    assert res.status_code == 200
    
    # Verify rep team assignment in DB
    with Session(engine) as session:
        rep = session.exec(select(User).where(User.username == "c1_rep")).first()
        assert rep.team_id == team_id

    # 5. Delete team
    res = client.delete(f"/api/v1/companies/c1_test/teams/{team_id}", headers=headers)
    assert res.status_code == 200
    
    # Verify rep team is unassigned (None)
    with Session(engine) as session:
        rep = session.exec(select(User).where(User.username == "c1_rep")).first()
        assert rep.team_id is None
        
        # Verify team is deleted
        team = session.get(Team, team_id)
        assert team is None
        
    print("Team management endpoints tests passed!")


if __name__ == "__main__":
    try:
        setup_db()
        test_role_gating()
        test_tenant_isolation()
        test_readiness_calculation()
        test_password_security_and_reset()
        test_team_management()
        print("\n[SUCCESS] ALL SECURITY, ONBOARDING AND TEAM TESTS PASSED!")
    finally:
        # Clean up database connection before deleting file
        engine.dispose()
        if os.path.exists(test_db_file):
            try:
                os.remove(test_db_file)
            except Exception as e:
                print(f"Warning: could not clean up {test_db_file}: {e}")

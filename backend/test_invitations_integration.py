import json
import os
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel

test_db_file = "test_invitations.db"
if os.path.exists(test_db_file):
    try:
        os.remove(test_db_file)
    except:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{test_db_file}"
# To allow debug token in response
os.environ["ENV"] = "development"

from database import engine, get_session
from main import app
from models.user import User, Company, PlanTier, UserRole, UserStats, Team
from models.enterprise_hierarchy import Branch
from models.user_invitations import UserInvitation, InvitationStatus
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress

client = TestClient(app)

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    import models
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Create companies
        c1 = Company(id="septivolt_test", name="Septivolt Test Company", plan_tier=PlanTier.GROWTH)
        session.add(c1)
        
        # Create user accounts for testing
        sa = User(username="sa_user", password="password", role=UserRole.SUPER_ADMIN, company_id="septivolt_test")
        da = User(username="da_user", password="password", role=UserRole.DEALER_ADMIN, company_id="septivolt_test")
        bm = User(username="bm_user", password="password", role=UserRole.BRANCH_MANAGER, company_id="septivolt_test")
        rep = User(username="rep_user", password="password", role=UserRole.SALES_REP, company_id="septivolt_test")
        
        session.add(sa)
        session.add(da)
        session.add(bm)
        session.add(rep)
        
        # Create a branch and a team for c1
        branch = Branch(id="test_branch_1", company_id="septivolt_test", name="Test Branch")
        team = Team(id="test_team_1", company_id="septivolt_test", name="Test Team")
        session.add(branch)
        session.add(team)
        
        session.commit()

def test_invitation_permissions():
    print("\n--- Testing Invitation Permissions (RBAC) ---")
    
    # 1. Rep cannot invite anyone -> 403
    payload = {
        "email": "test-rep-invite@example.com",
        "first_name": "New",
        "last_name": "Rep",
        "role": "sales_rep"
    }
    headers = {"X-User-Id": "rep_user"}
    res = client.post("/api/v1/invitations", json=payload, headers=headers)
    assert res.status_code == 403, f"Expected 403, got {res.status_code}"
    
    # 2. Branch Manager cannot invite Super Admin -> 403
    payload = {
        "email": "new-sa@example.com",
        "first_name": "New",
        "last_name": "SA",
        "role": "super_admin"
    }
    headers = {"X-User-Id": "bm_user"}
    res = client.post("/api/v1/invitations", json=payload, headers=headers)
    assert res.status_code == 403
    
    # 3. Branch Manager can invite Trainer/Sales Rep/Observer -> 200
    payload = {
        "email": "invited-rep@example.com",
        "first_name": "Bob",
        "last_name": "Vance",
        "role": "sales_rep",
        "branch_id": "test_branch_1",
        "team_id": "test_team_1"
    }
    headers = {"X-User-Id": "bm_user"}
    res = client.post("/api/v1/invitations", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "created"
    assert "debug_raw_token" in data
    
    # Save token for validation
    return data["debug_raw_token"]

def test_validate_and_accept(token):
    print("\n--- Testing Invitation Validation and Acceptance ---")
    
    # 1. Validate invalid token -> 404
    res = client.post("/api/v1/invitations/validate", json={"token": "invalid-token-12345"})
    assert res.status_code == 404
    
    # 2. Validate valid token -> 200
    res = client.post("/api/v1/invitations/validate", json={"token": token})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "valid"
    assert data["email"] == "invited-rep@example.com"
    assert data["branch_id"] == "test_branch_1"
    assert data["team_id"] == "test_team_1"
    
    # 3. Accept and register
    accept_payload = {
        "token": token,
        "username": "bob_vance",
        "password": "Password123!"
    }
    res = client.post("/api/v1/invitations/accept", json=accept_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["username"] == "bob_vance"
    
    # 4. Verify DB side effects:
    #    - User created with branch_id, team_id, role
    #    - Default curriculum assigned
    #    - Progress entry created
    #    - Stats entry created
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == "bob_vance")).first()
        assert user is not None
        assert user.email == "invited-rep@example.com"
        assert user.branch_id == "test_branch_1"
        assert user.team_id == "test_team_1"
        assert user.role == "sales_rep"
        assert user.temporary_password_required is False
        
        stats = session.get(UserStats, "bob_vance")
        assert stats is not None
        
        # Curriculum check
        assign = session.exec(select(CurriculumAssignment).where(CurriculumAssignment.target_id == "bob_vance")).first()
        assert assign is not None
        assert assign.curriculum_id == "solar_fundamentals_v1"
        
        progress = session.exec(select(UserCurriculumProgress).where(UserCurriculumProgress.user_id == "bob_vance")).first()
        assert progress is not None
        assert progress.status == "not_started"
        
    # 5. Try to validate again -> 410 (already accepted)
    res = client.post("/api/v1/invitations/validate", json={"token": token})
    assert res.status_code == 410

def test_bulk_invite():
    print("\n--- Testing CSV Bulk Invitations ---")
    
    # Define a CSV string with a valid and an invalid row
    csv_data = (
        "email,first_name,last_name,role,team\n"
        "bulk-rep1@example.com,John,Doe,sales_rep,test_team_1\n"
        "bulk-rep2@example.com,Jane,Doe,sales_rep,invalid_team_abc\n"
    )
    
    headers = {"X-User-Id": "da_user"}
    payload = {
        "csv_content": csv_data,
        "branch_id": "test_branch_1"
    }
    
    res = client.post("/api/v1/invitations/bulk", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["success_count"] == 1
    assert data["failure_count"] == 1
    assert data["failures"][0]["reason"] == "Team 'invalid_team_abc' not found in company roster. Check team spelling."

def test_failed_sync_audit():
    print("\n--- Testing Failed GHL Sync Audit Logging ---")
    from models.company_settings import CompanyIntegration
    from models.user_invitations import SyncAuditLog
    
    with Session(engine) as session:
        # Create a GHL integration that will fail decryption
        integration = CompanyIntegration(
            company_id="septivolt_test",
            provider="gohighlevel",
            connection_status="connected",
            encrypted_credentials="this_will_fail_decryption_!!!!",
            location_id="test_loc_123"
        )
        session.add(integration)
        
        # Create a user to sync progress
        user = User(username="sync_fail_user", password="password", role=UserRole.SALES_REP, company_id="septivolt_test", email="fail@example.com")
        session.add(user)
        
        stats = UserStats(user_id="sync_fail_user", total_score=0, current_streak=0, lives=3)
        session.add(stats)
        session.commit()
        
    # Trigger progress sync (which will invoke GHLSyncService.sync_progress_to_ghl)
    res = client.post("/user/sync_fail_user/progress", json={
        "module_id": "test_mod",
        "type": "quiz",
        "passed": True,
        "xp": 100
    })
    assert res.status_code == 200
    
    # Check that a failed SyncAuditLog was created
    with Session(engine) as session:
        logs = session.exec(select(SyncAuditLog).where(SyncAuditLog.user_id == "sync_fail_user")).all()
        assert len(logs) > 0, "No sync audit log created for failed sync!"
        assert logs[0].status == "failed"
        assert "decrypt" in logs[0].details.lower()
        print(f"Verified failed sync audit log: {logs[0].details}")

def test_stripe_webhook_provisioning():
    print("\n--- Testing Stripe Webhook Provisioning & Invitation Seeding ---")
    from unittest.mock import patch
    
    mock_event = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "client_reference_id": "stripe_company_test",
                "customer": "cus_12345",
                "subscription": "sub_12345",
                "customer_details": {
                    "email": "owner-stripe@example.com",
                    "name": "Marcus Vance"
                },
                "metadata": {
                    "company_id": "stripe_company_test",
                    "tier": "enterprise"
                }
            }
        }
    }
    
    # Patch stripe.Webhook.construct_event to return our mock event
    with patch("stripe.Webhook.construct_event", return_value=mock_event):
        headers = {"stripe-signature": "test_signature"}
        res = client.post("/billing/webhook", json=mock_event, headers=headers)
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        assert res.json() == {"status": "success"}
        
    # Verify DB side effects
    with Session(engine) as session:
        # Check company provisioned
        company = session.get(Company, "stripe_company_test")
        assert company is not None, "Company was not provisioned by Stripe webhook!"
        assert company.plan_tier == PlanTier.ENTERPRISE
        assert company.payment_status == "active"
        assert company.stripe_customer_id == "cus_12345"
        
        # Check invitation provisioned
        stmt = select(UserInvitation).where(UserInvitation.email == "owner-stripe@example.com")
        invite = session.exec(stmt).first()
        assert invite is not None, "Invitation was not created by Stripe webhook!"
        assert invite.role == "dealer_admin"
        assert invite.company_id == "stripe_company_test"
        assert invite.first_name == "Marcus"
        assert invite.last_name == "Vance"
        print("Verified Stripe webhook provisioning and invitation creation successfully!")

    # --- Idempotency Check 1: Replay webhook while user is still pending ---
    with patch("stripe.Webhook.construct_event", return_value=mock_event):
        headers = {"stripe-signature": "test_signature"}
        res = client.post("/billing/webhook", json=mock_event, headers=headers)
        assert res.status_code == 200, f"Expected 200 on replay, got {res.status_code}"

    with Session(engine) as session:
        # Check that only one company exists with that ID
        companies = session.exec(select(Company).where(Company.id == "stripe_company_test")).all()
        assert len(companies) == 1, f"Expected exactly 1 company, got {len(companies)}"
        
        # Check that only one ACTIVE invitation exists for this email
        stmt = select(UserInvitation).where(
            UserInvitation.email == "owner-stripe@example.com",
            UserInvitation.status == InvitationStatus.PENDING
        )
        pending_invites = session.exec(stmt).all()
        assert len(pending_invites) == 1, f"Expected exactly 1 pending invitation, got {len(pending_invites)}"

    # Simulate that the user has accepted the invitation and is now registered
    with Session(engine) as session:
        registered_user = User(
            username="owner_stripe_registered",
            email="owner-stripe@example.com",
            password="hashedpassword",
            role=UserRole.ADMIN,
            company_id="stripe_company_test"
        )
        session.add(registered_user)
        session.commit()

    # --- Idempotency Check 2: Replay webhook after the user is registered ---
    with patch("stripe.Webhook.construct_event", return_value=mock_event):
        headers = {"stripe-signature": "test_signature"}
        res = client.post("/billing/webhook", json=mock_event, headers=headers)
        assert res.status_code == 200, f"Expected 200 on replay after registration, got {res.status_code}"

    with Session(engine) as session:
        # Confirm that no new invitation is created (the registered email check prevented it)
        total_invites = session.exec(select(UserInvitation).where(UserInvitation.email == "owner-stripe@example.com")).all()
        # Initial run created 1. Replay 1 (while pending) created 2nd. Replay 2 (after registration) should block, so total invites remains 2.
        assert len(total_invites) == 2, f"Expected exactly 2 invitations in history, got {len(total_invites)}"
        print("Verified duplicate webhook protection and idempotency successfully!")

if __name__ == "__main__":
    try:
        setup_db()
        token = test_invitation_permissions()
        test_validate_and_accept(token)
        test_bulk_invite()
        test_failed_sync_audit()
        test_stripe_webhook_provisioning()
        print("\n[SUCCESS] ALL INVITATION SYSTEM INTEGRATION TESTS PASSED!")
    finally:
        engine.dispose()
        if os.path.exists(test_db_file):
            try:
                os.remove(test_db_file)
            except Exception as e:
                print(f"Warning: could not clean up {test_db_file}: {e}")

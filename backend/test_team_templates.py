import json
from datetime import datetime
import os
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel

test_db_file = "test_templates.db"
if os.path.exists(test_db_file):
    try:
        os.remove(test_db_file)
    except:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{test_db_file}"
os.environ["ENV"] = "development"

from database import engine, get_session
from main import app
from models.user import User, Company, PlanTier, UserRole, UserStats, Team
from models.enterprise_hierarchy import Branch
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress
from models.certifications import Certification, UserCertification
from models.user_invitations import UserInvitation, InvitationStatus
from models.team_template import (
    TeamTemplate,
    TeamTemplateRoleRule,
    TeamTemplateCurriculumRule,
    TeamTemplateCertificationRule,
    TeamTemplateGHLRule,
    TeamTemplateTeamRule,
    TeamTemplateDefaultAssignmentRule,
    TeamTemplateApplicationLog,
)
from scripts.bootstrap_whitelabel import bootstrap_whitelabel

client = TestClient(app)

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Create companies
        c1 = Company(id="company_a", name="Company Alpha", plan_tier=PlanTier.ENTERPRISE)
        c2 = Company(id="company_b", name="Company Beta", plan_tier=PlanTier.GROWTH)
        session.add(c1)
        session.add(c2)
        
        # Create users for Company A
        sa = User(username="superadmin", password="password", role=UserRole.SUPER_ADMIN, company_id="company_a")
        da = User(username="dealeradmin_a", password="password", role=UserRole.DEALER_ADMIN, company_id="company_a")
        mgr_a = User(username="manager_a", password="password", role=UserRole.BRANCH_MANAGER, company_id="company_a")
        rep_a = User(username="rep_a", password="password", role=UserRole.SALES_REP, company_id="company_a", branch_id="b_a")
        
        # Create user for Company B
        da_b = User(username="dealeradmin_b", password="password", role=UserRole.DEALER_ADMIN, company_id="company_b")
        
        session.add(sa)
        session.add(da)
        session.add(mgr_a)
        session.add(rep_a)
        session.add(da_b)
        
        # Branch
        b_a = Branch(id="b_a", company_id="company_a", name="Branch Alpha")
        session.add(b_a)
        
        # Seed core curriculums
        session.add(Curriculum(id="solar_fundamentals_v1", name="Solar Fundamentals RAMPER v1"))
        session.add(Curriculum(id="objection_crusher_v1", name="Objection Crusher Mastery"))
        session.add(Curriculum(id="manager_command_center_mastery", name="Manager Command Center Mastery"))
        
        # Seed core certification
        session.add(Certification(id="septivolt_certified_rep", name="SeptiVolt Certified Solar Rep", curriculum_id="solar_fundamentals_v1"))
        
        session.commit()

def test_template_flow():
    setup_db()
    
    # ─── 1. SEED DEFAULT TEMPLATES ───
    # Boot Lifespan lifespan seeds templates via create_db_and_tables, but let's make sure
    from seed_templates import seed_templates
    seed_templates()
    
    # Verify templates seeded (Global Templates)
    response = client.get("/api/v1/team-templates", headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    global_templates = [t for t in data if t["is_global_template"]]
    assert len(global_templates) >= 3
    
    # ─── 2. TENANT ISOLATION CREATION ───
    # Dealer Admin A creates a local template
    payload = {
        "template_name": "Company A Custom Rep Path",
        "description": "Custom track for rep onboarding in Company A",
        "target_scope": "company",
        "is_global_template": False,
        "template_version": 1,
        "role_rules": ["sales_rep"],
        "curriculum_rules": [{"role": "sales_rep", "curriculum_id": "objection_crusher_v1"}],
        "certification_rules": [],
        "ghl_rules": [{"role": "sales_rep", "tag": "objection_crusher_assigned"}],
        "team_rules": ["Company A Closers"]
    }
    
    response = client.post("/api/v1/team-templates", json=payload, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 201
    custom_temp_id = response.json()["template_id"]
    assert custom_temp_id.startswith("temp_")
    
    # Verify dealeradmin_b CANNOT see Company A's local template
    response = client.get("/api/v1/team-templates", headers={"X-User-Id": "dealeradmin_b"})
    data = response.json()
    local_ids = [t["id"] for t in data if not t["is_global_template"]]
    assert custom_temp_id not in local_ids
    
    # Verify dealeradmin_b CANNOT fetch it directly
    response = client.get(f"/api/v1/team-templates/{custom_temp_id}", headers={"X-User-Id": "dealeradmin_b"})
    assert response.status_code == 403
    
    # Verify Super Admin can see and fetch it directly
    response = client.get(f"/api/v1/team-templates/{custom_temp_id}", headers={"X-User-Id": "superadmin"})
    assert response.status_code == 200
    assert response.json()["template_name"] == "Company A Custom Rep Path"

    # ─── 3. TEMPLATE VERSIONING ───
    # Create v2 of custom template
    payload_v2 = {
        "template_name": "Company A Custom Rep Path v2",
        "description": "Newer version",
        "target_scope": "company",
        "is_global_template": False,
        "template_version": 2,
        "parent_template_id": custom_temp_id,
        "role_rules": ["sales_rep"],
        "curriculum_rules": [
            {"role": "sales_rep", "curriculum_id": "solar_fundamentals_v1"},
            {"role": "sales_rep", "curriculum_id": "objection_crusher_v1"}
        ]
    }
    response = client.post("/api/v1/team-templates", json=payload_v2, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 201
    v2_temp_id = response.json()["template_id"]
    
    response = client.get(f"/api/v1/team-templates/{v2_temp_id}", headers={"X-User-Id": "dealeradmin_a"})
    assert response.json()["template_version"] == 2
    assert response.json()["parent_template_id"] == custom_temp_id

    # ─── 4. PREVIEW TEMPLATE ───
    preview_payload = {
        "target_type": "company",
        "target_id": "company_a"
    }
    response = client.post(f"/api/v1/team-templates/{v2_temp_id}/preview", json=preview_payload, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 200
    preview = response.json()
    assert preview["affected_users_count"] == 1
    # rep_a matches role sales_rep, so they receive assignments
    rep_assigns = [a for a in preview["curriculums_to_assign"] if a["username"] == "rep_a"]
    assert len(rep_assigns) == 2
    
    # ─── 5. APPLY TEMPLATE ───
    apply_payload = {
        "target_type": "company",
        "target_id": "company_a"
    }
    response = client.post(f"/api/v1/team-templates/{v2_temp_id}/apply", json=apply_payload, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 200
    apply_result = response.json()
    assert apply_result["status"] == "success"
    
    # Verify changes applied to database
    with Session(engine) as session:
        # Check Default Assignment Rule was created
        rule = session.exec(
            select(TeamTemplateDefaultAssignmentRule).where(
                TeamTemplateDefaultAssignmentRule.company_id == "company_a",
                TeamTemplateDefaultAssignmentRule.target_type == "company",
                TeamTemplateDefaultAssignmentRule.is_active == True
            )
        ).first()
        assert rule is not None
        assert rule.template_id == v2_temp_id
        
        # Check user curriculum progress created for rep_a
        prog_solar = session.exec(
            select(UserCurriculumProgress).where(
                UserCurriculumProgress.user_id == "rep_a",
                UserCurriculumProgress.curriculum_id == "solar_fundamentals_v1"
            )
        ).first()
        prog_objection = session.exec(
            select(UserCurriculumProgress).where(
                UserCurriculumProgress.user_id == "rep_a",
                UserCurriculumProgress.curriculum_id == "objection_crusher_v1"
            )
        ).first()
        
        assert prog_solar is not None
        assert prog_objection is not None
        
        # Verify idempotency: apply again and ensure no new progress rows created
        progress_count_before = len(session.exec(select(UserCurriculumProgress)).all())
    
    response = client.post(f"/api/v1/team-templates/{v2_temp_id}/apply", json=apply_payload, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 200
    
    with Session(engine) as session:
        progress_count_after = len(session.exec(select(UserCurriculumProgress)).all())
        assert progress_count_before == progress_count_after

    # ─── 6. DYNAMIC ONBOARDING / FUTURE USERS ───
    # Invite a new user
    invite_payload = {
        "email": "new_rep@companya.com",
        "first_name": "New",
        "last_name": "Rep",
        "role": "sales_rep",
        "branch_id": "b_a",
        "team_id": None
    }
    response = client.post("/api/v1/invitations", json=invite_payload, headers={"X-User-Id": "dealeradmin_a"})
    assert response.status_code == 200, f"Invite post failed: {response.status_code} - {response.text}"
    token = response.json()["debug_raw_token"]

    
    # Accept the invitation
    accept_payload = {
        "token": token,
        "username": "new_rep_user",
        "password": "hashed_password"
    }
    response = client.post("/api/v1/invitations/accept", json=accept_payload)
    assert response.status_code == 200
    
    # Check that new_rep_user is auto-assigned the template's courses (solar_fundamentals & objection_crusher)
    # instead of just solar_fundamentals fallback
    with Session(engine) as session:
        new_progress = session.exec(
            select(UserCurriculumProgress).where(UserCurriculumProgress.user_id == "new_rep_user")
        ).all()
        # Should have 2 courses assigned from v2_temp_id template
        course_ids = {p.curriculum_id for p in new_progress}
        assert "solar_fundamentals_v1" in course_ids
        assert "objection_crusher_v1" in course_ids
        assert len(new_progress) == 2

def test_whitelabel_bootstrap_integration():
    # Bootstrap a brand new company using whitelabel script and standard template
    bootstrap_config = {
        "company_id": "bootstrap_corp",
        "company_name": "Bootstrap Corp Solar",
        "plan_tier": "enterprise",
        "admin_email": "admin@bootstrapcorp.com",
        "admin_first_name": "Boss",
        "admin_last_name": "Solar",
        "template_id": "temp_new_era_solar_standard",
        "branches": [{"id": "b_boot", "name": "Branch Boot"}],
        "teams": []
    }
    
    # Run whitelabel bootstrap function
    bootstrap_whitelabel(bootstrap_config)
    
    # Check that the default assignment rules were registered and teams created
    with Session(engine) as session:
        company = session.get(Company, "bootstrap_corp")
        assert company is not None
        
        # Standard template creates Miami Office & Orlando Office teams
        teams = session.exec(select(Team).where(Team.company_id == "bootstrap_corp")).all()
        team_names = {t.name for t in teams}
        assert "Miami Office" in team_names
        assert "Orlando Office" in team_names
        
        # Check active assignment rule
        rule = session.exec(
            select(TeamTemplateDefaultAssignmentRule).where(
                TeamTemplateDefaultAssignmentRule.company_id == "bootstrap_corp",
                TeamTemplateDefaultAssignmentRule.is_active == True
            )
        ).first()
        assert rule is not None
        assert rule.template_id == "temp_new_era_solar_standard"

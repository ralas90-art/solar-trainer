import json
import os
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel

test_db_file = "test_command_center.db"
if os.path.exists(test_db_file):
    try:
        os.remove(test_db_file)
    except:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{test_db_file}"
os.environ["ENV"] = "development"

from database import engine, get_session
from main import app
from models.user import User, Company, PlanTier, UserRole, UserStats, Team, SimulationSession, CoachingFlag
from models.enterprise_hierarchy import Branch
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress
from models.certifications import Certification, UserCertification
from models.user_invitations import UserInvitation, InvitationStatus

client = TestClient(app)

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:

        # Create company
        c1 = Company(id="septivolt_test", name="Septivolt Test Company", plan_tier=PlanTier.GROWTH)
        session.add(c1)
        
        # Create users
        mgr = User(username="mgr_user", password="password", role=UserRole.BRANCH_MANAGER, company_id="septivolt_test")
        rep1 = User(username="rep_user_1", password="password", role=UserRole.SALES_REP, company_id="septivolt_test", branch_id="b1", team_id="t1")
        rep2 = User(username="rep_user_2", password="password", role=UserRole.SALES_REP, company_id="septivolt_test", branch_id="b1", team_id="t1")
        session.add(mgr)
        session.add(rep1)
        session.add(rep2)
        
        # Create branch and team
        b1 = Branch(id="b1", company_id="septivolt_test", name="Branch One")
        t1 = Team(id="t1", company_id="septivolt_test", name="Team One", manager_id=mgr.id)
        session.add(b1)
        session.add(t1)
        
        # Create curriculum & assignments
        curr = Curriculum(id="solar_fundamentals_v1", name="Solar Fundamentals v1")
        session.add(curr)
        session.flush()
        
        assign1 = CurriculumAssignment(company_id="septivolt_test", curriculum_id="solar_fundamentals_v1", target_type="user", target_id="rep_user_1", assigned_by="mgr_user")
        assign2 = CurriculumAssignment(company_id="septivolt_test", curriculum_id="solar_fundamentals_v1", target_type="user", target_id="rep_user_2", assigned_by="mgr_user")
        session.add(assign1)
        session.add(assign2)
        
        # Create user curriculum progress
        prog1 = UserCurriculumProgress(
            user_id="rep_user_1", company_id="septivolt_test", curriculum_id="solar_fundamentals_v1",
            status="completed", progress_percentage=100.0, quiz_average=88.5, sim_average_score=84.0,
            started_at=datetime.utcnow() - timedelta(days=10), completed_at=datetime.utcnow() - timedelta(days=5)
        )
        prog2 = UserCurriculumProgress(
            user_id="rep_user_2", company_id="septivolt_test", curriculum_id="solar_fundamentals_v1",
            status="in_progress", progress_percentage=50.0, quiz_average=60.0, sim_average_score=62.0
        )
        session.add(prog1)
        session.add(prog2)
        
        # User stats
        stats1 = UserStats(user_id="rep_user_1", total_score=1500, current_streak=5)
        stats2 = UserStats(user_id="rep_user_2", total_score=200, current_streak=1)
        session.add(stats1)
        session.add(stats2)
        
        # Certifications
        cert = Certification(id="solar_closer_l1", name="Solar Closer L1", curriculum_id="solar_fundamentals_v1")
        session.add(cert)
        session.flush()
        
        user_cert = UserCertification(id="cert-uuid-1", user_id="rep_user_1", company_id="septivolt_test", certification_id="solar_closer_l1", verification_hash="hash-1")
        session.add(user_cert)
        
        session.commit()

def test_command_center_flow():
    setup_db()
    headers = {"X-User-Id": "mgr_user"}
    
    # 1. Test Executive Dashboard Endpoint
    res = client.get("/api/v1/command-center/executive", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_users"] == 3
    assert data["courses_assigned"] == 2
    assert data["completion_rate"] == 50.0  # 1 completed out of 2 assigned
    assert data["certification_rate"] == 50.0  # 1 certified out of 2 reps
    assert data["avg_quiz_score"] == 74.2  # avg of 88.5 and 60.0 -> 74.25 (rounds to 74.2 in python)
    assert data["avg_sim_score"] == 73.0  # avg of 84.0 and 62.0 -> 73.0
    
    # 2. Test Branch Performance Endpoint
    res = client.get("/api/v1/command-center/branches", headers=headers)
    assert res.status_code == 200
    branches = res.json()
    assert len(branches) == 1
    b = branches[0]
    assert b["branch_name"] == "Branch One"
    assert b["users"] == 2
    assert b["completion_rate"] == 75.0  # avg of 100.0 and 50.0 -> 75.0
    assert b["certification_rate"] == 50.0
    assert b["avg_quiz_score"] == 74.2
    assert b["avg_sim_score"] == 73.0
    assert b["health_score"] > 0

    
    # 3. Test Team Performance Endpoint
    res = client.get("/api/v1/command-center/teams", headers=headers)
    assert res.status_code == 200
    teams = res.json()
    assert len(teams) == 1
    t = teams[0]
    assert t["team_name"] == "Team One"
    assert t["users"] == 2
    assert t["completion_rate"] == 75.0
    assert t["health_score"] > 0
    
    # 4. Test Rep Performance Endpoint (No Filter)
    res = client.get("/api/v1/command-center/reps", headers=headers)
    assert res.status_code == 200
    reps = res.json()
    assert len(reps) == 2
    
    # Check filters
    # Rep 2 has quiz_avg=60 (below 75) and sim_avg=62 (below 75), should be under risk / needs_coaching
    res = client.get("/api/v1/command-center/reps?filter_type=needs_coaching", headers=headers)
    assert res.status_code == 200
    needs_coaching = res.json()
    assert len(needs_coaching) == 1
    assert needs_coaching[0]["username"] == "rep_user_2"
    
    # 5. Test Coaching Scanner Alerts
    res = client.get("/api/v1/command-center/coaching", headers=headers)
    assert res.status_code == 200
    alerts = res.json()
    # At least low quiz alert for rep_user_2
    assert len(alerts) > 0
    low_quiz_alert = next((a for a in alerts if a["user_id"] == "rep_user_2" and a["flag_type"] == "low_score"), None)
    assert low_quiz_alert is not None
    assert "Low Quiz Performance" in low_quiz_alert["title"]

    # 6. Test Actions Assign
    # Assign new curriculum
    payload = {
        "target_type": "user",
        "target_id": "rep_user_2",
        "curriculum_id": "solar_advanced_v2"
    }
    res = client.post("/api/v1/command-center/actions/assign", json=payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    
    # Verify assignment created in DB
    with Session(engine) as session:
        prog = session.exec(
            select(UserCurriculumProgress).where(
                UserCurriculumProgress.user_id == "rep_user_2",
                UserCurriculumProgress.curriculum_id == "solar_advanced_v2"
            )
        ).first()
        assert prog is not None
        assert prog.status == "not_started"
        
    # 7. Test Export Report Endpoint
    res = client.get("/api/v1/command-center/reports/export?report_type=roster", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["Content-Type"]
    csv_content = res.text
    assert "Username,Email,Role,Team,Progress,Quiz Avg,Sim Avg,Risk Score" in csv_content
    assert "rep_user_1" in csv_content
    assert "rep_user_2" in csv_content


    # 8. Test RBAC Constraint (Rep should be 403 Forbidden)
    rep_headers = {"X-User-Id": "rep_user_1"}
    res = client.get("/api/v1/command-center/executive", headers=rep_headers)
    assert res.status_code == 403

if __name__ == "__main__":
    setup_db()
    test_command_center_flow()
    print("ALL COMMAND CENTER TESTS PASSED!")


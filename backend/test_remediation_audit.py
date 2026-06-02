import os
import sys
import json
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel, create_engine
from sqlalchemy.pool import StaticPool

# Setup path and database url override
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
test_db_file = "test_remediation.db"
if os.path.exists(test_db_file):
    try:
        os.remove(test_db_file)
    except:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{test_db_file}"

from database import engine, get_session
from main import app
from models.user import User, Company, PlanTier, UserRole, UserStats
from models.company_settings import CompanyProfile
from auth_utils import CryptContext

client = TestClient(app)

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Seed a test company
        c = Company(id="septivolt", name="Septivolt Solar", plan_tier=PlanTier.GROWTH)
        session.add(c)
        session.commit()

# Test 1: Signup -> Login flow with Bcrypt Hashing
def test_signup_login_bcrypt():
    setup_db()
    
    # 1. Signup user
    signup_payload = {
        "username": "new_remediation_user",
        "password": "SecurePassword123!",
        "role": "sales_rep",
        "company_id": "septivolt"
    }
    res = client.post("/signup", json=signup_payload)
    assert res.status_code == 200
    
    # 2. Assert password is encrypted in database
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == "new_remediation_user")).first()
        assert user is not None
        # Should be a bcrypt hash (starts with $2b$)
        assert user.password.startswith("$2b$")
        assert user.password != "SecurePassword123!"
        
    # 3. Log in with correct password
    login_payload = {
        "identifier": "new_remediation_user",
        "password": "SecurePassword123!"
    }
    res_login = client.post("/login", json=login_payload)
    assert res_login.status_code == 200
    assert res_login.json()["username"] == "new_remediation_user"
    assert res_login.json()["temporary_password_required"] is False
    
    # 4. Log in with incorrect password -> should fail
    login_payload["password"] = "WrongPassword!"
    res_fail = client.post("/login", json=login_payload)
    assert res_fail.status_code == 401
    print("Signup -> Login Bcrypt test passed successfully!")

# Test 2: Demo Admin company settings seeding logic
def test_demo_admin_seeding():
    # Make sure we clean/re-setup db
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    
    from migrate_db import run_migration
    
    # Seeding should be skipped when SEED_DEMO_ACCOUNT=false
    os.environ["SEED_DEMO_ACCOUNT"] = "false"
    
    # Run migrations with SEED_DEMO_ACCOUNT=false
    run_migration()
    with Session(engine) as session:
        demo_user = session.exec(select(User).where(User.username == "demo_admin")).first()
        assert demo_user is None
        
    # Seeding should run when SEED_DEMO_ACCOUNT=true
    os.environ["SEED_DEMO_ACCOUNT"] = "true"
    os.environ["DEMO_ADMIN_PASSWORD"] = "custom_demo_pass_2026"
    
    run_migration()
    
    with Session(engine) as session:
        # User created
        demo_user = session.exec(select(User).where(User.username == "demo_admin")).first()
        assert demo_user is not None
        assert demo_user.company_id == "sales_accelerator_demo"
        
        # Verify password is correct using CryptContext
        pwd_context = CryptContext()
        assert pwd_context.verify("custom_demo_pass_2026", demo_user.password)
        
        # Stats created
        stats = session.get(UserStats, "demo_admin")
        assert stats is not None
        assert stats.total_score == 1500
        
        # Profile settings created
        profile = session.exec(select(CompanyProfile).where(CompanyProfile.company_id == "sales_accelerator_demo")).first()
        assert profile is not None
        assert profile.company_overview.startswith("A dynamic solar dealer")
        
    # Idempotency check: run it again, should not crash or duplicate
    run_migration()
    with Session(engine) as session:
        users = session.exec(select(User).where(User.username == "demo_admin")).all()
        assert len(users) == 1
        
        companies = session.exec(select(Company).where(Company.id == "sales_accelerator_demo")).all()
        assert len(companies) == 1
    print("Demo Admin Seeding and Idempotency test passed successfully!")

if __name__ == "__main__":
    try:
        test_signup_login_bcrypt()
        test_demo_admin_seeding()
        print("\n[SUCCESS] ALL REMEDIATION TARGETED TESTS PASSED!")
    finally:
        engine.dispose()
        if os.path.exists(test_db_file):
            try:
                os.remove(test_db_file)
            except Exception as e:
                print(f"Warning: could not clean up {test_db_file}: {e}")

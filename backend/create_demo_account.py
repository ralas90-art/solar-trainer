from sqlmodel import Session, select
from database import get_session, create_db_and_tables
from models.user import User, Company, UserStats, UserRole, PlanTier
from database import engine
import json
from datetime import datetime

def create_demo():
    create_db_and_tables()
    with Session(engine) as session:
        # 1. Create/Update Demo Company
        company_id = "sales_accelerator_demo"
        company = session.get(Company, company_id)
        if not company:
            print(f"Creating demo company: {company_id}")
            company = Company(
                id=company_id,
                name="Sales Accelerator Demo",
                plan_tier=PlanTier.ENTERPRISE,
                payment_status="active"
            )
            session.add(company)
        else:
            print(f"Demo company {company_id} already exists. Updating to Enterprise.")
            company.plan_tier = PlanTier.ENTERPRISE
            company.payment_status = "active"
            session.add(company)
        
        session.commit()

        # 2. Create/Update Demo Admin User
        username = "demo_admin"
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        
        if not user:
            print(f"Creating demo user: {username}")
            user = User(
                username=username,
                password="solar_password_2026", # Shared demo password
                role=UserRole.ADMIN,
                company_id=company_id
            )
            session.add(user)
        else:
            print(f"Demo user {username} already exists. Resetting to Admin.")
            user.role = UserRole.ADMIN
            user.company_id = company_id
            user.password = "solar_password_2026"
            session.add(user)
        
        session.commit()
        session.refresh(user)

        # 3. Initialize Demo Stats
        stats = session.get(UserStats, user.username)
        if not stats:
            print(f"Initializing stats for: {username}")
            stats = UserStats(
                user_id=user.username,
                total_score=1500,
                current_streak=5,
                highest_streak=12,
                lives=3,
                module_progress=json.dumps({
                    "mod_1_1": {"quiz": True, "sim": True},
                    "mod_1_2": {"quiz": True, "sim": True}
                })
            )
            session.add(stats)
        
        session.commit()
        print("\nDemo Account Provisioning Complete!")
        print(f"Username: {username}")
        print(f"Password: solar_password_2026")
        print(f"Company ID: {company_id}")

if __name__ == "__main__":
    create_demo()

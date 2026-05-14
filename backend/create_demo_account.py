from sqlmodel import Session, select
from database import get_session, create_db_and_tables, engine
from models.user import User, Company, UserStats, UserRole, PlanTier, Membership
from auth_utils import get_password_hash
import json
from datetime import datetime

def create_demo():
    create_db_and_tables()
    with Session(engine) as session:
        # 1. Create/Update Demo Company
        company_id = "septivolt"
        company = session.get(Company, company_id)
        if not company:
            print(f"Creating demo company: {company_id}")
            company = Company(
                id=company_id,
                name="SeptiVolt",
                plan_tier=PlanTier.ENTERPRISE,
                subscription_status="active"
            )
            session.add(company)
        else:
            print(f"Demo company {company_id} already exists. Updating to Enterprise.")
            company.plan_tier = PlanTier.ENTERPRISE
            company.subscription_status = "active"
            session.add(company)
        
        session.commit()

        # 2. Create/Update Demo Admin User
        email = "admin@septivolt.com"
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        password = "solar_password_2026"
        hashed_password = get_password_hash(password)

        if not user:
            print(f"Creating demo user: {email}")
            user = User(
                email=email,
                password=hashed_password,
                full_name="Demo Admin"
            )
            session.add(user)
            session.commit()
            session.refresh(user)

            # Create Membership
            membership = Membership(
                user_id=user.id,
                company_id=company_id,
                role=UserRole.ADMIN
            )
            session.add(membership)
        else:
            print(f"Demo user {email} already exists. Resetting to Admin.")
            user.password = hashed_password
            user.full_name = "Demo Admin"
            session.add(user)
            
            # Ensure Membership exists
            m_statement = select(Membership).where(Membership.user_id == user.id)
            membership = session.exec(m_statement).first()
            if not membership:
                membership = Membership(
                    user_id=user.id,
                    company_id=company_id,
                    role=UserRole.ADMIN
                )
                session.add(membership)
            else:
                membership.company_id = company_id
                membership.role = UserRole.ADMIN
                session.add(membership)
        
        session.commit()
        session.refresh(user)

        # 3. Initialize Demo Stats
        stats = session.get(UserStats, user.id)
        if not stats:
            print(f"Initializing stats for: {email}")
            stats = UserStats(
                user_id=user.id,
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
        print(f"Email: {email}")
        print(f"Password: {password}")
        print(f"Company ID: {company_id}")

if __name__ == "__main__":
    create_demo()

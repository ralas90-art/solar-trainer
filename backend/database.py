import os
from sqlmodel import SQLModel, create_engine, Session, select

# Check for Cloud Database URL
database_url = os.getenv("DATABASE_URL")

if database_url:
    # Postgres Connection
    engine = create_engine(database_url)
else:
    # Fallback to Local SQLite
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    sqlite_file_name = os.path.join(DB_DIR, "database.db")
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
    # 1. Seed default company if it doesn't exist
    from models.user import Company, PlanTier, User, UserRole, UserStats
    import json
    
    with Session(engine) as session:
        septivolt = session.get(Company, "septivolt")
        if not septivolt:
            # Create the default company for the platform
            septivolt = Company(
                id="septivolt",
                name="Septivolt Solar",
                plan_tier=PlanTier.GROWTH # Default platform tier
            )
            session.add(septivolt)
        
        # 2. SEED DEMO ACCOUNT (Required for Live Demo)
        company_id = "sales_accelerator_demo"
        demo_company = session.get(Company, company_id)
        if not demo_company:
            demo_company = Company(
                id=company_id,
                name="Sales Accelerator Demo",
                plan_tier=PlanTier.ENTERPRISE,
                payment_status="active"
            )
            session.add(demo_company)
        
        # Demo Admin User
        username = "demo_admin"
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        
        if not user:
            user = User(
                username=username,
                password="solar_password_2026", # Shared demo password
                role=UserRole.ADMIN,
                company_id=company_id
            )
            session.add(user)
        else:
            # Always ensure demo password/role is reset
            user.role = UserRole.ADMIN
            user.company_id = company_id
            user.password = "solar_password_2026"
            session.add(user)
        
        # Demo Stats
        stats = session.get(UserStats, username)
        if not stats:
            stats = UserStats(
                user_id=username,
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

def get_session():
    with Session(engine) as session:
        yield session

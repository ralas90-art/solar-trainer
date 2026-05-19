import os
from sqlmodel import SQLModel, create_engine, Session, select

# Check for Cloud Database URL
database_url = os.getenv("DATABASE_URL")

if database_url:
    # 1. Handle Render's 'postgres://' vs 'postgresql://' requirement
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # 2. Postgres Connection with pooling and timeouts to prevent hangs
    engine = create_engine(
        database_url,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800,
    )
else:
    # Fallback to Local SQLite
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    sqlite_file_name = os.path.join(DB_DIR, "database.db")
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    # 0. Run programmatic migrations (adds new columns & seeds test companies)
    try:
        from migrate_db import run_migration
        run_migration()
    except Exception as e:
        print(f"Error running programmatic migration: {e}")
        # Run standard metadata creation as a fallback
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
        
        # Demo Admin User (Render Env Vars Required)
        admin_username = os.getenv("ADMIN_USERNAME")
        admin_email = os.getenv("ADMIN_EMAIL")
        raw_pwd = os.getenv("ADMIN_PASSWORD")
        
        if not admin_username or not admin_email or not raw_pwd:
            raise RuntimeError("CRITICAL ERROR: ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables are required.")
            
        # Hash password with bcrypt
        from auth_utils import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        stored_pwd = pwd_context.hash(raw_pwd)
            
        statement = select(User).where((User.username == admin_username) | (User.email == admin_email))
        user = session.exec(statement).first()
        
        if not user:
            user = User(
                username=admin_username,
                email=admin_email,
                password=stored_pwd,
                role=UserRole.ADMIN,
                company_id=company_id
            )
            session.add(user)
        else:
            # Only reset existing admin password if explicitly requested
            reset_flag = os.getenv("RESET_ADMIN_PASSWORD", "false").lower() == "true"
            if reset_flag:
                user.password = stored_pwd
                
            user.username = admin_username
            user.email = admin_email
            user.role = UserRole.ADMIN
            user.company_id = company_id
            session.add(user)
        
        # Demo Stats
        stats = session.get(UserStats, admin_username)
        if not stats:
            stats = UserStats(
                user_id=admin_username,
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

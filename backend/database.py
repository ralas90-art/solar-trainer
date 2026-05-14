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
    SQLModel.metadata.create_all(engine)
    
    # 1. Seed default company if it doesn't exist
    from models.user import Company, PlanTier, User, UserRole, UserStats, Membership, GlobalSettings
    from auth_utils import get_password_hash
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
        
        # Seed GlobalSettings
        global_settings = session.get(GlobalSettings, 1)
        if not global_settings:
            global_settings = GlobalSettings(
                id=1,
                fallback_variables={
                    "company_name": "SeptiVolt Training",
                    "crm_name": "the CRM",
                    "proposal_tool": "the proposal tool",
                    "door_knocking_tool": "the tracking app",
                    "financing_options": "standard financing options",
                    "phone_number": "our support line",
                    "contact_email": "support@septivolt.com",
                    "address": "our headquarters",
                    "onboarding_notes": "Welcome to your training!"
                }
            )
            session.add(global_settings)

        # 2. SEED ADMIN USER
        admin_email = "admin@septivolt.com"
        statement = select(User).where(User.email == admin_email)
        admin_user = session.exec(statement).first()
        
        if not admin_user:
            admin_user = User(
                email=admin_email,
                password=get_password_hash("septivolt2026"),
                full_name="SeptiVolt Admin"
            )
            session.add(admin_user)
            session.commit()
            session.refresh(admin_user)
            
            # Add Membership
            membership = Membership(
                user_id=admin_user.id,
                company_id="septivolt",
                role=UserRole.ADMIN
            )
            session.add(membership)
            
            # Add Stats
            stats = UserStats(
                user_id=admin_user.id,
                total_score=0,
                current_streak=0,
                highest_streak=0,
                lives=3
            )
            session.add(stats)
            session.commit()
            
        print(f"Database initialized. System Admin: {admin_email}")

def get_session():
    with Session(engine) as session:
        yield session

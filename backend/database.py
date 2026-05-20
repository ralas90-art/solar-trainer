import os
import sys
from sqlmodel import SQLModel, create_engine, Session, select

# Check for Cloud Database URL
database_url = os.getenv("DATABASE_URL")

if database_url:
    # 1. Handle Render's 'postgres://' vs 'postgresql://' requirement
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # 2. Postgres Connection with pooling and timeouts to prevent hangs
    if "postgresql" in database_url or "postgres" in database_url:
        engine = create_engine(
            database_url,
            pool_size=5,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=1800,
        )
    else:
        engine = create_engine(database_url, connect_args={"check_same_thread": False} if "sqlite" in database_url else {})
else:
    # Fallback to Local SQLite
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    sqlite_file_name = os.path.join(DB_DIR, "database.db")
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    print("[DB-INIT] Starting database initialization...", flush=True)
    
    # 0. Run programmatic migrations FIRST (adds new columns via raw SQL)
    try:
        from migrate_db import run_migration
        run_migration()
        print("[DB-INIT] Programmatic migration completed.", flush=True)
    except Exception as e:
        print(f"[DB-INIT] Error running programmatic migration: {e}", flush=True)
    
    # 1. Ensure ALL SQLModel tables exist (creates missing tables AND columns on new tables)
    #    This MUST run before any ORM queries.
    try:
        import models  # noqa: F401 — triggers model registration
        SQLModel.metadata.create_all(engine)
        print("[DB-INIT] SQLModel.metadata.create_all completed.", flush=True)
    except Exception as e:
        print(f"[DB-INIT] Error in create_all: {e}", flush=True)
    
    # 2. Seed companies and admin user
    from models.user import Company, PlanTier, User, UserRole, UserStats
    import json
    
    with Session(engine) as session:
        # --- Seed default Septivolt company ---
        try:
            septivolt = session.get(Company, "septivolt")
            if not septivolt:
                septivolt = Company(
                    id="septivolt",
                    name="Septivolt Solar",
                    plan_tier=PlanTier.GROWTH
                )
                session.add(septivolt)
                session.commit()
                print("[DB-INIT] Seeded default company: septivolt", flush=True)
        except Exception as e:
            session.rollback()
            print(f"[DB-INIT] Error seeding septivolt company: {e}", flush=True)
        
        # --- Seed demo company ---
        company_id = "sales_accelerator_demo"
        try:
            demo_company = session.get(Company, company_id)
            if not demo_company:
                demo_company = Company(
                    id=company_id,
                    name="Sales Accelerator Demo",
                    plan_tier=PlanTier.ENTERPRISE,
                    payment_status="active"
                )
                session.add(demo_company)
                session.commit()
                print(f"[DB-INIT] Seeded demo company: {company_id}", flush=True)
        except Exception as e:
            session.rollback()
            print(f"[DB-INIT] Error seeding demo company: {e}", flush=True)
        
        # --- Seed Admin User ---
        admin_username = os.getenv("ADMIN_USERNAME")
        admin_email = os.getenv("ADMIN_EMAIL")
        raw_pwd = os.getenv("ADMIN_PASSWORD")
        
        if not admin_username or not admin_email or not raw_pwd:
            print("[DB-INIT] WARNING: ADMIN_USERNAME, ADMIN_EMAIL, or ADMIN_PASSWORD not set. Skipping admin seed.", flush=True)
        else:
            try:
                from auth_utils import CryptContext
                pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
                stored_pwd = pwd_context.hash(raw_pwd)
                
                # Try ORM lookup first
                try:
                    statement = select(User).where((User.username == admin_username) | (User.email == admin_email))
                    user = session.exec(statement).first()
                except Exception as orm_err:
                    print(f"[DB-INIT] ORM admin lookup failed: {orm_err}", flush=True)
                    session.rollback()
                    
                    # Fallback: raw SQL lookup by username only
                    from sqlalchemy import text as sql_text
                    try:
                        result = session.execute(
                            sql_text('SELECT id FROM "user" WHERE username = :u'),
                            {"u": admin_username}
                        ).first()
                    except Exception:
                        session.rollback()
                        result = None
                    
                    user = None
                    if result:
                        # User exists but ORM can't query it — update via raw SQL
                        try:
                            session.execute(
                                sql_text('UPDATE "user" SET role = :role, company_id = :cid WHERE username = :u'),
                                {"role": "admin", "cid": company_id, "u": admin_username}
                            )
                            session.commit()
                            print(f"[DB-INIT] Admin '{admin_username}' updated via raw SQL fallback.", flush=True)
                        except Exception as raw_err:
                            session.rollback()
                            print(f"[DB-INIT] Raw SQL admin update failed: {raw_err}", flush=True)
                        
                        # Seed stats and return early
                        try:
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
                        except Exception as stats_err:
                            session.rollback()
                            print(f"[DB-INIT] Stats seeding failed: {stats_err}", flush=True)
                        
                        print("[DB-INIT] Admin seeding complete (raw SQL path).", flush=True)
                        return
                
                # Normal ORM path
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
                    reset_flag = os.getenv("RESET_ADMIN_PASSWORD", "false").lower() == "true"
                    if reset_flag:
                        user.password = stored_pwd
                    user.username = admin_username
                    user.email = admin_email
                    user.role = UserRole.ADMIN
                    user.company_id = company_id
                    session.add(user)
                
                # Seed stats
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
                print("[DB-INIT] Admin seeding complete (ORM path).", flush=True)
                
            except Exception as admin_err:
                session.rollback()
                print(f"[DB-INIT] Error seeding admin user: {admin_err}", flush=True)
    
    print("[DB-INIT] Database initialization complete.", flush=True)

def get_session():
    with Session(engine) as session:
        yield session

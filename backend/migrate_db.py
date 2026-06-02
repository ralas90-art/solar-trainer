"""
Phase 6A Idempotent Migration Script
======================================
Safe to run multiple times on both SQLite and Postgres.
Can be imported and called at runtime.
"""
import os
import json
import sys

def run_migration():
    # Load env variables safely
    try:
        from dotenv import load_dotenv
        load_dotenv()
        # Also try backend/.env specifically
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        load_dotenv(os.path.join(backend_dir, ".env"))
    except ImportError:
        pass

    # Determine dialect
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    IS_POSTGRES = DATABASE_URL.startswith("postgres")

    if IS_POSTGRES:
        import psycopg2
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    else:
        import sqlite3

    print("=" * 60)
    print("SeptiVolt Phase 6A — Database Migration")
    print(f"Target: {'Postgres (cloud)' if IS_POSTGRES else 'SQLite (local)'}")
    print("=" * 60)

    def table_exists(conn, table: str) -> bool:
        cur = conn.cursor()
        if IS_POSTGRES:
            cur.execute(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    AND table_name = %s
                )
                """,
                (table,),
            )
            return cur.fetchone()[0]
        else:
            cur.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?", (table,))
            return cur.fetchone()[0] > 0

    # Helper: safe column addition
    def add_column_sqlite(conn, table: str, column: str, col_type: str, default: str = "NULL"):
        if not table_exists(conn, table):
            print(f"  [SKIP] Table `{table}` does not exist yet. Column `{column}` will be created by SQLModel.")
            return
        cur = conn.cursor()
        cur.execute(f"PRAGMA table_info({table})")
        existing = [row[1] for row in cur.fetchall()]
        if column not in existing:
            sql = f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"
            if default != "NULL":
                sql += f" DEFAULT {default}"
            cur.execute(sql)
            conn.commit()
            print(f"  [OK] Added column `{column}` to `{table}`")
        else:
            print(f"  [SKIP] Column `{column}` already exists in `{table}`")

    def add_column_postgres(conn, table: str, column: str, col_type: str, default: str = "NULL"):
        if not table_exists(conn, table):
            print(f"  [SKIP] Table `{table}` does not exist yet. Column `{column}` will be created by SQLModel.")
            return
        cur = conn.cursor()
        cur.execute(
            """
            SELECT column_name FROM information_schema.columns
            WHERE table_name = %s AND column_name = %s
            """,
            (table, column),
        )
        if cur.fetchone() is None:
            sql = f'ALTER TABLE "{table}" ADD COLUMN "{column}" {col_type}'
            if default != "NULL":
                sql += f" DEFAULT {default}"
            cur.execute(sql)
            conn.commit()
            print(f"  [OK] Added column `{column}` to `{table}`")
        else:
            print(f"  [SKIP] Column `{column}` already exists in `{table}`")

    def add_col(conn, table: str, column: str, col_type: str, default: str = "NULL"):
        if IS_POSTGRES:
            add_column_postgres(conn, table, column, col_type, default)
        else:
            add_column_sqlite(conn, table, column, col_type, default)

    # Step 1 — Column additions on existing tables
    print("\n[1/3] Patching existing table columns…")
    if IS_POSTGRES:
        conn = psycopg2.connect(DATABASE_URL)
    else:
        DB_DIR = os.path.dirname(os.path.abspath(__file__))
        DB_PATH = os.path.join(DB_DIR, "database.db")
        if not os.path.exists(DB_PATH):
            print(f"  ⚠  SQLite file not found at {DB_PATH} — will be created by app startup.")
            conn = None
        else:
            conn = sqlite3.connect(DB_PATH)

    if conn:
        # user table — core columns (may be missing on pre-existing DBs)
        add_col(conn, "user", "email", "TEXT", "NULL")
        add_col(conn, "user", "password", "TEXT", "NULL")
        add_col(conn, "user", "role", "TEXT", "NULL")
        add_col(conn, "user", "company_id", "TEXT", "NULL")
        add_col(conn, "user", "is_active", "BOOLEAN", "TRUE")
        add_col(conn, "user", "created_at", "TIMESTAMP", "NULL")
        # user table — Phase 6A columns
        add_col(conn, "user", "team_id", "TEXT", "NULL")
        add_col(conn, "user", "branch_id", "TEXT", "NULL")
        add_col(conn, "user", "temporary_password_required", "BOOLEAN", "FALSE")

        # team table
        add_col(conn, "team", "branch_id", "TEXT", "NULL")

        # userstats table — core & Phase 6A columns
        add_col(conn, "userstats", "total_score", "INTEGER", "0")
        add_col(conn, "userstats", "current_streak", "INTEGER", "0")
        add_col(conn, "userstats", "highest_streak", "INTEGER", "0")
        add_col(conn, "userstats", "lives", "INTEGER", "3")
        add_col(conn, "userstats", "last_life_lost_at", "TIMESTAMP", "NULL")
        add_col(conn, "userstats", "module_progress", "TEXT", "'{}'")
        add_col(conn, "userstats", "scenario_progress", "TEXT", "'{}'")
        add_col(conn, "userstats", "onboarding_progress", "TEXT", "'{}'")
        add_col(conn, "userstats", "coaching_notes", "TEXT", "''")

        # company table — core & billing columns
        add_col(conn, "company", "plan_tier", "TEXT", "'starter'")
        add_col(conn, "company", "platform_fee", "DOUBLE PRECISION", "499.0")
        add_col(conn, "company", "per_rep_fee", "DOUBLE PRECISION", "39.0")
        add_col(conn, "company", "stripe_customer_id", "TEXT", "NULL")
        add_col(conn, "company", "stripe_subscription_id", "TEXT", "NULL")
        add_col(conn, "company", "payment_status", "TEXT", "'pending'")
        add_col(conn, "company", "created_at", "TIMESTAMP", "NULL")

        # certifications table — Phase 7 expiration policy columns
        add_col(conn, "certifications", "expiration_policy", "TEXT", "'never'")
        add_col(conn, "certifications", "renewal_required", "BOOLEAN", "FALSE")

        # user_certifications table — Phase 7 lifecycle & verification columns
        add_col(conn, "user_certifications", "status", "TEXT", "'ACTIVE'")
        add_col(conn, "user_certifications", "issued_by", "TEXT", "NULL")
        add_col(conn, "user_certifications", "approved_by", "TEXT", "NULL")
        add_col(conn, "user_certifications", "approved_at", "TIMESTAMP", "NULL")
        add_col(conn, "user_certifications", "revoked_by", "TEXT", "NULL")
        add_col(conn, "user_certifications", "revoked_at", "TIMESTAMP", "NULL")
        add_col(conn, "user_certifications", "revoked_reason", "TEXT", "NULL")
        add_col(conn, "user_certifications", "last_verified_at", "TIMESTAMP", "NULL")
        add_col(conn, "user_certifications", "verification_views", "INTEGER", "0")

        # training_predictions table — Phase 8 Training Intelligence Engine
        add_col(conn, "training_predictions", "branch_id", "TEXT", "NULL")
        add_col(conn, "training_predictions", "team_id", "TEXT", "NULL")
        add_col(conn, "training_predictions", "score", "REAL", "0.0")
        add_col(conn, "training_predictions", "ghl_tags", "TEXT", "'[]'")
        add_col(conn, "training_predictions", "ghl_custom_fields", "TEXT", "'{}'")
        add_col(conn, "training_predictions", "ghl_synced", "BOOLEAN", "FALSE")
        add_col(conn, "training_predictions", "ghl_synced_at", "TIMESTAMP", "NULL")
        add_col(conn, "training_predictions", "resolved_at", "TIMESTAMP", "NULL")
        add_col(conn, "training_predictions", "dismissed_at", "TIMESTAMP", "NULL")
        add_col(conn, "training_predictions", "resolved_by", "TEXT", "NULL")
        add_col(conn, "training_predictions", "dismissed_by", "TEXT", "NULL")


        # Ensure company_id index exists on user table
        try:
            cur = conn.cursor()
            if IS_POSTGRES:
                cur.execute('CREATE INDEX IF NOT EXISTS idx_user_company_id ON "user" (company_id);')
            else:
                cur.execute('CREATE INDEX IF NOT EXISTS idx_user_company_id ON user (company_id);')
            conn.commit()
            print("  [OK] Index idx_user_company_id verified/created.")
        except Exception as e:
            print(f"  [ERROR] Index idx_user_company_id creation failed: {e}")


        conn.close()
        print("  Column patching complete.")

    # Step 2 — Create new Phase 6A tables
    print("\n[2/3] Creating new Phase 6A tables (skip if already exist)…")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from database import engine
    import models  # noqa: F401
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(engine, checkfirst=True)
    print("  [OK] Table creation pass complete (Team, SimulationSession, Debrief, CoachingFlag).")

    # Step 3 — Seed test companies
    print("\n[3/3] Seeding test companies for isolation verification…")
    from sqlmodel import Session
    from models.user import Company, PlanTier

    TEST_COMPANIES = [
        {"id": "cresca_test", "name": "Cresca Test Corp", "plan_tier": PlanTier.GROWTH},
        {"id": "rival_corp_test", "name": "Rival Corp Test", "plan_tier": PlanTier.STARTER},
    ]

    with Session(engine) as session:
        for tc in TEST_COMPANIES:
            existing = session.get(Company, tc["id"])
            if not existing:
                company = Company(
                    id=tc["id"],
                    name=tc["name"],
                    plan_tier=tc["plan_tier"],
                    payment_status="active",
                )
                session.add(company)
                print(f"  [OK] Seeded company: {tc['id']} ({tc['name']})")
            else:
                print(f"  [SKIP] Company `{tc['id']}` already exists.")
        session.commit()

        # Step 4 — Sanitize Test Credentials & Mark Test Profiles
        print("\n[4/4] Sanitizing test credentials and marking test profiles in database…")
        try:
            from services.integration_service import IntegrationService
            from models.company_settings import CompanyIntegration, CompanyProfile
            from sqlmodel import select

            sanitized_val = IntegrationService.encrypt_credential("sanitized_test_key")

            # 4.1 Sanitize Integrations
            statement_integration = select(CompanyIntegration)
            integrations = session.exec(statement_integration).all()
            sanitized_count = 0
            for integration in integrations:
                cid = integration.company_id
                if cid == "cresca_test" or cid.startswith("cresca_test_") or cid == "rival_corp_test" or cid.startswith("rival_corp_test_"):
                    integration.encrypted_credentials = sanitized_val
                    integration.sync_enabled = False
                    integration.connection_status = "disabled"
                    session.add(integration)
                    sanitized_count += 1

            # 4.2 Mark Profiles
            statement_profile = select(CompanyProfile)
            profiles = session.exec(statement_profile).all()
            profile_count = 0
            for profile in profiles:
                cid = profile.company_id
                if cid == "cresca_test" or cid.startswith("cresca_test_") or cid == "rival_corp_test" or cid.startswith("rival_corp_test_"):
                    desc = profile.company_overview or ""
                    if "[TEST DEMO]" not in desc:
                        profile.company_overview = f"[TEST DEMO] {desc}".strip()
                        session.add(profile)
                        profile_count += 1

            session.commit()
            print(f"  [OK] Sanitized {sanitized_count} test integration credentials.")
            print(f"  [OK] Marked {profile_count} test company profiles as TEST DEMO.")
        except Exception as e:
            session.rollback()
            import traceback
            traceback.print_exc()
            print(f"  [ERROR] Failed to sanitize/mark test data: {e}")

    print("\n" + "=" * 60)
    print("[SUCCESS] Phase 6A Migration Complete.")
    print("=" * 60)

if __name__ == "__main__":
    run_migration()

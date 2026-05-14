from sqlmodel import Session, create_engine, select, text
from models.user import Company, PlanTier

sqlite_url = "sqlite:///solar-trainer/backend/database.db"
engine = create_engine(sqlite_url)

def migrate_billing_fields():
    with Session(engine) as session:
        print("Running Phase 6 Billing Migration...")
        
        # Add new columns if they don't exist (SQLite style)
        columns = [
            ("subscription_status", "VARCHAR", "'trialing'"),
            ("monthly_sim_limit", "INTEGER", "50"),
            ("max_rep_limit", "INTEGER", "3"),
            ("allow_custom_keys", "BOOLEAN", "0"),
            ("allow_whitelabel", "BOOLEAN", "1"),
            ("allow_manager_dashboard", "BOOLEAN", "0")
        ]
        
        for col_name, col_type, default_val in columns:
            try:
                session.execute(text(f"ALTER TABLE company ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                session.commit()
                print(f"Added column: {col_name}")
            except Exception as e:
                # Column might already exist
                session.rollback()
                print(f"Column {col_name} already exists or error: {e}")

        # Drop old column if it exists
        try:
            # SQLite doesn't support DROP COLUMN easily in older versions, 
            # but we can just leave it or rename if needed. 
            # In modern SQLite (3.35+) it works.
            session.execute(text("ALTER TABLE company DROP COLUMN payment_status"))
            session.commit()
            print("Dropped old column: payment_status")
        except Exception:
            session.rollback()

        print("Migration complete!")

if __name__ == "__main__":
    migrate_billing_fields()

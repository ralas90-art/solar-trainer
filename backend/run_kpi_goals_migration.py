"""
Migration script to add target_weekly, target_monthly, and target_quarterly columns to KPIDefinition table
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

# Get DB URL
database_url = os.getenv("DATABASE_URL")
if not database_url:
    # Fallback to sqlite
    database_url = "sqlite:///database.db"

print(f"Migrating database: {database_url}")

engine = create_engine(database_url)

def migrate():
    with engine.connect() as conn:
        # Check if columns exist (Postgres specific check, but works for adding)
        # We'll just try to add them and catch errors if they exist, or check information_schema if strict
        
        columns = ["target_weekly", "target_monthly", "target_quarterly"]
        
        for col in columns:
            try:
                print(f"Adding column {col}...")
                conn.execute(text(f"ALTER TABLE kpi_definitions ADD COLUMN {col} INTEGER"))
                print(f"✅ Added {col}")
            except Exception as e:
                print(f"⚠️ Could not add {col} (might already exist): {e}")
                
        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()

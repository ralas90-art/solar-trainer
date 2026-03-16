"""
Run KPI tables migration
"""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def run_migration():
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        return
    
    print(f"🔄 Connecting to database...")
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("📄 Reading migration file...")
        with open("migrations/add_kpi_tables.sql", "r") as f:
            sql = f.read()
        
        print("🚀 Running migration...")
        cursor.execute(sql)
        conn.commit()
        
        print("✅ Migration completed successfully!")
        print("\nCreated tables:")
        print("  - kpi_definitions")
        print("  - kpi_entries")
        print("  - kpi_templates")
        print("  - template_kpis")
        print("\nSeeded templates:")
        print("  - Door-to-Door")
        print("  - Virtual Sales")
        print("  - Hybrid")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    run_migration()

import sqlite3
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(DB_DIR, "database.db")

def migrate():
    print("Starting V2 White-Label Migration...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Create GlobalSettings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS globalsettings (
                id INTEGER NOT NULL PRIMARY KEY,
                fallback_variables TEXT,
                updated_at DATETIME NOT NULL
            )
        """)
        print("Ensured GlobalSettings table exists.")

        # Add new columns to Company table
        new_columns = [
            ("profile_version", "INTEGER DEFAULT 1"),
            ("logo_url", "VARCHAR"),
            ("primary_color", "VARCHAR"),
            ("secondary_color", "VARCHAR"),
            ("accent_color", "VARCHAR"),
            ("contact_email", "VARCHAR"),
            ("phone_number", "VARCHAR"),
            ("address", "VARCHAR"),
            ("crm_name", "VARCHAR"),
            ("proposal_tool", "VARCHAR"),
            ("door_knocking_tool", "VARCHAR"),
            ("financing_options", "VARCHAR"),
            ("onboarding_notes", "VARCHAR"),
            ("custom_script_overrides", "TEXT"),
            ("objection_handling_overrides", "TEXT")
        ]

        for col_name, col_type in new_columns:
            try:
                cursor.execute(f"ALTER TABLE company ADD COLUMN {col_name} {col_type}")
                print(f"Added column {col_name} to company table.")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e).lower():
                    pass
                else:
                    print(f"Error adding {col_name}: {e}")

        conn.commit()
        print("Migration complete!")
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

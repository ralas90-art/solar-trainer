import sqlite3
import os

db_path = "solar-trainer/backend/database.db"

def migrate():
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add columns to Company
    columns_to_add = [
        ("use_custom_ai_keys", "BOOLEAN DEFAULT 0"),
        ("openai_api_key_encrypted", "VARCHAR"),
        ("vapi_api_key_encrypted", "VARCHAR")
    ]

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE company ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name} to company table.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"Column {col_name} already exists.")
            else:
                print(f"Error adding {col_name}: {e}")

    # Create aiusagelog table
    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS aiusagelog (
            id CHAR(32) PRIMARY KEY,
            company_id CHAR(32) NOT NULL,
            user_id CHAR(32),
            session_id VARCHAR,
            provider VARCHAR NOT NULL,
            model VARCHAR,
            input_tokens INTEGER DEFAULT 0,
            output_tokens INTEGER DEFAULT 0,
            total_tokens INTEGER DEFAULT 0,
            estimated_cost FLOAT DEFAULT 0.0,
            status VARCHAR NOT NULL,
            error_category VARCHAR,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("Created aiusagelog table.")
    except Exception as e:
        print(f"Error creating aiusagelog table: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()

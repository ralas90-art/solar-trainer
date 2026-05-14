import sqlite3
import os

def migrate():
    # Path to your database
    db_path = os.path.join(os.path.dirname(__file__), "database.db")
    print(f"Migrating database at: {db_path}")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Create EnterpriseInquiry table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS enterpriseinquiry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT NOT NULL,
            team_size INTEGER NOT NULL,
            use_case TEXT NOT NULL,
            score INTEGER,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'new',
            research_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("Success: EnterpriseInquiry table created.")
        
    except sqlite3.OperationalError as e:
        if "already exists" in str(e):
            print("EnterpriseInquiry table already exists.")
        else:
            print(f"Error: {e}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()

"""
Migration script to add scenario_progress column to UserStats table
"""
import sqlite3
import os

# Path to database
db_path = "database.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} not found. Creating new database...")
    # Database will be created when backend starts
else:
    print(f"Migrating database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if column exists
    cursor.execute("PRAGMA table_info(userstats)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'scenario_progress' not in columns:
        print("Adding scenario_progress column...")
        cursor.execute("""
            ALTER TABLE userstats 
            ADD COLUMN scenario_progress TEXT DEFAULT '{}'
        """)
        conn.commit()
        print("✅ Column added successfully!")
    else:
        print("✅ Column already exists, no migration needed")
    
    conn.close()
    print("Migration complete!")

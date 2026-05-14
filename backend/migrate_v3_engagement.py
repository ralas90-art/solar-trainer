import sqlite3
import os

db_path = "database.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
else:
    print(f"Migrating database: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(userstats)")
    columns = [column[1] for column in cursor.fetchall()]
    
    new_columns = [
        ('last_interaction_at', "DATETIME DEFAULT NULL"),
        ('activity_log', "TEXT DEFAULT '[]'"),
        ('coaching_signals_state', "TEXT DEFAULT '{}'")
    ]

    for col_name, col_type in new_columns:
        if col_name not in columns:
            print(f"Adding {col_name} column...")
            try:
                cursor.execute(f"ALTER TABLE userstats ADD COLUMN {col_name} {col_type}")
                conn.commit()
                print(f"Success: {col_name} added successfully!")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")
    
    conn.close()
    print("Migration complete!")

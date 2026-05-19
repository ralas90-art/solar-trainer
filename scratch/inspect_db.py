import sqlite3

def inspect_db():
    print("=== SQLite Database Schema ===")
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", [t[0] for t in tables])
    for table_name in [t[0] for t in tables]:
        print(f"\nSchema for table: {table_name}")
        cursor.execute(f"PRAGMA table_info({table_name});")
        info = cursor.fetchall()
        for col in info:
            print(f"  Column: {col[1]} ({col[2]})")
        
        # Print a sample row if any
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 1;")
        row = cursor.fetchone()
        if row:
            print(f"  Sample row: {row}")
    conn.close()

if __name__ == "__main__":
    inspect_db()

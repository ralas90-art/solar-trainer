"""
Migration script to add stripe_customer_id, stripe_subscription_id, and payment_status columns to Company table
"""
import sqlite3
import os

# Path to database
db_path = "database.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} not found. Migration not possible.")
else:
    print(f"Migrating database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if columns exist
    cursor.execute("PRAGMA table_info(company)")
    columns = [column[1] for column in cursor.fetchall()]
    
    new_columns = [
        ('stripe_customer_id', "TEXT DEFAULT NULL"),
        ('stripe_subscription_id', "TEXT DEFAULT NULL"),
        ('payment_status', "TEXT DEFAULT 'pending'")
    ]
    
    for col_name, col_def in new_columns:
        if col_name not in columns:
            print(f"Adding {col_name} column...")
            cursor.execute(f"ALTER TABLE company ADD COLUMN {col_name} {col_def}")
            print(f"✅ Column {col_name} added successfully!")
        else:
            print(f"✅ Column {col_name} already exists")
    
    conn.commit()
    conn.close()
    print("Migration complete!")

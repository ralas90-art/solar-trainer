"""
Phase 6A Idempotent Migration Script
======================================
Safe to run multiple times on both SQLite and Postgres.

What this does:
  1. Adds new columns to existing tables (user, userstats) if they don't already exist.
  2. Creates new Phase 6A tables (team, simulationsession, debrief, coachingflag)
     using SQLModel.metadata — only tables that do not yet exist are created (checkfirst=True).
  3. Seeds two test companies (cresca_test, rival_corp_test) for tenant isolation testing.

Run this after deploying updated models:
    cd backend
    python migrate_db.py
"""
import os
import json
import sys

# ---------------------------------------------------------------------------
# Determine dialect
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "")
IS_POSTGRES = DATABASE_URL.startswith("postgres")

if IS_POSTGRES:
    import psycopg2
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    import sqlite3

print("=" * 60)
print("SeptiVolt Phase 6A — Database Migration")
print(f"Target: {'Postgres (cloud)' if IS_POSTGRES else 'SQLite (local)'}")
print("=" * 60)


# ---------------------------------------------------------------------------
# Helper: safe column addition
# ---------------------------------------------------------------------------

def add_column_sqlite(conn, table: str, column: str, col_type: str, default: str = "NULL"):
    """Add a column to a SQLite table if it doesn't already exist."""
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info({table})")
    existing = [row[1] for row in cur.fetchall()]
    if column not in existing:
        sql = f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"
        if default != "NULL":
            sql += f" DEFAULT {default}"
        cur.execute(sql)
        conn.commit()
        print(f"  ✅ Added column `{column}` to `{table}`")
    else:
        print(f"  ✔  Column `{column}` already exists in `{table}`")


def add_column_postgres(conn, table: str, column: str, col_type: str, default: str = "NULL"):
    """Add a column to a Postgres table if it doesn't already exist."""
    cur = conn.cursor()
    cur.execute(
        """
        SELECT column_name FROM information_schema.columns
        WHERE table_name = %s AND column_name = %s
        """,
        (table, column),
    )
    if cur.fetchone() is None:
        sql = f'ALTER TABLE "{table}" ADD COLUMN "{column}" {col_type}'
        if default != "NULL":
            sql += f" DEFAULT {default}"
        cur.execute(sql)
        conn.commit()
        print(f"  ✅ Added column `{column}` to `{table}`")
    else:
        print(f"  ✔  Column `{column}` already exists in `{table}`")


def add_col(conn, table: str, column: str, col_type: str, default: str = "NULL"):
    if IS_POSTGRES:
        add_column_postgres(conn, table, column, col_type, default)
    else:
        add_column_sqlite(conn, table, column, col_type, default)


# ---------------------------------------------------------------------------
# Step 1 — Column additions on existing tables
# ---------------------------------------------------------------------------

print("\n[1/3] Patching existing table columns…")

if IS_POSTGRES:
    conn = psycopg2.connect(DATABASE_URL)
else:
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(DB_DIR, "database.db")
    if not os.path.exists(DB_PATH):
        print(f"  ⚠  SQLite file not found at {DB_PATH} — will be created by app startup.")
        conn = None
    else:
        conn = sqlite3.connect(DB_PATH)

if conn:
    # user table — add team_id
    add_col(conn, "user", "team_id", "TEXT", "NULL")

    # userstats table — add onboarding_progress and coaching_notes
    add_col(conn, "userstats", "onboarding_progress", "TEXT", "'{}'")
    add_col(conn, "userstats", "coaching_notes", "TEXT", "''")

    conn.close()
    print("  Column patching complete.")


# ---------------------------------------------------------------------------
# Step 2 — Create new Phase 6A tables (idempotent via checkfirst=True)
# ---------------------------------------------------------------------------

print("\n[2/3] Creating new Phase 6A tables (skip if already exist)…")

# Import models AFTER patching so SQLModel sees the full schema
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine
import models  # noqa: F401 — ensures all SQLModel table classes are registered
from sqlmodel import SQLModel

SQLModel.metadata.create_all(engine, checkfirst=True)
print("  ✅ Table creation pass complete (Team, SimulationSession, Debrief, CoachingFlag).")


# ---------------------------------------------------------------------------
# Step 3 — Seed test companies for tenant isolation verification
# ---------------------------------------------------------------------------

print("\n[3/3] Seeding test companies for isolation verification…")

from sqlmodel import Session, select
from models.user import Company, PlanTier

TEST_COMPANIES = [
    {"id": "cresca_test", "name": "Cresca Test Corp", "plan_tier": PlanTier.GROWTH},
    {"id": "rival_corp_test", "name": "Rival Corp Test", "plan_tier": PlanTier.STARTER},
]

with Session(engine) as session:
    for tc in TEST_COMPANIES:
        existing = session.get(Company, tc["id"])
        if not existing:
            company = Company(
                id=tc["id"],
                name=tc["name"],
                plan_tier=tc["plan_tier"],
                payment_status="active",
            )
            session.add(company)
            print(f"  ✅ Seeded company: {tc['id']} ({tc['name']})")
        else:
            print(f"  ✔  Company `{tc['id']}` already exists.")
    session.commit()


print("\n" + "=" * 60)
print("✅ Phase 6A Migration Complete.")
print("=" * 60)

import os
from sqlmodel import SQLModel, create_engine, Session

# Check for Cloud Database URL
database_url = os.getenv("DATABASE_URL")

if database_url:
    # Postgres Connection
    engine = create_engine(database_url)
else:
    # Fallback to Local SQLite
    sqlite_file_name = "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

import sys
import os
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.append(backend_path)

from sqlmodel import SQLModel, create_engine
from models.user import UserStats, Company, User
from models.kpi import KPIDefinition, KPIEntry

engine = create_engine("sqlite://")
SQLModel.metadata.create_all(engine)
print("Tables in metadata:", list(SQLModel.metadata.tables.keys()))

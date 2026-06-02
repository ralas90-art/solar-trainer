from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Branch(SQLModel, table=True):
    __tablename__ = "branches"

    id: str = Field(primary_key=True)  # unique string id, e.g. "florida_office"
    name: str
    company_id: str = Field(index=True, foreign_key="company.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

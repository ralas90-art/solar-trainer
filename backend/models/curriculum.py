from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Curriculum(SQLModel, table=True):
    __tablename__ = "curriculums"

    id: str = Field(primary_key=True)  # unique string ID, e.g. "solar_fundamentals_v1"
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CurriculumAssignment(SQLModel, table=True):
    __tablename__ = "curriculum_assignments"

    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, foreign_key="company.id")
    curriculum_id: str = Field(index=True, foreign_key="curriculums.id")
    
    # Target Scope: assigned to entire company, a branch, a team, or a single user
    target_type: str = Field(index=True)  # company | branch | team | user
    target_id: str = Field(index=True)    # Matches company_id, branch_id, team_id, or username
    
    assigned_by: str = Field(index=True)  # Username of Trainer/Admin
    assigned_at: datetime = Field(default_factory=datetime.utcnow)

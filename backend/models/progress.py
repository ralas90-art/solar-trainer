from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class UserCurriculumProgress(SQLModel, table=True):
    __tablename__ = "user_curriculum_progress"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # username
    company_id: str = Field(index=True, foreign_key="company.id")
    curriculum_id: str = Field(index=True, foreign_key="curriculums.id")
    status: str = Field(default="not_started", index=True)  # not_started | in_progress | completed
    
    progress_percentage: float = Field(default=0.0)
    quiz_average: float = Field(default=0.0)
    sim_average_score: float = Field(default=0.0)
    
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

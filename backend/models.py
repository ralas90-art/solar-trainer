from typing import List, Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

# --- Database Models (SQLModel) ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str # In production, hash this!

class UserStats(SQLModel, table=True):
    user_id: str = Field(primary_key=True)
    total_score: int = 0
    current_streak: int = 0
    highest_streak: int = 0

# --- API Models (Pydantic / SQLModel) ---

class TenantConfig(BaseModel):
    id: str
    name: str
    allowed_states: List[str]
    brand_tone: str

class StateProfile(BaseModel):
    code: str
    name: str
    metering: str
    incentives: List[str]
    critical_keywords: List[str]
    pitch_focus: str

class UserProfile(BaseModel):
    experience_years: float = 0
    has_sold_solar: bool = False
    skill_level: str = "Beginner" # Beginner, Intermediate, Advanced

class Scenario(BaseModel):
    id: str
    name: str
    description: str
    difficulty: str
    opening_line: str
    valid_responses: List[str]

class ChatRequest(BaseModel):
    user_id: str
    tenant_id: str
    state_code: str
    scenario_id: str
    user_message: str
    language: str = "en" # 'en' or 'es'
    
class ChatResponse(BaseModel):
    agent_message: str
    critique: Optional[str] = None
    pass_fail: Optional[bool] = None
    score: int = 0 # 0-100

from typing import List, Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

# --- Enums ---
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    SALES_REP = "sales_rep"

class PlanTier(str, Enum):
    STARTER = "starter"
    GROWTH = "growth"
    ENTERPRISE = "enterprise"

# --- Database Models (SQLModel) ---
class Company(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    plan_tier: PlanTier = Field(default=PlanTier.STARTER)
    platform_fee: float = 499.0
    per_rep_fee: float = 39.0
    stripe_customer_id: Optional[str] = Field(default=None)
    stripe_subscription_id: Optional[str] = Field(default=None)
    payment_status: str = Field(default="pending") # pending, active, past_due, canceled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str # In production, hash this!
    role: UserRole = Field(default=UserRole.SALES_REP)
    company_id: Optional[str] = Field(default="septivolt", foreign_key="company.id")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserStats(SQLModel, table=True):
    user_id: str = Field(primary_key=True)
    total_score: int = 0
    current_streak: int = 0
    highest_streak: int = 0
    lives: int = 3
    last_life_lost_at: Optional[datetime] = None
    # JSON string tracking progress: {"day_1": {"quiz": true, "sim": true}, ...}
    module_progress: str = "{}"
    # JSON string tracking scenario progress: {"d2d_1": {"passed": true, "best_score": 85, "attempts": 2}, ...}
    scenario_progress: str = "{}"

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
    briefing: Optional[str] = None
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
    better_response: Optional[str] = None
    pass_fail: Optional[bool] = None
    score: int = 0 # 0-100
    summary: Optional[str] = None
    pros: List[str] = []
    cons: List[str] = []

class EnterpriseInquiry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    company: str
    team_size: int
    use_case: str
    score: Optional[int] = None # AI qualification score
    priority: str = Field(default="medium") # high, medium, low
    status: str = Field(default="new") # new, contacted, demo_booked, qualified, lost
    research_notes: Optional[str] = None # AI background research
    created_at: datetime = Field(default_factory=datetime.utcnow)

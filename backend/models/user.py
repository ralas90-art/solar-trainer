from typing import List, Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON, Column
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

import uuid
from uuid import UUID, uuid4

# --- Database Models (SQLModel) ---
class Company(SQLModel, table=True):
    id: str = Field(primary_key=True) # Slug e.g. "septivolt"
    name: str
    plan_tier: PlanTier = Field(default=PlanTier.STARTER)
    platform_fee: float = 499.0
    per_rep_fee: float = 39.0
    stripe_customer_id: Optional[str] = Field(default=None)
    stripe_subscription_id: Optional[str] = Field(default=None)
    subscription_status: str = Field(default="trialing") # active, trialing, past_due, canceled, unpaid
    
    # --- Plan Limits ---
    monthly_sim_limit: int = Field(default=50)
    max_rep_limit: int = Field(default=3)
    allow_custom_keys: bool = Field(default=False)
    allow_whitelabel: bool = Field(default=True) # Basic whitelabel allowed for all
    allow_manager_dashboard: bool = Field(default=False)
    
    # --- White-Label Customization (V2) ---
    profile_version: int = Field(default=1)

    # Core Branding
    logo_url: Optional[str] = Field(default=None)
    primary_color: Optional[str] = Field(default=None)
    secondary_color: Optional[str] = Field(default=None)
    accent_color: Optional[str] = Field(default=None)
    contact_email: Optional[str] = Field(default=None)
    phone_number: Optional[str] = Field(default=None)
    address: Optional[str] = Field(default=None)

    # Custom Operational Fields
    crm_name: Optional[str] = Field(default=None)
    proposal_tool: Optional[str] = Field(default=None)
    door_knocking_tool: Optional[str] = Field(default=None)
    financing_options: Optional[str] = Field(default=None)
    onboarding_notes: Optional[str] = Field(default=None)
    
    # JSON Overrides
    custom_script_overrides: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    objection_handling_overrides: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

    # --- AI Configuration (Phase 5) ---
    use_custom_ai_keys: bool = Field(default=False)
    openai_api_key_encrypted: Optional[str] = Field(default=None)
    vapi_api_key_encrypted: Optional[str] = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow)

class GlobalSettings(SQLModel, table=True):
    """Database-driven global fallback variables for the White-Label Engine."""
    id: int = Field(default=1, primary_key=True)
    fallback_variables: Dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True)
    password: str # Hashed with passlib/bcrypt
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Membership(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    company_id: str = Field(foreign_key="company.id")
    role: UserRole = Field(default=UserRole.SALES_REP)
    is_active: bool = Field(default=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class Invitation(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    company_id: str = Field(foreign_key="company.id")
    email: str
    role: UserRole = Field(default=UserRole.SALES_REP)
    token: str = Field(index=True, unique=True)
    status: str = Field(default="pending") # pending, accepted, expired, revoked
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserStats(SQLModel, table=True):
    user_id: UUID = Field(primary_key=True, foreign_key="user.id")
    total_score: int = 0
    current_streak: int = 0
    highest_streak: int = 0
    lives: int = 3
    last_life_lost_at: Optional[datetime] = None
    # JSON string tracking progress: {"day_1": {"quiz": true, "sim": true}, ...}
    module_progress: str = "{}"
    # JSON string tracking scenario progress: {"d2d_1": {"passed": true, "best_score": 85, "attempts": 2}, ...}
    scenario_progress: str = "{}"
    
    # Engagement Tracking (Phase 2)
    last_interaction_at: Optional[datetime] = Field(default=None)
    activity_log: str = "[]" # JSON list of events with timestamps
    coaching_signals_state: str = "{}" # JSON map of {signal_type: last_triggered_at}

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

# --- AI Usage Tracking (Phase 5) ---
class AIUsageLog(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    company_id: str = Field(index=True)
    user_id: Optional[UUID] = Field(index=True)
    session_id: Optional[str] = Field(index=True)
    provider: str # openai, vapi
    model: Optional[str]
    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0
    estimated_cost: float = 0.0
    status: str = "success" # success, failed
    error_category: Optional[str] = None # auth, timeout, rate_limit, invalid_request
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- Coaching & History (Phase 7B) ---
class SimulationResult(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True, foreign_key="user.id")
    company_id: str = Field(index=True, foreign_key="company.id")
    scenario_id: str
    scenario_name: str
    score: int = 0
    passed: bool = False
    duration_seconds: Optional[int] = None
    transcript_json: Optional[str] = Field(default="[]", sa_column=Column(JSON))
    feedback_json: Optional[str] = Field(default="{}", sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CoachingNote(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    rep_id: UUID = Field(index=True, foreign_key="user.id")
    manager_id: UUID = Field(index=True, foreign_key="user.id")
    company_id: str = Field(index=True, foreign_key="company.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

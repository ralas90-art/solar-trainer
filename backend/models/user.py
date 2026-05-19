from typing import List, Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
import uuid


# ─── Enums ───────────────────────────────────────────────────────────────────

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    SALES_REP = "sales_rep"

class PlanTier(str, Enum):
    STARTER = "starter"
    GROWTH = "growth"
    ENTERPRISE = "enterprise"


# ─── Database Models (SQLModel) ───────────────────────────────────────────────

class Company(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    plan_tier: PlanTier = Field(default=PlanTier.STARTER)
    platform_fee: float = 499.0
    per_rep_fee: float = 39.0
    stripe_customer_id: Optional[str] = Field(default=None)
    stripe_subscription_id: Optional[str] = Field(default=None)
    payment_status: str = Field(default="pending")  # pending, active, past_due, canceled
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Team(SQLModel, table=True):
    """
    Represents a team within a company (e.g. "West Mavericks").
    Used to group trainees under a manager for reporting and coaching.
    """
    id: str = Field(default_factory=lambda: f"team_{uuid.uuid4().hex[:12]}", primary_key=True)
    name: str
    company_id: str = Field(index=True, foreign_key="company.id")
    manager_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: Optional[str] = Field(default=None, index=True)
    password: str  # Always bcrypt-hashed
    role: UserRole = Field(default=UserRole.SALES_REP)
    company_id: Optional[str] = Field(default="septivolt", foreign_key="company.id")
    team_id: Optional[str] = Field(default=None, foreign_key="team.id")
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
    # JSON string tracking onboarding task completions: {"assessment": true, "roleplay": false, ...}
    onboarding_progress: str = "{}"
    # Private manager coaching notes for this rep (written by manager, not visible to reps)
    coaching_notes: str = ""


class SimulationSession(SQLModel, table=True):
    """
    Persists a single simulation run for analytics and coaching history.
    company_id provides tenant isolation — all queries must filter by this column.
    """
    id: str = Field(
        default_factory=lambda: f"sim_{uuid.uuid4().hex[:16]}",
        primary_key=True
    )
    user_id: str = Field(index=True)          # username FK (no FK constraint for flexibility)
    company_id: str = Field(index=True)       # tenant isolation
    scenario_id: str = Field(index=True)
    scenario_name: str = Field(default="")
    difficulty: str = Field(default="beginner")
    score: int = 0
    passed: bool = False
    duration_seconds: Optional[int] = None
    is_demo: bool = Field(default=False)      # Demo runs are tagged, never leak into real analytics
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Debrief(SQLModel, table=True):
    """
    Persists AI coaching feedback for a completed simulation session.
    company_id and user_id provide row-level isolation.
    """
    id: str = Field(
        default_factory=lambda: f"debrief_{uuid.uuid4().hex[:16]}",
        primary_key=True
    )
    session_id: str = Field(index=True)       # FK to SimulationSession.id
    user_id: str = Field(index=True)          # username
    company_id: str = Field(index=True)       # tenant isolation
    scenario_id: str = Field(default="")
    scenario_name: str = Field(default="")
    feedback_summary: Optional[str] = None
    tone_rating: Optional[str] = None
    tone_feedback: Optional[str] = None
    strengths: str = "[]"                     # JSON list
    improvements: str = "[]"                  # JSON list
    suggested_script: Optional[str] = None
    transcript: str = "[]"                    # JSON list of {role, content} turns
    is_demo: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CoachingFlag(SQLModel, table=True):
    """
    Manager-visible attention alerts for a specific rep.
    High-severity flags (score < 70%) or inactivity warnings are stored here.
    """
    id: str = Field(
        default_factory=lambda: f"flag_{uuid.uuid4().hex[:12]}",
        primary_key=True
    )
    user_id: str = Field(index=True)          # rep username
    company_id: str = Field(index=True)       # tenant isolation
    flag_type: str = Field(default="at_risk") # at_risk | stale_activity | low_score | custom
    severity: str = Field(default="medium")   # high | medium | low
    title_en: str = ""
    title_es: str = ""
    reason_en: str = ""
    reason_es: str = ""
    context_en: str = ""
    context_es: str = ""
    recommended_actions_json: str = "[]"      # JSON list of strings
    is_active: bool = Field(default=True)
    notes: Optional[str] = None               # Manager's private annotation
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None


# ─── API / Pydantic Models ────────────────────────────────────────────────────

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
    skill_level: str = "Beginner"  # Beginner, Intermediate, Advanced

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
    language: str = "en"  # 'en' or 'es'

class ChatResponse(BaseModel):
    agent_message: str
    critique: Optional[str] = None
    better_response: Optional[str] = None
    pass_fail: Optional[bool] = None
    score: int = 0  # 0-100
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
    score: Optional[int] = None           # AI qualification score
    priority: str = Field(default="medium")  # high, medium, low
    status: str = Field(default="new")    # new, contacted, demo_booked, qualified, lost
    research_notes: Optional[str] = None  # AI background research
    created_at: datetime = Field(default_factory=datetime.utcnow)

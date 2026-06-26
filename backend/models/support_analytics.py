from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class SupportChatAnalytics(SQLModel, table=True):
    __tablename__ = "support_chat_analytics"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Username of the logged in user
    role: Optional[str] = Field(default=None)  # Role of the user (e.g. sales_rep, manager, admin)
    locale: str = Field(default="en")  # Language locale (en or es)
    question_type: str = Field(default="ai_custom")  # allowed: "quick_faq" or "ai_custom"
    question_preview: Optional[str] = Field(default=None)  # Message preview, capped to 200 chars
    fallback_used: bool = Field(default=False)
    context_area: Optional[str] = Field(default=None, index=True)  # Platform area: simulator, training, dashboard, settings, certifications, kpis, general
    helpful: Optional[bool] = Field(default=None)  # None = unrated, True = helpful, False = not helpful
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SupportChatRateLimit(SQLModel, table=True):
    __tablename__ = "support_chat_rate_limit"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

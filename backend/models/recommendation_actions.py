"""
RecommendationAction model for tracking human decisions on curriculum recommendations.
Snapshot fields preserve the exact context the user saw when taking action.
"""
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class RecommendationAction(SQLModel, table=True):
    __tablename__ = "recommendation_actions"

    id: Optional[int] = Field(default=None, primary_key=True)
    recommendation_id: str = Field(index=True)          # e.g. "rec_ctx_simulator_high"
    status: str = Field(index=True)                     # "accepted" | "dismissed" | "needs_review" | "converted_to_faq" | "converted_to_walkthrough" | "converted_to_manual"
    context_area: str = Field(index=True)               # For filtering
    priority: str = Field(default="medium")             # Priority at time of action

    # Snapshot fields — preserve what the human saw
    signal_sources_json: str = Field(default="[]")      # JSON-serialized List[str]
    snapshot_title: str = Field(default="")
    snapshot_explanation: str = Field(default="")
    snapshot_suggested_action: str = Field(default="")
    snapshot_supporting_data_json: str = Field(default="{}")  # JSON-serialized dict

    # Action metadata
    acted_by: str = Field(index=True)                   # Username who acted
    acted_at: Optional[str] = Field(default=None)       # ISO timestamp
    notes: Optional[str] = Field(default=None)          # Optional human notes

    # Dismissal tracking
    dismissed_until_signal_strength: Optional[int] = Field(default=None)  # 2x the count at time of dismissal

    # Timestamps
    created_at: Optional[str] = Field(default=None)
    updated_at: Optional[str] = Field(default=None)

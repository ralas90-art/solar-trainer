"""
DraftPackReview model for tracking implementation status of curriculum draft pack items.
Tracks the lifecycle from draft creation through assignment, review, implementation,
NotebookLM update, verification, and closure.
"""
from typing import Optional
from sqlmodel import SQLModel, Field


class DraftPackReview(SQLModel, table=True):
    __tablename__ = "draft_pack_reviews"

    id: Optional[int] = Field(default=None, primary_key=True)
    recommendation_action_id: int = Field(index=True)
    draft_pack_path: Optional[str] = Field(default=None)
    source_status: Optional[str] = Field(default=None, index=True)  # Original RecommendationAction status
    status: str = Field(default="draft_created", index=True)
    priority: str = Field(default="medium", index=True)
    context_area: str = Field(default="general", index=True)

    # Snapshot from the recommendation action
    snapshot_title: str = Field(default="")
    snapshot_suggested_action: str = Field(default="")

    # Assignment
    assigned_to: Optional[str] = Field(default=None, index=True)
    assigned_by: Optional[str] = Field(default=None)
    assigned_at: Optional[str] = Field(default=None)

    # Implementation tracking
    implementation_notes: Optional[str] = Field(default=None)
    notebooklm_updated_at: Optional[str] = Field(default=None)
    verified_by: Optional[str] = Field(default=None)
    verified_at: Optional[str] = Field(default=None)

    # Timestamps
    created_at: Optional[str] = Field(default=None)
    updated_at: Optional[str] = Field(default=None)
    closed_at: Optional[str] = Field(default=None)

"""
Phase 7: Draft Pack Review Status + Manual Implementation Tracker
=================================================================
Tracks what happens after a curriculum draft pack is generated.
Status tracking only. No auto-edits, no auto-PRs, no direct NotebookLM changes.
"""
import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from pydantic import BaseModel, Field as PydanticField

from database import get_session
from models.user import User
from models.draft_pack_review import DraftPackReview
from routers.support import get_authenticated_user
from routers.support_analytics import require_analytics_access

router = APIRouter()

# -- Constants --

ALLOWED_STATUSES = {
    "draft_created", "assigned", "reviewed", "implemented",
    "notebook_updated", "verified", "closed",
    "blocked", "needs_revision", "deferred",
}

NEXT_STEP_MAP = {
    "draft_created": "Assign this item to a trainer or admin for review.",
    "assigned": "Review the draft content and mark as reviewed when ready.",
    "reviewed": "Implement the curriculum changes manually.",
    "implemented": "Re-upload affected sections to NotebookLM.",
    "notebook_updated": "Verify the chatbot reflects the new content.",
    "verified": "Close this item to mark it complete.",
    "closed": "This item is complete.",
    "blocked": "Resolve the blocker before proceeding.",
    "needs_revision": "Revise the draft content and reassign for review.",
    "deferred": "This item has been postponed.",
}

PRIORITY_ORDER = {"high": 0, "medium": 1, "low": 2}


# -- DTOs --

class CreateTrackerItemRequest(BaseModel):
    recommendation_action_id: int
    draft_pack_path: Optional[str] = None
    source_status: Optional[str] = None
    priority: str = "medium"
    context_area: str = "general"
    snapshot_title: str = ""
    snapshot_suggested_action: str = ""
    assigned_to: Optional[str] = None


class PatchTrackerItemRequest(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    implementation_notes: Optional[str] = None


# -- Endpoints --

@router.get("/api/v1/support/implementation-tracker")
async def list_tracker_items(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    status: str = Query("all"),
    context_area: str = Query("all"),
    priority: str = Query("all", pattern="^(high|medium|low|all)$"),
    assigned_to: str = Query("all"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    require_analytics_access(user)

    all_items = session.exec(select(DraftPackReview)).all()

    # Apply filters
    filtered = list(all_items)
    if status != "all":
        filtered = [i for i in filtered if i.status == status]
    if context_area != "all":
        filtered = [i for i in filtered if i.context_area == context_area]
    if priority != "all":
        filtered = [i for i in filtered if i.priority == priority]
    if assigned_to != "all":
        filtered = [i for i in filtered if i.assigned_to == assigned_to]

    # Sort by priority (high first), then created_at descending
    filtered.sort(key=lambda i: (
        PRIORITY_ORDER.get(i.priority, 9),
        -(datetime.fromisoformat(i.created_at).timestamp() if i.created_at else 0)
    ))

    # Paginate
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = filtered[start:end]

    items = []
    for i in page_items:
        items.append({
            "id": i.id,
            "recommendation_action_id": i.recommendation_action_id,
            "draft_pack_path": i.draft_pack_path,
            "source_status": i.source_status,
            "status": i.status,
            "priority": i.priority,
            "context_area": i.context_area,
            "snapshot_title": i.snapshot_title,
            "snapshot_suggested_action": i.snapshot_suggested_action,
            "assigned_to": i.assigned_to,
            "assigned_by": i.assigned_by,
            "assigned_at": i.assigned_at,
            "implementation_notes": i.implementation_notes,
            "notebooklm_updated_at": i.notebooklm_updated_at,
            "verified_by": i.verified_by,
            "verified_at": i.verified_at,
            "suggested_next_step": NEXT_STEP_MAP.get(i.status, "Review this item."),
            "created_at": i.created_at,
            "updated_at": i.updated_at,
            "closed_at": i.closed_at,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/api/v1/support/implementation-tracker", status_code=201)
async def create_tracker_item(
    body: CreateTrackerItemRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
):
    require_analytics_access(user)

    now = datetime.utcnow().isoformat()

    # Duplicate-safe: check for existing item
    existing = session.exec(
        select(DraftPackReview).where(
            DraftPackReview.recommendation_action_id == body.recommendation_action_id
        )
    ).first()

    if existing:
        return {
            "id": existing.id,
            "recommendation_action_id": existing.recommendation_action_id,
            "status": existing.status,
            "assigned_to": existing.assigned_to,
            "created_at": existing.created_at,
            "already_exists": True,
        }

    # Determine initial status
    initial_status = "draft_created"
    assigned_by = None
    assigned_at = None
    if body.assigned_to:
        initial_status = "assigned"
        assigned_by = user.username
        assigned_at = now

    item = DraftPackReview(
        recommendation_action_id=body.recommendation_action_id,
        draft_pack_path=body.draft_pack_path,
        source_status=body.source_status,
        status=initial_status,
        priority=body.priority,
        context_area=body.context_area,
        snapshot_title=body.snapshot_title,
        snapshot_suggested_action=body.snapshot_suggested_action,
        assigned_to=body.assigned_to,
        assigned_by=assigned_by,
        assigned_at=assigned_at,
        created_at=now,
        updated_at=now,
    )

    session.add(item)
    session.commit()
    session.refresh(item)

    return {
        "id": item.id,
        "recommendation_action_id": item.recommendation_action_id,
        "status": item.status,
        "assigned_to": item.assigned_to,
        "created_at": item.created_at,
        "already_exists": False,
    }


@router.patch("/api/v1/support/implementation-tracker/{item_id}")
async def patch_tracker_item(
    item_id: int,
    body: PatchTrackerItemRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
):
    require_analytics_access(user)

    item = session.get(DraftPackReview, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Implementation tracker item not found.")

    now = datetime.utcnow().isoformat()

    if body.status is not None:
        if body.status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=422, detail=f"Invalid status: {body.status}. Allowed: {', '.join(sorted(ALLOWED_STATUSES))}")
        item.status = body.status

        # Auto-set timestamps based on status transitions
        if body.status == "notebook_updated":
            item.notebooklm_updated_at = now
        elif body.status == "verified":
            item.verified_by = user.username
            item.verified_at = now
        elif body.status == "closed":
            item.closed_at = now

    if body.assigned_to is not None:
        item.assigned_to = body.assigned_to
        item.assigned_by = user.username
        item.assigned_at = now
        # Auto-transition to assigned if still draft_created
        if item.status == "draft_created":
            item.status = "assigned"

    if body.implementation_notes is not None:
        item.implementation_notes = body.implementation_notes

    item.updated_at = now
    session.add(item)
    session.commit()
    session.refresh(item)

    return {
        "id": item.id,
        "recommendation_action_id": item.recommendation_action_id,
        "status": item.status,
        "assigned_to": item.assigned_to,
        "assigned_by": item.assigned_by,
        "assigned_at": item.assigned_at,
        "implementation_notes": item.implementation_notes,
        "notebooklm_updated_at": item.notebooklm_updated_at,
        "verified_by": item.verified_by,
        "verified_at": item.verified_at,
        "closed_at": item.closed_at,
        "updated_at": item.updated_at,
        "suggested_next_step": NEXT_STEP_MAP.get(item.status, "Review this item."),
    }

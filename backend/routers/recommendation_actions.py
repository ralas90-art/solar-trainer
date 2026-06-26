"""
Phase 5: Human-in-the-Loop Curriculum Update Workflow
=====================================================
Endpoints for tracking human decisions on curriculum recommendations.
The engine suggests. Humans decide. Nothing auto-edits production docs.
"""
import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from pydantic import BaseModel, Field as PydanticField

from database import get_session
from models.user import User
from models.recommendation_actions import RecommendationAction
from routers.support import get_authenticated_user
from routers.support_analytics import require_analytics_access

router = APIRouter()

# ── DTOs ──

ALLOWED_STATUSES = {
    "accepted", "dismissed", "needs_review",
    "converted_to_faq", "converted_to_walkthrough", "converted_to_manual"
}


class CreateRecommendationActionRequest(BaseModel):
    recommendation_id: str
    status: str
    context_area: str = "general"
    priority: str = "medium"
    signal_sources: list = PydanticField(default_factory=list)
    snapshot_title: str = ""
    snapshot_explanation: str = ""
    snapshot_suggested_action: str = ""
    snapshot_supporting_data: dict = PydanticField(default_factory=dict)
    notes: Optional[str] = None


class PatchRecommendationActionRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


# ── Helper: Extract primary count for dismissal threshold ──

def _get_primary_count(supporting_data: dict, signal_sources: list) -> int:
    """Extract the primary count from supporting_data based on signal type."""
    if not signal_sources:
        return 0
    primary_signal = signal_sources[0] if signal_sources else ""
    key_map = {
        "context_concentration": "count",
        "repeated_question": "repeat_count",
        "not_helpful_rate": "not_helpful_count",
        "fallback_rate": "fallback_count",
        "locale_gap": "es_count",
        "faq_coverage_gap": "custom_count",
    }
    key = key_map.get(primary_signal, "count")
    return int(supporting_data.get(key, 0))


# ── Endpoints ──

@router.get("/api/v1/support/analytics/recommendation-actions")
async def list_recommendation_actions(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    status: str = Query("all", pattern="^(accepted|dismissed|needs_review|converted_to_faq|converted_to_walkthrough|converted_to_manual|all)$"),
    context_area: str = Query("all"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    require_analytics_access(user)

    query = select(RecommendationAction)
    all_actions = session.exec(query).all()

    # Filter
    filtered = list(all_actions)
    if status != "all":
        filtered = [a for a in filtered if a.status == status]
    if context_area != "all":
        filtered = [a for a in filtered if a.context_area == context_area]

    # Sort by acted_at descending
    filtered.sort(key=lambda a: a.acted_at or "", reverse=True)

    # Paginate
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = filtered[start:end]

    return {
        "actions": [
            {
                "id": a.id,
                "recommendation_id": a.recommendation_id,
                "status": a.status,
                "context_area": a.context_area,
                "priority": a.priority,
                "signal_sources": json.loads(a.signal_sources_json or "[]"),
                "snapshot_title": a.snapshot_title,
                "snapshot_explanation": a.snapshot_explanation,
                "snapshot_suggested_action": a.snapshot_suggested_action,
                "snapshot_supporting_data": json.loads(a.snapshot_supporting_data_json or "{}"),
                "acted_by": a.acted_by,
                "acted_at": a.acted_at,
                "notes": a.notes,
                "dismissed_until_signal_strength": a.dismissed_until_signal_strength,
                "created_at": a.created_at,
                "updated_at": a.updated_at,
            }
            for a in page_items
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/api/v1/support/analytics/recommendation-actions", status_code=201)
async def create_recommendation_action(
    body: CreateRecommendationActionRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
):
    require_analytics_access(user)

    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status: {body.status}. Allowed: {', '.join(sorted(ALLOWED_STATUSES))}")

    now = datetime.utcnow().isoformat()

    # Check for existing action on this recommendation
    existing = session.exec(
        select(RecommendationAction).where(
            RecommendationAction.recommendation_id == body.recommendation_id
        )
    ).first()

    if existing:
        # Same status + same notes = return existing safely
        if existing.status == body.status and existing.notes == body.notes:
            return {
                "id": existing.id,
                "recommendation_id": existing.recommendation_id,
                "status": existing.status,
                "acted_by": existing.acted_by,
                "acted_at": existing.acted_at,
                "notes": existing.notes,
                "updated": False,
            }

        # Different status or notes = update existing
        existing.status = body.status
        existing.notes = body.notes
        existing.acted_by = user.username
        existing.acted_at = now
        existing.updated_at = now

        # Update snapshot to reflect current view
        existing.signal_sources_json = json.dumps(body.signal_sources)
        existing.snapshot_title = body.snapshot_title
        existing.snapshot_explanation = body.snapshot_explanation
        existing.snapshot_suggested_action = body.snapshot_suggested_action
        existing.snapshot_supporting_data_json = json.dumps(body.snapshot_supporting_data)
        existing.priority = body.priority
        existing.context_area = body.context_area

        # Dismissal threshold
        if body.status == "dismissed":
            primary_count = _get_primary_count(body.snapshot_supporting_data, body.signal_sources)
            existing.dismissed_until_signal_strength = primary_count * 2
        else:
            existing.dismissed_until_signal_strength = None

        session.add(existing)
        session.commit()
        session.refresh(existing)

        return {
            "id": existing.id,
            "recommendation_id": existing.recommendation_id,
            "status": existing.status,
            "acted_by": existing.acted_by,
            "acted_at": existing.acted_at,
            "notes": existing.notes,
            "dismissed_until_signal_strength": existing.dismissed_until_signal_strength,
            "updated": True,
        }

    # Create new action
    dismissed_threshold = None
    if body.status == "dismissed":
        primary_count = _get_primary_count(body.snapshot_supporting_data, body.signal_sources)
        dismissed_threshold = primary_count * 2

    action = RecommendationAction(
        recommendation_id=body.recommendation_id,
        status=body.status,
        context_area=body.context_area,
        priority=body.priority,
        signal_sources_json=json.dumps(body.signal_sources),
        snapshot_title=body.snapshot_title,
        snapshot_explanation=body.snapshot_explanation,
        snapshot_suggested_action=body.snapshot_suggested_action,
        snapshot_supporting_data_json=json.dumps(body.snapshot_supporting_data),
        acted_by=user.username,
        acted_at=now,
        notes=body.notes,
        dismissed_until_signal_strength=dismissed_threshold,
        created_at=now,
        updated_at=now,
    )

    session.add(action)
    session.commit()
    session.refresh(action)

    return {
        "id": action.id,
        "recommendation_id": action.recommendation_id,
        "status": action.status,
        "acted_by": action.acted_by,
        "acted_at": action.acted_at,
        "notes": action.notes,
        "dismissed_until_signal_strength": action.dismissed_until_signal_strength,
        "updated": False,
    }


@router.patch("/api/v1/support/analytics/recommendation-actions/{action_id}")
async def patch_recommendation_action(
    action_id: int,
    body: PatchRecommendationActionRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
):
    require_analytics_access(user)

    action = session.get(RecommendationAction, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Recommendation action not found.")

    # Ownership check: only original actor or super_admin can modify
    user_role = str(user.role).lower() if hasattr(user.role, 'value') else str(user.role).lower()
    if hasattr(user.role, 'value'):
        user_role = user.role.value.lower()
    is_owner = action.acted_by == user.username
    is_super = user_role == "super_admin"
    if not is_owner and not is_super:
        raise HTTPException(status_code=403, detail="Forbidden: Only the original actor or a super_admin can modify this action.")

    now = datetime.utcnow().isoformat()

    if body.status is not None:
        if body.status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=422, detail=f"Invalid status: {body.status}.")
        action.status = body.status

        # Recompute dismissal threshold if changing to dismissed
        if body.status == "dismissed":
            supporting_data = json.loads(action.snapshot_supporting_data_json or "{}")
            signal_sources = json.loads(action.signal_sources_json or "[]")
            primary_count = _get_primary_count(supporting_data, signal_sources)
            action.dismissed_until_signal_strength = primary_count * 2
        elif action.status != "dismissed":
            action.dismissed_until_signal_strength = None

    if body.notes is not None:
        action.notes = body.notes

    action.updated_at = now
    session.add(action)
    session.commit()
    session.refresh(action)

    return {
        "id": action.id,
        "recommendation_id": action.recommendation_id,
        "status": action.status,
        "acted_by": action.acted_by,
        "acted_at": action.acted_at,
        "notes": action.notes,
        "dismissed_until_signal_strength": action.dismissed_until_signal_strength,
        "updated_at": action.updated_at,
    }

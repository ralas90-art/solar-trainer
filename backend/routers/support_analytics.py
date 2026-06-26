from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import Optional
from collections import defaultdict, Counter

from database import get_session
from models.support_analytics import SupportChatAnalytics
from models.user import User
from routers.support import get_authenticated_user

router = APIRouter()

ANALYTICS_ROLE_VALUES = {
    "super_admin", "dealer_admin", "branch_manager", "trainer", "admin", "manager"
}


def require_analytics_access(user: User):
    role = user.role
    has_access = role in ANALYTICS_ROLE_VALUES or (
        hasattr(role, 'value') and role.value in ANALYTICS_ROLE_VALUES
    )
    if not has_access:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You do not have access to support analytics."
        )


def _apply_filters(
    records: list,
    date_range: str,
    locale: str,
    question_type: str,
    helpful: str,
    fallback_used: str,
    context_area: str,
):
    now = datetime.utcnow()

    if date_range == "7d":
        cutoff = now - timedelta(days=7)
    elif date_range == "30d":
        cutoff = now - timedelta(days=30)
    elif date_range == "90d":
        cutoff = now - timedelta(days=90)
    else:
        cutoff = None

    filtered = []
    for r in records:
        if cutoff and r.created_at < cutoff:
            continue
        if locale != "all" and r.locale != locale:
            continue
        if question_type != "all" and r.question_type != question_type:
            continue
        if helpful == "true" and r.helpful is not True:
            continue
        if helpful == "false" and r.helpful is not False:
            continue
        if helpful == "unrated" and r.helpful is not None:
            continue
        if fallback_used == "true" and r.fallback_used is not True:
            continue
        if fallback_used == "false" and r.fallback_used is not False:
            continue
        if context_area != "all":
            area = r.context_area or "general"
            if area != context_area:
                continue
        filtered.append(r)

    return filtered


@router.get("/api/v1/support/analytics/summary")
async def support_analytics_summary(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    date_range: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    locale: str = Query("all", pattern="^(en|es|all)$"),
    question_type: str = Query("all", pattern="^(quick_faq|ai_custom|all)$"),
    helpful: str = Query("all", pattern="^(true|false|unrated|all)$"),
    fallback_used: str = Query("all", pattern="^(true|false|all)$"),
    context_area: str = Query("all", pattern="^(simulator|training|dashboard|settings|certifications|kpis|general|all)$"),
):
    require_analytics_access(user)

    all_records = session.exec(select(SupportChatAnalytics)).all()
    records = _apply_filters(all_records, date_range, locale, question_type, helpful, fallback_used, context_area)

    total = len(records)
    quick_faq_count = sum(1 for r in records if r.question_type == "quick_faq")
    ai_custom_count = sum(1 for r in records if r.question_type == "ai_custom")
    english_count = sum(1 for r in records if r.locale == "en")
    spanish_count = sum(1 for r in records if r.locale == "es")
    helpful_count = sum(1 for r in records if r.helpful is True)
    not_helpful_count = sum(1 for r in records if r.helpful is False)
    unrated_count = sum(1 for r in records if r.helpful is None)
    fallback_count = sum(1 for r in records if r.fallback_used is True)

    rated_total = helpful_count + not_helpful_count
    helpful_rate = round((helpful_count / rated_total) * 100, 1) if rated_total > 0 else 0.0

    # Context area breakdown
    area_counter = Counter()
    for r in records:
        area = r.context_area or "general"
        area_counter[area] += 1

    # Top question previews (top 10 by frequency)
    preview_groups = defaultdict(list)
    for r in records:
        if r.question_preview:
            preview_groups[r.question_preview].append(r)

    top_previews = sorted(preview_groups.items(), key=lambda x: len(x[1]), reverse=True)[:10]
    top_question_previews = []
    for preview, group in top_previews:
        most_recent = max(group, key=lambda r: r.created_at)
        top_question_previews.append({
            "preview": preview,
            "count": len(group),
            "locale": most_recent.locale,
        })

    # Recent not-helpful (last 10)
    not_helpful_records = [r for r in records if r.helpful is False]
    not_helpful_records.sort(key=lambda r: r.created_at, reverse=True)
    recent_not_helpful = []
    for r in not_helpful_records[:10]:
        recent_not_helpful.append({
            "id": r.id,
            "question_preview": r.question_preview,
            "locale": r.locale,
            "context_area": r.context_area or "general",
            "created_at": r.created_at.isoformat(),
        })

    return {
        "total_interactions": total,
        "quick_faq_count": quick_faq_count,
        "ai_custom_count": ai_custom_count,
        "english_count": english_count,
        "spanish_count": spanish_count,
        "helpful_count": helpful_count,
        "not_helpful_count": not_helpful_count,
        "unrated_count": unrated_count,
        "fallback_count": fallback_count,
        "helpful_rate": helpful_rate,
        "context_area_breakdown": dict(area_counter),
        "top_question_previews": top_question_previews,
        "recent_not_helpful": recent_not_helpful,
    }


@router.get("/api/v1/support/analytics/trends")
async def support_analytics_trends(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    date_range: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    locale: str = Query("all", pattern="^(en|es|all)$"),
    question_type: str = Query("all", pattern="^(quick_faq|ai_custom|all)$"),
    helpful: str = Query("all", pattern="^(true|false|unrated|all)$"),
    fallback_used: str = Query("all", pattern="^(true|false|all)$"),
    context_area: str = Query("all", pattern="^(simulator|training|dashboard|settings|certifications|kpis|general|all)$"),
):
    require_analytics_access(user)

    all_records = session.exec(select(SupportChatAnalytics)).all()
    records = _apply_filters(all_records, date_range, locale, question_type, helpful, fallback_used, context_area)

    def bucket_key(dt: datetime) -> str:
        if date_range in ("7d", "30d"):
            return dt.strftime("%Y-%m-%d")
        elif date_range == "90d":
            iso = dt.isocalendar()
            monday = dt - timedelta(days=dt.weekday())
            return monday.strftime("%Y-%m-%d")
        else:
            return dt.strftime("%Y-%m-01")

    buckets = defaultdict(list)
    for r in records:
        key = bucket_key(r.created_at)
        buckets[key].append(r)

    data = []
    for date_key in sorted(buckets.keys()):
        group = buckets[date_key]
        data.append({
            "date": date_key,
            "total": len(group),
            "faq": sum(1 for r in group if r.question_type == "quick_faq"),
            "custom": sum(1 for r in group if r.question_type == "ai_custom"),
            "en": sum(1 for r in group if r.locale == "en"),
            "es": sum(1 for r in group if r.locale == "es"),
            "helpful": sum(1 for r in group if r.helpful is True),
            "not_helpful": sum(1 for r in group if r.helpful is False),
            "fallback": sum(1 for r in group if r.fallback_used is True),
        })

    return {"data": data}


@router.get("/api/v1/support/analytics/questions")
async def support_analytics_questions(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    date_range: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    locale: str = Query("all", pattern="^(en|es|all)$"),
    question_type: str = Query("all", pattern="^(quick_faq|ai_custom|all)$"),
    helpful: str = Query("all", pattern="^(true|false|unrated|all)$"),
    fallback_used: str = Query("all", pattern="^(true|false|all)$"),
    context_area: str = Query("all", pattern="^(simulator|training|dashboard|settings|certifications|kpis|general|all)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query("newest", pattern="^(newest|oldest)$"),
):
    require_analytics_access(user)

    all_records = session.exec(select(SupportChatAnalytics)).all()
    records = _apply_filters(all_records, date_range, locale, question_type, helpful, fallback_used, context_area)

    reverse = sort == "newest"
    records.sort(key=lambda r: r.created_at, reverse=reverse)

    total = len(records)
    page_size = min(page_size, 100)
    start = (page - 1) * page_size
    end = start + page_size
    page_records = records[start:end]

    questions = []
    for r in page_records:
        role_val = r.role
        if hasattr(role_val, 'value'):
            role_val = role_val.value
        questions.append({
            "id": r.id,
            "user_id": r.user_id,
            "role": role_val,
            "question_preview": r.question_preview,
            "question_type": r.question_type,
            "locale": r.locale,
            "helpful": r.helpful,
            "fallback_used": r.fallback_used,
            "context_area": r.context_area or "general",
            "created_at": r.created_at.isoformat(),
        })

    return {
        "questions": questions,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/api/v1/support/analytics/recommendations")
async def support_analytics_recommendations(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    date_range: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    locale: str = Query("all", pattern="^(en|es|all)$"),
    context_area: str = Query("all", pattern="^(simulator|training|dashboard|settings|certifications|kpis|general|all)$"),
    show_dismissed: bool = Query(False),
):
    require_analytics_access(user)

    all_records = session.exec(select(SupportChatAnalytics)).all()
    records = _apply_filters(all_records, date_range, locale, "all", "all", "all", context_area)

    from services.recommendation_engine import generate_recommendations
    recommendations = generate_recommendations(records)

    # Load saved actions for merging
    from models.recommendation_actions import RecommendationAction
    import json as json_lib
    all_actions = session.exec(select(RecommendationAction)).all()
    actions_by_rec_id = {a.recommendation_id: a for a in all_actions}

    # Helper: extract primary count for dismissal comparison
    def _get_primary_count_from_rec(rec):
        signal = rec.signal_source or (rec.signal_sources[0] if rec.signal_sources else "")
        key_map = {
            "context_concentration": "count",
            "repeated_question": "repeat_count",
            "not_helpful_rate": "not_helpful_count",
            "fallback_rate": "fallback_count",
            "locale_gap": "es_count",
            "faq_coverage_gap": "custom_count",
        }
        key = key_map.get(signal, "count")
        return rec.supporting_data.get(key, 0)

    merged = []
    for rec in recommendations:
        rec_dict = rec.to_dict()
        action = actions_by_rec_id.get(rec.id)

        if action:
            if action.status == "dismissed":
                current_count = _get_primary_count_from_rec(rec)
                threshold = action.dismissed_until_signal_strength or 0
                if current_count >= threshold and threshold > 0:
                    # Signal doubled — refire
                    rec_dict["action_status"] = "refired"
                    rec_dict["action_id"] = action.id
                    rec_dict["action_notes"] = action.notes
                    merged.append(rec_dict)
                elif show_dismissed:
                    rec_dict["action_status"] = "dismissed"
                    rec_dict["action_id"] = action.id
                    rec_dict["action_notes"] = action.notes
                    merged.append(rec_dict)
                # else: hidden
            else:
                rec_dict["action_status"] = action.status
                rec_dict["action_id"] = action.id
                rec_dict["action_notes"] = action.notes
                merged.append(rec_dict)
        else:
            rec_dict["action_status"] = "new"
            rec_dict["action_id"] = None
            rec_dict["action_notes"] = None
            merged.append(rec_dict)

    return {
        "recommendations": merged,
        "meta": {
            "total_records_analyzed": len(records),
            "date_range": date_range,
            "generated_at": datetime.utcnow().isoformat(),
            "show_dismissed": show_dismissed,
        }
    }


# ── Phase 6: Curriculum Review Queue ──

QUEUE_STATUSES = {
    "accepted", "needs_review",
    "converted_to_faq", "converted_to_walkthrough", "converted_to_manual"
}

NEXT_STEP_MAP = {
    "accepted": "Review the recommendation and decide on a specific curriculum update.",
    "needs_review": "Assign this item for deeper review before taking action.",
    "converted_to_faq": "Draft a new quick FAQ entry for the {context_area} area.",
    "converted_to_walkthrough": "Draft walkthrough copy updates for the {context_area} section.",
    "converted_to_manual": "Draft a support manual section update for {context_area}.",
}

PRIORITY_ORDER = {"high": 0, "medium": 1, "low": 2}


@router.get("/api/v1/support/analytics/curriculum-review-queue")
async def curriculum_review_queue(
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session),
    status: str = Query("all", pattern="^(accepted|needs_review|converted_to_faq|converted_to_walkthrough|converted_to_manual|all)$"),
    context_area: str = Query("all"),
    priority: str = Query("all", pattern="^(high|medium|low|all)$"),
    acted_by: str = Query("all"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    require_analytics_access(user)

    from models.recommendation_actions import RecommendationAction
    import json as json_lib

    all_actions = session.exec(select(RecommendationAction)).all()

    # Filter to queue-eligible statuses (exclude dismissed)
    filtered = [a for a in all_actions if a.status in QUEUE_STATUSES]

    # Apply filters
    if status != "all":
        filtered = [a for a in filtered if a.status == status]
    if context_area != "all":
        filtered = [a for a in filtered if a.context_area == context_area]
    if priority != "all":
        filtered = [a for a in filtered if a.priority == priority]
    if acted_by != "all":
        filtered = [a for a in filtered if a.acted_by == acted_by]

    # Sort by priority (high first), then acted_at descending
    filtered.sort(key=lambda a: (
        PRIORITY_ORDER.get(a.priority, 9),
        -(datetime.fromisoformat(a.acted_at).timestamp() if a.acted_at else 0)
    ))

    # Paginate
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = filtered[start:end]

    queue = []
    for a in page_items:
        next_step = NEXT_STEP_MAP.get(a.status, "Review this item.")
        next_step = next_step.replace("{context_area}", a.context_area or "general")
        queue.append({
            "id": a.id,
            "recommendation_id": a.recommendation_id,
            "status": a.status,
            "context_area": a.context_area,
            "priority": a.priority,
            "signal_sources": json_lib.loads(a.signal_sources_json or "[]"),
            "snapshot_title": a.snapshot_title,
            "snapshot_explanation": a.snapshot_explanation,
            "snapshot_suggested_action": a.snapshot_suggested_action,
            "snapshot_supporting_data": json_lib.loads(a.snapshot_supporting_data_json or "{}"),
            "acted_by": a.acted_by,
            "acted_at": a.acted_at,
            "notes": a.notes,
            "suggested_next_step": next_step,
            "created_at": a.created_at,
            "updated_at": a.updated_at,
        })

    return {
        "queue": queue,
        "total": total,
        "page": page,
        "page_size": page_size,
    }

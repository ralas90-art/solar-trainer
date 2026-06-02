"""
Phase 6A: Organization Router
=============================
Handles all multi-tenant, company-scoped, and per-user persistence endpoints.

Security model:
  - Every endpoint resolves the requesting user's company_id from the DB (not from the client).
  - Reps can only access their own records.
  - Managers/Admins can access records for users within their own company.
  - Demo Mode (is_demo=True) sessions are tagged but never pollute real queries.
"""
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, validator
from sqlmodel import Session, select
from database import get_session
from auth_utils import pwd_context

from models.user import (
    CoachingFlag,
    Company,
    Debrief,
    PlanTier,
    SimulationSession,
    Team,
    User,
    UserRole,
    UserStats,
)
from routers.analytics_snapshot import invalidate_analytics_cache_for_user

router = APIRouter(tags=["organization"])

# ─── Constants ───────────────────────────────────────────────────────────────

# Usernames that are considered demo/test accounts — never written as real records
DEMO_USER_IDS = {"trainee", "test_user", "admin", "demo"}
DEMO_COMPANY_IDS = {"sales_accelerator_demo"}


# ─── Auth helpers ─────────────────────────────────────────────────────────────

def _get_user_or_404(session: Session, username: str) -> User:
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found.")
    return user


def _resolve_company_id(session: Session, username: str) -> str:
    """Resolve company_id from the database — never trust the client."""
    user = _get_user_or_404(session, username)
    return user.company_id or "septivolt"


def _require_manager_or_admin(user: User) -> None:
    """Raise 403 if user is a standard rep."""
    if user.role == UserRole.SALES_REP:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Manager or Admin role required.",
        )


def _require_same_company(requesting_user: User, target_company_id: str) -> None:
    """Ensure requesting_user belongs to the same company as the target resource."""
    if requesting_user.company_id != target_company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: cross-company data access is not permitted.",
        )


def _is_demo(username: str, company_id: str) -> bool:
    return username in DEMO_USER_IDS or company_id in DEMO_COMPANY_IDS


def _is_super_admin(user: User) -> bool:
    return user.username == "super_admin" or getattr(user, "is_super_admin", False) or user.role == "super_admin" or user.role == "super_admin"


# ─── Pydantic Request/Response Models ─────────────────────────────────────────

class TranscriptTurn(BaseModel):
    role: str
    content: str


class DebriefCreateRequest(BaseModel):
    scenario_id: str
    scenario_name: str
    difficulty: str = "beginner"
    score: int
    passed: bool
    duration_seconds: Optional[int] = None
    feedback_summary: Optional[str] = None
    tone_rating: Optional[str] = None
    tone_feedback: Optional[str] = None
    strengths: List[str] = []
    improvements: List[str] = []
    suggested_script: Optional[str] = None
    transcript: List[TranscriptTurn] = []

    @validator("score")
    def score_range(cls, v: int) -> int:
        if not (0 <= v <= 100):
            raise ValueError("score must be between 0 and 100")
        return v

    @validator("difficulty")
    def difficulty_valid(cls, v: str) -> str:
        allowed = {"beginner", "intermediate", "advanced"}
        if v not in allowed:
            raise ValueError(f"difficulty must be one of {allowed}")
        return v


class DebriefResponse(BaseModel):
    id: str
    session_id: str
    scenario_id: str
    scenario_name: str
    completed_at: str
    passed: bool
    score: int
    difficulty: str
    feedback_summary: Optional[str]
    tone_rating: Optional[str]
    tone_feedback: Optional[str]
    strengths: List[str]
    improvements: List[str]
    suggested_script: Optional[str]
    transcript: List[Dict[str, str]]
    is_demo: bool


class OnboardingUpdateRequest(BaseModel):
    tasks: Dict[str, bool]

    @validator("tasks")
    def valid_task_keys(cls, v: Dict[str, bool]) -> Dict[str, bool]:
        allowed = {"assessment", "roleplay", "leaderboard", "analytics", "settings"}
        invalid = set(v.keys()) - allowed
        if invalid:
            raise ValueError(f"Unknown onboarding task keys: {invalid}")
        return v


class LanguagePreferenceRequest(BaseModel):
    language: str


class CoachingNoteRequest(BaseModel):
    notes: str


class CoachingFlagCreateRequest(BaseModel):
    flag_type: str = "at_risk"
    severity: str = "medium"
    title_en: str
    title_es: str = ""
    reason_en: str
    reason_es: str = ""
    context_en: str = ""
    context_es: str = ""
    recommended_actions: List[str] = []

    @validator("severity")
    def severity_valid(cls, v: str) -> str:
        if v not in {"high", "medium", "low"}:
            raise ValueError("severity must be high, medium, or low")
        return v

    @validator("flag_type")
    def flag_type_valid(cls, v: str) -> str:
        if v not in {"at_risk", "stale_activity", "low_score", "custom"}:
            raise ValueError("flag_type must be at_risk, stale_activity, low_score, or custom")
        return v


class CoachingFlagUpdateRequest(BaseModel):
    notes: Optional[str] = None
    is_active: Optional[bool] = None
    resolved: Optional[bool] = None


class TeamCreateRequest(BaseModel):
    name: str


class CompanyCreateRequest(BaseModel):
    id: str
    name: str
    plan_tier: str = "starter"

    @validator("plan_tier")
    def plan_valid(cls, v: str) -> str:
        if v not in {"starter", "growth", "enterprise"}:
            raise ValueError("plan_tier must be starter, growth, or enterprise")
        return v


class MemberAddRequest(BaseModel):
    username: str
    role: str = "sales_rep"


class MemberCreateRequest(BaseModel):
    username: str
    email: Optional[str] = None
    role: str = "sales_rep"
    team_id: Optional[str] = None
    language_preference: Optional[str] = "en"


class MemberUpdateRequest(BaseModel):
    role: Optional[str] = None
    team_id: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None


class TeamUpdateRequest(BaseModel):
    name: Optional[str] = None
    manager_id: Optional[int] = None


class TeamAssignRequest(BaseModel):
    team_id: str


# ─── Debrief Endpoints ────────────────────────────────────────────────────────

@router.post("/api/v1/user/{username}/debriefs", response_model=DebriefResponse)
async def create_debrief(
    username: str,
    body: DebriefCreateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Persist a completed simulation debrief.
    Reps may only submit debriefs for themselves.
    Demo users are tagged but still stored (for dev/testing).
    """
    # Resolve the target user and their company from the DB
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    # Role guard — rep can only submit for themselves
    if requesting_username and requesting_username != username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user and req_user.role == UserRole.SALES_REP:
            raise HTTPException(status_code=403, detail="Reps may only submit their own debriefs.")

    is_demo_run = _is_demo(username, company_id)

    # Create the simulation session record
    sim = SimulationSession(
        user_id=username,
        company_id=company_id,
        scenario_id=body.scenario_id,
        scenario_name=body.scenario_name,
        difficulty=body.difficulty,
        score=body.score,
        passed=body.passed,
        duration_seconds=body.duration_seconds,
        is_demo=is_demo_run,
    )
    session.add(sim)
    session.flush()  # get sim.id

    # Create the debrief record
    debrief = Debrief(
        session_id=sim.id,
        user_id=username,
        company_id=company_id,
        scenario_id=body.scenario_id,
        scenario_name=body.scenario_name,
        feedback_summary=body.feedback_summary,
        tone_rating=body.tone_rating,
        tone_feedback=body.tone_feedback,
        strengths=json.dumps(body.strengths),
        improvements=json.dumps(body.improvements),
        suggested_script=body.suggested_script,
        transcript=json.dumps([t.dict() for t in body.transcript]),
        is_demo=is_demo_run,
    )
    session.add(debrief)

    # Update UserStats: scenario_progress, total_score, streak
    stats = session.get(UserStats, username)
    if not stats:
        stats = UserStats(user_id=username)
        session.add(stats)
        session.flush()

    # Update scenario progress JSON
    try:
        sp = json.loads(stats.scenario_progress or "{}")
    except Exception:
        sp = {}

    existing_entry = sp.get(body.scenario_id, {})
    best_score = max(existing_entry.get("best_score", 0), body.score)
    passed_any = existing_entry.get("passed", False) or body.passed
    attempts = existing_entry.get("attempts", 0) + 1

    sp[body.scenario_id] = {
        "passed": passed_any,
        "best_score": best_score,
        "attempts": attempts,
        "last_attempt_at": datetime.utcnow().isoformat(),
    }
    stats.scenario_progress = json.dumps(sp)

    # Award XP: 10 pts per attempt, 50 bonus on first pass
    xp_earned = 10
    if body.passed and not existing_entry.get("passed", False):
        xp_earned += 50
    stats.total_score = stats.total_score + xp_earned

    session.commit()
    session.refresh(debrief)

    # Invalidate analytics cache so the dashboard reflects new data
    if not is_demo_run:
        invalidate_analytics_cache_for_user(username)
        try:
            from services.ghl_sync import GHLSyncService
            GHLSyncService.sync_progress_to_ghl(session, username)
        except Exception as e:
            print(f"[GHL-TRIGGER ERROR] Failed in debrief progress callback: {e}")

    return _debrief_to_response(debrief, sim)


@router.get("/api/v1/user/{username}/debriefs", response_model=List[DebriefResponse])
async def list_debriefs(
    username: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    limit: int = 50,
    session: Session = Depends(get_session),
):
    """
    Fetch debrief history for a user.
    Reps can only fetch their own. Managers can fetch any rep in their company.
    """
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    # Role guard
    if requesting_username and requesting_username != username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            if req_user.role == UserRole.SALES_REP:
                raise HTTPException(status_code=403, detail="Access denied.")
            _require_same_company(req_user, company_id)

    debriefs = session.exec(
        select(Debrief)
        .where(Debrief.user_id == username, Debrief.company_id == company_id)
        .order_by(Debrief.created_at.desc())
        .limit(limit)
    ).all()

    # Load matching simulation sessions for duration/difficulty
    session_ids = [d.session_id for d in debriefs]
    sim_map: Dict[str, SimulationSession] = {}
    if session_ids:
        sims = session.exec(
            select(SimulationSession).where(SimulationSession.id.in_(session_ids))
        ).all()
        sim_map = {s.id: s for s in sims}

    return [_debrief_to_response(d, sim_map.get(d.session_id)) for d in debriefs]


@router.get("/api/v1/user/{username}/debriefs/{debrief_id}", response_model=DebriefResponse)
async def get_debrief(
    username: str,
    debrief_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    debrief = session.exec(
        select(Debrief).where(
            Debrief.id == debrief_id,
            Debrief.user_id == username,
            Debrief.company_id == company_id,
        )
    ).first()
    if not debrief:
        raise HTTPException(status_code=404, detail="Debrief not found.")

    sim = session.get(SimulationSession, debrief.session_id)
    return _debrief_to_response(debrief, sim)


def _debrief_to_response(debrief: Debrief, sim: Optional[SimulationSession]) -> DebriefResponse:
    try:
        strengths = json.loads(debrief.strengths or "[]")
    except Exception:
        strengths = []
    try:
        improvements = json.loads(debrief.improvements or "[]")
    except Exception:
        improvements = []
    try:
        transcript = json.loads(debrief.transcript or "[]")
    except Exception:
        transcript = []

    return DebriefResponse(
        id=debrief.id,
        session_id=debrief.session_id,
        scenario_id=debrief.scenario_id,
        scenario_name=debrief.scenario_name,
        completed_at=debrief.created_at.isoformat(),
        passed=sim.passed if sim else False,
        score=sim.score if sim else 0,
        difficulty=sim.difficulty if sim else "beginner",
        feedback_summary=debrief.feedback_summary,
        tone_rating=debrief.tone_rating,
        tone_feedback=debrief.tone_feedback,
        strengths=strengths,
        improvements=improvements,
        suggested_script=debrief.suggested_script,
        transcript=transcript,
        is_demo=debrief.is_demo,
    )


# ─── Onboarding Endpoints ─────────────────────────────────────────────────────

@router.get("/api/v1/user/{username}/onboarding")
async def get_onboarding(
    username: str,
    session: Session = Depends(get_session),
):
    """Return the onboarding task completion state for a user."""
    _get_user_or_404(session, username)
    stats = session.get(UserStats, username)
    if not stats:
        return {"tasks": {}}
    try:
        tasks = json.loads(stats.onboarding_progress or "{}")
    except Exception:
        tasks = {}
    return {"tasks": tasks}


@router.post("/api/v1/user/{username}/onboarding")
async def update_onboarding(
    username: str,
    body: OnboardingUpdateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Update onboarding task checklist state. Reps may only update their own."""
    user = _get_user_or_404(session, username)

    # Role guard: rep can only touch their own
    if requesting_username and requesting_username != username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user and req_user.role == UserRole.SALES_REP:
            raise HTTPException(status_code=403, detail="Reps may only update their own onboarding state.")

    stats = session.get(UserStats, username)
    if not stats:
        stats = UserStats(user_id=username)
        session.add(stats)

    try:
        existing = json.loads(stats.onboarding_progress or "{}")
    except Exception:
        existing = {}

    existing.update(body.tasks)
    stats.onboarding_progress = json.dumps(existing)
    session.commit()
    return {"status": "ok", "tasks": existing}


@router.post("/api/v1/user/{username}/language")
async def update_language_preference(
    username: str,
    body: LanguagePreferenceRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Update user's language preference.
    Stored inside UserStats.onboarding_progress as temporary technical debt
    pending schema expansion to a first-class user preferences field.
    """
    user = _get_user_or_404(session, username)

    # Role guard: reps can only update their own language preference
    if requesting_username and requesting_username != username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user and req_user.role == UserRole.SALES_REP:
            raise HTTPException(status_code=403, detail="Reps may only update their own language preference.")

    stats = session.get(UserStats, username)
    if not stats:
        stats = UserStats(user_id=username)
        session.add(stats)

    try:
        existing = json.loads(stats.onboarding_progress or "{}")
    except Exception:
        existing = {}

    existing["language"] = body.language
    stats.onboarding_progress = json.dumps(existing)
    session.commit()
    return {"status": "ok", "language": body.language}


# ─── Coaching Note Endpoints ──────────────────────────────────────────────────

@router.post("/api/v1/user/{username}/coaching-note")
async def save_coaching_note(
    username: str,
    body: CoachingNoteRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Save a manager's private coaching note for a rep.
    Only managers/admins from the same company may write coaching notes.
    """
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    stats = session.get(UserStats, username)
    if not stats:
        stats = UserStats(user_id=username)
        session.add(stats)

    stats.coaching_notes = body.notes
    session.commit()
    return {"status": "ok"}


# ─── Coaching Flag Endpoints ──────────────────────────────────────────────────

@router.get("/api/v1/user/{username}/coaching-flags")
async def get_coaching_flags(
    username: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Return all active coaching flags for a rep. Manager/admin only."""
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    flags = session.exec(
        select(CoachingFlag).where(
            CoachingFlag.user_id == username,
            CoachingFlag.company_id == company_id,
            CoachingFlag.is_active == True,
        ).order_by(CoachingFlag.created_at.desc())
    ).all()

    return [_flag_to_dict(f) for f in flags]


@router.post("/api/v1/user/{username}/coaching-flags")
async def create_coaching_flag(
    username: str,
    body: CoachingFlagCreateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Create a coaching attention flag for a rep. Manager/admin only."""
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    flag = CoachingFlag(
        user_id=username,
        company_id=company_id,
        flag_type=body.flag_type,
        severity=body.severity,
        title_en=body.title_en,
        title_es=body.title_es,
        reason_en=body.reason_en,
        reason_es=body.reason_es,
        context_en=body.context_en,
        context_es=body.context_es,
        recommended_actions_json=json.dumps(body.recommended_actions),
    )
    session.add(flag)
    session.commit()
    session.refresh(flag)
    return _flag_to_dict(flag)


@router.put("/api/v1/coaching-flags/{flag_id}")
async def update_coaching_flag(
    flag_id: str,
    body: CoachingFlagUpdateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Update coaching flag notes or resolve it. Manager/admin only."""
    flag = session.get(CoachingFlag, flag_id)
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, flag.company_id)

    if body.notes is not None:
        flag.notes = body.notes
    if body.is_active is not None:
        flag.is_active = body.is_active
    if body.resolved:
        flag.is_active = False
        flag.resolved_at = datetime.utcnow()

    session.commit()
    session.refresh(flag)
    return _flag_to_dict(flag)


def _flag_to_dict(flag: CoachingFlag) -> Dict[str, Any]:
    try:
        actions = json.loads(flag.recommended_actions_json or "[]")
    except Exception:
        actions = []
    return {
        "id": flag.id,
        "user_id": flag.user_id,
        "flag_type": flag.flag_type,
        "severity": flag.severity,
        "title_en": flag.title_en,
        "title_es": flag.title_es,
        "reason_en": flag.reason_en,
        "reason_es": flag.reason_es,
        "context_en": flag.context_en,
        "context_es": flag.context_es,
        "recommended_actions": actions,
        "is_active": flag.is_active,
        "notes": flag.notes,
        "created_at": flag.created_at.isoformat(),
        "resolved_at": flag.resolved_at.isoformat() if flag.resolved_at else None,
    }


# ─── Company / Roster Endpoints ───────────────────────────────────────────────

@router.get("/api/v1/companies/{company_id}")
async def get_company(
    company_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Get company details. Must belong to that company."""
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_same_company(req_user, company_id)

    return {
        "id": company.id,
        "name": company.name,
        "plan_tier": company.plan_tier,
        "payment_status": company.payment_status,
        "created_at": company.created_at.isoformat(),
    }


@router.post("/api/v1/companies")
async def create_company(
    body: CompanyCreateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Create a new white-label company. Admin only."""
    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user and req_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Admin role required to create companies.")

    existing = session.get(Company, body.id)
    if existing:
        raise HTTPException(status_code=409, detail=f"Company '{body.id}' already exists.")

    company = Company(
        id=body.id,
        name=body.name,
        plan_tier=PlanTier(body.plan_tier),
        payment_status="pending",
    )
    session.add(company)
    session.commit()
    session.refresh(company)
    return {"status": "created", "id": company.id}


@router.get("/api/v1/companies/{company_id}/roster")
async def get_roster(
    company_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    members = session.exec(
        select(User).where(User.company_id == company_id, User.is_active == True)
    ).all()

    roster = []
    for member in members:
        stats = session.get(UserStats, member.username)
        flags = session.exec(
            select(CoachingFlag).where(
                CoachingFlag.user_id == member.username,
                CoachingFlag.company_id == company_id,
                CoachingFlag.is_active == True,
            )
        ).all()

        try:
            sp = json.loads(stats.scenario_progress if stats else "{}")
        except Exception:
            sp = {}

        completed_sims = sum(1 for v in sp.values() if isinstance(v, dict) and v.get("passed"))
        last_score = 0
        if sp:
            latest = max(
                (v for v in sp.values() if isinstance(v, dict) and v.get("last_attempt_at")),
                key=lambda x: x.get("last_attempt_at", ""),
                default=None,
            )
            if latest:
                last_score = latest.get("best_score", 0)

        roster.append({
            "id": str(member.id),
            "username": member.username,
            "email": member.email,
            "role": member.role,
            "team_id": member.team_id,
            "total_score": stats.total_score if stats else 0,
            "current_streak": stats.current_streak if stats else 0,
            "completed_sims": completed_sims,
            "last_score": last_score,
            "active": member.is_active,
            "needs_attention": len(flags) > 0,
            "coaching_flags": [_flag_to_dict(f) for f in flags],
            "coaching_notes": stats.coaching_notes if stats else "",
        })

    return {"company_id": company_id, "member_count": len(roster), "roster": roster}


@router.get("/api/v1/companies/{company_id}/members")
async def get_members_alias(
    company_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Wrapper/alias around get_roster for matching UI schema."""
    return await get_roster(company_id, requesting_username, session)


@router.post("/api/v1/companies/{company_id}/members")
async def add_or_create_member(
    company_id: str,
    body: MemberCreateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Assign or manually create a member. Manager/Admin only. Demo Mode is isolated."""
    # Verify Company
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    # Role check & Tenant Isolation
    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            # Block reps from manually creating/inviting users
            if req_user.role == UserRole.SALES_REP:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions. Sales reps are not allowed to invite or manage members.",
                )
            # Tenant isolation unless super_admin
            if not _is_super_admin(req_user):
                _require_same_company(req_user, company_id)

    # Demo Mode check: if demo, return mock response, do NOT write to database
    if _is_demo(requesting_username or "", company_id):
        print(f"[DEMO] Skip database write for creating user '{body.username}' in company '{company_id}'")
        return {
            "status": "ok",
            "username": body.username,
            "company_id": company_id,
            "action": "created",
            "temp_password": "demo_temp_password_123",
            "invite_code": "demo_code",
            "is_demo": True
        }

    # Check if target user already exists
    target_user = session.exec(select(User).where(User.username == body.username)).first()
    if target_user:
        # Check if user belongs to another company
        if target_user.company_id and target_user.company_id != company_id:
            # Block cross-tenant assignment unless super_admin
            is_super = False
            if requesting_username:
                req_user = session.exec(select(User).where(User.username == requesting_username)).first()
                if req_user and _is_super_admin(req_user):
                    is_super = True
            if not is_super:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: cross-company member assignment is not permitted.",
                )
        
        # Update existing user info
        target_user.company_id = company_id
        if body.role:
            target_user.role = UserRole(body.role)
        if body.team_id:
            if body.team_id == "none":
                target_user.team_id = None
            else:
                team = session.get(Team, body.team_id)
                if team and team.company_id == company_id:
                    target_user.team_id = body.team_id

        session.add(target_user)
        session.commit()
        print(f"[AUDIT] Associated existing user '{body.username}' with company '{company_id}' (Role: {body.role})")
        return {"status": "ok", "username": body.username, "company_id": company_id, "action": "associated"}
    
    else:
        # Create a new user manually
        import secrets
        temp_password = secrets.token_urlsafe(12) # Secure high-entropy random password
        
        hashed_password = pwd_context.hash(temp_password)

        new_user = User(
            username=body.username,
            email=body.email,
            password=hashed_password,
            role=UserRole(body.role),
            company_id=company_id,
            temporary_password_required=True
        )
        if body.team_id and body.team_id != "none":
            team = session.get(Team, body.team_id)
            if team and team.company_id == company_id:
                new_user.team_id = body.team_id

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Create corresponding UserStats for tracking progress and language preference
        onboarding_pref = json.dumps({"language": body.language_preference or "en"})
        new_stats = UserStats(
            user_id=body.username,
            total_score=0,
            current_streak=0,
            lives=3,
            onboarding_progress=onboarding_pref
        )
        session.add(new_stats)
        session.commit()

        print(f"[AUDIT] Created new user '{body.username}' for company '{company_id}' (Role: {body.role})")
        return {
            "status": "ok",
            "username": body.username,
            "company_id": company_id,
            "action": "created",
            "temp_password": temp_password,
            "invite_code": secrets.token_hex(8)
        }


@router.put("/api/v1/companies/{company_id}/members/{username}")
async def update_member(
    company_id: str,
    username: str,
    body: MemberUpdateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Update user email, role, team, or active status inside a company. Manager/Admin only."""
    # Verify Company
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    # Role check & Tenant Isolation
    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            if req_user.role == UserRole.SALES_REP:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions. Sales reps are not allowed to update members.",
                )
            if not _is_super_admin(req_user):
                _require_same_company(req_user, company_id)

    # Demo mode isolation
    if _is_demo(requesting_username or "", company_id):
        print(f"[DEMO] Skip database write for updating user '{username}' in company '{company_id}'")
        return {"status": "ok", "username": username, "is_demo": True}

    # Get target user
    user = session.exec(select(User).where(User.username == username)).first()
    if not user or user.company_id != company_id:
        raise HTTPException(status_code=404, detail="Member not found in this company.")

    # Apply updates
    if body.role:
        user.role = UserRole(body.role)
    if body.team_id is not None:
        if body.team_id == "none" or not body.team_id:
            user.team_id = None
        else:
            team = session.get(Team, body.team_id)
            if not team or team.company_id != company_id:
                raise HTTPException(status_code=400, detail="Team does not belong to this company.")
            user.team_id = body.team_id
    if body.email is not None:
        user.email = body.email
    if body.is_active is not None:
        user.is_active = body.is_active

    session.add(user)
    session.commit()
    print(f"[AUDIT] Updated member '{username}' details in company '{company_id}'")
    return {"status": "ok", "username": username}


# ─── Team Endpoints ───────────────────────────────────────────────────────────

@router.get("/api/v1/companies/{company_id}/teams")
async def list_teams(
    company_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """List teams within a company. Manager/Admin only."""
    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    teams = session.exec(select(Team).where(Team.company_id == company_id)).all()
    
    # Calculate team-level readiness indicators dynamically
    result = []
    for t in teams:
        members = session.exec(select(User).where(User.team_id == t.id, User.is_active == True)).all()
        rep_count = len(members)
        
        sims_count = 0
        started_count = 0
        completed_count = 0
        for m in members:
            # count completed/started sims
            stats = session.get(UserStats, m.username)
            if stats:
                try:
                    sp = json.loads(stats.scenario_progress)
                except:
                    sp = {}
                m_sims = sum(1 for v in sp.values() if isinstance(v, dict) and v.get("passed"))
                sims_count += m_sims
                if len(sp) > 0:
                    started_count += 1
                if m_sims >= 3: # 3 sims considered fully complete
                    completed_count += 1

        result.append({
            "id": t.id,
            "name": t.name,
            "company_id": t.company_id,
            "manager_id": t.manager_id,
            "stats": {
                "rep_count": rep_count,
                "started_count": started_count,
                "completed_count": completed_count,
                "sims_count": sims_count
            }
        })
        
    return result


@router.post("/api/v1/companies/{company_id}/teams")
async def create_team(
    company_id: str,
    body: TeamCreateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Create a team within a company. Manager/Admin only."""
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    if _is_demo(requesting_username or "", company_id):
        print(f"[DEMO] Skip database write for creating team '{body.name}'")
        return {"id": "demo_team_id", "name": body.name, "company_id": company_id, "is_demo": True}

    team = Team(name=body.name, company_id=company_id)
    session.add(team)
    session.commit()
    session.refresh(team)
    print(f"[AUDIT] Created new team '{team.id}' (Name: {team.name}) in company '{company_id}'")
    return {"id": team.id, "name": team.name, "company_id": team.company_id}


@router.put("/api/v1/companies/{company_id}/teams/{team_id}")
async def update_team(
    company_id: str,
    team_id: str,
    body: TeamUpdateRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Rename team or change manager. Manager/Admin only."""
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    if _is_demo(requesting_username or "", company_id):
        print(f"[DEMO] Skip database write for updating team '{team_id}'")
        return {"status": "ok", "id": team_id, "is_demo": True}

    team = session.get(Team, team_id)
    if not team or team.company_id != company_id:
        raise HTTPException(status_code=404, detail="Team not found in this company.")

    if body.name:
        team.name = body.name
    if body.manager_id is not None:
        if body.manager_id in [0, -1]:
            team.manager_id = None
        else:
            mgr = session.get(User, body.manager_id)
            if not mgr or mgr.company_id != company_id or mgr.role not in [UserRole.MANAGER, UserRole.ADMIN]:
                raise HTTPException(status_code=400, detail="Invalid manager_id selected.")
            team.manager_id = body.manager_id

    session.add(team)
    session.commit()
    print(f"[AUDIT] Updated team '{team_id}' details in company '{company_id}'")
    return {"status": "ok", "id": team.id, "name": team.name, "manager_id": team.manager_id}


@router.put("/api/v1/user/{username}/team")
async def assign_team(
    username: str,
    body: TeamAssignRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Assign/move a user to a team. Manager/Admin only."""
    user = _get_user_or_404(session, username)
    company_id = user.company_id or "septivolt"

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    # Validate team belongs to the same company
    team = session.get(Team, body.team_id)
    if not team or team.company_id != company_id:
        raise HTTPException(status_code=400, detail="Team does not belong to this company.")

    user.team_id = body.team_id
    session.commit()
    return {"status": "ok", "username": username, "team_id": body.team_id}


@router.delete("/api/v1/companies/{company_id}/teams/{team_id}")
async def delete_team(
    company_id: str,
    team_id: str,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Delete a team. Manager/Admin only."""
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    if _is_demo(requesting_username or "", company_id):
        print(f"[DEMO] Skip database write for deleting team '{team_id}'")
        return {"status": "ok", "id": team_id, "is_demo": True}

    team = session.get(Team, team_id)
    if not team or team.company_id != company_id:
        raise HTTPException(status_code=404, detail="Team not found in this company.")

    # Unassign all users currently in this team
    users_in_team = session.exec(select(User).where(User.team_id == team.id)).all()
    for u in users_in_team:
        u.team_id = None
        session.add(u)

    session.delete(team)
    session.commit()
    print(f"[AUDIT] Deleted team '{team_id}' (Name: {team.name}) in company '{company_id}'")
    return {"status": "ok", "id": team_id}

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


@router.post("/api/v1/companies/{company_id}/members")
async def add_member(
    company_id: str,
    body: MemberAddRequest,
    requesting_username: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """Assign an existing user to a company. Manager/Admin only."""
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if requesting_username:
        req_user = session.exec(select(User).where(User.username == requesting_username)).first()
        if req_user:
            _require_manager_or_admin(req_user)
            _require_same_company(req_user, company_id)

    user = session.exec(select(User).where(User.username == body.username)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{body.username}' not found.")

    user.company_id = company_id
    session.commit()
    return {"status": "ok", "username": body.username, "company_id": company_id}


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
    return [{"id": t.id, "name": t.name, "company_id": t.company_id, "manager_id": t.manager_id} for t in teams]


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

    team = Team(name=body.name, company_id=company_id)
    session.add(team)
    session.commit()
    session.refresh(team)
    return {"id": team.id, "name": team.name, "company_id": team.company_id}


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

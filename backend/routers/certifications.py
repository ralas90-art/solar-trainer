"""
Certification System API Router
Provides canonical certification progress, status, team views, public verification,
manager approval/revocation/renewal, and automated expiration checking.

Phase 7 — SeptiVolt Certification Verification & Credential Management System
"""
from datetime import date, datetime, timedelta
import json
import os
import secrets
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select, func

from database import get_session
from models import UserStats
from models.certifications import Certification, UserCertification
from models.user import User, UserRole

router = APIRouter()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _safe_json_parse(raw: Optional[str], fallback: Any) -> Any:
    if not raw:
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback


def _clamp(min_value: int, value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


def _get_requesting_user(session: Session, x_user_id: Optional[str]) -> User:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing authentication header 'X-User-Id'.")
    user = session.exec(select(User).where(User.username == x_user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Session user not found.")
    return user


def _require_manager_or_admin(user: User):
    allowed = {
        UserRole.SUPER_ADMIN, UserRole.DEALER_ADMIN,
        UserRole.BRANCH_MANAGER, UserRole.TRAINER,
        UserRole.ADMIN, UserRole.MANAGER
    }
    if user.role not in allowed:
        raise HTTPException(status_code=403, detail="Access denied: Manager or Admin permissions required.")


# ─── Track Blueprints (catalog definitions — unchanged) ──────────────────────

TRACK_BLUEPRINTS = [
    {
        "id": "septivolt-certified-solar-rep",
        "title": "SeptiVolt Certified Solar Rep",
        "description": "Core qualification validating full-path readiness from training module mastery through live AI scenario execution.",
        "why_it_matters": "Signals end-to-end readiness for production-level solar consultative selling under SeptiVolt standards.",
        "required_modules": ["Day 1 Foundations", "Day 3 Discovery", "Day 5 Objection Handling", "Day 7 Certification Prep"],
        "required_sim_score": 85,
        "unlock_criteria": "Complete all core modules and maintain 80+ average across the last 5 simulations.",
        "assessment": {
            "name": "Final Certification Scenario: Residential Value Stack",
            "skills_tested": ["Discovery", "Presentation", "Objection Handling", "Closing"],
            "target_score": 88,
            "max_attempts": 3,
        },
        "xp_value": 1200,
        "level_reward": "Closer L13 eligibility",
    },
    {
        "id": "discovery-master",
        "title": "Discovery Master",
        "description": "Specialized credential for consultative questioning and homeowner qualification flow.",
        "why_it_matters": "Discovery quality strongly predicts close consistency and objection resilience.",
        "required_modules": ["Day 2 Art of Connection", "Day 3 Discovery Framework"],
        "required_sim_score": 82,
        "unlock_criteria": "Complete discovery modules and pass two discovery-focused simulations at 82+.",
        "assessment": {
            "name": "Discovery Precision Assessment",
            "skills_tested": ["Prospecting", "Discovery"],
            "target_score": 84,
            "max_attempts": 3,
        },
        "xp_value": 500,
        "level_reward": "Discovery Aura badge frame",
    },
    {
        "id": "objection-crusher",
        "title": "Objection Crusher",
        "description": "Credential proving repeatable rebuttal performance under pressure across pricing and trust objections.",
        "why_it_matters": "Structured objection handling is a major leverage point for conversion and confidence.",
        "required_modules": ["Day 4 Objection Judo", "Day 5 Closing Confidence"],
        "required_sim_score": 84,
        "unlock_criteria": "Finish objection modules and complete three objection simulation wins.",
        "assessment": {
            "name": "High-Pressure Objection Scenario",
            "skills_tested": ["Objection Handling", "Closing"],
            "target_score": 86,
            "max_attempts": 3,
        },
        "xp_value": 650,
        "level_reward": "Rebuttal Circuit title",
    },
    {
        "id": "closing-specialist",
        "title": "Closing Specialist",
        "description": "Qualification focused on commitment language, urgency framing, and clean next-step closes.",
        "why_it_matters": "Protects revenue outcomes by validating high-integrity close execution and next-step control.",
        "required_modules": ["Day 5 Closing Confidence", "Day 6 Mastery Lab"],
        "required_sim_score": 87,
        "unlock_criteria": "Reach top-25 percentile and complete closing module path.",
        "assessment": {
            "name": "Advanced Commitment Assessment",
            "skills_tested": ["Presentation", "Closing"],
            "target_score": 90,
            "max_attempts": 2,
        },
        "xp_value": 700,
        "level_reward": "Closer L14 fast-track",
    },
    {
        "id": "7-day-accelerator-graduate",
        "title": "7-Day Accelerator Graduate",
        "description": "Program completion credential proving full execution of SeptiVolt's 7-day ramp framework.",
        "why_it_matters": "Provides enterprise managers with a baseline onboarding qualification for field readiness.",
        "required_modules": ["Day 1-7 Core Curriculum"],
        "required_sim_score": 80,
        "unlock_criteria": "Finish full curriculum and pass graduation simulation at 80+.",
        "assessment": {
            "name": "Accelerator Graduation Simulation",
            "skills_tested": ["Prospecting", "Discovery", "Presentation", "Closing"],
            "target_score": 82,
            "max_attempts": 3,
        },
        "xp_value": 850,
        "level_reward": "Accelerator Graduate frame",
    },
]


def _compute_signals(stats: Optional[UserStats]) -> Dict[str, int]:
    if not stats:
        return {
            "score_signal": 8,
            "streak_signal": 0,
            "module_completion_rate": 0,
            "best_scenario_score": 0,
            "passed_scenarios": 0,
            "attempts_used": 0,
        }

    module_progress = _safe_json_parse(stats.module_progress, {})
    scenario_progress = _safe_json_parse(stats.scenario_progress, {})

    completed_module_steps = 0
    total_module_steps = max(len(module_progress) * 3, 12)
    for module_state in module_progress.values():
        if isinstance(module_state, dict):
            completed_module_steps += len([value for value in module_state.values() if value is True])

    module_completion_rate = _clamp(0, round((completed_module_steps / total_module_steps) * 100), 100)

    best_scenario_score = 0
    passed_scenarios = 0
    attempts_used = 0
    for scenario_state in scenario_progress.values():
        if not isinstance(scenario_state, dict):
            continue
        best_scenario_score = max(best_scenario_score, int(scenario_state.get("best_score", 0)))
        if scenario_state.get("passed") is True:
            passed_scenarios += 1
        attempts_used = max(attempts_used, int(scenario_state.get("attempts", 0)))

    return {
        "score_signal": _clamp(0, round(stats.total_score / 55), 100),
        "streak_signal": _clamp(0, stats.current_streak * 2, 24),
        "module_completion_rate": module_completion_rate,
        "best_scenario_score": best_scenario_score,
        "passed_scenarios": passed_scenarios,
        "attempts_used": attempts_used,
    }


def _compute_rank(user_id: str, leaderboard: List[UserStats]) -> Tuple[int, int]:
    if not leaderboard:
        return 1, 1
    index = next((i for i, row in enumerate(leaderboard) if row.user_id == user_id), 0)
    return index + 1, len(leaderboard)


def _derive_track(
    blueprint: Dict[str, Any],
    idx: int,
    signals: Dict[str, int],
    rank: int,
    total_reps: int,
) -> Dict[str, Any]:
    percentile_bonus = 0
    if total_reps > 0:
        percentile_bonus = round((1 - (rank / total_reps)) * 20)

    progress = _clamp(
        5,
        round(
            signals["score_signal"] * 0.38
            + signals["module_completion_rate"] * 0.34
            + signals["streak_signal"] * 0.18
            + percentile_bonus
        ) - idx * 6,
        99,
    )

    lesson_complete = signals["module_completion_rate"] >= (70 - idx * 6)
    simulation_complete = signals["best_scenario_score"] >= blueprint["required_sim_score"]
    compliance_complete = signals["streak_signal"] >= (8 - min(idx, 2))
    final_assessment_complete = signals["passed_scenarios"] >= max(1, idx)

    requirements = [
        {"id": f"{idx}-m1", "label": "Complete required lesson modules", "complete": lesson_complete},
        {
            "id": f"{idx}-m2",
            "label": f"Pass required simulation with target score {blueprint['required_sim_score']}+",
            "complete": simulation_complete,
        },
        {"id": f"{idx}-m3", "label": "Maintain compliance threshold", "complete": compliance_complete},
        {"id": f"{idx}-m4", "label": "Complete final assessment", "complete": final_assessment_complete},
    ]

    complete_count = len([r for r in requirements if r["complete"]])
    if complete_count == len(requirements):
        status = "certified"
        progress = 100
    elif complete_count >= len(requirements) - 1 and progress >= 82:
        status = "ready"
    elif progress >= 20:
        status = "in-progress"
    else:
        status = "locked"

    assessment_score = signals["best_scenario_score"] if signals["best_scenario_score"] > 0 else None
    assessment_passed = None if assessment_score is None else assessment_score >= blueprint["assessment"]["target_score"]
    earned_date = None
    credential_id = None
    if status == "certified":
        earned_date = (date.today() - timedelta(days=idx + 2)).isoformat()
        credential_id = f"SV-{idx + 1:02d}-{date.today().strftime('%Y%m%d')}-{(idx + 17):03d}"

    return {
        "id": blueprint["id"],
        "title": blueprint["title"],
        "description": blueprint["description"],
        "whyItMatters": blueprint["why_it_matters"],
        "status": status,
        "progress": progress,
        "requiredModules": blueprint["required_modules"],
        "requiredSimulationScore": blueprint["required_sim_score"],
        "unlockCriteria": blueprint["unlock_criteria"],
        "requirements": requirements,
        "assessment": {
            "name": blueprint["assessment"]["name"],
            "skillsTested": blueprint["assessment"]["skills_tested"],
            "targetScore": blueprint["assessment"]["target_score"],
            "currentScore": assessment_score,
            "passed": True if status == "certified" else assessment_passed,
            "attemptsUsed": max(signals["attempts_used"], signals["passed_scenarios"]),
            "maxAttempts": blueprint["assessment"]["max_attempts"],
        },
        "earnedDate": earned_date,
        "xpValue": blueprint["xp_value"],
        "levelReward": blueprint["level_reward"],
        "credentialId": credential_id,
        "statusHistory": [
            {"date": (date.today() - timedelta(days=8 - idx)).isoformat(), "event": "Track unlocked", "actor": "System"},
            {"date": (date.today() - timedelta(days=2)).isoformat(), "event": "Live metrics sync", "actor": "Certification Service"},
            {"date": date.today().isoformat(), "event": f"Status: {status.replace('-', ' ').title()}", "actor": "Certification Service"},
        ],
    }


def _derive_team_progress(leaderboard: List[UserStats]) -> List[Dict[str, Any]]:
    if not leaderboard:
        return [
            {"teamName": "West Mavericks", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "East Current", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "Northeast Orbit", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "South Voltage", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
        ]

    team_names = ["West Mavericks", "East Current", "Northeast Orbit", "South Voltage"]
    buckets: Dict[str, List[UserStats]] = {name: [] for name in team_names}

    for idx, rep in enumerate(leaderboard):
        team = team_names[idx % len(team_names)]
        buckets[team].append(rep)

    results: List[Dict[str, Any]] = []
    for team_name, reps in buckets.items():
        if not reps:
            continue
        certified = len([r for r in reps if r.total_score >= 4200])
        in_progress = len([r for r in reps if 2200 <= r.total_score < 4200])
        at_risk = len([r for r in reps if r.total_score < 2200])
        completion = round(sum([_clamp(0, round(r.total_score / 55), 100) for r in reps]) / len(reps))
        results.append(
            {
                "teamName": team_name,
                "repsCertified": certified,
                "repsInProgress": in_progress,
                "repsAtRisk": at_risk,
                "overallCompletion": completion,
                "managerSignoffPending": max(0, in_progress - (certified // 2)),
            }
        )
    return results


# ─── Endpoint 1: Snapshot (existing, preserved) ───────────────────────────────

@router.get("/api/v1/certifications/snapshot")
async def get_certification_snapshot(
    user_id: str = "trainee",
    session: Session = Depends(get_session),
):
    """
    Canonical certification snapshot for frontend dashboard/detail pages.
    """
    stats = session.get(UserStats, user_id)
    leaderboard = session.exec(select(UserStats).order_by(UserStats.total_score.desc()).limit(20)).all()

    signals = _compute_signals(stats)
    rank, total_reps = _compute_rank(user_id, leaderboard)
    tracks = [_derive_track(blueprint, idx, signals, rank, total_reps) for idx, blueprint in enumerate(TRACK_BLUEPRINTS)]
    team_progress = _derive_team_progress(leaderboard)

    active_track = next((track for track in tracks if track["status"] == "ready"), None)
    if not active_track:
        active_track = next((track for track in tracks if track["status"] == "in-progress"), None)
    active_track_id = active_track["id"] if active_track else tracks[0]["id"]

    return {
        "userId": user_id,
        "tracks": tracks,
        "teamProgress": team_progress,
        "activeTrackId": active_track_id,
        "updatedAt": date.today().isoformat(),
    }


# ─── Endpoint 2: Public Credential Verification ───────────────────────────────

@router.get("/api/v1/certifications/verify/{verification_hash}")
async def verify_certification(
    verification_hash: str,
    session: Session = Depends(get_session),
):
    """
    PUBLIC endpoint — no authentication required.
    Verifies a credential by its unique hash and returns only whitelisted fields.
    Increments verification_views and updates last_verified_at.
    """
    uc = session.exec(
        select(UserCertification).where(UserCertification.verification_hash == verification_hash)
    ).first()

    if not uc:
        raise HTTPException(status_code=404, detail="Credential not found. This verification link may be invalid or the credential may have been revoked.")

    # Resolve certification name
    cert = session.get(Certification, uc.certification_id)
    cert_name = cert.name if cert else uc.certification_id.replace("_", " ").title()

    # Resolve company name
    from models.user import Company
    company = session.get(Company, uc.company_id)
    company_name = company.name if company else uc.company_id

    # Resolve branch name (optional)
    from models.enterprise_hierarchy import Branch
    user = session.exec(select(User).where(User.username == uc.user_id)).first()
    branch_name = None
    if user and user.branch_id:
        branch = session.get(Branch, user.branch_id)
        branch_name = branch.name if branch else None

    # Log the verification view (do NOT expose user private data)
    try:
        uc.verification_views = (uc.verification_views or 0) + 1
        uc.last_verified_at = datetime.utcnow()
        session.add(uc)
        session.commit()
    except Exception:
        session.rollback()

    # Status label mapping
    status_labels = {
        "ACTIVE": "Valid & Active",
        "EXPIRED": "Expired",
        "REVOKED": "Revoked",
        "PENDING_APPROVAL": "Pending Approval",
    }
    status_label = status_labels.get(uc.status, uc.status)
    is_valid = uc.status == "ACTIVE"

    return {
        "isValid": is_valid,
        "status": uc.status,
        "statusLabel": status_label,
        "certificationName": cert_name,
        "recipientDisplayName": uc.user_id,  # username shown publicly
        "companyName": company_name,
        "branchName": branch_name,
        "verificationId": uc.id,
        "verificationHash": uc.verification_hash,
        "issuedAt": uc.issued_at.isoformat() if uc.issued_at else None,
        "expiresAt": uc.expires_at.isoformat() if uc.expires_at else None,
        "approvedAt": uc.approved_at.isoformat() if uc.approved_at else None,
        "verificationViews": uc.verification_views,
        "verifiedAt": datetime.utcnow().isoformat(),
        "badgeUrl": cert.badge_url if cert else None,
    }


# ─── Endpoint 3: Company-Scoped Certifications List ───────────────────────────

@router.get("/api/v1/certifications/list")
async def list_certifications(
    filter_status: Optional[str] = None,  # ACTIVE | EXPIRED | REVOKED | PENDING_APPROVAL
    filter_username: Optional[str] = None,
    filter_branch_id: Optional[str] = None,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Company-scoped list of all issued credentials. Manager/Admin only.
    """
    manager = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(manager)
    company_id = manager.company_id or "septivolt"

    stmt = select(UserCertification).where(UserCertification.company_id == company_id)
    if filter_status:
        stmt = stmt.where(UserCertification.status == filter_status.upper())
    if filter_username:
        stmt = stmt.where(UserCertification.user_id == filter_username)

    results = session.exec(stmt.order_by(UserCertification.issued_at.desc())).all()

    # If branch filter, resolve via user records
    if filter_branch_id:
        branch_users = session.exec(
            select(User.username).where(User.branch_id == filter_branch_id, User.company_id == company_id)
        ).all()
        branch_usernames = set(branch_users)
        results = [r for r in results if r.user_id in branch_usernames]

    # Enrich with certification names
    enriched = []
    cert_cache: Dict[str, str] = {}
    for uc in results:
        if uc.certification_id not in cert_cache:
            cert = session.get(Certification, uc.certification_id)
            cert_cache[uc.certification_id] = cert.name if cert else uc.certification_id.replace("_", " ").title()
        enriched.append({
            "id": uc.id,
            "userId": uc.user_id,
            "certificationId": uc.certification_id,
            "certificationName": cert_cache[uc.certification_id],
            "status": uc.status,
            "issuedAt": uc.issued_at.isoformat() if uc.issued_at else None,
            "expiresAt": uc.expires_at.isoformat() if uc.expires_at else None,
            "approvedBy": uc.approved_by,
            "approvedAt": uc.approved_at.isoformat() if uc.approved_at else None,
            "revokedBy": uc.revoked_by,
            "revokedAt": uc.revoked_at.isoformat() if uc.revoked_at else None,
            "revokedReason": uc.revoked_reason,
            "verificationHash": uc.verification_hash,
            "verificationViews": uc.verification_views or 0,
            "lastVerifiedAt": uc.last_verified_at.isoformat() if uc.last_verified_at else None,
        })

    return {
        "companyId": company_id,
        "total": len(enriched),
        "certifications": enriched,
    }


# ─── Endpoint 4: Approve Certification ────────────────────────────────────────

class ApprovalRequest(BaseModel):
    notes: Optional[str] = None


@router.post("/api/v1/certifications/{cert_record_id}/approve")
async def approve_certification(
    cert_record_id: str,
    body: ApprovalRequest = ApprovalRequest(),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Approve a PENDING_APPROVAL certification. Manager/Admin only, same company.
    Triggers GHL tag sync with certification_status:active.
    """
    manager = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(manager)

    uc = session.get(UserCertification, cert_record_id)
    if not uc:
        raise HTTPException(status_code=404, detail="Certification record not found.")

    # Tenant boundary check
    if uc.company_id != manager.company_id and manager.role not in {UserRole.SUPER_ADMIN}:
        raise HTTPException(status_code=403, detail="Cross-company access denied.")

    if uc.status not in ("PENDING_APPROVAL", "EXPIRED"):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve certification with status '{uc.status}'. Only PENDING_APPROVAL or EXPIRED records can be approved."
        )

    uc.status = "ACTIVE"
    uc.approved_by = manager.username
    uc.approved_at = datetime.utcnow()

    # Compute new expiry based on certification policy
    cert = session.get(Certification, uc.certification_id)
    if cert:
        if cert.expiration_policy == "1_year":
            uc.expires_at = datetime.utcnow() + timedelta(days=365)
        elif cert.expiration_policy == "2_years":
            uc.expires_at = datetime.utcnow() + timedelta(days=730)

    session.add(uc)

    # Trigger GHL sync
    try:
        from services.ghl_sync import GHLSyncService
        target_user = session.exec(select(User).where(User.username == uc.user_id)).first()
        if target_user:
            GHLSyncService.sync_contact(
                db_session=session,
                user_id=uc.user_id,
                company_id=uc.company_id,
                email=target_user.email or f"{uc.user_id}@company.com",
                first_name=uc.user_id.capitalize(),
                last_name="Rep",
                role=target_user.role,
                training_status="completed",
                extra_tags=[
                    f"certification:{uc.certification_id}",
                    "certification_status:active",
                ]
            )
    except Exception as e:
        print(f"[CERT-APPROVE] GHL sync failed (non-blocking): {e}")

    session.commit()

    return {
        "success": True,
        "message": f"Certification '{cert_record_id}' approved by {manager.username}.",
        "status": "ACTIVE",
        "approvedAt": uc.approved_at.isoformat(),
        "expiresAt": uc.expires_at.isoformat() if uc.expires_at else None,
    }


# ─── Endpoint 5: Revoke Certification ─────────────────────────────────────────

class RevocationRequest(BaseModel):
    reason: str


@router.post("/api/v1/certifications/{cert_record_id}/revoke")
async def revoke_certification(
    cert_record_id: str,
    body: RevocationRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Revoke an ACTIVE certification. Manager/Admin only, same company.
    Triggers GHL tag sync with certification_status:revoked.
    """
    manager = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(manager)

    uc = session.get(UserCertification, cert_record_id)
    if not uc:
        raise HTTPException(status_code=404, detail="Certification record not found.")

    if uc.company_id != manager.company_id and manager.role not in {UserRole.SUPER_ADMIN}:
        raise HTTPException(status_code=403, detail="Cross-company access denied.")

    if uc.status == "REVOKED":
        raise HTTPException(status_code=400, detail="Certification is already revoked.")

    uc.status = "REVOKED"
    uc.revoked_by = manager.username
    uc.revoked_at = datetime.utcnow()
    uc.revoked_reason = body.reason
    session.add(uc)

    # Trigger GHL sync
    try:
        from services.ghl_sync import GHLSyncService
        target_user = session.exec(select(User).where(User.username == uc.user_id)).first()
        if target_user:
            GHLSyncService.sync_contact(
                db_session=session,
                user_id=uc.user_id,
                company_id=uc.company_id,
                email=target_user.email or f"{uc.user_id}@company.com",
                first_name=uc.user_id.capitalize(),
                last_name="Rep",
                role=target_user.role,
                training_status="in_progress",
                extra_tags=[
                    f"certification:{uc.certification_id}",
                    "certification_status:revoked",
                ]
            )
    except Exception as e:
        print(f"[CERT-REVOKE] GHL sync failed (non-blocking): {e}")

    session.commit()

    return {
        "success": True,
        "message": f"Certification '{cert_record_id}' revoked by {manager.username}.",
        "status": "REVOKED",
        "revokedAt": uc.revoked_at.isoformat(),
        "revokedReason": uc.revoked_reason,
    }


# ─── Endpoint 6: Renew Certification ──────────────────────────────────────────

@router.post("/api/v1/certifications/{cert_record_id}/renew")
async def renew_certification(
    cert_record_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Renew an EXPIRED or REVOKED certification. Manager/Admin only.
    Resets status to ACTIVE and extends expiration date.
    Triggers GHL tag sync.
    """
    manager = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(manager)

    uc = session.get(UserCertification, cert_record_id)
    if not uc:
        raise HTTPException(status_code=404, detail="Certification record not found.")

    if uc.company_id != manager.company_id and manager.role not in {UserRole.SUPER_ADMIN}:
        raise HTTPException(status_code=403, detail="Cross-company access denied.")

    if uc.status == "ACTIVE":
        raise HTTPException(status_code=400, detail="Certification is already ACTIVE. Use approve for pending certifications.")

    uc.status = "ACTIVE"
    uc.approved_by = manager.username
    uc.approved_at = datetime.utcnow()
    uc.revoked_reason = None

    # Extend expiry based on certification policy
    cert = session.get(Certification, uc.certification_id)
    if cert:
        if cert.expiration_policy == "1_year":
            uc.expires_at = datetime.utcnow() + timedelta(days=365)
        elif cert.expiration_policy == "2_years":
            uc.expires_at = datetime.utcnow() + timedelta(days=730)
        else:
            uc.expires_at = None  # never
    session.add(uc)

    # Trigger GHL sync
    try:
        from services.ghl_sync import GHLSyncService
        target_user = session.exec(select(User).where(User.username == uc.user_id)).first()
        if target_user:
            GHLSyncService.sync_contact(
                db_session=session,
                user_id=uc.user_id,
                company_id=uc.company_id,
                email=target_user.email or f"{uc.user_id}@company.com",
                first_name=uc.user_id.capitalize(),
                last_name="Rep",
                role=target_user.role,
                training_status="completed",
                extra_tags=[
                    f"certification:{uc.certification_id}",
                    "certification_status:active",
                ]
            )
    except Exception as e:
        print(f"[CERT-RENEW] GHL sync failed (non-blocking): {e}")

    session.commit()

    return {
        "success": True,
        "message": f"Certification '{cert_record_id}' renewed by {manager.username}.",
        "status": "ACTIVE",
        "approvedAt": uc.approved_at.isoformat(),
        "expiresAt": uc.expires_at.isoformat() if uc.expires_at else None,
    }


# ─── Endpoint 7: Daily Expiration Engine (Cron) ───────────────────────────────

@router.post("/api/v1/certifications/cron/check-expirations")
async def check_expirations(
    x_cron_secret: Optional[str] = Header(None, alias="X-Cron-Secret"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session),
):
    """
    Scheduled daily cron endpoint.
    Finds ACTIVE certifications where expires_at is in the past,
    transitions them to EXPIRED, and triggers GHL tag updates.
    Requires X-Cron-Secret header matching CRON_SECRET env var, or super_admin access.
    """
    cron_secret = os.getenv("CRON_SECRET", "")
    is_authorized = False

    if x_cron_secret and cron_secret and x_cron_secret == cron_secret:
        is_authorized = True
    elif x_user_id:
        try:
            user = _get_requesting_user(session, x_user_id)
            if user.role == UserRole.SUPER_ADMIN:
                is_authorized = True
        except Exception:
            pass

    if not is_authorized:
        raise HTTPException(status_code=403, detail="Unauthorized. Provide valid X-Cron-Secret or super_admin credentials.")

    now = datetime.utcnow()

    # Find all ACTIVE certifications where expires_at has passed
    expired_stmt = select(UserCertification).where(
        UserCertification.status == "ACTIVE",
        UserCertification.expires_at != None,
        UserCertification.expires_at < now,
    )
    expired_certs = session.exec(expired_stmt).all()

    updated = 0
    for uc in expired_certs:
        uc.status = "EXPIRED"
        session.add(uc)

        # Non-blocking GHL sync per expired cert
        try:
            from services.ghl_sync import GHLSyncService
            target_user = session.exec(select(User).where(User.username == uc.user_id)).first()
            if target_user:
                GHLSyncService.sync_contact(
                    db_session=session,
                    user_id=uc.user_id,
                    company_id=uc.company_id,
                    email=target_user.email or f"{uc.user_id}@company.com",
                    first_name=uc.user_id.capitalize(),
                    last_name="Rep",
                    role=target_user.role,
                    training_status="in_progress",
                    extra_tags=[
                        f"certification:{uc.certification_id}",
                        "certification_status:expired",
                    ]
                )
        except Exception as e:
            print(f"[CERT-CRON] GHL sync failed for {uc.user_id}: {e}")

        updated += 1

    session.commit()

    print(f"[CERT-CRON] Expiration check complete. {updated} certifications transitioned to EXPIRED.")

    return {
        "success": True,
        "expiredCount": updated,
        "checkedAt": now.isoformat(),
        "message": f"Expiration check complete. {updated} certification(s) transitioned to EXPIRED.",
    }

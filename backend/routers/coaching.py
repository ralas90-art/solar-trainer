from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import json

from database import get_session
from middleware.auth import get_current_membership, require_role, require_admin
from models import (
    User, UserStats, Membership, UserRole, Company, 
    SimulationResult, CoachingNote
)
from services.gamification import get_level_progress
from services.coaching_signals import CoachingSignalsService

router = APIRouter(prefix="/api/v1/reps", tags=["Coaching"])

@router.get("/{user_id}/coaching-profile")
def get_rep_coaching_profile(
    user_id: str,
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    # 1. Tenant Isolation & RBAC
    # Managers can only see reps in their own company
    # Reps cannot see other reps
    try:
        target_user_id = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # If requester is a rep, they can only see themselves
    if membership.role == UserRole.SALES_REP and membership.user_id != target_user_id:
        raise HTTPException(status_code=403, detail="Reps can only view their own coaching profile")

    # Target user must be in the same company (unless platform admin)
    target_membership = session.exec(
        select(Membership).where(Membership.user_id == target_user_id)
    ).first()

    if not target_membership:
        raise HTTPException(status_code=404, detail="User not found or has no membership")

    if target_membership.company_id != membership.company_id:
        # Check if platform admin (future-proofing)
        if membership.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Access denied: User belongs to a different company")

    # 2. Fetch Data
    user = session.get(User, target_user_id)
    stats = session.get(UserStats, target_user_id)
    
    # Simulation History
    simulations = session.exec(
        select(SimulationResult)
        .where(SimulationResult.user_id == target_user_id)
        .order_by(SimulationResult.created_at.desc())
        .limit(50)
    ).all()

    # Coaching Notes
    notes = session.exec(
        select(CoachingNote)
        .where(CoachingNote.rep_id == target_user_id)
        .order_by(CoachingNote.created_at.desc())
    ).all()

    # --- Intelligence & Refinement (Phase 2) ---
    
    # 1. Level & Progress
    xp = stats.total_score if stats else 0
    level_data = get_level_progress(xp)
    
    # 2. Coaching Signals
    coaching_signals = CoachingSignalsService.get_signals(target_user_id, session)
    
    # 3. Curriculum Completion (Single Source of Truth)
    from services.training import TrainingService
    progress = TrainingService.get_curriculum_progress(stats) if stats else {"percent": 0}
    curriculum_percent = progress["percent"]
    
    # 4. Activity Log (Phase 2)
    activity_log = []
    if stats and stats.activity_log:
        try:
            activity_log = json.loads(stats.activity_log)
        except:
            activity_log = []

    last_synced_at = datetime.utcnow().isoformat()

    # 3. Assemble Response
    history = []
    for sim in simulations:
        history.append({
            "simulation_id": str(sim.id),
            "scenario_name": sim.scenario_name,
            "score": sim.score,
            "passed": sim.passed,
            "created_at": sim.created_at,
            "duration_seconds": sim.duration_seconds,
            "transcript_available": True if sim.transcript_json else False,
            "feedback_available": True if sim.feedback_json else False,
            "transcript": json.loads(sim.transcript_json) if sim.transcript_json else [],
            "feedback": json.loads(sim.feedback_json) if sim.feedback_json else {}
        })

    # AI Feedback Summary (Aggregate from last 5 sims)
    strengths = []
    weaknesses = []
    for sim in simulations[:5]:
        if sim.feedback_json:
            fb = json.loads(sim.feedback_json)
            strengths.extend(fb.get("pros", []))
            weaknesses.extend(fb.get("cons", []))
    
    # Deduplicate
    strengths = list(set(strengths))[:5]
    weaknesses = list(set(weaknesses))[:5]

    return {
        "profile": {
            "user_id": str(user.id),
            "name": user.full_name,
            "email": user.email,
            "role": target_membership.role,
            "company_id": target_membership.company_id
        },
        "performance": {
            "total_score": xp,
            "current_streak": stats.current_streak if stats else 0,
            "highest_streak": stats.highest_streak if stats else 0,
            "level": level_data["currentLevel"],
            "level_progress": level_data["progress"],
            "xp_to_next_level": level_data["xpToNext"],
            "curriculum_completion_percent": curriculum_percent,
            "lives": stats.lives if stats else 3,
            "simulations_completed": len(simulations),
            "average_score": sum(s.score for s in simulations) / len(simulations) if simulations else 0,
            "last_active": stats.last_interaction_at.isoformat() if stats and stats.last_interaction_at else (simulations[0].created_at.isoformat() if simulations else user.created_at.isoformat()),
            "last_synced_at": last_synced_at
        },
        "coaching_signals": coaching_signals,
        "activity_log": activity_log,
        "simulation_history": history,
        "ai_feedback_summary": {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommended_next_steps": ["Focus on objection handling" if len(weaknesses) > 0 else "Ready for advanced scenarios"],
            "revised_script": None
        },
        "coaching_notes": [
            {
                "id": str(n.id),
                "content": n.content,
                "created_at": n.created_at,
                "manager_name": session.get(User, n.manager_id).full_name if session.get(User, n.manager_id) else "Unknown"
            } for n in notes
        ]
    }

@router.post("/{user_id}/coaching-notes")
def add_coaching_note(
    user_id: str,
    note_data: dict,
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    # Only Managers/Admins can add notes
    if membership.role not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only Managers can add coaching notes")

    try:
        target_user_id = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Verify target belongs to same company
    target_membership = session.exec(
        select(Membership).where(Membership.user_id == target_user_id)
    ).first()

    if not target_membership or target_membership.company_id != membership.company_id:
        if membership.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Cannot add notes to users in other companies")

    note = CoachingNote(
        rep_id=target_user_id,
        manager_id=membership.user_id,
        company_id=membership.company_id,
        content=note_data.get("content", ""),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    session.add(note)
    session.commit()
    session.refresh(note)
    
    return {"status": "ok", "note_id": str(note.id)}

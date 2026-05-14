from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func, desc
from typing import List, Optional
from database import get_session
from models.user import User, UserStats, Membership, AIUsageLog, Company, UserRole
from middleware.auth import get_current_membership
from datetime import datetime

router = APIRouter(prefix="/api/v1/leaderboard", tags=["leaderboard"])

@router.get("")
async def get_company_leaderboard(
    membership: Membership = Depends(get_current_membership),
    session: Session = Depends(get_session)
):
    """
    Returns a ranked list of users within the current user's company.
    Enforces strict tenant isolation.
    """
    company_id = membership.company_id

    # 1. Fetch all memberships for this company to get user info and roles
    # We join User for names and UserStats for the core gamification data
    statement = (
        select(Membership, User, UserStats)
        .join(User, Membership.user_id == User.id)
        .outerjoin(UserStats, User.id == UserStats.user_id)
        .where(Membership.company_id == company_id)
        .where(Membership.is_active == True)
        .order_by(desc(UserStats.total_score))
    )
    
    results = session.exec(statement).all()
    
    leaderboard = []
    
    # 2. Process results and calculate additional metrics
    for idx, (m, u, s) in enumerate(results):
        # Fallback for users without stats yet
        if not s:
            s = UserStats(user_id=u.id, total_score=0, current_streak=0, highest_streak=0, lives=3)

        # Calculate simulations completed and average score from AIUsageLog
        sim_stats_stmt = (
            select(
                func.count(AIUsageLog.id).label("count"),
                func.avg(AIUsageLog.total_tokens).label("avg_tokens") # This is a placeholder for actual simulation score if we had it there
            )
            .where(AIUsageLog.user_id == u.id)
            .where(AIUsageLog.status == "success")
        )
        # Note: In a production app, we'd store 'score' in AIUsageLog or a specific Simulation table.
        # For now, we'll use a count of logs and the score from UserStats.
        
        sim_count = session.exec(select(func.count(AIUsageLog.id)).where(AIUsageLog.user_id == u.id)).first() or 0
        
        # Determine average score
        # If they've done simulations, we can derive an average if we stored it per-sim.
        # Since we currently store total_score in UserStats, we'll approximate avg as total/sims
        avg_score = round(s.total_score / sim_count, 1) if sim_count > 0 else 0

        leaderboard.append({
            "user_id": str(u.id),
            "name": u.full_name or u.email.split("@")[0],
            "role": m.role,
            "total_score": s.total_score,
            "current_streak": s.current_streak,
            "highest_streak": s.highest_streak,
            "lives": s.lives,
            "simulations_completed": sim_count,
            "average_score": avg_score,
            "last_active": u.created_at.isoformat(), # Placeholder for actual last login
            "rank": idx + 1
        })

    return leaderboard

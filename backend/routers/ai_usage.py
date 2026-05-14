from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func, and_
from database import get_session
from middleware.auth import get_current_membership
from models.user import Membership, UserRole, AIUsageLog, User
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/v1/company/ai-usage", tags=["AI Usage"])

@router.get("/summary")
async def get_usage_summary(
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """
    Returns a summary of AI usage for the current month.
    Only available to Managers and Admins.
    """
    if membership.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    company_id = membership.company_id
    
    # Start of current month
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # 1. Monthly Totals
    totals_statement = select(
        func.count(AIUsageLog.id).label("total_simulations"),
        func.sum(AIUsageLog.total_tokens).label("total_tokens"),
        func.sum(AIUsageLog.estimated_cost).label("total_cost")
    ).where(
        AIUsageLog.company_id == company_id,
        AIUsageLog.created_at >= start_of_month,
        AIUsageLog.status == "success"
    )
    
    totals = session.exec(totals_statement).first()

    # 2. Daily Usage Trend (Last 30 Days)
    thirty_days_ago = now - timedelta(days=30)
    
    # SQLite friendly date grouping
    trend_statement = select(
        func.date(AIUsageLog.created_at).label("date"),
        func.count(AIUsageLog.id).label("count"),
        func.sum(AIUsageLog.estimated_cost).label("cost")
    ).where(
        AIUsageLog.company_id == company_id,
        AIUsageLog.created_at >= thirty_days_ago,
        AIUsageLog.status == "success"
    ).group_by(func.date(AIUsageLog.created_at)).order_by(func.date(AIUsageLog.created_at))
    
    trend_data = session.exec(trend_statement).all()
    
    # Fill in gaps for trend data
    trend_dict = {row[0]: {"date": row[0], "simulations": row[1], "cost": round(float(row[2] or 0), 4)} for row in trend_data}
    filled_trend = []
    for i in range(31):
        d = (thirty_days_ago + timedelta(days=i)).strftime("%Y-%m-%d")
        if d > now.strftime("%Y-%m-%d"):
            break
        filled_trend.append(trend_dict.get(d, {"date": d, "simulations": 0, "cost": 0}))

    # 3. Usage by User (Rep)
    user_statement = select(
        User.full_name,
        func.count(AIUsageLog.id).label("simulations"),
        func.sum(AIUsageLog.total_tokens).label("tokens"),
        func.max(AIUsageLog.created_at).label("last_active")
    ).join(User, AIUsageLog.user_id == User.id).where(
        AIUsageLog.company_id == company_id,
        AIUsageLog.created_at >= start_of_month
    ).group_by(User.id).order_by(func.count(AIUsageLog.id).desc())

    user_usage = session.exec(user_statement).all()

    # 4. Top/Least Active Insights
    active_reps_count = len(user_usage)
    top_performer = user_usage[0][0] if user_usage else "N/A"
    least_active = user_usage[-1][0] if user_usage else "N/A"

    return {
        "monthly_summary": {
            "total_simulations": totals[0] or 0,
            "total_tokens": totals[1] or 0,
            "total_cost": round(float(totals[2] or 0), 4),
            "active_reps": active_reps_count,
            "period": start_of_month.strftime("%B %Y")
        },
        "trend": filled_trend,
        "by_rep": [
            {
                "name": u[0], 
                "simulations": u[1], 
                "tokens": u[2], 
                "last_active": u[3].strftime("%Y-%m-%d %H:%M") if u[3] else "N/A"
            } for u in user_usage
        ],
        "insights": {
            "top_performer": top_performer,
            "least_active": least_active
        }
    }

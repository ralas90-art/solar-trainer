from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID

from database import get_session
from models.user import User, Membership, UserRole, Company, Invitation
from middleware.auth import get_current_membership, require_role

router = APIRouter(prefix="/api/v1/team", tags=["team"])

@router.get("/members", response_model=List[dict])
async def get_team_members(
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """Get all members of the current company"""
    # Join Membership and User to get details
    statement = (
        select(User, Membership)
        .join(Membership, User.id == Membership.user_id)
        .where(Membership.company_id == membership.company_id)
    )
    results = session.exec(statement).all()
    
    return [
        {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": m.role,
            "joined_at": m.created_at
        }
        for user, m in results
    ]

@router.get("/invites", response_model=List[dict])
async def get_pending_invites(
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """Get all pending invitations for the current company"""
    statement = select(Invitation).where(
        Invitation.company_id == membership.company_id,
        Invitation.status == "pending"
    )
    invites = session.exec(statement).all()
    
    return [
        {
            "id": str(invite.id),
            "email": invite.email,
            "role": invite.role,
            "expires_at": invite.expires_at,
            "token": invite.token # Useful for manager to manually copy/paste if email fails
        }
        for invite in invites
    ]

@router.delete("/members/{user_id}")
async def remove_team_member(
    user_id: UUID,
    session: Session = Depends(get_session),
    manager: Membership = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Remove a member from the company"""
    # 1. Find membership
    statement = select(Membership).where(
        Membership.user_id == user_id,
        Membership.company_id == manager.company_id
    )
    membership = session.exec(statement).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in your company")
        
    # 2. Prevent self-removal if last admin (optional check)
    if user_id == manager.user_id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
        
    session.delete(membership)
    session.commit()
    
    return {"status": "success", "message": "Member removed"}

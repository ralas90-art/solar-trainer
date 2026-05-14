from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
import secrets
from uuid import UUID

from database import get_session
from models.user import User, Company, Membership, Invitation, UserRole, UserStats
from auth_utils import get_password_hash
from middleware.auth import get_current_membership, require_role
from services.billing import BillingService

router = APIRouter(prefix="/api/v1/invites", tags=["invites"])

@router.post("/", response_model=dict)
async def create_invite(
    email: str,
    role: UserRole = UserRole.SALES_REP,
    session: Session = Depends(get_session),
    manager_membership: Membership = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Create an invitation for a new user"""
    # 0. Check Rep Limits
    company = session.get(Company, manager_membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    can_invite, reason = BillingService.check_rep_limit(company, session)
    if not can_invite:
        raise HTTPException(status_code=403, detail=reason)

    # 1. Check if user already exists
    user_stmt = select(User).where(User.email == email)
    if session.exec(user_stmt).first():
        raise HTTPException(status_code=400, detail="User already registered")

    # 2. Check for existing pending invite
    invite_stmt = select(Invitation).where(Invitation.email == email).where(Invitation.status == "pending")
    existing_invite = session.exec(invite_stmt).first()
    if existing_invite:
        # Update existing invite expiration
        existing_invite.expires_at = datetime.utcnow() + timedelta(days=7)
        session.add(existing_invite)
        session.commit()
        return {"message": "Invite resent", "token": existing_invite.token}

    # 3. Create new invite
    token = secrets.token_urlsafe(32)
    invitation = Invitation(
        company_id=manager_membership.company_id,
        email=email,
        role=role,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    session.add(invitation)
    session.commit()
    
    # TODO: Send email with token link
    return {"message": "Invite created", "token": token}

@router.get("/{token}")
async def validate_invite(token: str, session: Session = Depends(get_session)):
    """Check if an invite is valid"""
    stmt = select(Invitation).where(Invitation.token == token)
    invitation = session.exec(stmt).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if invitation.status != "pending":
        raise HTTPException(status_code=400, detail=f"Invitation already {invitation.status}")
    
    if invitation.expires_at < datetime.utcnow():
        invitation.status = "expired"
        session.add(invitation)
        session.commit()
        raise HTTPException(status_code=400, detail="Invitation expired")
        
    company = session.get(Company, invitation.company_id)
    
    return {
        "email": invitation.email,
        "company_name": company.name if company else "SeptiVolt",
        "role": invitation.role
    }

class AcceptInviteRequest(BaseModel):
    token: str
    password: str
    full_name: str


@router.post("/accept")
async def accept_invite(
    req: AcceptInviteRequest,
    session: Session = Depends(get_session)
):
    """Register a user from an invite"""
    stmt = select(Invitation).where(Invitation.token == req.token)
    invitation = session.exec(stmt).first()
    
    if not invitation or invitation.status != "pending" or invitation.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired invitation")
    
    # 1. Create User
    user = User(
        email=invitation.email,
        password=get_password_hash(req.password),
        full_name=req.full_name
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # 2. Create Membership
    membership = Membership(
        user_id=user.id,
        company_id=invitation.company_id,
        role=invitation.role
    )
    session.add(membership)
    
    # 3. Update Invitation
    invitation.status = "accepted"
    session.add(invitation)
    
    # 4. Initialize Stats
    stats = UserStats(user_id=user.id)
    session.add(stats)
    
    session.commit()
    
    return {"status": "success", "user_id": str(user.id)}

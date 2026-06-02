from fastapi import APIRouter, Depends, Header, HTTPException, status, Request
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from database import get_session
from models.user import User, UserRole, Company
from models.enterprise_hierarchy import Branch
from models.user_invitations import UserInvitation, InvitationStatus, InvitationAuditLog
from services.invitation_service import InvitationService
from services.bulk_invite import BulkInviteService
from services.email import EmailService
import os
import secrets
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/v1/invitations", tags=["invitations"])

# --- Request / Response DTOs ---

class InvitationRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    branch_id: Optional[str] = None
    team_id: Optional[str] = None

class BulkInvitationRequest(BaseModel):
    csv_content: str
    branch_id: Optional[str] = None

class ValidateRequest(BaseModel):
    token: str

class AcceptRequest(BaseModel):
    token: str
    username: str
    password: Optional[str] = None

# --- Permission / Helper Guards ---

def _get_requesting_user(session: Session, x_user_id: str) -> User:
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication header 'X-User-Id'."
        )
    user = session.exec(select(User).where(User.username == x_user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session user not found."
        )
    return user

def _verify_can_invite(inviter: User, target_role: str):
    """
    Enforces RBAC hierarchy on target roles.
    """
    inviter_role = inviter.role
    
    # Map legacy inputs
    if inviter_role == UserRole.ADMIN:
        inviter_role = UserRole.DEALER_ADMIN
    elif inviter_role == UserRole.MANAGER:
        inviter_role = UserRole.BRANCH_MANAGER

    if inviter_role == UserRole.SUPER_ADMIN:
        return  # Super admin has unrestricted access

    if inviter_role == UserRole.DEALER_ADMIN:
        # Dealer Admin can invite anyone EXCEPT super_admin
        if target_role == UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Dealer Admins cannot invite Super Admins."
            )
        return

    if inviter_role == UserRole.BRANCH_MANAGER:
        # Branch Managers can invite Trainer, Sales Rep, Observer
        allowed = {UserRole.TRAINER, UserRole.SALES_REP, UserRole.OBSERVER}
        if target_role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Branch Managers can only invite Trainers, Reps, or Observers."
            )
        return

    if inviter_role == UserRole.TRAINER:
        # Trainers can invite Sales Rep, Observer
        allowed = {UserRole.SALES_REP, UserRole.OBSERVER}
        if target_role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Trainers can only invite Sales Reps or Observers."
            )
        return

    # Sales Rep / Observer blocked
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Insufficient privileges. Reps and Observers cannot manage invitations."
    )

# --- Endpoints ---

@router.post("")
def create_single_invitation(
    body: InvitationRequest,
    request: Request,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    inviter = _get_requesting_user(session, x_user_id)
    _verify_can_invite(inviter, body.role)

    # Tenant constraint check
    company_id = inviter.company_id or "septivolt"

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    invite, raw_token = InvitationService.create_invitation(
        session=session,
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        role=body.role,
        company_id=company_id,
        created_by=inviter.username,
        branch_id=body.branch_id,
        team_id=body.team_id,
        ip_address=ip,
        user_agent=ua
    )

    # For testing, we also return the raw token in development environments
    resp = {
        "status": "created",
        "id": invite.id,
        "email": invite.email,
        "role": invite.role,
        "expires_at": invite.expires_at.isoformat()
    }
    if os.getenv("ENV") != "production":
        resp["debug_raw_token"] = raw_token

    return resp

@router.post("/bulk")
def create_bulk_invitations(
    body: BulkInvitationRequest,
    request: Request,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    inviter = _get_requesting_user(session, x_user_id)
    
    # Enforce basic manager role constraint for bulk invitations
    if inviter.role in [UserRole.SALES_REP, UserRole.OBSERVER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reps and Observers cannot create invitations."
        )

    company_id = inviter.company_id or "septivolt"
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    result = BulkInviteService.process_csv(
        session=session,
        csv_content=body.csv_content,
        company_id=company_id,
        created_by=inviter.username,
        branch_id=body.branch_id,
        ip_address=ip,
        user_agent=ua
    )

    return result

@router.post("/validate")
def validate_invitation_token(
    body: ValidateRequest,
    request: Request,
    session: Session = Depends(get_session)
):
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    invite = InvitationService.validate_token(
        session=session,
        raw_token=body.token,
        ip_address=ip,
        user_agent=ua
    )

    # Resolve company name
    company = session.get(Company, invite.company_id)
    company_name = company.name if company else invite.company_id.capitalize()

    return {
        "status": "valid",
        "email": invite.email,
        "first_name": invite.first_name,
        "last_name": invite.last_name,
        "role": invite.role,
        "company_id": invite.company_id,
        "company_name": company_name,
        "branch_id": invite.branch_id,
        "team_id": invite.team_id
    }

@router.post("/accept")
def accept_invitation_token(
    body: AcceptRequest,
    request: Request,
    session: Session = Depends(get_session)
):
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    user = InvitationService.complete_onboarding(
        session=session,
        raw_token=body.token,
        username=body.username,
        password=body.password,
        ip_address=ip,
        user_agent=ua
    )

    # Retrieve plan tier for response compatibility
    company = session.get(Company, user.company_id)
    plan_tier = company.plan_tier if company else "starter"

    # Return standard login credentials payload matching frontend context setup
    return {
        "status": "ok",
        "username": user.username,
        "role": user.role,
        "plan_tier": plan_tier,
        "company_id": user.company_id,
        "temporary_password_required": user.temporary_password_required
    }

@router.get("/branches")
def list_company_branches(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    stmt = select(Branch)
    if user.role != UserRole.SUPER_ADMIN:
        stmt = stmt.where(Branch.company_id == user.company_id)
    return session.exec(stmt).all()


@router.get("")
def list_invitations(
    status_filter: Optional[str] = None,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    if user.role in [UserRole.SALES_REP, UserRole.OBSERVER]:
        raise HTTPException(status_code=403, detail="Reps/Observers cannot list invitations.")

    stmt = select(UserInvitation)
    if user.role != UserRole.SUPER_ADMIN:
        stmt = stmt.where(UserInvitation.company_id == user.company_id)
    
    if status_filter:
        stmt = stmt.where(UserInvitation.status == status_filter)

    results = session.exec(stmt.order_by(UserInvitation.created_at.desc())).all()
    return results

@router.post("/{invite_id}/resend")
def resend_invitation(
    invite_id: str,
    request: Request,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    
    invite = session.get(UserInvitation, invite_id)
    if not invite:
        raise HTTPException(status_code=404, detail="Invitation not found.")

    if user.role != UserRole.SUPER_ADMIN and invite.company_id != user.company_id:
        raise HTTPException(status_code=403, detail="Access denied.")

    _verify_can_invite(user, invite.role)

    # Generate new Token
    raw_token = secrets.token_urlsafe(32)
    token_hash = InvitationService._hash_token(raw_token)

    invite.token_hash = token_hash
    # Update status back to pending and reset expires_at to 24h from now
    invite.status = InvitationStatus.PENDING
    invite.expires_at = datetime.utcnow() + timedelta(hours=24)
    session.add(invite)

    # Log audit resend action
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    audit = InvitationAuditLog(
        invitation_id=invite_id,
        action="resend",
        ip_address=ip,
        user_agent=ua,
        details=f"Resent by {user.username}"
    )
    session.add(audit)
    session.commit()

    # Re-send Email
    frontend_url = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
    magic_link = f"{frontend_url}/accept-invite?token={raw_token}"

    company = session.get(Company, invite.company_id)
    company_name = company.name if company else invite.company_id.capitalize()

    EmailService.send_invitation_email(
        email=invite.email,
        first_name=invite.first_name,
        role=invite.role,
        company_name=company_name,
        magic_link=magic_link
    )

    resp = {"status": "resent", "id": invite.id}
    if os.getenv("ENV") != "production":
        resp["debug_raw_token"] = raw_token

    return resp

@router.delete("/{invite_id}")
def revoke_invitation(
    invite_id: str,
    request: Request,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    
    invite = session.get(UserInvitation, invite_id)
    if not invite:
        raise HTTPException(status_code=404, detail="Invitation not found.")

    if user.role != UserRole.SUPER_ADMIN and invite.company_id != user.company_id:
        raise HTTPException(status_code=403, detail="Access denied.")

    _verify_can_invite(user, invite.role)

    invite.status = InvitationStatus.REVOKED
    session.add(invite)

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    audit = InvitationAuditLog(
        invitation_id=invite_id,
        action="revoke",
        ip_address=ip,
        user_agent=ua,
        details=f"Revoked by {user.username}"
    )
    session.add(audit)
    session.commit()

    return {"status": "revoked", "id": invite.id}

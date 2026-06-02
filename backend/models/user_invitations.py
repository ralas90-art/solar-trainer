from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

class InvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    EXPIRED = "expired"
    REVOKED = "revoked"

class UserInvitation(SQLModel, table=True):
    __tablename__ = "user_invitations"

    id: str = Field(primary_key=True)  # unique string UUID
    company_id: str = Field(index=True, foreign_key="company.id")
    branch_id: Optional[str] = Field(default=None, foreign_key="branches.id", index=True)
    team_id: Optional[str] = Field(default=None, foreign_key="team.id", index=True)
    email: str = Field(index=True)
    first_name: str
    last_name: str
    role: str = Field(default="sales_rep")  # user role (e.g. dealer_admin, branch_manager, etc.)
    token_hash: str = Field(index=True, unique=True)
    status: InvitationStatus = Field(default=InvitationStatus.PENDING, index=True)
    expires_at: datetime = Field(index=True)
    accepted_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str = Field(index=True)  # creator username
    bulk_upload_id: Optional[str] = Field(default=None, index=True)

class InvitationAuditLog(SQLModel, table=True):
    __tablename__ = "invitation_audit_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    invitation_id: str = Field(index=True)
    action: str  # create | validate | accept | revoke | resend | failed_attempt
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SyncAuditLog(SQLModel, table=True):
    __tablename__ = "sync_audit_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True)
    user_id: str = Field(index=True)
    provider: str = Field(default="gohighlevel", index=True)
    sync_type: str = Field(index=True)  # onboarding | progress_update
    status: str = Field(index=True)     # success | failed
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

import secrets
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import HTTPException, status
from sqlmodel import Session, select
import uuid

from models.user import User, UserStats, UserRole
from models.enterprise_hierarchy import Branch
from models.user_invitations import UserInvitation, InvitationStatus, InvitationAuditLog
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress
from services.email import EmailService
from services.ghl_sync import GHLSyncService
from auth_utils import pwd_context

class InvitationService:
    @staticmethod
    def _hash_token(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @classmethod
    def create_invitation(
        cls,
        session: Session,
        first_name: str,
        last_name: str,
        email: str,
        role: str,
        company_id: str,
        created_by: str,
        branch_id: Optional[str] = None,
        team_id: Optional[str] = None,
        bulk_upload_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> tuple[UserInvitation, str]:
        # Check if user with this email already exists
        user_exists = session.exec(select(User).where(User.email == email)).first()
        if user_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email '{email}' is already registered."
            )

        # Check if active pending invite already exists for this email
        stmt = select(UserInvitation).where(
            UserInvitation.email == email,
            UserInvitation.company_id == company_id,
            UserInvitation.status == InvitationStatus.PENDING
        )
        existing = session.exec(stmt).first()
        if existing:
            # Revoke existing
            existing.status = InvitationStatus.REVOKED
            session.add(existing)
            session.flush()

        # Generate Token
        raw_token = secrets.token_urlsafe(32)
        token_hash = cls._hash_token(raw_token)
        
        # 24 Hours invitation expiry policy
        expires_at = datetime.utcnow() + timedelta(hours=24)
        invite_id = f"invite_{uuid.uuid4().hex[:12]}"

        invitation = UserInvitation(
            id=invite_id,
            company_id=company_id,
            branch_id=branch_id,
            team_id=team_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            token_hash=token_hash,
            status=InvitationStatus.PENDING,
            expires_at=expires_at,
            created_by=created_by,
            bulk_upload_id=bulk_upload_id
        )
        
        session.add(invitation)
        session.flush()

        # Log creation event
        audit = InvitationAuditLog(
            invitation_id=invite_id,
            action="create",
            ip_address=ip_address,
            user_agent=user_agent,
            details=f"Invited by {created_by} to role {role}"
        )
        session.add(audit)
        session.commit()
        session.refresh(invitation)

        # Build Magic Link
        frontend_url = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
        magic_link = f"{frontend_url}/accept-invite?token={raw_token}"

        # Get Company Name for email branding
        from models.user import Company
        company = session.get(Company, company_id)
        company_name = company.name if company else company_id.capitalize()

        # Trigger delivery
        EmailService.send_invitation_email(
            email=email,
            first_name=first_name,
            role=role,
            company_name=company_name,
            magic_link=magic_link
        )

        return invitation, raw_token

    @classmethod
    def validate_token(
        cls,
        session: Session,
        raw_token: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> UserInvitation:
        if not raw_token:
            raise HTTPException(status_code=400, detail="Token parameter is required.")

        token_hash = cls._hash_token(raw_token)
        stmt = select(UserInvitation).where(UserInvitation.token_hash == token_hash)
        invite = session.exec(stmt).first()

        if not invite:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation link is invalid or has been modified."
            )

        if invite.status == InvitationStatus.REVOKED:
            cls._log_audit(session, invite.id, "failed_attempt", ip_address, user_agent, "Token has been revoked by admin")
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This invitation has been revoked."
            )

        if invite.status == InvitationStatus.ACCEPTED:
            cls._log_audit(session, invite.id, "failed_attempt", ip_address, user_agent, "Token already used")
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This invitation has already been accepted."
            )

        # Check expiration
        if invite.expires_at < datetime.utcnow() or invite.status == InvitationStatus.EXPIRED:
            invite.status = InvitationStatus.EXPIRED
            session.add(invite)
            session.commit()
            cls._log_audit(session, invite.id, "failed_attempt", ip_address, user_agent, "Token expired")
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This invitation link has expired (24-hour limit reached)."
            )

        cls._log_audit(session, invite.id, "validate", ip_address, user_agent, "Token verified successfully")
        return invite

    @classmethod
    def complete_onboarding(
        cls,
        session: Session,
        raw_token: str,
        username: str,
        password: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> User:
        # Step 1: Validate Token
        invite = cls.validate_token(session, raw_token, ip_address, user_agent)

        # Verify username availability
        username_check = session.exec(select(User).where(User.username == username)).first()
        if username_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is already taken."
            )

        # Step 2: Hashing password or fallback
        if password:
            hashed_pwd = pwd_context.hash(password)
            temp_pwd_req = False
        else:
            # Fallback to random password if skipped, but user will need passwordless/magic links
            hashed_pwd = pwd_context.hash(secrets.token_urlsafe(16))
            temp_pwd_req = True

        # Step 3: Create User
        new_user = User(
            username=username,
            email=invite.email,
            password=hashed_pwd,
            role=invite.role,
            company_id=invite.company_id,
            branch_id=invite.branch_id,
            team_id=invite.team_id,
            temporary_password_required=temp_pwd_req,
            is_active=True
        )
        session.add(new_user)
        session.flush()

        # Step 4: Provision UserStats
        stats = UserStats(
            user_id=username,
            total_score=0,
            current_streak=0,
            lives=3,
            onboarding_progress='{"assessment": false, "roleplay": false, "leaderboard": false, "analytics": false}'
        )
        session.add(stats)
        session.flush()

        # Step 5: Auto-assign default curriculum or template rules
        from services.template_service import TemplateService
        applied_template = TemplateService.apply_template_to_new_user(session, new_user)
        
        if not applied_template:
            # Fallback to default curriculum: "solar_fundamentals_v1"
            curriculum_id = "solar_fundamentals_v1"
            
            # Ensure Curriculum exists
            curriculum = session.get(Curriculum, curriculum_id)
            if not curriculum:
                curriculum = Curriculum(
                    id=curriculum_id,
                    name="Solar Fundamentals RAMPER v1",
                    description="Introductory curriculum tracking core prospecting, consult discovery, and pricing objections."
                )
                session.add(curriculum)
                session.flush()

            # Assign
            assignment = CurriculumAssignment(
                company_id=invite.company_id,
                curriculum_id=curriculum_id,
                target_type="user",
                target_id=username,
                assigned_by="system"
            )
            session.add(assignment)

            # Track Initial Progress
            progress = UserCurriculumProgress(
                user_id=username,
                company_id=invite.company_id,
                curriculum_id=curriculum_id,
                status="not_started",
                progress_percentage=0.0
            )
            session.add(progress)


        # Step 6: Mark Invitation as Accepted
        invite.status = InvitationStatus.ACCEPTED
        invite.accepted_at = datetime.utcnow()
        session.add(invite)

        # Log accept event
        cls._log_audit(session, invite.id, "accept", ip_address, user_agent, f"Registered user: {username}")
        session.commit()

        # Step 7: GHL Contact Provisioning Trigger
        try:
            branch_name = None
            if invite.branch_id:
                branch = session.get(Branch, invite.branch_id)
                branch_name = branch.name if branch else invite.branch_id
            
            # Run background GHL contact sync
            GHLSyncService.sync_contact(
                db_session=session,
                user_id=username,
                company_id=invite.company_id,
                email=invite.email,
                first_name=invite.first_name,
                last_name=invite.last_name,
                role=invite.role,
                branch_name=branch_name,
                team_name=invite.team_id,
                training_status="not_started"
            )
        except Exception as sync_err:
            print(f"[GHL SYNC WARNING] Background GHL provisioning failed silently: {sync_err}")

        return new_user

    @staticmethod
    def _log_audit(session: Session, invite_id: str, action: str, ip: str, ua: str, details: str):
        audit = InvitationAuditLog(
            invitation_id=invite_id,
            action=action,
            ip_address=ip,
            user_agent=ua,
            details=details
        )
        session.add(audit)
        session.commit()

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


# ─── Certification Status Enum Values (stored as strings) ────────────────────
# PENDING_APPROVAL  — Earned but awaiting manager sign-off
# ACTIVE            — Fully issued and valid
# EXPIRED           — Past expiration date
# REVOKED           — Manually revoked by an admin/manager


class Certification(SQLModel, table=True):
    __tablename__ = "certifications"

    id: str = Field(primary_key=True)  # unique string ID, e.g. "solar_closer_l1"
    name: str
    curriculum_id: str = Field(foreign_key="curriculums.id")
    badge_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Expiration policy for this certification type
    expiration_policy: str = Field(default="never")  # "never" | "1_year" | "2_years" | "custom"
    renewal_required: bool = Field(default=False)


class UserCertification(SQLModel, table=True):
    __tablename__ = "user_certifications"

    id: str = Field(primary_key=True)  # unique verification UUID
    user_id: str = Field(index=True)  # username
    company_id: str = Field(index=True, foreign_key="company.id")
    certification_id: str = Field(index=True, foreign_key="certifications.id")

    issued_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    verification_hash: str = Field(unique=True, index=True)  # SHA-256 hash or secure token

    # Lifecycle status
    status: str = Field(default="ACTIVE", index=True)  # PENDING_APPROVAL | ACTIVE | EXPIRED | REVOKED

    # Issuance metadata
    issued_by: Optional[str] = Field(default=None)  # username who created the record

    # Approval metadata
    approved_by: Optional[str] = Field(default=None)  # manager username who approved
    approved_at: Optional[datetime] = Field(default=None)

    # Revocation metadata
    revoked_by: Optional[str] = Field(default=None)  # admin/manager username who revoked
    revoked_at: Optional[datetime] = Field(default=None)
    revoked_reason: Optional[str] = Field(default=None)

    # Verification analytics
    last_verified_at: Optional[datetime] = Field(default=None)
    verification_views: int = Field(default=0)

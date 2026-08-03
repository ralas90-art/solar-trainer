from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlmodel import Session, select
from models import EnterpriseInquiry
from models.user import User, UserRole
from database import get_session
from services.filtering import FilteringService
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import os
import tempfile

from auth_utils import get_current_user
from rate_limiter import check_rate_limit, validate_email_format

router = APIRouter(prefix="/enterprise", tags=["enterprise"])
filter_service = FilteringService()

class InquiryCreate(BaseModel):
    name: str
    email: str
    company: str
    teamSize: int
    useCase: str
    website: Optional[str] = None  # Honeypot field for bot detection

# Enterprise router instance

@router.post("/inquiry")
async def create_inquiry(
    data: InquiryCreate,
    req: Request,
    session: Session = Depends(get_session)
):
    # 1. Rate limiting: 5 inquiries per 10 minutes per IP
    check_rate_limit(req, key_prefix="enterprise_inquiry", max_requests=5, window_seconds=600)

    # 2. Honeypot check (bots fill out invisible website field)
    if data.website:
        print("[SPAM BLOCKED] Honeypot field filled.")
        return {"status": "received", "id": 0}

    # 3. Email format validation
    if not validate_email_format(data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format."
        )

    # 4. Anti-spam input validation
    if len(data.name) > 100 or "<script" in data.name.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid name payload."
        )

    # 5. Duplicate inquiry window protection (5 minutes)
    cutoff = datetime.utcnow() - timedelta(minutes=5)
    existing = session.exec(
        select(EnterpriseInquiry)
        .where(EnterpriseInquiry.email == data.email.strip().lower())
        .where(EnterpriseInquiry.created_at >= cutoff)
    ).first()

    if existing:
        print(f"[DUPLICATE PREVENTED] Duplicate inquiry within 5m for {data.email}")
        return {"status": "received", "id": existing.id}

    # 6. Create entry in DB
    inquiry = EnterpriseInquiry(
        name=data.name.strip(),
        email=data.email.strip().lower(),
        company=data.company.strip(),
        team_size=data.teamSize,
        use_case=data.useCase.strip()
    )
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)

    print(f"New Inquiry received: {inquiry.id}. Triggering AI Filtering...")

    inquiry.status = "ai_processing"
    session.add(inquiry)
    session.commit()

    return {"status": "received", "id": inquiry.id}


@router.get("/leads")
def get_leads(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    allowed_roles = {UserRole.SUPER_ADMIN, UserRole.DEALER_ADMIN, UserRole.ADMIN}
    if user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Access denied: Admin only.")

    statement = select(EnterpriseInquiry).order_by(EnterpriseInquiry.created_at.desc())
    results = session.exec(statement).all()
    return results


class AIUpdate(BaseModel):
    score: int
    priority: str
    research: str


@router.post("/inquiry/{inquiry_id}/update-ai")
def update_ai_results(
    inquiry_id: int,
    data: AIUpdate,
    x_internal_secret: Optional[str] = Header(None, alias="X-Internal-Secret"),
    session: Session = Depends(get_session)
):
    expected_secret = os.getenv("INTERNAL_AI_UPDATE_SECRET", "septivolt_ai_internal_secret_2026")
    if not x_internal_secret or x_internal_secret != expected_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid or missing internal service secret."
        )

    inquiry = session.get(EnterpriseInquiry, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    inquiry.score = data.score
    inquiry.priority = data.priority
    inquiry.research_notes = data.research
    inquiry.status = "processed"

    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)

    filter_service.log_to_excel(inquiry)

    ics = filter_service.generate_ics_content(inquiry.name, inquiry.company)
    email_body = filter_service.format_email_body(inquiry)

    ics_path = os.path.join(tempfile.gettempdir(), f"invite_{inquiry_id}.ics")
    with open(ics_path, "w") as f:
        f.write(ics)

    print(f"Email prepared for {inquiry.email}. ICS saved to {ics_path}")

    return {"status": "updated", "ics_path": ics_path}

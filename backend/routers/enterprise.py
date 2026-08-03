from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlmodel import Session, select
from models import EnterpriseInquiry
from models.user import User, UserRole
from database import get_session
from services.filtering import FilteringService
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Optional
import tempfile

from auth_utils import get_current_user

router = APIRouter(prefix="/enterprise", tags=["enterprise"])
filter_service = FilteringService()

class InquiryCreate(BaseModel):
    name: str
    email: str
    company: str
    teamSize: int
    useCase: str

# Enterprise router instance

@router.post("/inquiry")
async def create_inquiry(data: InquiryCreate, session: Session = Depends(get_session)):
    # 1. Create entry in DB
    inquiry = EnterpriseInquiry(
        name=data.name,
        email=data.email,
        company=data.company,
        team_size=data.teamSize,
        use_case=data.useCase
    )
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)

    # 2. Logic for AI Scoring & Research (Simulated for Now)
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

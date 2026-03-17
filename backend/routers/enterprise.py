from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import EnterpriseInquiry
from database import get_session
from services.filtering import FilteringService
from pydantic import BaseModel
from datetime import datetime
import os
import tempfile

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
    # In a real production environment, this would trigger an async task
    # For this implementation, we log the intent.
    print(f"New Inquiry received: {inquiry.id}. Triggering AI Filtering...")

    # For the verification step, the Agent will call Grok/Manus and update these fields.
    inquiry.status = "ai_processing"
    session.add(inquiry)
    session.commit()

    return {"status": "received", "id": inquiry.id}

@router.get("/leads")
def get_leads(session: Session = Depends(get_session)):
    statement = select(EnterpriseInquiry).order_by(EnterpriseInquiry.created_at.desc())
    results = session.exec(statement).all()
    return results

class AIUpdate(BaseModel):
    score: int
    priority: str
    research: str

@router.post("/inquiry/{inquiry_id}/update-ai")
def update_ai_results(inquiry_id: int, data: AIUpdate, session: Session = Depends(get_session)):
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
    
    # After AI results are in, log to Excel and simulate email sending
    filter_service.log_to_excel(inquiry)
    
    # Generate ICS and Email Body (to be used by an email service)
    ics = filter_service.generate_ics_content(inquiry.name, inquiry.company)
    email_body = filter_service.format_email_body(inquiry)
    
    # Save ICS to tmp for review - Use cross-platform temp dir
    ics_path = os.path.join(tempfile.gettempdir(), f"invite_{inquiry_id}.ics")
    with open(ics_path, "w") as f:
        f.write(ics)
        
    print(f"Email prepared for {inquiry.email}. ICS saved to {ics_path}")
    
    return {"status": "updated", "ics_path": ics_path}

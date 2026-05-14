from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

from database import get_session
from models.user import Company, Membership
from middleware.auth import get_current_membership
from services.whitelabel_engine import WhiteLabelEngine

router = APIRouter()
logger = logging.getLogger(__name__)

class PreviewRequest(BaseModel):
    content_payload: Any  # Can be a string, dict, or list (structured blocks)
    company_overrides: Optional[Dict[str, Any]] = None  # Optional "what-if" testing values


@router.post("/render")
def render_preview(
    request: PreviewRequest,
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """
    Renders arbitrary content using the company's current profile or provided overrides.
    Bypasses caching. Primarily for Manager Preview UI or Sales Demos.
    """
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    # Apply temporary overrides if provided (for unsaved manager changes)
    if request.company_overrides:
        # Create an ephemeral company object for rendering, don't persist it.
        # We can just update a copy of the attributes.
        for k, v in request.company_overrides.items():
            if hasattr(company, k):
                setattr(company, k, v)
                
    engine = WhiteLabelEngine(session)
    
    try:
        rendered = engine.render_structured_blocks(request.content_payload, company)
        return {"rendered_output": rendered}
    except Exception as e:
        logger.error(f"Error rendering preview: {e}")
        raise HTTPException(status_code=500, detail="Failed to render content")

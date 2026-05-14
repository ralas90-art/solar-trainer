from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr
import logging

from database import get_session
from models.user import Company, Membership, UserRole
from middleware.auth import get_current_membership
from services.ai_keys import encrypt_key, decrypt_key, mask_key

router = APIRouter()
logger = logging.getLogger(__name__)

class CompanyUpdateSchema(BaseModel):
    # Core Branding
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    contact_email: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

    # Custom Operational Fields
    crm_name: Optional[str] = None
    proposal_tool: Optional[str] = None
    door_knocking_tool: Optional[str] = None
    financing_options: Optional[str] = None
    onboarding_notes: Optional[str] = None
    
    # JSON Overrides
    custom_script_overrides: Optional[Dict[str, Any]] = None
    objection_handling_overrides: Optional[Dict[str, Any]] = None

    # AI Configuration (Phase 5)
    use_custom_ai_keys: Optional[bool] = None
    openai_api_key: Optional[str] = None
    vapi_api_key: Optional[str] = None


@router.get("/profile")
def get_company_profile(
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """
    Fetches the current user's company profile settings.
    Masks encrypted API keys for safe display.
    """
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    # Create a dict to return, masking sensitive keys
    company_data = company.model_dump()
    
    # Decrypt and mask keys if they exist
    if company.openai_api_key_encrypted:
        raw_key = decrypt_key(company.openai_api_key_encrypted)
        company_data["openai_api_key"] = mask_key(raw_key)
    else:
        company_data["openai_api_key"] = ""

    if company.vapi_api_key_encrypted:
        raw_key = decrypt_key(company.vapi_api_key_encrypted)
        company_data["vapi_api_key"] = mask_key(raw_key)
    else:
        company_data["vapi_api_key"] = ""
        
    return company_data


@router.put("/profile")
def update_company_profile(
    payload: CompanyUpdateSchema,
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    """
    Updates the white-label fields and AI configuration.
    Encrypts API keys at rest.
    """
    if membership.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Managers or Admins can update company settings"
        )
        
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    update_dict = payload.model_dump(exclude_unset=True)
    
    # Handle API Key Encryption separately
    if "openai_api_key" in update_dict:
        key = update_dict.pop("openai_api_key")
        # Only update if it's not the masked placeholder from the UI
        if key and "****" not in key:
            company.openai_api_key_encrypted = encrypt_key(key)
        elif key == "":
            company.openai_api_key_encrypted = None

    if "vapi_api_key" in update_dict:
        key = update_dict.pop("vapi_api_key")
        # Only update if it's not the masked placeholder from the UI
        if key and "****" not in key:
            company.vapi_api_key_encrypted = encrypt_key(key)
        elif key == "":
            company.vapi_api_key_encrypted = None

    # Apply other updates
    for key, value in update_dict.items():
        setattr(company, key, value)
        
    # Increment version to invalidate V2 Caching
    company.profile_version += 1
    
    session.add(company)
    session.commit()
    session.refresh(company)
    
    return get_company_profile(session, membership)

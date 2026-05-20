import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models.user import User, UserRole, Company
from models.company_settings import CompanyProfile, CompanyIntegration
from services.integration_service import IntegrationService
from services.profile_service import ProfileService

router = APIRouter(tags=["company_settings"])

# ─── Auth helpers ─────────────────────────────────────────────────────────────

def _require_auth_user(session: Session, username: str) -> User:
    """Validate user context exists in the DB (prevent header spoofing)."""
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials."
        )
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user session."
        )
    return user

def _require_same_company(user: User, target_company_id: str) -> None:
    """Ensure user belongs to the target company (tenant isolation)."""
    # Allow super admins or admins across companies if needed, but for standard tenant:
    if user.company_id != target_company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Cross-tenant request is prohibited."
        )

# ─── Pydantic Request Models ──────────────────────────────────────────────────

class CompanyProfileRequest(BaseModel):
    company_overview: Optional[str] = None
    website_url: Optional[str] = None
    markets_served: Optional[List[str]] = None
    states_served: Optional[List[str]] = None
    service_areas: Optional[str] = None
    languages_supported: Optional[List[str]] = None
    residential_focus: Optional[bool] = None
    commercial_focus: Optional[bool] = None
    products_offered: Optional[List[str]] = None
    financing_options: Optional[List[str]] = None
    utility_programs: Optional[str] = None
    equipment_brands: Optional[str] = None
    warranty_details: Optional[str] = None
    average_install_timeline: Optional[str] = None
    target_customer: Optional[str] = None
    sales_model: Optional[str] = None
    appointment_type: Optional[str] = None
    setter_closer_model: Optional[bool] = None
    sales_process_notes: Optional[str] = None
    brand_voice: Optional[List[str]] = None
    common_objections: Optional[List[str]] = None
    approved_rebuttals: Optional[List[str]] = None
    compliance_notes: Optional[str] = None
    words_to_avoid: Optional[str] = None
    script_preferences: Optional[str] = None
    training_focus: Optional[List[str]] = None

class CompanyIntegrationRequest(BaseModel):
    provider: str
    auth_type: str = "none"
    credentials: Optional[str] = None  # Raw credentials submitted for encryption
    location_id: Optional[str] = None
    account_id: Optional[str] = None
    webhook_url: Optional[str] = None
    sync_enabled: bool = False
    sync_preferences: Optional[Dict[str, bool]] = None

# ─── Demo Mock Data ──────────────────────────────────────────────────────────

MOCK_DEMO_PROFILE = {
    "company_id": "sales_accelerator_demo",
    "company_overview": "A dynamic solar dealer training 50+ sales reps.",
    "website_url": "https://demo-solar.example.com",
    "markets_served": ["door-to-door", "virtual"],
    "states_served": ["CA", "TX", "FL"],
    "service_areas": "California, Texas, and Florida utility grids",
    "languages_supported": ["en", "es"],
    "residential_focus": True,
    "commercial_focus": True,
    "products_offered": ["solar", "battery"],
    "financing_options": ["loan", "lease", "cash"],
    "utility_programs": "NEM 3.0 net billing, TX grid import buybacks",
    "equipment_brands": "Tesla Powerwall, Qcells panels, Enphase microinverters",
    "warranty_details": "25-year structural, 10-year battery storage warranty",
    "average_install_timeline": "4-6 weeks",
    "target_customer": "Suburban homeowners and commercial retail stores",
    "sales_model": "virtual",
    "appointment_type": "zoom",
    "setter_closer_model": True,
    "sales_process_notes": "Setters knock door or call, closers run online proposal.",
    "brand_voice": ["consultative", "professional"],
    "common_objections": ["Solar is too expensive", "NEM 3.0 is bad"],
    "approved_rebuttals": ["Battery offsets NEM 3.0", "Zero down loan immediately saves cash"],
    "compliance_notes": "Do not promise zero electric bill.",
    "words_to_avoid": "free panels, government paid",
    "script_preferences": "Consultative A.R.T. pitch style preferred.",
    "training_focus": ["virtual", "spanish"],
    "completeness_score": 92
}

MOCK_DEMO_INTEGRATIONS = [
    {
        "id": 999,
        "company_id": "sales_accelerator_demo",
        "provider": "gohighlevel",
        "auth_type": "api_key",
        "location_id": "loc_demo_123456",
        "account_id": None,
        "webhook_url": None,
        "sync_enabled": True,
        "sync_preferences": {
            "Sync new SeptiVolt users to CRM": True,
            "Sync onboarding completion": True,
            "Sync simulation completions": True
        },
        "connection_status": "connected",
        "last_verified_at": datetime.utcnow().isoformat(),
        "last_error": None
    }
]

# ─── Company Profile API Endpoints ────────────────────────────────────────────

@router.get("/api/v1/companies/{company_id}/profile")
def get_company_profile(
    company_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Retrieve the company intelligence profile."""
    # Enforce safe user authentication
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Demo Mode check
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return MOCK_DEMO_PROFILE

    profile = session.exec(select(CompanyProfile).where(CompanyProfile.company_id == company_id)).first()
    
    # If profile does not exist, return a default empty model
    if not profile:
        profile = CompanyProfile(company_id=company_id)
        session.add(profile)
        session.commit()
        session.refresh(profile)

    # Deserialize JSON fields
    def safe_json_load(val: str) -> list:
        try:
            return json.loads(val or "[]")
        except Exception:
            return []

    return {
        "company_id": profile.company_id,
        "company_overview": profile.company_overview,
        "website_url": profile.website_url,
        "markets_served": safe_json_load(profile.markets_served),
        "states_served": safe_json_load(profile.states_served),
        "service_areas": profile.service_areas,
        "languages_supported": safe_json_load(profile.languages_supported),
        "residential_focus": profile.residential_focus,
        "commercial_focus": profile.commercial_focus,
        "products_offered": safe_json_load(profile.products_offered),
        "financing_options": safe_json_load(profile.financing_options),
        "utility_programs": profile.utility_programs,
        "equipment_brands": profile.equipment_brands,
        "warranty_details": profile.warranty_details,
        "average_install_timeline": profile.average_install_timeline,
        "target_customer": profile.target_customer,
        "sales_model": profile.sales_model,
        "appointment_type": profile.appointment_type,
        "setter_closer_model": profile.setter_closer_model,
        "sales_process_notes": profile.sales_process_notes,
        "brand_voice": safe_json_load(profile.brand_voice),
        "common_objections": safe_json_load(profile.common_objections),
        "approved_rebuttals": safe_json_load(profile.approved_rebuttals),
        "compliance_notes": profile.compliance_notes,
        "words_to_avoid": profile.words_to_avoid,
        "script_preferences": profile.script_preferences,
        "training_focus": safe_json_load(profile.training_focus),
        "completeness_score": ProfileService.calculate_completeness_score(profile)
    }

@router.post("/api/v1/companies/{company_id}/profile")
@router.put("/api/v1/companies/{company_id}/profile")
def save_company_profile(
    company_id: str,
    body: CompanyProfileRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Save or update company intelligence profile details."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Edit permissions guard: admin or manager only
    if user.role not in (UserRole.ADMIN, UserRole.MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Only Admins or Managers can edit the company profile."
        )

    # Demo Mode bypass
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return {"status": "success", "message": "Demo Mode: Profile update mocked successfully."}

    profile = session.exec(select(CompanyProfile).where(CompanyProfile.company_id == company_id)).first()
    if not profile:
        profile = CompanyProfile(company_id=company_id)

    # Update profile fields helper
    def set_field(profile_field, request_val):
        if request_val is not None:
            if isinstance(request_val, list):
                return json.dumps(request_val)
            return request_val
        return profile_field

    profile.company_overview = set_field(profile.company_overview, body.company_overview)
    profile.website_url = set_field(profile.website_url, body.website_url)
    profile.markets_served = set_field(profile.markets_served, body.markets_served)
    profile.states_served = set_field(profile.states_served, body.states_served)
    profile.service_areas = set_field(profile.service_areas, body.service_areas)
    profile.languages_supported = set_field(profile.languages_supported, body.languages_supported)
    profile.residential_focus = body.residential_focus if body.residential_focus is not None else profile.residential_focus
    profile.commercial_focus = body.commercial_focus if body.commercial_focus is not None else profile.commercial_focus
    profile.products_offered = set_field(profile.products_offered, body.products_offered)
    profile.financing_options = set_field(profile.financing_options, body.financing_options)
    profile.utility_programs = set_field(profile.utility_programs, body.utility_programs)
    profile.equipment_brands = set_field(profile.equipment_brands, body.equipment_brands)
    profile.warranty_details = set_field(profile.warranty_details, body.warranty_details)
    profile.average_install_timeline = set_field(profile.average_install_timeline, body.average_install_timeline)
    profile.target_customer = set_field(profile.target_customer, body.target_customer)
    profile.sales_model = set_field(profile.sales_model, body.sales_model)
    profile.appointment_type = set_field(profile.appointment_type, body.appointment_type)
    profile.setter_closer_model = body.setter_closer_model if body.setter_closer_model is not None else profile.setter_closer_model
    profile.sales_process_notes = set_field(profile.sales_process_notes, body.sales_process_notes)
    profile.brand_voice = set_field(profile.brand_voice, body.brand_voice)
    profile.common_objections = set_field(profile.common_objections, body.common_objections)
    profile.approved_rebuttals = set_field(profile.approved_rebuttals, body.approved_rebuttals)
    profile.compliance_notes = set_field(profile.compliance_notes, body.compliance_notes)
    profile.words_to_avoid = set_field(profile.words_to_avoid, body.words_to_avoid)
    profile.script_preferences = set_field(profile.script_preferences, body.script_preferences)
    profile.training_focus = set_field(profile.training_focus, body.training_focus)
    
    profile.updated_at = datetime.utcnow()

    session.add(profile)
    session.commit()
    session.refresh(profile)

    return {
        "status": "success",
        "completeness_score": ProfileService.calculate_completeness_score(profile)
    }

@router.get("/api/v1/companies/{company_id}/profile/preview-context")
def get_company_profile_preview(
    company_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Generates a text summary preview of the Company Training Context."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # All company members (including reps) can preview, but admins/managers can edit
    # Generates text context
    context = ProfileService.build_company_training_context(company_id, session)
    return {"context": context}

# ─── Company Integrations API Endpoints ────────────────────────────────────────

@router.get("/api/v1/companies/{company_id}/integrations")
def get_company_integrations(
    company_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Retrieve integration configurations for a company."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Role guard: reps are completely blocked
    if user.role == UserRole.SALES_REP:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: sales representatives cannot access integrations settings."
        )

    # Demo Mode check
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return MOCK_DEMO_INTEGRATIONS

    integrations = session.exec(select(CompanyIntegration).where(CompanyIntegration.company_id == company_id)).all()
    
    result = []
    for ing in integrations:
        # Determine sync preferences
        try:
            prefs = json.loads(ing.sync_preferences or "{}")
        except Exception:
            prefs = {}
            
        # Mask credentials
        masked_creds = ""
        if ing.encrypted_credentials:
            try:
                raw_creds = IntegrationService.decrypt_credential(ing.encrypted_credentials)
                masked_creds = IntegrationService.mask_credential(raw_creds)
            except Exception:
                masked_creds = "••••••••••••" # generic fallback if decryption key fails

        # If user is a manager, they cannot see credentials OR mask (block credential settings visibility)
        item = {
            "id": ing.id,
            "company_id": ing.company_id,
            "provider": ing.provider,
            "auth_type": ing.auth_type,
            "location_id": ing.location_id,
            "account_id": ing.account_id,
            "webhook_url": ing.webhook_url,
            "sync_enabled": ing.sync_enabled,
            "sync_preferences": prefs,
            "connection_status": ing.connection_status,
            "last_verified_at": ing.last_verified_at.isoformat() if ing.last_verified_at else None,
            "last_error": ing.last_error
        }
        
        # Omit masked credential field entirely for manager to prevent tampering
        if user.role == UserRole.ADMIN:
            item["credentials_preview"] = masked_creds

        result.append(item)
        
    return result

@router.post("/api/v1/companies/{company_id}/integrations")
def create_company_integration(
    company_id: str,
    body: CompanyIntegrationRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Configure a new company integration connection."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Only admin can manage integrations
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: only Administrators can create integrations."
        )

    # Demo Mode bypass
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return {"status": "success", "id": 999, "message": "Demo Mode: Integration mocked successfully."}

    # Encrypt credentials if supplied
    enc_creds = None
    if body.credentials:
        # Check if the key is already masked (meaning client sent back the mask, skip re-encrypting)
        if body.credentials.startswith("••••"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Credentials payload is masked. Please provide a new, valid key to update."
            )
        try:
            enc_creds = IntegrationService.encrypt_credential(body.credentials)
        except ValueError as err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot save credentials: {str(err)}"
            )

    sync_pref_str = json.dumps(body.sync_preferences or {})

    # Create new integration configuration
    new_ing = CompanyIntegration(
        company_id=company_id,
        provider=body.provider,
        auth_type=body.auth_type,
        encrypted_credentials=enc_creds,
        location_id=body.location_id,
        account_id=body.account_id,
        webhook_url=body.webhook_url,
        sync_enabled=body.sync_enabled,
        sync_preferences=sync_pref_str,
        connection_status="pending_verification"
    )
    
    session.add(new_ing)
    session.commit()
    session.refresh(new_ing)

    return {"status": "success", "id": new_ing.id, "connection_status": new_ing.connection_status}

@router.put("/api/v1/companies/{company_id}/integrations/{integration_id}")
def update_company_integration(
    company_id: str,
    integration_id: int,
    body: CompanyIntegrationRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Update an existing company integration connection."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Only admin can manage integrations
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: only Administrators can modify integrations."
        )

    # Demo Mode bypass
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return {"status": "success", "message": "Demo Mode: Integration mocked successfully."}

    ing = session.exec(select(CompanyIntegration).where(
        CompanyIntegration.id == integration_id,
        CompanyIntegration.company_id == company_id
    )).first()

    if not ing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration configuration not found."
        )

    # Update provider, auth_type, locations etc
    ing.provider = body.provider
    ing.auth_type = body.auth_type
    ing.location_id = body.location_id
    ing.account_id = body.account_id
    ing.webhook_url = body.webhook_url
    ing.sync_enabled = body.sync_enabled
    if body.sync_preferences is not None:
        ing.sync_preferences = json.dumps(body.sync_preferences)

    # Encrypt raw credentials if supplied (skip if masked string returned by client)
    if body.credentials:
        if not body.credentials.startswith("••••"):
            try:
                ing.encrypted_credentials = IntegrationService.encrypt_credential(body.credentials)
            except ValueError as err:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot save credentials: {str(err)}"
                )

    ing.updated_at = datetime.utcnow()
    session.add(ing)
    session.commit()
    session.refresh(ing)

    return {"status": "success", "connection_status": ing.connection_status}

@router.post("/api/v1/companies/{company_id}/integrations/{integration_id}/test")
def test_company_integration_endpoint(
    company_id: str,
    integration_id: int,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    """Triggers the integration connection test."""
    user = _require_auth_user(session, x_user_id)
    _require_same_company(user, company_id)

    # Only admin can test connections
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: only Administrators can test integrations."
        )

    # Demo Mode bypass
    if company_id == "sales_accelerator_demo" or user.username == "demo":
        return {"status": "connected", "message": "Demo Mode: Connection successful."}

    ing = session.exec(select(CompanyIntegration).where(
        CompanyIntegration.id == integration_id,
        CompanyIntegration.company_id == company_id
    )).first()

    if not ing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration configuration not found."
        )

    # Test the connection via the integration service
    test_result = IntegrationService.test_company_integration(ing)
    
    # Update status in the DB based on test result
    ing.connection_status = test_result.get("status", "pending_verification")
    ing.last_verified_at = datetime.utcnow()
    
    if test_result.get("status") == "failed":
        ing.last_error = test_result.get("error")
    else:
        ing.last_error = None
        
    session.add(ing)
    session.commit()

    return test_result

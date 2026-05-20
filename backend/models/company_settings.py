from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime

class CompanyProfile(SQLModel, table=True):
    """
    Enterprise Company Intelligence Profile.
    Stores domain knowledge, script/compliance guidelines, product catalogs, and sales preferences.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, unique=True, foreign_key="company.id")
    
    # Company Basics
    company_overview: Optional[str] = Field(default=None)
    website_url: Optional[str] = Field(default=None)
    markets_served: str = Field(default="[]")          # JSON list of strings (e.g. ["D2D", "Retail"])
    states_served: str = Field(default="[]")           # JSON list of strings (e.g. ["CA", "TX"])
    service_areas: Optional[str] = Field(default=None)
    languages_supported: str = Field(default="[]")     # JSON list of strings (e.g. ["en", "es"])
    residential_focus: bool = Field(default=True)
    commercial_focus: bool = Field(default=False)
    
    # Offer Details
    products_offered: str = Field(default="[]")        # JSON list of strings (e.g. ["solar", "battery"])
    financing_options: str = Field(default="[]")       # JSON list of strings (e.g. ["lease", "loan", "cash"])
    utility_programs: Optional[str] = Field(default=None)
    equipment_brands: Optional[str] = Field(default=None)
    warranty_details: Optional[str] = Field(default=None)
    average_install_timeline: Optional[str] = Field(default=None)
    
    # Sales Process
    target_customer: Optional[str] = Field(default=None)
    sales_model: Optional[str] = Field(default=None)   # e.g., "door-to-door", "cold-calling", "inbound", "virtual"
    appointment_type: Optional[str] = Field(default=None) # e.g., "in-home", "zoom"
    setter_closer_model: bool = Field(default=False)
    sales_process_notes: Optional[str] = Field(default=None)
    
    # Brand Voice
    brand_voice: str = Field(default="[]")              # JSON list of strings (e.g. ["consultative", "professional"])
    
    # Script & Compliance Preferences
    common_objections: str = Field(default="[]")       # JSON list of strings or dicts
    approved_rebuttals: str = Field(default="[]")      # JSON list of strings or dicts
    compliance_notes: Optional[str] = Field(default=None)
    words_to_avoid: Optional[str] = Field(default=None)
    script_preferences: Optional[str] = Field(default=None)
    
    # Training Preferences
    training_focus: str = Field(default="[]")          # JSON list of strings
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CompanyIntegration(SQLModel, table=True):
    """
    Enterprise Company Integration details (CRM, Webhook, etc.).
    All credentials are stored in encrypted format.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, foreign_key="company.id")
    provider: str = Field(index=True)                  # gohighlevel | custom_webhook | septivolt_crm | none | hubspot | salesforce | zoho | pipedrive
    auth_type: str = Field(default="none")              # api_key | bearer_token | oauth | webhook | none
    encrypted_credentials: Optional[str] = Field(default=None)
    location_id: Optional[str] = Field(default=None)
    account_id: Optional[str] = Field(default=None)
    webhook_url: Optional[str] = Field(default=None)
    sync_enabled: bool = Field(default=False)
    sync_preferences: str = Field(default="{}")        # JSON string of enabled sync options
    connection_status: str = Field(default="disabled") # disabled | connected | pending_verification | failed
    last_verified_at: Optional[datetime] = Field(default=None)
    last_error: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CompanySalesAsset(SQLModel, table=True):
    """
    Enterprise Company Sales Asset.
    Stores generated sales scripts or objection handling rebuttals.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, foreign_key="company.id")
    asset_type: str = Field(index=True)                  # "door_knock" | "cold_call" | "zoom_in_home"
    title: str
    language: str = Field(default="en")                  # "en" | "es"
    content: str                                         # Markdown/text content of the script
    source_profile_version: Optional[str] = Field(default=None)
    status: str = Field(default="draft")                  # "draft" | "approved" | "archived"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CompanySetupState(SQLModel, table=True):
    """
    Enterprise Company Setup State.
    Stores the setup wizard step and manual checklist overrides.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, unique=True, foreign_key="company.id")
    setup_completed: bool = Field(default=False)
    setup_dismissed: bool = Field(default=False)
    current_step: int = Field(default=1)
    checklist_json: str = Field(default="{}")           # JSON string mapping checklist item -> completed boolean
    readiness_score: int = Field(default=0)
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


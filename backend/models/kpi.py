"""
KPI Tracker Models
Defines SQLModel classes for KPI tracking system
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict
import datetime
from uuid import UUID, uuid4


class KPIDefinition(SQLModel, table=True):
    """User's custom KPI definition"""
    __tablename__ = "kpi_definitions"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)  # String to match UserStats.user_id
    label: str = Field(max_length=100)
    description: Optional[str] = None
    target_value: Optional[int] = None
    target_weekly: Optional[int] = None
    target_monthly: Optional[int] = None
    target_quarterly: Optional[int] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    
    # Relationships
    entries: List["KPIEntry"] = Relationship(back_populates="kpi_definition")


class KPIEntry(SQLModel, table=True):
    """Daily KPI entry"""
    __tablename__ = "kpi_entries"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)  # String to match UserStats.user_id
    kpi_definition_id: UUID = Field(foreign_key="kpi_definitions.id", index=True)
    date: datetime.date = Field(index=True)
    value: int
    notes: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    
    # Relationships
    kpi_definition: Optional[KPIDefinition] = Relationship(back_populates="entries")


class KPITemplate(SQLModel, table=True):
    """Preset KPI template"""
    __tablename__ = "kpi_templates"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=100)
    description: Optional[str] = None
    is_default: bool = Field(default=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    
    # Relationships
    template_kpis: List["TemplateKPI"] = Relationship(back_populates="template")


class TemplateKPI(SQLModel, table=True):
    """KPI within a template"""
    __tablename__ = "template_kpis"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    template_id: UUID = Field(foreign_key="kpi_templates.id")
    label: str = Field(max_length=100)
    description: Optional[str] = None
    target_value: Optional[int] = None
    target_weekly: Optional[int] = None
    target_monthly: Optional[int] = None
    target_quarterly: Optional[int] = None
    display_order: int = Field(default=0)
    
    # Relationships
    template: Optional[KPITemplate] = Relationship(back_populates="template_kpis")


# Request/Response Models

class KPIDefinitionCreate(SQLModel):
    """Create new KPI definition"""
    label: str
    description: Optional[str] = None
    target_value: Optional[int] = None
    target_weekly: Optional[int] = None
    target_monthly: Optional[int] = None
    target_quarterly: Optional[int] = None


class KPIDefinitionUpdate(SQLModel):
    """Update KPI definition"""
    label: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[int] = None
    target_weekly: Optional[int] = None
    target_monthly: Optional[int] = None
    target_quarterly: Optional[int] = None
    is_active: Optional[bool] = None


class KPIDefinitionResponse(SQLModel):
    """KPI definition response"""
    id: UUID
    label: str
    description: Optional[str]
    target_value: Optional[int]
    target_weekly: Optional[int]
    target_monthly: Optional[int]
    target_quarterly: Optional[int]
    display_order: int
    is_active: bool


class KPIEntryCreate(SQLModel):
    """Create/update KPI entry"""
    kpi_definition_id: UUID
    date: datetime.date
    value: int
    notes: Optional[str] = None


class KPIEntryBulk(SQLModel):
    """Bulk entry submission"""
    date: datetime.date
    entries: List[dict]  # [{kpi_definition_id, value, notes?}]


class KPIEntryResponse(SQLModel):
    """KPI entry response"""
    id: UUID
    kpi_definition_id: UUID
    kpi_label: str
    date: datetime.date
    value: int
    target: Optional[int]
    notes: Optional[str]


class KPIAnalytics(SQLModel):
    """Analytics response"""
    period: str
    kpis: List[dict]
    conversion_rates: Optional[dict] = None


class TemplateResponse(SQLModel):
    """Template response"""
    id: UUID
    name: str
    description: Optional[str]
    is_default: bool
    kpis: List[dict]


class KPIReportRequest(SQLModel):
    """Request for generating an end-of-period report"""
    period: str = "week"  # week, month
    user_id: Optional[str] = None


class KPIReportResponse(SQLModel):
    """AI-generated end-of-period report"""
    period: str
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    action_plan: List[str]
    score: int  # 0-100 performance score


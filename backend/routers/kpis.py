"""
KPI Tracker API Router
Handles all KPI-related endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date, datetime, timedelta
from uuid import UUID

from models.kpi import (
    KPIDefinition, KPIEntry, KPITemplate, TemplateKPI,
    KPIDefinitionCreate, KPIDefinitionUpdate, KPIDefinitionResponse,
    KPIEntryCreate, KPIEntryBulk, KPIEntryResponse,
    KPIAnalytics, TemplateResponse
)
from database import get_session

router = APIRouter()


# Helper function to get user_id from header or default
async def get_user_id(x_user_id: Optional[str] = Header(None)) -> str:
    """Get user ID from header or use default for testing"""
    return x_user_id or "test_user"


# ============================================================================
# KPI DEFINITIONS ENDPOINTS
# ============================================================================

@router.get("/api/v1/kpis/definitions", response_model=List[KPIDefinitionResponse])
async def get_kpi_definitions(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Get all KPI definitions for current user"""
    statement = select(KPIDefinition).where(
        KPIDefinition.user_id == user_id,
        KPIDefinition.is_active == True
    ).order_by(KPIDefinition.display_order)
    
    definitions = session.exec(statement).all()
    
    return [
        KPIDefinitionResponse(
            id=d.id,
            label=d.label,
            description=d.description,
            target_value=d.target_value,
            target_weekly=d.target_weekly,
            target_monthly=d.target_monthly,
            target_quarterly=d.target_quarterly,
            display_order=d.display_order,
            is_active=d.is_active
        )
        for d in definitions
    ]


@router.post("/api/v1/kpis/definitions", response_model=KPIDefinitionResponse)
async def create_kpi_definition(
    kpi: KPIDefinitionCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Create new KPI definition"""
    # Get max display_order for user
    statement = select(KPIDefinition).where(
        KPIDefinition.user_id == user_id
    ).order_by(KPIDefinition.display_order.desc())
    
    last_kpi = session.exec(statement).first()
    next_order = (last_kpi.display_order + 1) if last_kpi else 0
    
    # Create new KPI
    new_kpi = KPIDefinition(
        user_id=user_id,
        label=kpi.label,
        description=kpi.description,
        target_value=kpi.target_value,
        target_weekly=kpi.target_weekly,
        target_monthly=kpi.target_monthly,
        target_quarterly=kpi.target_quarterly,
        display_order=next_order
    )
    
    session.add(new_kpi)
    session.commit()
    session.refresh(new_kpi)
    
    return KPIDefinitionResponse(
        id=new_kpi.id,
        label=new_kpi.label,
        description=new_kpi.description,
        target_value=new_kpi.target_value,
        target_weekly=new_kpi.target_weekly,
        target_monthly=new_kpi.target_monthly,
        target_quarterly=new_kpi.target_quarterly,
        display_order=new_kpi.display_order,
        is_active=new_kpi.is_active
    )


@router.put("/api/v1/kpis/definitions/{kpi_id}", response_model=KPIDefinitionResponse)
async def update_kpi_definition(
    kpi_id: UUID,
    kpi_update: KPIDefinitionUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Update KPI definition"""
    statement = select(KPIDefinition).where(
        KPIDefinition.id == kpi_id,
        KPIDefinition.user_id == user_id
    )
    
    kpi = session.exec(statement).first()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    
    # Update fields
    if kpi_update.label is not None:
        kpi.label = kpi_update.label
    if kpi_update.description is not None:
        kpi.description = kpi_update.description
    if kpi_update.target_value is not None:
        kpi.target_value = kpi_update.target_value
    if kpi_update.target_weekly is not None:
        kpi.target_weekly = kpi_update.target_weekly
    if kpi_update.target_monthly is not None:
        kpi.target_monthly = kpi_update.target_monthly
    if kpi_update.target_quarterly is not None:
        kpi.target_quarterly = kpi_update.target_quarterly
    if kpi_update.is_active is not None:
        kpi.is_active = kpi_update.is_active
    
    kpi.updated_at = datetime.utcnow()
    
    session.add(kpi)
    session.commit()
    session.refresh(kpi)
    
    return KPIDefinitionResponse(
        id=kpi.id,
        label=kpi.label,
        description=kpi.description,
        target_value=kpi.target_value,
        target_weekly=kpi.target_weekly,
        target_monthly=kpi.target_monthly,
        target_quarterly=kpi.target_quarterly,
        display_order=kpi.display_order,
        is_active=kpi.is_active
    )


@router.delete("/api/v1/kpis/definitions/{kpi_id}")
async def delete_kpi_definition(
    kpi_id: UUID,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Delete KPI definition (soft delete)"""
    statement = select(KPIDefinition).where(
        KPIDefinition.id == kpi_id,
        KPIDefinition.user_id == user_id
    )
    
    kpi = session.exec(statement).first()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    
    # Soft delete
    kpi.is_active = False
    kpi.updated_at = datetime.utcnow()
    
    session.add(kpi)
    session.commit()
    
    return {"message": "KPI deleted successfully"}


@router.put("/api/v1/kpis/definitions/reorder")
async def reorder_kpis(
    order: List[UUID],
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Reorder KPIs"""
    for index, kpi_id in enumerate(order):
        statement = select(KPIDefinition).where(
            KPIDefinition.id == kpi_id,
            KPIDefinition.user_id == user_id
        )
        
        kpi = session.exec(statement).first()
        if kpi:
            kpi.display_order = index
            kpi.updated_at = datetime.utcnow()
            session.add(kpi)
    
    session.commit()
    return {"message": "KPIs reordered successfully"}


# ============================================================================
# KPI ENTRIES ENDPOINTS
# ============================================================================

@router.get("/api/v1/kpis/entries", response_model=List[KPIEntryResponse])
async def get_kpi_entries(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Get KPI entries for date range"""
    # Default to last 30 days
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    statement = select(KPIEntry, KPIDefinition).join(
        KPIDefinition, KPIEntry.kpi_definition_id == KPIDefinition.id
    ).where(
        KPIEntry.user_id == user_id,
        KPIEntry.date >= start_date,
        KPIEntry.date <= end_date
    ).order_by(KPIEntry.date.desc())
    
    results = session.exec(statement).all()
    
    return [
        KPIEntryResponse(
            id=entry.id,
            kpi_definition_id=entry.kpi_definition_id,
            kpi_label=definition.label,
            date=entry.date,
            value=entry.value,
            target=definition.target_value,
            notes=entry.notes
        )
        for entry, definition in results
    ]


@router.post("/api/v1/kpis/entries", response_model=KPIEntryResponse)
async def create_or_update_entry(
    entry_data: KPIEntryCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Create or update KPI entry"""
    # Check if entry exists
    statement = select(KPIEntry).where(
        KPIEntry.user_id == user_id,
        KPIEntry.kpi_definition_id == entry_data.kpi_definition_id,
        KPIEntry.date == entry_data.date
    )
    
    existing_entry = session.exec(statement).first()
    
    if existing_entry:
        # Update existing
        existing_entry.value = entry_data.value
        existing_entry.notes = entry_data.notes
        existing_entry.updated_at = datetime.utcnow()
        session.add(existing_entry)
        entry = existing_entry
    else:
        # Create new
        entry = KPIEntry(
            user_id=user_id,
            kpi_definition_id=entry_data.kpi_definition_id,
            date=entry_data.date,
            value=entry_data.value,
            notes=entry_data.notes
        )
        session.add(entry)
    
    session.commit()
    session.refresh(entry)
    
    # Get KPI definition for response
    kpi_def = session.get(KPIDefinition, entry.kpi_definition_id)
    
    return KPIEntryResponse(
        id=entry.id,
        kpi_definition_id=entry.kpi_definition_id,
        kpi_label=kpi_def.label,
        date=entry.date,
        value=entry.value,
        target=kpi_def.target_value,
        notes=entry.notes
    )


@router.post("/api/v1/kpis/entries/bulk")
async def bulk_create_entries(
    bulk_data: KPIEntryBulk,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Bulk create/update entries for a date"""
    created_count = 0
    updated_count = 0
    
    for entry_dict in bulk_data.entries:
        kpi_id = UUID(entry_dict["kpi_definition_id"])
        value = entry_dict["value"]
        notes = entry_dict.get("notes")
        
        # Check if exists
        statement = select(KPIEntry).where(
            KPIEntry.user_id == user_id,
            KPIEntry.kpi_definition_id == kpi_id,
            KPIEntry.date == bulk_data.date
        )
        
        existing = session.exec(statement).first()
        
        if existing:
            existing.value = value
            existing.notes = notes
            existing.updated_at = datetime.utcnow()
            session.add(existing)
            updated_count += 1
        else:
            new_entry = KPIEntry(
                user_id=user_id,
                kpi_definition_id=kpi_id,
                date=bulk_data.date,
                value=value,
                notes=notes
            )
            session.add(new_entry)
            created_count += 1
    
    session.commit()
    
    return {
        "message": "Entries saved successfully",
        "created": created_count,
        "updated": updated_count
    }


# ============================================================================
# ANALYTICS ENDPOINT
# ============================================================================

@router.get("/api/v1/kpis/analytics", response_model=KPIAnalytics)
async def get_analytics(
    period: str = "week",  # week, month, year
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Get KPI analytics for period"""
    # Calculate date range
    end_date = date.today()
    if period == "week":
        start_date = end_date - timedelta(days=7)
    elif period == "month":
        start_date = end_date - timedelta(days=30)
    else:  # year
        start_date = end_date - timedelta(days=365)
    
    # Get all KPI definitions
    kpi_defs = session.exec(
        select(KPIDefinition).where(
            KPIDefinition.user_id == user_id,
            KPIDefinition.is_active == True
        ).order_by(KPIDefinition.display_order)
    ).all()
    
    kpi_analytics = []
    
    for kpi_def in kpi_defs:
        # Get entries for this KPI
        entries = session.exec(
            select(KPIEntry).where(
                KPIEntry.kpi_definition_id == kpi_def.id,
                KPIEntry.date >= start_date,
                KPIEntry.date <= end_date
            ).order_by(KPIEntry.date)
        ).all()
        
        # Calculate totals even if no entries (totals will be 0)
        total = sum(e.value for e in entries)
        average = total / len(entries) if entries else 0
        daily_values = [e.value for e in entries]
        
        # Calculate trend
        mid_point = len(daily_values) // 2
        if mid_point > 0:
            first_half_avg = sum(daily_values[:mid_point]) / mid_point
            second_half_avg = sum(daily_values[mid_point:]) / (len(daily_values) - mid_point)
            trend = "up" if second_half_avg > first_half_avg else "down"
        else:
            trend = "stable"
        
        # Determine Period Target
        period_target = None
        if period == "week":
            period_target = kpi_def.target_weekly
            if not period_target and kpi_def.target_value:
                 period_target = kpi_def.target_value * 5 # Fallback to 5 days
        elif period == "month":
            period_target = kpi_def.target_monthly
            if not period_target and kpi_def.target_value:
                 period_target = kpi_def.target_value * 21 # Fallback to 21 days
        elif period == "quarter":
            period_target = kpi_def.target_quarterly
            if not period_target and kpi_def.target_value:
                 period_target = kpi_def.target_value * 63 # Fallback
        
        # Achievement calculation
        achievement = 0
        if period_target:
            achievement = min(round((total / period_target * 100), 1), 999) # Cap at 999% to avoid huge numbers
        
        kpi_analytics.append({
            "label": kpi_def.label,
            "total": total,
            "average": round(average, 1),
            "target": period_target, # This is the target FOR THIS PERIOD
            "daily_target": kpi_def.target_value,
            "target_weekly": kpi_def.target_weekly,
            "target_monthly": kpi_def.target_monthly,
            "target_quarterly": kpi_def.target_quarterly,
            "achievement": achievement,
            "trend": trend,
            "daily_values": daily_values
        })
    
    # Calculate Conversion Rates
    # Loosely match standard solar funnel steps
    # Signals = Leads
    # Locks = Appointments/Sets
    # Acquisitions = Sales/Closes
    
    funnel_metrics = {
        "signals": 0,
        "locks": 0,
        "acquisitions": 0
    }
    
    for kpi in kpi_analytics:
        label = kpi["label"].lower()
        if "lead" in label or "signal" in label or "knock" in label:
            funnel_metrics["signals"] += kpi["total"]
        elif "app" in label or "set" in label or "lock" in label or "sit" in label:
            funnel_metrics["locks"] += kpi["total"]
        elif "close" in label or "sale" in label or "acquisition" in label or "install" in label:
            funnel_metrics["acquisitions"] += kpi["total"]
            
    # Calculate Rates
    conversion_rates = {
        "signal_to_lock": 0,
        "lock_to_acquisition": 0,
        "signal_to_acquisition": 0
    }
    
    if funnel_metrics["signals"] > 0:
        conversion_rates["signal_to_lock"] = round((funnel_metrics["locks"] / funnel_metrics["signals"]) * 100, 1)
        conversion_rates["signal_to_acquisition"] = round((funnel_metrics["acquisitions"] / funnel_metrics["signals"]) * 100, 1)
        
    if funnel_metrics["locks"] > 0:
        conversion_rates["lock_to_acquisition"] = round((funnel_metrics["acquisitions"] / funnel_metrics["locks"]) * 100, 1)

    return KPIAnalytics(
        period=f"{start_date} to {end_date}",
        kpis=kpi_analytics,
        conversion_rates=conversion_rates
    )


# ============================================================================
# TEMPLATES ENDPOINTS
# ============================================================================

@router.get("/api/v1/kpis/templates", response_model=List[TemplateResponse])
async def get_templates(session: Session = Depends(get_session)):
    """Get all KPI templates"""
    templates = session.exec(select(KPITemplate)).all()
    
    result = []
    for template in templates:
        template_kpis = session.exec(
            select(TemplateKPI).where(
                TemplateKPI.template_id == template.id
            ).order_by(TemplateKPI.display_order)
        ).all()
        
        result.append(TemplateResponse(
            id=template.id,
            name=template.name,
            description=template.description,
            is_default=template.is_default,
            kpis=[
                {
                    "label": kpi.label,
                    "description": kpi.description,
                    "target_value": kpi.target_value
                }
                for kpi in template_kpis
            ]
        ))
    
    return result


@router.post("/api/v1/kpis/templates/{template_id}/apply")
async def apply_template(
    template_id: UUID,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Apply template to user (creates KPI definitions)"""
    # Get template KPIs
    template_kpis = session.exec(
        select(TemplateKPI).where(
            TemplateKPI.template_id == template_id
        ).order_by(TemplateKPI.display_order)
    ).all()
    
    if not template_kpis:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Create KPI definitions for user
    created_count = 0
    
    # Get existing KPIs to check for duplicates
    existing_kpis = session.exec(
        select(KPIDefinition).where(KPIDefinition.user_id == user_id)
    ).all()
    existing_labels = {k.label.lower() for k in existing_kpis}

    for template_kpi in template_kpis:
        if template_kpi.label.lower() in existing_labels:
            continue

        new_kpi = KPIDefinition(
            user_id=user_id,
            label=template_kpi.label,
            description=template_kpi.description,
            target_value=template_kpi.target_value,
            display_order=template_kpi.display_order
        )
        session.add(new_kpi)
        created_count += 1
    
    session.commit()
    
    return {
        "message": f"Template applied successfully",
        "kpis_created": created_count
    }


# ============================================================================
# REPORT GENERATION ENDPOINT
# ============================================================================

from models.kpi import KPIReportRequest, KPIReportResponse
from openai import AsyncOpenAI
import json
import os

# Client for Report Generation (reuse or create new)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/api/v1/kpis/report", response_model=KPIReportResponse)
async def generate_kpi_report(
    request: KPIReportRequest,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_user_id)
):
    """Generate comprehensive AI performance report"""
    
    # 1. Get Analytics Data
    analytics = await get_analytics(
        period=request.period,
        session=session,
        user_id=user_id
    )
    
    # 2. Format Data for AI
    kpi_summary = "\n".join([
        f"- {k['label']}: {k['total']} (Target: {k['target'] or 'N/A'}) - Achievement: {k['achievement']}%" 
        for k in analytics.kpis
    ])
    
    conversion_summary = "N/A"
    if analytics.conversion_rates:
        conversion_summary = "\n".join([
            f"- {k.replace('_', ' ').title()}: {v}%" 
            for k, v in analytics.conversion_rates.items()
        ])
    
    # 3. Create Prompt
    prompt = f"""
    You are an expert Sales Manager generating an end-of-period report for a solar sales representative.
    
    PERIOD: {request.period.upper()}
    
    KPI DATA:
    {kpi_summary}
    
    CONVERSION RATES:
    {conversion_summary}
    
    TASK:
    Analyze the data and provide a performance report in JSON format.
    
    GUIDELINES:
    - Identify 2-3 clear STRENGTHS based on high achievement or good conversion.
    - Identify 2-3 WEAKNESSES or bottlenecks (e.g., high leads but low closing).
    - Create a specific ACTION PLAN (3-4 bullet points) to improve next week.
    - Assign a PERFORMANCE SCORE (0-100) based on overall target achievement.
    - Write a brief SUMMARY (2-3 sentences) of their performance.
    
    JSON FORMAT:
    {{
        "period": "{request.period}",
        "summary": "...",
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "action_plan": ["...", "..."],
        "score": 0-100
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful sales manager. Respond only in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        return KPIReportResponse(
            period=request.period,
            summary=result.get("summary", "Analysis failed."),
            strengths=result.get("strengths", []),
            weaknesses=result.get("weaknesses", []),
            action_plan=result.get("action_plan", []),
            score=result.get("score", 0)
        )
        
    except Exception as e:
        print(f"Report Generation Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate report")

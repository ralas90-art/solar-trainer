import os
import stripe
from fastapi import APIRouter, Header, Request, HTTPException, Depends
from sqlmodel import Session, select
from models.user import Company, PlanTier
from database import get_session
from typing import Optional
from middleware.auth import get_current_membership

from services.billing import BillingService
from models.user import Membership, AIUsageLog
from llm_client import LLMClient
from datetime import datetime
from sqlmodel import func

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.get("/status")
async def get_billing_status(
    membership: Membership = Depends(get_current_membership),
    session: Session = Depends(get_session)
):
    """Returns current plan, limits, and usage stats."""
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # 1. Count Simulations this month
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    sim_count_stmt = select(func.count(AIUsageLog.id)).where(
        AIUsageLog.company_id == company.id,
        AIUsageLog.created_at >= start_of_month,
        AIUsageLog.status == "success"
    )
    sim_usage = session.exec(sim_count_stmt).first() or 0

    # 2. Count Reps
    rep_count_stmt = select(func.count(Membership.id)).where(
        Membership.company_id == company.id
    )
    rep_usage = session.exec(rep_count_stmt).first() or 0

    return {
        "plan_name": company.plan_tier,
        "subscription_status": company.subscription_status,
        "usage": {
            "simulations": {
                "used": sim_usage,
                "limit": company.monthly_sim_limit
            },
            "reps": {
                "used": rep_usage,
                "limit": company.max_rep_limit
            }
        },
        "features": {
            "custom_keys": company.allow_custom_keys,
            "whitelabel": company.allow_whitelabel,
            "analytics": company.allow_manager_dashboard
        }
    }

@router.post("/create-portal-session")
async def create_portal_session(
    membership: Membership = Depends(get_current_membership),
    session: Session = Depends(get_session)
):
    """Creates a Stripe Customer Portal session for subscription management."""
    company = session.get(Company, membership.company_id)
    if not company or not company.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No active Stripe customer found for this company.")

    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=company.stripe_customer_id,
            return_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/settings/billing",
        )
        return {"url": portal_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-checkout-session")
async def create_checkout_session(
    tier: PlanTier,
    membership: Membership = Depends(get_current_membership),
    session: Session = Depends(get_session)
):
    """Creates a Stripe Checkout session for a new subscription."""
    company = session.get(Company, membership.company_id)
    
    # Map Tiers to Price IDs from env
    price_map = {
        PlanTier.STARTER: os.getenv("STRIPE_PRICE_STARTER"),
        PlanTier.GROWTH: os.getenv("STRIPE_PRICE_GROWTH"),
        PlanTier.ENTERPRISE: os.getenv("STRIPE_PRICE_ENTERPRISE")
    }
    
    price_id = price_map.get(tier)
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan tier or price not configured.")

    try:
        checkout_session = stripe.checkout.Session.create(
            customer=company.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/settings/billing?success=true",
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/settings/billing?canceled=true",
            metadata={"company_id": company.id, "tier": tier}
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

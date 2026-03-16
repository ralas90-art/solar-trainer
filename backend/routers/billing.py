import os
import stripe
from fastapi import APIRouter, Header, Request, HTTPException, Depends
from sqlmodel import Session, select
from models.user import Company, PlanTier
from database import get_session
from typing import Optional

router = APIRouter(prefix="/billing", tags=["billing"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# Mapping PlanTier to Stripe Price IDs
# We now use a dictionary for Base (Platform) and Rep fees
PRICE_IDS = {
    PlanTier.STARTER: {
        "base": os.getenv("STRIPE_PRICE_STARTER_BASE"),
        "rep": os.getenv("STRIPE_PRICE_STARTER_REP")
    },
    PlanTier.GROWTH: {
        "base": os.getenv("STRIPE_PRICE_GROWTH_BASE"),
        "rep": os.getenv("STRIPE_PRICE_GROWTH_REP")
    }
}

@router.post("/create-checkout-session")
async def create_checkout_session(
    company_id: str,
    tier: PlanTier,
    rep_count: int = 1, # Default to 1 if not specified
    session: Session = Depends(get_session)
):
    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    plan_prices = PRICE_IDS.get(tier)
    if not plan_prices or not plan_prices["base"] or not plan_prices["rep"]:
        raise HTTPException(status_code=400, detail="Price IDs not configured for this tier")

    try:
        line_items = [
            {
                "price": plan_prices["base"],
                "quantity": 1,
            },
            {
                "price": plan_prices["rep"],
                "quantity": rep_count,
            }
        ]
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/payment/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/payment/cancel",
            client_reference_id=company_id,
            metadata={
                "company_id": company_id,
                "tier": tier
            }
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    session: Session = Depends(get_session)
):
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook Error: {str(e)}")

    if event["type"] == "checkout.session.completed":
        checkout_session = event["data"]["object"]
        company_id = checkout_session.get("client_reference_id")
        stripe_customer_id = checkout_session.get("customer")
        stripe_subscription_id = checkout_session.get("subscription")
        
        tier = checkout_session.get("metadata", {}).get("tier")

        if company_id:
            company = session.get(Company, company_id)
            if company:
                company.stripe_customer_id = stripe_customer_id
                company.stripe_subscription_id = stripe_subscription_id
                company.payment_status = "active"
                if tier:
                    company.plan_tier = tier
                session.add(company)
                session.commit()
                print(f"✅ Payment completed for company: {company_id}")

    elif event["type"] == "invoice.payment_failed":
        # Handle failed payment
        invoice = event["data"]["object"]
        stripe_customer_id = invoice.get("customer")
        
        statement = select(Company).where(Company.stripe_customer_id == stripe_customer_id)
        company = session.exec(statement).first()
        if company:
            company.payment_status = "past_due"
            session.add(company)
            session.commit()
            print(f"❌ Payment failed for company: {company.id}")

    elif event["type"] == "customer.subscription.deleted":
        # Handle subscription cancellation
        subscription = event["data"]["object"]
        stripe_subscription_id = subscription.get("id")
        
        statement = select(Company).where(Company.stripe_subscription_id == stripe_subscription_id)
        company = session.exec(statement).first()
        if company:
            company.payment_status = "canceled"
            session.add(company)
            session.commit()
            print(f"🚫 Subscription canceled for company: {company.id}")

    return {"status": "success"}

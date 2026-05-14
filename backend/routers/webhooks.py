from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlmodel import Session, select
import stripe
import os
from database import get_session
from models.user import Company, PlanTier
from services.billing import BillingService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])

# Stripe Configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_test_mock")

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    """
    Stripe webhook handler for subscription events.
    """
    payload = await request.body()
    sig_header = stripe_signature

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'customer.subscription.created':
        subscription = event['data']['object']
        await handle_subscription_change(subscription)
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        await handle_subscription_change(subscription)
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        await handle_subscription_change(subscription)
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        await handle_payment_failure(invoice)

    return {"status": "success"}

async def handle_subscription_change(subscription):
    """Updates company plan and status based on Stripe subscription."""
    customer_id = subscription.get('customer')
    stripe_sub_id = subscription.get('id')
    status = subscription.get('status') # active, past_due, canceled, etc.
    
    # Map Stripe Price ID to PlanTier (Example mapping)
    # In a real app, you'd look up the price_id in a registry
    price_id = subscription['items']['data'][0]['price']['id']
    
    plan_map = {
        os.getenv("STRIPE_PRICE_STARTER"): PlanTier.STARTER,
        os.getenv("STRIPE_PRICE_GROWTH"): PlanTier.GROWTH,
        os.getenv("STRIPE_PRICE_ENTERPRISE"): PlanTier.ENTERPRISE
    }
    
    plan_tier = plan_map.get(price_id, PlanTier.STARTER)
    
    from database import engine
    with Session(engine) as session:
        statement = select(Company).where(Company.stripe_customer_id == customer_id)
        company = session.exec(statement).first()
        
        if company:
            company.subscription_status = status
            company.stripe_subscription_id = stripe_sub_id
            
            # Update limits if status is active
            if status in ["active", "trialing"]:
                BillingService.update_company_plan(company, plan_tier, session)
            else:
                # If canceled/past_due, we might want to downgrade limits 
                # but let's keep them until period end or explicit logic
                company.subscription_status = status
                session.add(company)
                session.commit()
            
            logger.info(f"Updated company {company.id} status to {status}")

async def handle_payment_failure(invoice):
    """Handles payment failure by marking company status as past_due."""
    customer_id = invoice.get('customer')
    
    from database import engine
    with Session(engine) as session:
        statement = select(Company).where(Company.stripe_customer_id == customer_id)
        company = session.exec(statement).first()
        if company:
            company.subscription_status = "past_due"
            session.add(company)
            session.commit()
            logger.warning(f"Payment failed for company {company.id}")

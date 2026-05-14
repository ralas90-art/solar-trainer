from typing import Dict, Any, Tuple
from sqlmodel import Session, select, func
from models.user import Company, PlanTier, AIUsageLog, Membership
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Plan Configurations
PLAN_CONFIGS = {
    PlanTier.STARTER: {
        "monthly_sim_limit": 50,
        "max_rep_limit": 3,
        "allow_custom_keys": False,
        "allow_whitelabel": True, # Basic
        "allow_manager_dashboard": False
    },
    PlanTier.GROWTH: {
        "monthly_sim_limit": 250,
        "max_rep_limit": 15,
        "allow_custom_keys": True,
        "allow_whitelabel": True,
        "allow_manager_dashboard": True
    },
    PlanTier.ENTERPRISE: {
        "monthly_sim_limit": 10000, # Effectively unlimited
        "max_rep_limit": 100,
        "allow_custom_keys": True,
        "allow_whitelabel": True,
        "allow_manager_dashboard": True
    }
}

class BillingService:
    @staticmethod
    def get_plan_limits(plan_tier: PlanTier) -> Dict[str, Any]:
        return PLAN_CONFIGS.get(plan_tier, PLAN_CONFIGS[PlanTier.STARTER])

    @staticmethod
    def check_simulation_limit(company: Company, session: Session) -> Tuple[bool, str]:
        """Checks if the company has reached its monthly AI simulation limit."""
        
        # 1. Check subscription status
        if company.subscription_status in ["canceled", "unpaid"]:
            return False, f"Subscription is {company.subscription_status}. Please update billing."

        # 2. Count simulations this month
        start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        statement = select(func.count(AIUsageLog.id)).where(
            AIUsageLog.company_id == company.id,
            AIUsageLog.created_at >= start_of_month,
            AIUsageLog.status == "success"
        )
        usage_count = session.exec(statement).first() or 0
        
        if usage_count >= company.monthly_sim_limit:
            return False, f"Monthly simulation limit reached ({company.monthly_sim_limit}). Upgrade your plan to continue."
        
        return True, "Limit check passed"

    @staticmethod
    def check_rep_limit(company: Company, session: Session) -> Tuple[bool, str]:
        """Checks if the company has reached its maximum representative limit."""
        
        statement = select(func.count(Membership.id)).where(
            Membership.company_id == company.id
        )
        rep_count = session.exec(statement).first() or 0
        
        if rep_count >= company.max_rep_limit:
            return False, f"Maximum representative limit reached ({company.max_rep_limit}). Upgrade your plan to invite more reps."
        
        return True, "Limit check passed"

    @staticmethod
    def update_company_plan(company: Company, plan_tier: PlanTier, session: Session):
        """Updates a company's plan and syncs limits."""
        limits = BillingService.get_plan_limits(plan_tier)
        
        company.plan_tier = plan_tier
        company.monthly_sim_limit = limits["monthly_sim_limit"]
        company.max_rep_limit = limits["max_rep_limit"]
        company.allow_custom_keys = limits["allow_custom_keys"]
        company.allow_whitelabel = limits["allow_whitelabel"]
        company.allow_manager_dashboard = limits["allow_manager_dashboard"]
        
        session.add(company)
        session.commit()
        logger.info(f"Company {company.id} updated to {plan_tier} plan.")

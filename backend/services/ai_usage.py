from typing import Optional, Dict
from models.user import AIUsageLog
from database import engine
from sqlmodel import Session
from uuid import UUID
import logging

# Pricing Registry (Per 1k tokens)
# Note: These are example prices, update with live rates as needed.
PRICING_REGISTRY = {
    "gpt-4o": {
        "input": 0.005,
        "output": 0.015
    },
    "gpt-4-turbo": {
        "input": 0.01,
        "output": 0.03
    },
    "gpt-3.5-turbo": {
        "input": 0.0005,
        "output": 0.0015
    }
}

class AIUsageService:
    @staticmethod
    def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
        """Calculates estimated cost based on model and token counts."""
        pricing = PRICING_REGISTRY.get(model, PRICING_REGISTRY["gpt-4o"]) # Default to 4o
        input_cost = (input_tokens / 1000) * pricing["input"]
        output_cost = (output_tokens / 1000) * pricing["output"]
        return round(input_cost + output_cost, 6)

    @staticmethod
    def log_usage(
        company_id: str,
        user_id: Optional[UUID],
        provider: str,
        model: Optional[str] = "gpt-4o",
        input_tokens: int = 0,
        output_tokens: int = 0,
        session_id: Optional[str] = None,
        status: str = "success",
        error_category: Optional[str] = None
    ):
        """Logs AI usage to the database."""
        try:
            total_tokens = input_tokens + output_tokens
            estimated_cost = 0.0
            
            if status == "success" and model:
                estimated_cost = AIUsageService.calculate_cost(model, input_tokens, output_tokens)

            log_entry = AIUsageLog(
                company_id=company_id,
                user_id=user_id,
                session_id=session_id,
                provider=provider,
                model=model,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                total_tokens=total_tokens,
                estimated_cost=estimated_cost,
                status=status,
                error_category=error_category
            )

            with Session(engine) as session:
                session.add(log_entry)
                session.commit()
        except Exception as e:
            # We never want usage logging to crash the main request flow
            logging.error(f"Failed to log AI usage: {e}")

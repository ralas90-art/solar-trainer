import os
import json
from openai import OpenAI
from models import StateProfile, Scenario
from models.user import Company
from services.whitelabel_engine import WhiteLabelEngine
from services.ai_context import AIContextService
from services.ai_keys import decrypt_key
from services.ai_usage import AIUsageService
from uuid import UUID
from typing import Optional

# Platform Default Client
try:
    default_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except:
    default_client = None

class LLMClient:
    def get_client(self, company: Company) -> OpenAI:
        """Returns the appropriate OpenAI client (Company custom vs Platform default)."""
        if company.use_custom_ai_keys:
            custom_key = decrypt_key(company.openai_api_key_encrypted)
            if custom_key:
                return OpenAI(api_key=custom_key)
        return default_client

    def evaluate_submission(
        self, 
        user_text: str, 
        state: StateProfile, 
        scenario: Scenario, 
        company: Company,
        user_id: Optional[UUID] = None,
        session_id: Optional[str] = None,
        language: str = "en"
    ) -> str:
        """
        Sends the interaction to the LLM to get a critique and score.
        Renders prompt with WhiteLabelEngine and logs usage.
        """
        
        raw_system_prompt = f"""
You are an expert Solar Sales Manager and Roleplay Partner.

CONTEXT:
- Scenario: {scenario.name} ("{scenario.description}")
- State: {state.name} (Context only. Do NOT mention specific regulations like NEM 3.0 unless the User brings them up.)
- Objective: {scenario.briefing}
- Language: {language}

TASK:
Evaluate the Rep's response to the customer's objection: "{scenario.opening_line}"

EVALUATION FRAMEWORK (The "A.R.T." of Sales):
1. Acknowledge: Did they validate the customer's feeling? (e.g., "I understand how you feel...")
2. Respond: Did they directly address the concern with logic or value? (Using {{company_name}} standards)
3. Transition: Did they end with a question to keep control? (e.g., "Does that make sense?")

STRICT RULES:
- If the Rep mentions "{{crm_name}}" or "{{proposal_tool}}", ensure they use the correct terminology.
- The "better_response" must use {{company_name}} branding and terminology.
- If the Rep misses the "Transition", fail them.
- The "better_response" must be natural, conversational, and follow the A.R.T. framework.

IMPORTANT: YOU MUST RETURN VALID JSON.

JSON FORMAT:
{{
    "pass": boolean,
    "score": integer (0-100),
    "critique": "string (< 50 words). Focus on what part of A.R.T. they missed.",
    "better_response": "string (The perfect A.R.T. response).",
    "agent_message": "string (Short feedback as the coach).",
    "summary": "string (A brief 1-2 sentence summary of the interaction).",
    "pros": ["string", "string"], 
    "cons": ["string", "string"]
}}
"""
        
        # 1. Render prompt with WhiteLabelEngine
        rendered_prompt = WhiteLabelEngine.render_content(raw_system_prompt, company)
        
        # 2. Inject Company Context
        final_system_prompt = AIContextService.inject_context(rendered_prompt, company)

        # 3. Get Client
        client = self.get_client(company)
        if not client:
            error_msg = "AI Client not configured."
            AIUsageService.log_usage(
                company_id=company.id, user_id=user_id, provider="openai", 
                status="failed", error_category="auth"
            )
            return json.dumps({"pass": False, "critique": error_msg, "agent_message": "System Offline."})

        model = "gpt-4o"
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": final_system_prompt},
                    {"role": "user", "content": f"REP RESPONSE: {user_text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            
            # 4. Log Usage
            AIUsageService.log_usage(
                company_id=company.id,
                user_id=user_id,
                session_id=session_id,
                provider="openai",
                model=model,
                input_tokens=response.usage.prompt_tokens,
                output_tokens=response.usage.completion_tokens,
                status="success"
            )
            
            return content
        except Exception as e:
            print(f"LLM Error: {e}")
            # Log Failure
            AIUsageService.log_usage(
                company_id=company.id,
                user_id=user_id,
                session_id=session_id,
                provider="openai",
                model=model,
                status="failed",
                error_category="api_error"
            )
            return json.dumps({"pass": False, "critique": "Error connecting to AI.", "agent_message": "System Offline."})

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session, select
from database import get_session
from middleware.auth import get_current_membership
from models.user import Membership, Company
from services.whitelabel_engine import WhiteLabelEngine
from services.ai_context import AIContextService
from services.ai_keys import decrypt_key
from services.billing import BillingService

router = APIRouter()

class VapiAssistantRequest(BaseModel):
    name: Optional[str] = "Solar Homeowner"
    model_provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"
    first_message: Optional[str] = "Hello? Who is this?"
    system_prompt: str

@router.post("/api/v1/vapi/assistant")
async def create_vapi_assistant(
    request: VapiAssistantRequest,
    membership: Membership = Depends(get_current_membership),
    session: Session = Depends(get_session)
):
    """
    Returns a configured Assistant JSON that the Frontend can pass to Vapi.start()
    Renders prompts through the WhiteLabelEngine and injects company context.
    """
    
    # Fetch company
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # 0. Check Billing Limits
    can_sim, reason = BillingService.check_simulation_limit(company, session)
    if not can_sim:
        raise HTTPException(
            status_code=403, 
            detail={
                "message": f"Simulation blocked: {reason}",
                "category": "billing_limit"
            }
        )

    # 1. Render prompts through WhiteLabelEngine
    rendered_system_prompt = WhiteLabelEngine.render_content(request.system_prompt, company)
    rendered_first_message = WhiteLabelEngine.render_content(request.first_message, company)

    # 2. Inject Company Context Block
    final_system_prompt = AIContextService.inject_context(rendered_system_prompt, company)

    # 3. Resolve OpenAI API Key (if company uses custom keys)
    openai_api_key = None
    if company.use_custom_ai_keys:
        openai_api_key = decrypt_key(company.openai_api_key_encrypted)

    # Construct the ephemeral assistant config
    assistant_config = {
        "model": {
            "provider": request.model_provider,
            "model": request.model,
            "messages": [
                {
                    "role": "system",
                    "content": final_system_prompt
                }
            ],
            "temperature": 0.7,
        },
        "voice": {
            "provider": "11labs",
            "voiceId": request.voice_id,
        },
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-2",
            "language": "en-US",
            "smartFormat": True,
        },
        "silenceTimeoutSeconds": 30,
        "responseDelaySeconds": 0.4,
        "llmRequestDelaySeconds": 0.1,
        "name": WhiteLabelEngine.render_content(request.name, company),
        "firstMessage": rendered_first_message,
        "firstMessageMode": "assistant-speaks-first",
        "recordingEnabled": False
    }

    # If custom key exists, pass it to Vapi so it uses the tenant's OpenAI account
    if openai_api_key:
        assistant_config["model"]["apiKey"] = openai_api_key

    return assistant_config

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
from typing import Optional
from sqlmodel import Session
from database import get_session

router = APIRouter()

class VapiAssistantRequest(BaseModel):
    name: Optional[str] = "Solar Homeowner"
    model_provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"  # Upgraded to GPT-4o for better roleplay compliance
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM" # Default Voice
    first_message: Optional[str] = "Hello? Who is this?"
    system_prompt: str
    company_id: Optional[str] = None

@router.post("/api/v1/vapi/assistant")
async def create_vapi_assistant(request: VapiAssistantRequest, session: Session = Depends(get_session)):
    """
    Returns a configured Assistant JSON that the Frontend can pass to Vapi.start()
    This allows us to keep the system prompt hidden/dynamic on the server.
    """
    final_prompt = request.system_prompt
    if request.company_id:
        from services.profile_service import ProfileService
        company_context = ProfileService.build_company_training_context(request.company_id, session)
        final_prompt = (
            f"COMPANY SPECIFIC SALES RULES & PROFILE:\n{company_context}\n\n"
            f"ROLEPLAY CHARACTER & INSTRUCTIONS:\n{request.system_prompt}"
        )

    # Construct the ephemeral assistant config
    # Vapi allows passing this entire object to the start() method in the SDK
    assistant_config = {
        "model": {
            "provider": request.model_provider,
            "model": request.model,
            "messages": [
                {
                    "role": "system",
                    "content": final_prompt
                }
            ],
            "temperature": 0.7,
        },
        "voice": {
            "provider": "11labs", # ElevenLabs
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
        "name": request.name,
        "firstMessage": request.first_message,
        "firstMessageMode": "assistant-speaks-first", # Explicitly set AI to speak first
        "recordingEnabled": False
    }

    return assistant_config

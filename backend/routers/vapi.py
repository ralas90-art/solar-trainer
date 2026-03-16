from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
from typing import Optional

router = APIRouter()

class VapiAssistantRequest(BaseModel):
    name: Optional[str] = "Solar Homeowner"
    model_provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"  # Upgraded to GPT-4o for better roleplay compliance
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM" # Default Voice
    first_message: Optional[str] = "Hello? Who is this?"
    system_prompt: str

@router.post("/api/v1/vapi/assistant")
async def create_vapi_assistant(request: VapiAssistantRequest):
    """
    Returns a configured Assistant JSON that the Frontend can pass to Vapi.start()
    This allows us to keep the system prompt hidden/dynamic on the server.
    """
    
    # In a production app, checking auth here is critical
    # user = Depends(get_current_user)

    # Construct the ephemeral assistant config
    # Vapi allows passing this entire object to the start() method in the SDK
    assistant_config = {
        "model": {
            "provider": request.model_provider,
            "model": request.model,
            "messages": [
                {
                    "role": "system",
                    "content": request.system_prompt
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

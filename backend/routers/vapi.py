from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
from typing import Optional

router = APIRouter()

class VapiAssistantRequest(BaseModel):
    name: Optional[str] = "Solar Homeowner"
    model_provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4"
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM" # Default Voice
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
        "voice": {
            "provider": "11labs", # ElevenLabs
            "voiceId": request.voice_id,
            "latencyOptimizationLevel": 3,
        },
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-2",
            "language": "en-US",
            "smartFormat": True,
        },
        "silenceTimeoutSeconds": 0.5, # Fast turn-taking
        "responseDelaySeconds": 0.4,  # Artificial delay (minimized)
        "llmRequestDelaySeconds": 0,
        "name": request.name,
        "firstMessage": "Hello? Who is this?",
        "recordingEnabled": True
    }

    return assistant_config

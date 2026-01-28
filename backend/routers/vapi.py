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
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-2",
            "language": "en-US"
        },
        "model": {
            "provider": request.model_provider,
            "model": request.model,
            "messages": [
                {
                    "role": "system",
                    "content": request.system_prompt
                }
            ]
        },
        "voice": {
            "provider": "11labs", # ElevenLabs
            "voiceId": request.voice_id,
        },
        "name": request.name,
        "firstMessage": "Hello? Who is this?",
        "recordingEnabled": True
    }

    return assistant_config

import os
import requests
from typing import Generator

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# Default Voice: "Tom" (American, Confident & Persuasive Trainer)
DEFAULT_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD" 

def text_to_speech_stream(text: str, voice_id: str = DEFAULT_VOICE_ID) -> Generator[bytes, None, None]:
    if not ELEVENLABS_API_KEY:
        print("ElevenLabs API Key missing.")
        return

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_v3",  # Updated to V3 (Feb 2026)
        "voice_settings": {
            "stability": 0.4,
            "similarity_boost": 0.9,
            "style": 0.5,  # New in v3 - controls expressiveness
            "use_speaker_boost": True  # New in v3 - enhances voice clarity
        },
        # New in v3 - guides expressive generation
        "suggested_audio_tags": ["professional", "friendly", "confident"]
    }

    try:
        response = requests.post(url, json=data, headers=headers, stream=True)
        response.raise_for_status()
        
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                yield chunk
    except Exception as e:
        print(f"ElevenLabs Error: {e}")

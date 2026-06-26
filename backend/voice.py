import os
import sys
import requests
from typing import Generator

# ── Import canonical voice config (single source of truth) ───────────────────
# Adds the scripts/ directory to sys.path so we can import audio_voice_config
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from audio_voice_config import ENGLISH_VOICE_ID, MODEL_ID, VOICE_SETTINGS

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# Default voice imported from canonical config
DEFAULT_VOICE_ID = ENGLISH_VOICE_ID

def text_to_speech_stream(text: str, voice_id: str = DEFAULT_VOICE_ID) -> Generator[bytes, None, None]:
    if not ELEVENLABS_API_KEY:
        print("ElevenLabs API Key missing.")
        return

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
    }

    data = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
        "suggested_audio_tags": ["professional", "engaging", "confident", "trainer"],
    }

    try:
        response = requests.post(url, json=data, headers=headers, stream=True)
        response.raise_for_status()

        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                yield chunk
    except Exception as e:
        print(f"ElevenLabs Error: {e}")

"""Test TTS endpoint directly with a short string."""
import os, requests

KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

print("Testing TTS directly...")
r = requests.post(
    f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
    headers={
        "xi-api-key": KEY,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json"
    },
    json={
        "text": "Welcome to SeptiVolt. Solar energy is the future.",
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    },
    timeout=30
)

print(f"Status: {r.status_code}")
if r.status_code == 200:
    with open("test_audio.mp3", "wb") as f:
        f.write(r.content)
    print(f"SUCCESS! Audio saved: test_audio.mp3 ({len(r.content)/1024:.1f} KB)")
else:
    print(f"Error: {r.text[:500]}")

"""
Reads ELEVENLABS_API_KEY from .env file directly (avoids shell copy issues).
"""
import requests

# Read key directly from .env file
env_path = r"solar-trainer\backend\.env"
key = ""
with open(env_path, "r") as f:
    for line in f:
        if line.startswith("ELEVENLABS_API_KEY="):
            key = line.split("=", 1)[1].strip()
            break

print(f"Key found    : {'YES' if key else 'NO'}")
print(f"Key length   : {len(key)}")
print(f"Key prefix   : {key[:10]}...")
print(f"Key suffix   : ...{key[-8:]}")

print("\nTesting TTS...")
r = requests.post(
    f"https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
    headers={"xi-api-key": key, "Accept": "audio/mpeg", "Content-Type": "application/json"},
    json={
        "text": "Welcome to SeptiVolt.",
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    },
    timeout=30
)
print(f"Status: {r.status_code}")
if r.status_code == 200:
    with open("test_audio.mp3", "wb") as f:
        f.write(r.content)
    print(f"SUCCESS — {len(r.content)//1024} KB saved to test_audio.mp3")
else:
    print(f"Error: {r.text[:300]}")

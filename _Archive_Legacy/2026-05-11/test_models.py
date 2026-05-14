import requests

key = ""
with open("solar-trainer/backend/.env") as f:
    for line in f:
        if line.startswith("ELEVENLABS_API_KEY="):
            key = line.split("=", 1)[1].strip()
            break

print(f"Key: {key[:12]}...{key[-6:]}")

# List available models
r = requests.get("https://api.elevenlabs.io/v1/models", headers={"xi-api-key": key})
print("Models status:", r.status_code)
if r.status_code == 200:
    for m in r.json():
        model_id = m.get("model_id", "")
        can_tts = m.get("can_do_text_to_speech", False)
        print(f"  {model_id:45} tts={can_tts}")
else:
    print(r.text[:200])

# Try turbo model (free-tier-compatible)
print("\nTesting with eleven_turbo_v2_5...")
r2 = requests.post(
    "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
    headers={"xi-api-key": key, "Accept": "audio/mpeg", "Content-Type": "application/json"},
    json={
        "text": "Welcome to SeptiVolt. Solar energy is the future.",
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    },
    timeout=30
)
print(f"Turbo status: {r2.status_code}")
if r2.status_code == 200:
    with open("test_audio.mp3", "wb") as f:
        f.write(r2.content)
    print(f"SUCCESS — {len(r2.content)//1024} KB saved to test_audio.mp3")
else:
    print(f"Error: {r2.text[:300]}")

"""
Regenerate audio for Module 1.1 using the upgraded v2 narration scripts.
Reads from module_1_1_narration_v2.json and overwrites existing MP3s.
"""
import json
import time
import requests
from pathlib import Path

# Load API key from .env
KEY = ""
for line in Path("solar-trainer/backend/.env").read_text(encoding="utf-8").splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        KEY = line.split("=", 1)[1].strip()
        break

VOICE_ID = "21m00Tcm4TlvDq8ikWAM"
MODEL_ID = "eleven_turbo_v2_5"
OUT_DIR  = Path("audio/day-1/module-1.1")
OUT_DIR.mkdir(parents=True, exist_ok=True)

data = json.loads(Path("module_1_1_narration_v2.json").read_text(encoding="utf-8"))

print(f"Regenerating {len(data['slides'])} slides for Module 1.1 (v2 scripts)")
print(f"Voice: Rachel | Model: {MODEL_ID}\n")

for slide in data["slides"]:
    num    = slide["slide_number"]
    title  = slide["slide_title"]
    script = slide["spoken_teaching_script"]
    out    = OUT_DIR / f"slide-{num}.mp3"

    print(f"Slide {num}: {title}")
    print(f"  Words: {len(script.split())} | Est: ~{slide['estimated_seconds']}s")

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={"xi-api-key": KEY, "Accept": "audio/mpeg", "Content-Type": "application/json"},
        json={
            "text": script,
            "model_id": MODEL_ID,
            "voice_settings": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.4, "use_speaker_boost": True}
        },
        timeout=60
    )

    if r.status_code == 200:
        out.write_bytes(r.content)
        print(f"  ✓ Saved: {out} ({len(r.content)//1024} KB)")
    else:
        print(f"  ✗ Failed: {r.status_code} — {r.text[:150]}")

    time.sleep(1.5)

print("\nAll slides generated. Reload http://localhost:8000/audio/day-1/module-1.1/slide-1.mp3 to verify.")

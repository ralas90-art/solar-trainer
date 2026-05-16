import requests
import os
from pathlib import Path

def load_api_key() -> str:
    env_path = Path("backend") / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=")[1].strip()
    return os.getenv("ELEVENLABS_API_KEY", "")

def check_voice(voice_id, label):
    api_key = load_api_key()
    print(f"Checking {label} (ID: {voice_id})...")
    r = requests.get(
        f"https://api.elevenlabs.io/v1/voices/{voice_id}",
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    if r.status_code == 200:
        data = r.json()
        print(f"[OK] Found voice: {data['name']}")
    else:
        print(f"[ERROR] Could not find voice {voice_id} ({r.status_code}): {r.text}")

if __name__ == "__main__":
    check_voice("21m00Tcm4TlvDq8ikWAM", "Rachel (Legacy EN)")
    check_voice("QO7Mfy7rwYLdxzo4Q3iD", "Tom (EN)")
    check_voice("l1zE9xgNpUTaQCZzpNJa", "Alberto Rodriguez (ES)")

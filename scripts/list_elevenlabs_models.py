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

def list_models():
    api_key = load_api_key()
    print("Listing ElevenLabs models...")
    r = requests.get(
        "https://api.elevenlabs.io/v1/models",
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    if r.status_code == 200:
        models = r.json()
        for m in models:
            print(f" - {m['model_id']} | Name: {m['name']}")
    else:
        print(f"[ERROR] Could not list models ({r.status_code}): {r.text}")

if __name__ == "__main__":
    list_models()

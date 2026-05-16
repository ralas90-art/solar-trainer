import requests
import os
from pathlib import Path

def load_api_key() -> str:
    env_path = Path(__file__).parent.parent / "backend" / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=")[1].strip()
    return os.getenv("ELEVENLABS_API_KEY", "")

def verify_account():
    api_key = load_api_key()
    if not api_key:
        print("[ERROR] ELEVENLABS_API_KEY not found.")
        return

    print(f"Verifying ElevenLabs account with key: {api_key[:6]}...{api_key[-4:]}")
    
    # Check subscription
    r = requests.get(
        "https://api.elevenlabs.io/v1/user/subscription",
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    
    if r.status_code == 200:
        data = r.json()
        used = data.get("character_count", 0)
        limit = data.get("character_limit", 0)
        remaining = limit - used
        print(f"[OK] Subscription active")
        print(f"     Characters Used: {used:,}")
        print(f"     Characters Limit: {limit:,}")
        print(f"     Characters Remaining: {remaining:,}")
        
        if remaining < 180000:
            print(f"[WARNING] Remaining balance ({remaining:,}) is close to estimated requirement (~178,500).")
        else:
            print(f"[OK] Sufficient balance for current batch.")
    else:
        print(f"[ERROR] Failed to fetch subscription data ({r.status_code}): {r.text}")
        return

    # Check voices
    r = requests.get(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    
    if r.status_code == 200:
        voices = r.json().get("voices", [])
        print(f"[OK] Found {len(voices)} available voices:")
        for v in voices:
            labels = v.get("labels", {})
            accent = labels.get("accent", "N/A")
            langs = v.get("high_quality_base_model_ids", []) # Not quite right, let's just check metadata
            print(f"     - {v['name']} ({v['voice_id']}) | Accent: {accent} | Category: {v.get('category')}")
    else:
        print(f"[ERROR] Failed to fetch voices ({r.status_code}): {r.text}")

if __name__ == "__main__":
    verify_account()

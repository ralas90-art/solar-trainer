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

def search_library(query):
    api_key = load_api_key()
    print(f"Searching library for: {query}...")
    r = requests.get(
        "https://api.elevenlabs.io/v1/voices/library",
        params={"search": query},
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    if r.status_code == 200:
        data = r.json()
        voices = data.get("voices", [])
        print(f"Found {len(voices)} matching voices in library:")
        for v in voices:
            print(f" - {v['name']} | ID: {v['public_id']} | Category: {v.get('category')} | Language: {v.get('language')}")
    else:
        print(f"[ERROR] Could not search library ({r.status_code}): {r.text}")

if __name__ == "__main__":
    search_library("Alberto Rodriguez")
    search_library("Tom")

import os
from pathlib import Path

def check_env():
    env_path = Path(__file__).parent.parent / "backend" / ".env"
    print(f"Checking for .env at: {env_path}")
    
    if not env_path.exists():
        print("[ERROR] .env file NOT FOUND")
        return
        
    print("[OK] .env file found")
    
    api_key = None
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith("ELEVENLABS_API_KEY="):
                api_key = line.split("=")[1].strip()
                break
    
    if api_key:
        print(f"[OK] ELEVENLABS_API_KEY found: {api_key[:6]}...{api_key[-4:]}")
    else:
        print("[ERROR] ELEVENLABS_API_KEY NOT FOUND in .env")

if __name__ == "__main__":
    check_env()

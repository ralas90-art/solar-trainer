import os
from pathlib import Path

def find_manifest():
    roots = [
        Path("c:/Users/12132/Desktop"),
        Path("c:/Users/12132/Downloads"),
        Path("c:/Users/12132/Documents"),
        Path("c:/Users/12132/.gemini/antigravity")
    ]
    for start_dir in roots:
        if not start_dir.exists():
            continue
        print(f"Scanning {start_dir}...")
        for root, dirs, files in os.walk(start_dir):
            # prune some common directories to be fast
            if any(p in root.lower() for p in ["node_modules", ".next", "venv", "git", "cache"]):
                continue
            for file in files:
                if "manifest" in file.lower() or "elevenlabs" in file.lower():
                    print("Found file:", Path(root) / file)
                    
if __name__ == "__main__":
    find_manifest()

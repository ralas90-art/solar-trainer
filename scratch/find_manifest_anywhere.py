import os
from pathlib import Path

def find_file():
    paths = [
        Path(r"c:\Users\12132\Desktop"),
        Path(r"c:\Users\12132\Documents")
    ]
    for p in paths:
        if not p.exists():
            continue
        print(f"Searching in {p}...")
        for r, dirs, files in os.walk(p):
            # Prune some huge folders to avoid lagging
            if any(prune in r.lower() for prune in ["node_modules", ".git", ".next", "appdata", "local settings"]):
                continue
            for f in files:
                if "ElevenLabs_Production_Manifest.json" in f:
                    print(f"Found manifest: {Path(r) / f}")
                    return

if __name__ == "__main__":
    find_file()

import os
from pathlib import Path

def find_file():
    root = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    for r, dirs, files in os.walk(root):
        for f in files:
            if "ElevenLabs_Production_Manifest.json" in f or "audio_inventory_map.json" in f:
                print(f"Found file: {Path(r) / f}")

if __name__ == "__main__":
    find_file()

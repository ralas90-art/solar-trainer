import os
from pathlib import Path

def find_manifest():
    for root, dirs, files in os.walk("."):
        if "ElevenLabs_Production_Manifest.json" in files:
            print("Found Manifest at:", Path(root) / "ElevenLabs_Production_Manifest.json")
            return
    print("ElevenLabs_Production_Manifest.json not found in workspace.")

if __name__ == "__main__":
    find_manifest()

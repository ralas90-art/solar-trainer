import os
from pathlib import Path

def find_file(root_dir, name_pattern):
    print(f"Searching for '{name_pattern}' in {root_dir}...")
    for path in Path(root_dir).rglob("*"):
        if name_pattern.lower() in path.name.lower():
            print(f"Found file: {path} ({path.stat().st_size} bytes)")

if __name__ == "__main__":
    find_file(".", "Production_Manifest")
    find_file(".", "ElevenLabs_Production_Manifest")
    find_file(".", "ElevenLabs")

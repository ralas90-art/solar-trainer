import os
from pathlib import Path

def find_json_files(root_dir):
    print(f"Searching for all JSON files in {root_dir}...")
    for path in Path(root_dir).rglob("*.json"):
        print(f"Found JSON: {path} ({path.stat().st_size} bytes)")

if __name__ == "__main__":
    find_json_files("c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\_Archive_Legacy")

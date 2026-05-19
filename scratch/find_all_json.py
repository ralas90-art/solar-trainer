import os
from pathlib import Path

def find_json_files():
    workspace = Path(".")
    found = []
    for root, dirs, files in os.walk(workspace):
        if "node_modules" in root or ".git" in root or ".next" in root:
            continue
        for file in files:
            if file.endswith(".json"):
                found.append(Path(root) / file)
                
    print(f"Found {len(found)} JSON files:")
    for f in found:
        print(f" - {f}")

if __name__ == "__main__":
    find_json_files()

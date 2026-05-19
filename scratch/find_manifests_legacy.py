import os
from pathlib import Path

def find_manifest():
    found = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if "manifest" in file.lower():
                found.append(Path(root) / file)
    print(f"Found {len(found)} files containing 'manifest' in their names:")
    for f in found:
        print(f" - {f}")

if __name__ == "__main__":
    find_manifest()

import os
from pathlib import Path

def list_legacy_delivery():
    path = Path(r"_Archive_Legacy\2026-05-11\solar-trainer_leftovers\SeptiVolt_Delivery")
    if not path.exists():
        print(f"Path {path} does not exist.")
        return
        
    found = []
    for root, dirs, files in os.walk(path):
        for file in files:
            found.append(Path(root) / file)
            
    print(f"Found {len(found)} files in legacy delivery:")
    for f in found:
        print(f" - {f}")

if __name__ == "__main__":
    list_legacy_delivery()

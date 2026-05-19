import os
from pathlib import Path

def list_files(root_dir):
    print(f"Listing all files in {root_dir}:")
    root = Path(root_dir)
    if not root.exists():
        print("Root directory does not exist.")
        return
    for path in root.rglob("*"):
        if path.is_file():
            print(f"File: {path} ({path.stat().st_size} bytes)")

if __name__ == "__main__":
    list_files("_Archive_Legacy/2026-05-11/solar-trainer_leftovers/SeptiVolt_Delivery")

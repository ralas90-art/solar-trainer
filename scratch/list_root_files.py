import os
from pathlib import Path

def list_root():
    base = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    for item in sorted(base.iterdir()):
        if item.is_dir():
            print(f"[DIR] {item.name}")
        else:
            print(f"[FILE] {item.name}")

if __name__ == "__main__":
    list_root()

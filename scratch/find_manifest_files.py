import os
from pathlib import Path

def find_files():
    root = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    for r, dirs, files in os.walk(root):
        if any(prune in r.lower() for prune in ["node_modules", ".git", ".next"]):
            continue
        for f in files:
            if "manifest" in f.lower() or "voice" in f.lower():
                print(f"Found: {Path(r) / f}")

if __name__ == "__main__":
    find_files()

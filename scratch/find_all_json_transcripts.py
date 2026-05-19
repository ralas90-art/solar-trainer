import os
from pathlib import Path

def find_jsons():
    base = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith(".json") and "node_modules" not in root and ".next" not in root and ".git" not in root:
                fp = Path(root) / f
                print(fp.relative_to(base), f"({os.path.getsize(fp)} bytes)")

if __name__ == "__main__":
    find_jsons()

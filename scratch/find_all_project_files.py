import os
from pathlib import Path

def list_files():
    base = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator")
    for root, dirs, files in os.walk(base):
        for f in files:
            fp = Path(root) / f
            rel = fp.relative_to(base)
            print(rel)

if __name__ == "__main__":
    list_files()

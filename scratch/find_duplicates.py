import os
import hashlib
from collections import defaultdict

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def find_duplicates(root_dir):
    hashes = defaultdict(list)
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip archive and hidden folders
        if "_Archive_Legacy" in dirpath or ".antigravity" in dirpath or ".venv" in dirpath or "node_modules" in dirpath:
            continue
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            try:
                md5 = get_md5(file_path)
                hashes[md5].append(file_path)
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
    
    return {h: paths for h, paths in hashes.items() if len(paths) > 1}

if __name__ == "__main__":
    root = r"C:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent"
    duplicates = find_duplicates(root)
    
    if not duplicates:
        print("No duplicates found.")
    else:
        print(f"Found {len(duplicates)} sets of duplicate files:")
        for md5, paths in duplicates.items():
            print(f"\nHash: {md5}")
            for p in paths:
                print(f"  {p}")

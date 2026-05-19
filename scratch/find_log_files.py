import os
from pathlib import Path

def find_logs():
    base = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    ignore_dirs = {".git", ".next", "node_modules", "out", "dist", "build", ".venv"}
    
    log_files = []
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in [".log", ".txt", ".md"]:
                log_files.append(file_path)
                
    print(f"Total candidate files: {len(log_files)}")
    for f in log_files:
        print(f" - {f.relative_to(base)}")

if __name__ == "__main__":
    find_logs()

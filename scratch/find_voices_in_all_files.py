import os
from pathlib import Path

def search_files():
    base_dir = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent")
    terms = [b"rachel", b"dom", b"tom", b"21m00Tcm4TlvDq8ikWAM", b"AZnzlk1XvdvUeBnXmlld", b"QO7Mfy7rwYLdxzo4Q3iD"]
    
    ignore_dirs = {".git", ".next", "node_modules", "out", "dist", "build", "_Archive_Legacy"}
    ignore_exts = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".mp3", ".wav", ".zip", ".tar", ".gz", ".pdf"}
    
    matches = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in ignore_exts:
                continue
            try:
                content = file_path.read_bytes()
                for term in terms:
                    if term in content.lower():
                        matches.append((file_path, term))
                        break
            except Exception as e:
                pass
                
    print(f"Total matching files: {len(matches)}")
    for file_path, term in matches:
        print(f"File: {file_path.relative_to(base_dir)} | Term: {term.decode()}")

if __name__ == "__main__":
    search_files()

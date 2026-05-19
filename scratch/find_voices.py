import os
from pathlib import Path

def find_terms(root_dir, terms):
    print(f"Searching for terms {terms} in {root_dir}...")
    for folder in ["scripts", "frontend"]:
        dir_path = Path(root_dir) / folder
        if not dir_path.exists():
            continue
        for path in dir_path.rglob("*"):
            if path.is_file():
                if any(part in str(path) for part in [".git", "node_modules", ".next", "__pycache__"]):
                    continue
                if path.suffix not in [".py", ".ts", ".tsx", ".json", ".js"]:
                    continue
                try:
                    content = path.read_text(encoding="utf-8")
                    for term in terms:
                        if term.lower() in content.lower():
                            print(f"Found '{term}' in {path}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    find_terms("c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent", ["voiceName", "rachel", "elevenlabs"])

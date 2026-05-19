import os
from pathlib import Path

def search_markdown():
    workspace = Path(".")
    terms = ["Rachel", "Dom"]
    matches = []
    
    for root, dirs, files in os.walk(workspace):
        if "node_modules" in root or ".git" in root or ".next" in root:
            continue
        for file in files:
            if file.endswith(".md") or file.endswith(".json") or file.endswith(".ts"):
                path = Path(root) / file
                try:
                    content = path.read_text(encoding="utf-8")
                    for term in terms:
                        if term.lower() in content.lower():
                            matches.append((path, term))
                except Exception:
                    pass
                    
    print(f"Found {len(matches)} files referencing terms:")
    for path, term in set(matches):
        print(f" - {path} (matched '{term}')")

if __name__ == "__main__":
    search_markdown()

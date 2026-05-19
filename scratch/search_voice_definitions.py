import os
import re
from pathlib import Path

def search_voices():
    base = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator")
    terms = [
        re.compile(r"\bTom\b", re.IGNORECASE),
        re.compile(r"\bRachel\b", re.IGNORECASE),
        re.compile(r"\bDom\b", re.IGNORECASE),
        re.compile(r"QO7Mfy7rwYLdxzo4Q3iD"), # Tom ID
        re.compile(r"21m00Tcm4TlvDq8ikWAM")  # Rachel ID
    ]
    
    matches = []
    
    for root, dirs, files in os.walk(base):
        if any(x in root for x in ["node_modules", ".next", ".git", "public/audio", "public\\audio"]):
            continue
        for f in files:
            ext = Path(f).suffix.lower()
            if ext in [".json", ".md", ".ts", ".tsx", ".js", ".py", ".txt"]:
                fp = Path(root) / f
                try:
                    content = fp.read_text(encoding="utf-8", errors="ignore")
                except Exception:
                    continue
                for idx, line in enumerate(content.splitlines()):
                    for term in terms:
                        if term.search(line):
                            matches.append((fp.relative_to(base), idx + 1, line.strip()))
                            break
                            
    print(f"Total matching lines across all project files: {len(matches)}")
    for file_path, line_num, text in matches[:100]:
        print(f" - {file_path}:{line_num}: {text[:150]}")

if __name__ == "__main__":
    search_voices()

import os
from pathlib import Path

def find_audio_references():
    frontend_dir = Path("frontend")
    terms = ["audio", "voiceName", "elevenlabs", "manifest", "Tom", "Rachel", "Dom"]
    
    matches = []
    for root, dirs, files in os.walk(frontend_dir):
        if "node_modules" in root or ".next" in root or ".git" in root:
            continue
        for file in files:
            path = Path(root) / file
            if path.suffix in [".ts", ".tsx", ".json", ".js", ".jsx"]:
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
    find_audio_references()

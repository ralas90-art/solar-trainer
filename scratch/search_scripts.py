import os
from pathlib import Path

def search_scripts():
    scripts_dir = Path("scripts")
    terms = ["voice", "voiceName", "elevenlabs", "Tom", "Rachel", "Dom", "voice_name", "voiceid"]
    matches = []
    
    for file in scripts_dir.iterdir():
        if file.suffix in [".py", ".json", ".ts", ".js"]:
            try:
                content = file.read_text(encoding="utf-8")
            except Exception:
                try:
                    content = file.read_text(encoding="utf-16")
                except Exception:
                    continue
            for term in terms:
                if term.lower() in content.lower():
                    matches.append((file, term))
                    
    print(f"Found {len(matches)} matches in scripts:")
    for file, term in set(matches):
        print(f" - {file.name} (matched '{term}')")

if __name__ == "__main__":
    search_scripts()

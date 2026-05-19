import os
from pathlib import Path

def search_appdata(app_data_dir, search_str):
    print(f"Searching for '{search_str}' in AppData path: {app_data_dir}...")
    root = Path(app_data_dir)
    if not root.exists():
        print("AppData directory does not exist.")
        return
    matches = 0
    for path in root.rglob("*"):
        if path.is_file() and path.suffix in [".txt", ".json", ".md", ".log"]:
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
                if search_str in content:
                    print(f"Match found in: {path} ({path.stat().st_size} bytes)")
                    # print first 5 matching lines
                    lines = content.splitlines()
                    count = 0
                    for idx, line in enumerate(lines):
                        if search_str in line:
                            print(f"  Line {idx+1}: {line[:200]}")
                            count += 1
                            if count >= 5:
                                break
                    matches += 1
            except Exception as e:
                pass
    print(f"Finished searching AppData. Found {matches} matching files.")

if __name__ == "__main__":
    search_appdata("C:\\Users\\12132\\.gemini\\antigravity\\brain", "ElevenLabs_Production_Manifest.json")
    print("\n" + "="*50 + "\n")
    search_appdata("C:\\Users\\12132\\.gemini\\antigravity\\brain", "voiceName")

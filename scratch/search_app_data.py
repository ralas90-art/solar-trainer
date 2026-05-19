import os
from pathlib import Path

def search_app_data():
    app_data = Path(r"C:\Users\12132\.gemini\antigravity")
    found = []
    if app_data.exists():
        for root, dirs, files in os.walk(app_data):
            for file in files:
                if "manifest" in file.lower() or "production" in file.lower() or "elevenlabs" in file.lower():
                    found.append(Path(root) / file)
                    
    print(f"Found {len(found)} matching files in App Data:")
    for f in found:
        print(f" - {f}")

if __name__ == "__main__":
    search_app_data()

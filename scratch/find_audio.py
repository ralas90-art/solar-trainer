import os
from pathlib import Path

def find_audio_files():
    workspace = Path(".")
    audio_extensions = {".mp3", ".wav", ".m4a", ".ogg"}
    found_files = []
    
    for root, dirs, files in os.walk(workspace):
        # Skip .git and node_modules
        if "node_modules" in root or ".git" in root or ".next" in root:
            continue
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in audio_extensions:
                full_path = Path(root) / file
                found_files.append(full_path)
                
    print(f"Found {len(found_files)} audio files:")
    for f in found_files[:100]:
        print(f" - {f} ({f.stat().st_size} bytes)")
        
if __name__ == "__main__":
    find_audio_files()

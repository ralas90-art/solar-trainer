import os
from pathlib import Path

def analyze_audio_files():
    root = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\frontend\public\audio\modules")
    if not root.exists():
        print("Directory does not exist.")
        return
        
    print("Listing directories in modules:")
    dirs = [d for d in root.iterdir() if d.is_dir()]
    print(f"Total directories: {len(dirs)}")
    
    # Check if there is an "es" directory
    es_dir = root / "es"
    if es_dir.exists():
        es_dirs = [d for d in es_dir.iterdir() if d.is_dir()]
        print(f"Spanish ('es') modules count: {len(es_dirs)}")
    else:
        print("Spanish ('es') directory does not exist.")
        
    # Let's count standard English directories (excluding 'es')
    en_dirs = [d for d in dirs if d.name != "es"]
    print(f"English modules count: {len(en_dirs)}")
    
    # Check details of a few English directories
    if en_dirs:
        print("\nDetails of first 5 English modules:")
        for d in sorted(en_dirs, key=lambda x: x.name)[:5]:
            files = list(d.glob("*.mp3"))
            print(f"  - {d.name}: {len(files)} files, e.g. {[f.name for f in files[:2]]}")
            
    if es_dir.exists() and es_dirs:
        print("\nDetails of first 5 Spanish modules:")
        for d in sorted(es_dirs, key=lambda x: x.name)[:5]:
            files = list(d.glob("*.mp3"))
            print(f"  - {d.name}: {len(files)} files, e.g. {[f.name for f in files[:2]]}")

if __name__ == "__main__":
    analyze_audio_files()

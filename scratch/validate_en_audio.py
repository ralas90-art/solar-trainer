import os
import json
from pathlib import Path

def validate_en_audio():
    print("=== English Audio Validation Audit ===")
    
    # 1. Identify additive modules from JSON
    try:
        with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
            data = json.load(f)
    except:
        with open('scripts/modules_en.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
    additive_ids = [k for k in data.keys() if any(c.isalpha() for c in k.split('_')[-1])]
    print(f"Detected {len(additive_ids)} additive modules in JSON.")
    
    audio_base = Path("frontend/public/audio/modules")
    
    # 2. Check additive modules presence and integrity
    missing = []
    empty = []
    for mod_id in additive_ids:
        mod_dir = audio_base / mod_id
        if not mod_dir.exists():
            missing.append(mod_id)
            continue
            
        files = list(mod_dir.glob("section_*.mp3"))
        if not files:
            missing.append(f"{mod_id} (No section_*.mp3)")
        
        for f in files:
            if f.stat().st_size == 0:
                empty.append(str(f))
                
    print(f"Additive Integrity: {len(missing)} missing, {len(empty)} empty.")
    if missing: print(f"Missing: {missing}")
    if empty: print(f"Empty: {empty}")
    
    # 3. Check legacy core assets timestamps
    # We'll check mod_1_1 and mod_7_9 as bookends
    core_checks = ["mod_1_1", "mod_7_9"]
    print("\nCore Asset Isolation Check:")
    for mod_id in core_checks:
        mod_dir = audio_base / mod_id
        if mod_dir.exists():
            files = list(mod_dir.glob("mod_*.mp3"))
            if files:
                latest_mtime = max(f.stat().st_mtime for f in files)
                import datetime
                mtime_str = datetime.datetime.fromtimestamp(latest_mtime).strftime('%Y-%m-%d %H:%M:%S')
                print(f"  {mod_id}: Latest file modification: {mtime_str}")
                if "2026-05-16" in mtime_str:
                    print(f"  [WARNING] {mod_id} appears to have been modified today!")
                else:
                    print(f"  [OK] {mod_id} remains untouched.")
            else:
                print(f"  [ERROR] {mod_id} has no legacy mp3 files.")
        else:
            print(f"  [ERROR] {mod_id} directory missing.")

    print("\n=== Audit Complete ===")

if __name__ == "__main__":
    validate_en_audio()

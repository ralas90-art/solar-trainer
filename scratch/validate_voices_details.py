import json
from pathlib import Path

def print_validation_details():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scratch\audio_regeneration_queue.json")
    if not p.exists():
        print("Queue does not exist.")
        return
        
    data = json.loads(p.read_text(encoding="utf-8"))
    
    keep = data.get("keep", [])
    regenerate = data.get("regenerate", [])
    manual_review = data.get("manual_review", [])
    
    print("=== SUMMARY OF ENGLISH AUDIO STANDARDIZATION QUEUE ===")
    print(f"Total English Narration Files Analyzed: {len(keep) + len(regenerate) + len(manual_review)}")
    print(f"1. English files to keep (Standardized to Tom): {len(keep)}")
    print(f"2. English files to regenerate (Legacy Rachel -> Tom): {len(regenerate)}")
    print(f"3. English files needing manual review: {len(manual_review)}")
    
    print("\n--- SAMPLE FILES TO KEEP (Standardized Tom Voice) ---")
    # Group by module
    keep_modules = {}
    for item in keep:
        mod = item["module_id"]
        keep_modules.setdefault(mod, []).append(item["file"])
    for mod in sorted(keep_modules.keys())[:5]:
        print(f"  - {mod}: {len(keep_modules[mod])} files {keep_modules[mod][:3]}...")
        
    print("\n--- SAMPLE FILES TO REGENERATE (Legacy Rachel -> Tom) ---")
    regen_modules = {}
    for item in regenerate:
        mod = item["module_id"]
        regen_modules.setdefault(mod, []).append(item["file"])
    for mod in sorted(regen_modules.keys())[:5]:
        print(f"  - {mod}: {len(regen_modules[mod])} files {regen_modules[mod][:3]}...")

if __name__ == "__main__":
    print_validation_details()

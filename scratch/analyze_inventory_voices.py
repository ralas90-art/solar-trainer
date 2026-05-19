import json
from pathlib import Path

def analyze_voices():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\audio_inventory_map.json")
    if not p.exists():
        print("audio_inventory_map.json does not exist.")
        return
        
    for enc in ["utf-8", "utf-16", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            break
        except Exception:
            continue
            
    data = json.loads(content)
    
    en_core = data.get("en_core", {})
    en_additive = data.get("en_additive", {})
    es = data.get("es", {})
    
    # We want to catalog all physical English modules
    # English modules can be in en_core or en_additive
    # Let's count them and inspect their names
    print(f"en_core module count: {len(en_core)}")
    print(f"en_additive module count: {len(en_additive)}")
    print(f"es module count: {len(es)}")
    
    # Standard:
    # 1. Any EN module in en_core (mod_1_1 to mod_3_10) has legacy files generated with Rachel voice!
    # Wait, let's verify if en_core contains Day 4-7.
    # If en_core has mod_4_x to mod_7_x, did they have files? Or are they empty?
    # Let's see:
    print("\n--- EN Core Modules ---")
    for mod_id, info in sorted(en_core.items()):
        print(f"  - {mod_id}: {info['count']} files, e.g. {info['files'][:2]}")
        
    print("\n--- EN Additive Modules ---")
    for mod_id, info in sorted(en_additive.items()):
        print(f"  - {mod_id}: {info['count']} files, e.g. {info['files'][:2]}")

if __name__ == "__main__":
    analyze_voices()

import os
import json
from pathlib import Path

def generate_inventory():
    print("=== Generating SeptiVolt Audio Inventory ===")
    
    audio_base = Path("frontend/public/audio/modules")
    es_base = audio_base / "es"
    
    # 1. EN Core Inventory (mod_1_1 to mod_7_9, excluding additive suffixes like 1_5a)
    # We define core as modules without letters in the ID suffix or specifically known legacy ones.
    # Actually, a better way is to check the file naming convention: mod_{id}_{segment}.mp3
    en_core = {}
    en_additive = {}
    es_inventory = {}
    
    # Scan EN
    for mod_dir in audio_base.iterdir():
        if not mod_dir.is_dir() or mod_dir.name == "es":
            continue
            
        mod_id = mod_dir.name
        files = list(mod_dir.glob("*.mp3"))
        
        # Check if additive (has section_*.mp3) or core (has mod_*.mp3)
        core_files = [f.name for f in files if f.name.startswith("mod_")]
        additive_files = [f.name for f in files if f.name.startswith("section_")]
        
        if core_files:
            en_core[mod_id] = {
                "count": len(core_files),
                "files": sorted(core_files)
            }
        
        if additive_files:
            en_additive[mod_id] = {
                "count": len(additive_files),
                "files": sorted(additive_files)
            }
            
    # Scan ES
    if es_base.exists():
        for mod_dir in es_base.iterdir():
            if not mod_dir.is_dir():
                continue
            
            mod_id = mod_dir.name
            files = [f.name for f in mod_dir.glob("section_*.mp3")]
            es_inventory[mod_id] = {
                "count": len(files),
                "files": sorted(files)
            }

    # 2. Save Manifests
    with open('scripts/audio_inventory_en_core.json', 'w') as f:
        json.dump(en_core, f, indent=2)
    with open('scripts/audio_inventory_en_additive.json', 'w') as f:
        json.dump(en_additive, f, indent=2)
    with open('scripts/audio_inventory_es.json', 'w') as f:
        json.dump(es_inventory, f, indent=2)
        
    # 3. Audio Inventory Map (Full Mapping)
    full_map = {
        "summary": {
            "en_core_module_count": len(en_core),
            "en_additive_module_count": len(en_additive),
            "es_module_count": len(es_inventory),
            "total_files": sum(m["count"] for m in en_core.values()) + 
                           sum(m["count"] for m in en_additive.values()) + 
                           sum(m["count"] for m in es_inventory.values())
        },
        "en_core": en_core,
        "en_additive": en_additive,
        "es": es_inventory
    }
    
    with open('scripts/audio_inventory_map.json', 'w') as f:
        json.dump(full_map, f, indent=2)
        
    print(f"Inventory Complete.")
    print(f"  EN Core: {len(en_core)} modules")
    print(f"  EN Additive: {len(en_additive)} modules")
    print(f"  ES: {len(es_inventory)} modules")
    print(f"  Total Files: {full_map['summary']['total_files']}")

if __name__ == "__main__":
    generate_inventory()

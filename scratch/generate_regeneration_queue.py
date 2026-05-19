import json
from pathlib import Path

def process_inventory():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\audio_inventory_map.json")
    for enc in ["utf-8", "utf-16", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            break
        except Exception:
            continue
    data = json.loads(content)
    
    en_core = data.get("en_core", {})
    en_additive = data.get("en_additive", {})
    
    to_keep = []
    to_regenerate = []
    manual_review = []
    
    # Let's define the voice names:
    # en_core: voiceName = "Rachel" (not "Tom") -> Needs regeneration
    # en_additive: voiceName = "Tom" -> Keep
    
    # Wait, are there any other modules, or is there any file under en_core or en_additive that might be unknown?
    # Let's inspect all modules.
    
    # 1. Process en_core
    for mod_id, info in sorted(en_core.items()):
        files = info.get("files", [])
        for f in files:
            # Let's build the full relative path from public/audio/modules/
            path = f"{mod_id}/{f}"
            to_regenerate.append({
                "module_id": mod_id,
                "file": f,
                "path": path,
                "current_voice": "Rachel",
                "target_voice": "Tom",
                "reason": f"Legacy core narration audio generated with Rachel. Needs standardization to Tom."
            })
            
    # 2. Process en_additive
    for mod_id, info in sorted(en_additive.items()):
        files = info.get("files", [])
        if not files:
            # If a module has no files listed in inventory, maybe it needs manual review or is a placeholder
            manual_review.append({
                "module_id": mod_id,
                "reason": "English additive module has no files listed in inventory."
            })
            continue
        for f in files:
            path = f"{mod_id}/{f}"
            to_keep.append({
                "module_id": mod_id,
                "file": f,
                "path": path,
                "current_voice": "Tom",
                "target_voice": "Tom",
                "reason": "Standardized Tom voice narration. Keep."
            })
            
    # Let's see if there are other files in the directory that aren't accounted for in inventory_map.json
    # We should search the actual directories and see if we have files not in the inventory.
    actual_dir = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\frontend\public\audio\modules")
    
    # Find all physical files and check if they are in the inventory map
    physical_files = []
    if actual_dir.exists():
        for item in actual_dir.rglob("*.mp3"):
            # skip Spanish modules if any (under an 'es' folder)
            if "es/" in item.as_posix() or "\\es\\" in item.as_posix():
                continue
            # relative path from modules/
            rel_path = item.relative_to(actual_dir).as_posix()
            physical_files.append(rel_path)
            
    # Compile a set of all inventory paths for English
    inventory_paths = set()
    for item in to_regenerate:
        inventory_paths.add(item["path"])
    for item in to_keep:
        inventory_paths.add(item["path"])
        
    # Any physical file not in the inventory list is an "unknown" voice and needs manual review!
    for pf in sorted(physical_files):
        if pf not in inventory_paths:
            # Extract module id and filename
            parts = pf.split('/')
            if len(parts) == 2:
                mod_id, filename = parts
            else:
                mod_id = parts[0]
                filename = parts[-1]
            manual_review.append({
                "module_id": mod_id,
                "file": filename,
                "path": pf,
                "current_voice": "unknown",
                "reason": "Physical audio file is not registered in the inventory map. Voice name is unknown."
            })
            
    # Print the counts:
    print(f"English files to keep count: {len(to_keep)}")
    print(f"English files to regenerate count: {len(to_regenerate)}")
    print(f"English files needing manual review count: {len(manual_review)}")
    
    # Let's save the results to a JSON file so we can view them easily
    output_data = {
        "keep": to_keep,
        "regenerate": to_regenerate,
        "manual_review": manual_review
    }
    
    out_path = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scratch\audio_regeneration_queue.json")
    out_path.write_text(json.dumps(output_data, indent=2), encoding="utf-8")
    print(f"Saved results to {out_path}")

if __name__ == "__main__":
    process_inventory()

import json
from pathlib import Path
import sys

def inspect_inventories():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    scripts_dir = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts")
    files = ["audio_inventory_en_core.json", "audio_inventory_en_additive.json", "audio_inventory_es.json", "audio_inventory_map.json"]
    
    for filename in files:
        p = scripts_dir / filename
        if not p.exists():
            print(f"File {filename} does not exist.")
            continue
            
        # Read content, try encodings
        content = None
        for enc in ["utf-8", "utf-16", "utf-16-le", "utf-16-be", "latin-1"]:
            try:
                content = p.read_text(encoding=enc)
                break
            except Exception:
                continue
                
        if not content:
            print(f"Failed to decode {filename}")
            continue
            
        try:
            data = json.loads(content)
            print(f"\n--- {filename} ---")
            print(f"Type: {type(data)}")
            if isinstance(data, dict):
                print(f"Keys: {list(data.keys())[:10]} (total {len(data.keys())} keys)")
                first_key = list(data.keys())[0]
                print(f"Sample value for '{first_key}':")
                print(json.dumps(data[first_key], indent=2)[:500])
            elif isinstance(data, list):
                print(f"Length: {len(data)}")
                if len(data) > 0:
                    print("Sample value:")
                    print(json.dumps(data[0], indent=2)[:500])
        except Exception as e:
            print(f"Failed to parse {filename}: {e}")

if __name__ == "__main__":
    inspect_inventories()

import json
from pathlib import Path
import sys

def print_full_map():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\audio_inventory_map.json")
    if not p.exists():
        print("audio_inventory_map.json does not exist.")
        return
        
    # Read with multiple encodings
    content = None
    for enc in ["utf-8", "utf-16", "utf-16-le", "utf-16-be", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            break
        except Exception:
            continue
            
    data = json.loads(content)
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    print_full_map()

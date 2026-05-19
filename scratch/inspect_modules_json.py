import json
from pathlib import Path
import sys

def inspect_json():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\modules_en.json")
    if not p.exists():
        print("modules_en.json does not exist.")
        return
        
    # Try different encodings
    content = None
    for enc in ["utf-16", "utf-16-le", "utf-16-be", "utf-8", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            print(f"Successfully decoded with {enc}!")
            break
        except Exception:
            continue
            
    if not content:
        print("Failed to decode with any standard encoding.")
        return
        
    try:
        data = json.loads(content)
    except Exception as e:
        print(f"JSON parsing failed: {e}")
        # Print a snippet of raw characters
        print(content[:200])
        return
        
    print(f"Data type: {type(data)}")
    if isinstance(data, dict):
        print(f"Keys: {list(data.keys())[:10]} (total {len(data.keys())} keys)")
        # Print a sample value
        if data.keys():
            first_key = list(data.keys())[0]
            print(f"First key: {first_key}")
            print(json.dumps(data[first_key], indent=2)[:500])
    elif isinstance(data, list):
        print(f"List length: {len(data)}")
        if len(data) > 0:
            print(json.dumps(data[0], indent=2)[:500])

if __name__ == "__main__":
    inspect_json()

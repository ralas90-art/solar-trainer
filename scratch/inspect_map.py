import json
from pathlib import Path

def inspect_map():
    path = Path("scripts/audio_inventory_map.json")
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    print("Keys in audio_inventory_map:", list(data.keys()))
    for k, v in data.items():
        if isinstance(v, dict):
            print(f"Subkeys of '{k}':", list(v.keys())[:5])
            first_subkey = list(v.keys())[0]
            print(f"Sample under '{k}' -> '{first_subkey}':", json.dumps(v[first_subkey], indent=2)[:500])

if __name__ == "__main__":
    inspect_map()

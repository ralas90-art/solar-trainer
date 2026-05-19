import json
from pathlib import Path

def inspect_json(filename):
    path = Path(filename)
    if not path.exists():
        print(f"File {filename} does not exist.")
        return
    try:
        content = path.read_text(encoding="utf-16")
        data = json.loads(content)
    except Exception:
        try:
            content = path.read_text(encoding="utf-8")
            data = json.loads(content)
        except Exception as e:
            print(f"Could not read {filename}: {e}")
            return
            
    print(f"\n--- {filename} ---")
    if isinstance(data, list):
        print(f"List of {len(data)} items.")
        if data:
            print("Sample item:", json.dumps(data[0], indent=2)[:500])
    elif isinstance(data, dict):
        print(f"Dict of {len(data)} items.")
        print("Sample keys:", list(data.keys())[:5])
        if data:
            first_key = list(data.keys())[0]
            print(f"Sample item for key '{first_key}':", json.dumps(data[first_key], indent=2)[:500])

if __name__ == "__main__":
    inspect_json("scripts/audio_inventory_map.json")
    inspect_json("scripts/audio_inventory_en_core.json")
    inspect_json("scripts/audio_inventory_en_additive.json")

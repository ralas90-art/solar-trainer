import json
from pathlib import Path

def inspect_inventories():
    base = Path("scripts")
    for f in ["audio_inventory_en_core.json", "audio_inventory_en_additive.json", "audio_inventory_es.json", "audio_inventory_map.json"]:
        p = base / f
        if p.exists():
            print(f"\n=== {f} ===")
            content = p.read_text(encoding="utf-8")
            data = json.loads(content)
            if isinstance(data, list):
                print(f"List of {len(data)} items. Sample of first 2 items:")
                for item in data[:2]:
                    print(item)
            elif isinstance(data, dict):
                print(f"Dict of {len(data)} items. Sample of first 2 keys/values:")
                keys = list(data.keys())
                for k in keys[:2]:
                    print(k, "->", data[k])
        else:
            print(f"\n[NOT FOUND] {f}")

if __name__ == "__main__":
    inspect_inventories()

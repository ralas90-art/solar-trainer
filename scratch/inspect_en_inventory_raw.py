import json
from pathlib import Path

def inspect_raw():
    base = Path("scripts")
    for f in ["audio_inventory_en_core.json", "audio_inventory_en_additive.json"]:
        p = base / f
        if p.exists():
            data = json.loads(p.read_text(encoding="utf-8"))
            print(f"\n=== {f} ===")
            print("Type of data:", type(data))
            if isinstance(data, dict):
                print("Keys:", list(data.keys())[:5])
                first_k = list(data.keys())[0]
                print(f"Value for {first_k} (type: {type(data[first_k])}):")
                print(data[first_k])
            elif isinstance(data, list):
                print("Length:", len(data))
                print("First item (type:", type(data[0]), "):")
                print(data[0])
                if len(data) > 1:
                    print("Second item:")
                    print(data[1])

if __name__ == "__main__":
    inspect_raw()

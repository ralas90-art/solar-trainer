import json

def inspect_map():
    with open("scripts/audio_inventory_map.json", "r") as f:
        data = json.load(f)
    print("Keys in audio_inventory_map.json:", data.keys())
    print("\nSummary:")
    print(json.dumps(data.get("summary", {}), indent=2))
    
    print("\nSample en_core entry:")
    en_core = data.get("en_core", {})
    if en_core:
        first_key = list(en_core.keys())[0]
        print(f"{first_key}:", json.dumps(en_core[first_key], indent=2))

if __name__ == "__main__":
    inspect_map()

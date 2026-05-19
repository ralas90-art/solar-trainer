import json
from pathlib import Path

def print_detail():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\scripts\audio_inventory_map.json")
    for enc in ["utf-8", "utf-16", "latin-1"]:
        try:
            content = p.read_text(encoding=enc)
            break
        except Exception:
            continue
    data = json.loads(content)
    
    # Print the full content of one module from en_core and one from en_additive
    print("en_core sample (mod_1_1):")
    print(json.dumps(data["en_core"]["mod_1_1"], indent=2))
    
    print("\nen_additive sample (mod_1_5a):")
    print(json.dumps(data["en_additive"]["mod_1_5a"], indent=2))

if __name__ == "__main__":
    print_detail()

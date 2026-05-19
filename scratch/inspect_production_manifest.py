import json
from pathlib import Path

def inspect_manifest():
    p = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator\ElevenLabs_Production_Manifest.json")
    if not p.exists():
        print("Manifest does not exist at the target path.")
        return
        
    content = p.read_text(encoding="utf-8")
    data = json.loads(content)
    
    # Let's inspect the keys and a sample
    print(f"Keys: {list(data.keys())}")
    
    if "modules" in data:
        print(f"Number of modules in manifest: {len(data['modules'])}")
        print("\nSample module from manifest:")
        print(json.dumps(data["modules"][0], indent=2))
        
        # Let's see if there are other keys like 'voices', 'config', 'metadata'
        for k in data.keys():
            if k != "modules":
                val = data[k]
                if isinstance(val, (dict, list)):
                    print(f"\nKey '{k}': {type(val)} size={len(val)}")
                else:
                    print(f"\nKey '{k}': {val}")

if __name__ == "__main__":
    inspect_manifest()

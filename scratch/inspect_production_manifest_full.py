import json
from pathlib import Path

def inspect_manifest_full():
    path = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator\ElevenLabs_Production_Manifest.json")
    if not path.exists():
        print("Path does not exist.")
        return
        
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    # search for voice names in all keys and values recursively
    found = []
    
    def search_rec(obj, path_str):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if any(x in str(k).lower() or x in str(v).lower() for x in ["tom", "rachel", "dom", "voice", "narrator"]):
                    found.append((f"{path_str}.{k}", v))
                search_rec(v, f"{path_str}.{k}")
        elif isinstance(obj, list):
            for idx, item in enumerate(obj):
                if any(x in str(item).lower() for x in ["tom", "rachel", "dom", "voice", "narrator"]):
                    found.append((f"{path_str}[{idx}]", item))
                search_rec(item, f"{path_str}[{idx}]")
                
    search_rec(data, "root")
    print(f"Total matching elements: {len(found)}")
    for p, v in found[:30]:
        print(f" - {p}: {str(v)[:150]}")

if __name__ == "__main__":
    inspect_manifest_full()

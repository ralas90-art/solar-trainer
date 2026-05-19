import json
from pathlib import Path

def find_keys_in_json(filepath):
    path = Path(filepath)
    if not path.exists():
        return
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    keys = set()
    
    def get_keys(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                keys.add(k)
                get_keys(v)
        elif isinstance(obj, list):
            for item in obj:
                get_keys(item)
                
    get_keys(data)
    print(f"Keys found in {filepath}: {keys}")

if __name__ == "__main__":
    find_keys_in_json("scripts/curriculum_map.json")

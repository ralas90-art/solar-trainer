import json
from pathlib import Path

def find_voices_in_json():
    path = Path("scripts/narration_transcripts_part1_updated.json")
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    terms = ["Dom", "Rachel", "Tom", "voice"]
    found = []
    
    # Let's search recursively in JSON
    def search_recursive(obj, path_str):
        if isinstance(obj, dict):
            for k, v in obj.items():
                for term in terms:
                    if term.lower() == str(k).lower():
                        found.append((f"{path_str}.{k}", v))
                if isinstance(v, str):
                    for term in terms:
                        if term.lower() in v.lower():
                            found.append((f"{path_str}.{k}", v))
                else:
                    search_recursive(v, f"{path_str}.{k}")
        elif isinstance(obj, list):
            for idx, item in enumerate(obj):
                search_recursive(item, f"{path_str}[{idx}]")
                
    search_recursive(data, "root")
    
    print(f"Found {len(found)} matches in json:")
    for path_key, val in found[:20]:
        print(f" - {path_key}: {str(val)[:200]}")

if __name__ == "__main__":
    find_voices_in_json()

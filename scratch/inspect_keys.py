import json
import re
from pathlib import Path

def get_keys_from_ts_strict(file_path, object_name):
    content = Path(file_path).read_text(encoding="utf-8")
    start_idx = content.find(f"export const {object_name}")
    if start_idx == -1:
        return []
    
    # We find the matching closing brace for the object
    brace_count = 0
    end_idx = -1
    for idx in range(start_idx, len(content)):
        char = content[idx]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = idx + 1
                break
                
    object_content = content[start_idx:end_idx]
    
    # Find keys at the start of a line inside the object
    # e.g.,   "mod_1_1": {
    keys = re.findall(r'^\s+["\']?(mod_\d+_\d+[a-z]?)["\']?\s*:', object_content, re.MULTILINE)
    return sorted(list(set(keys)))

def main():
    en_ts_keys = get_keys_from_ts_strict("frontend/lib/modules.ts", "MODULES")
    es_ts_keys = get_keys_from_ts_strict("frontend/lib/modules.es.ts", "MODULES_ES")
    
    en_json_keys = []
    en_json_path = Path("scripts/modules_en.json")
    if en_json_path.exists():
        try:
            en_json_keys = sorted(list(json.loads(en_json_path.read_text(encoding="utf-16")).keys()))
        except Exception:
            en_json_keys = sorted(list(json.loads(en_json_path.read_text(encoding="utf-8")).keys()))
            
    es_json_keys = []
    es_json_path = Path("scripts/modules_es.json")
    if es_json_path.exists():
        try:
            es_json_keys = sorted(list(json.loads(es_json_path.read_text(encoding="utf-16")).keys()))
        except Exception:
            es_json_keys = sorted(list(json.loads(es_json_path.read_text(encoding="utf-8")).keys()))
            
    print(f"modules.ts (EN TS) keys count: {len(en_ts_keys)}")
    print(f"modules.es.ts (ES TS) keys count: {len(es_ts_keys)}")
    print(f"modules_en.json (EN JSON) keys count: {len(en_json_keys)}")
    print(f"modules_es.json (ES JSON) keys count: {len(es_json_keys)}")
    
    print("\n--- Compare EN TS vs EN JSON ---")
    print(f"In EN TS but not EN JSON: {set(en_ts_keys) - set(en_json_keys)}")
    print(f"In EN JSON but not EN TS: {set(en_json_keys) - set(en_ts_keys)}")
    
    print("\n--- Compare EN TS vs ES JSON ---")
    print(f"In EN TS but not ES JSON: {set(en_ts_keys) - set(es_json_keys)}")
    print(f"In ES JSON but not EN TS: {set(es_json_keys) - set(en_ts_keys)}")

if __name__ == "__main__":
    main()

import json
from pathlib import Path

def inspect_modules_en():
    path = Path("scripts/modules_en.json")
    try:
        content = path.read_text(encoding="utf-16")
        data = json.loads(content)
    except Exception:
        content = path.read_text(encoding="utf-8")
        data = json.loads(content)
        
    print(f"Total modules: {len(data)}")
    
    # Check all keys across all modules
    all_keys = set()
    for m_id, m_data in data.items():
        all_keys.update(m_data.keys())
    print("All keys in modules:", all_keys)
    
    # Search for audio-related fields
    for m_id, m_data in data.items():
        for k, v in m_data.items():
            if any(term in k.lower() for term in ["voice", "audio", "narrat", "tom", "eleven", "sound", "mp3"]):
                print(f"Found match: module {m_id} has key '{k}': {v}")
            if isinstance(v, str) and any(term in v.lower() for term in ["voice", "audio", "narrat", "tom", "eleven", "sound", "mp3"]):
                print(f"Found match in string values: module {m_id} has value containing term at '{k}': {v[:100]}")

if __name__ == "__main__":
    inspect_modules_en()

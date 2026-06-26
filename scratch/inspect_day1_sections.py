import json
from pathlib import Path

def load_json(path):
    try:
        with open(path, "r", encoding="utf-16") as f:
            return json.load(f)
    except Exception:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

def check():
    en_data = load_json("scripts/modules_en.json")
    es_data = load_json("scripts/modules_es.json")
    
    # Check mod_1_1 segments count in JSON
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    for lang, data in [("en", en_data), ("es", es_data)]:
        mod = data.get("mod_1_1")
        if not mod:
            print(f"No mod_1_1 in {lang}")
            continue
        sections = [s for s in mod.get("sections", []) if s.get("type") != "simulation"]
        print(f"{lang} mod_1_1 segments (filtered):")
        for i, s in enumerate(sections):
            title = s.get('title', '')
            t_type = s.get('type', '')
            print(f"  Segment {i+1}: {title} ({t_type})")

if __name__ == "__main__":
    check()

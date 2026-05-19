import json
from pathlib import Path

def parse_days():
    path = Path("scripts/narration_transcripts_part1_updated.json")
    content = path.read_text(encoding="utf-8")
    data = json.loads(content)
    
    days = data.get("days", [])
    print(f"Days is a list of length {len(days)}")
    
    if days:
        first_day = days[0]
        print(f"\nStructure of first day:")
        print("Keys in day:", list(first_day.keys()) if isinstance(first_day, dict) else type(first_day))
        
        modules = first_day.get("modules", [])
        print(f"Modules is of type {type(modules)}, length {len(modules)}")
        
        if modules:
            first_mod = modules[0]
            print(f"\nStructure of first module:")
            print(json.dumps(first_mod, indent=2)[:1000])

if __name__ == "__main__":
    parse_days()

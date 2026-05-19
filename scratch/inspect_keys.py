import json
from pathlib import Path

def inspect_keys():
    base = Path("scripts")
    p = base / "narration_transcripts_part1_updated.json"
    if p.exists():
        data = json.loads(p.read_text(encoding="utf-8"))
        days = data.get("days", [])
        if len(days) > 0:
            modules = days[0].get("modules", [])
            if len(modules) > 0:
                print("First module structure:")
                print(json.dumps(modules[0], indent=2)[:1000])

if __name__ == "__main__":
    inspect_keys()

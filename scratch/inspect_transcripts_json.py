import json
from pathlib import Path

def inspect_transcripts():
    base = Path("scripts")
    for f in ["narration_transcripts_part1_updated.json", "narration_transcripts_part2_updated.json"]:
        p = base / f
        if p.exists():
            data = json.loads(p.read_text(encoding="utf-8"))
            print(f"\n=== {f} ===")
            days = data.get("days", {})
            print("Type of days:", type(days))
            if isinstance(days, dict):
                print("Days keys:", list(days.keys()))
                for day_key in list(days.keys())[:1]:
                    day_val = days[day_key]
                    print(f"Day '{day_key}' type:", type(day_val))
                    if isinstance(day_val, dict):
                        print("Day keys:", list(day_val.keys()))
                        if "modules" in day_val:
                            print("modules type:", type(day_val["modules"]))
                            if isinstance(day_val["modules"], dict):
                                print("modules keys:", list(day_val["modules"].keys())[:2])
                                first_mod = list(day_val["modules"].keys())[0]
                                mod_val = day_val["modules"][first_mod]
                                print(f"Module '{first_mod}' type: {type(mod_val)}")
                                if isinstance(mod_val, dict):
                                    print("Module keys:", list(mod_val.keys()))
                                    # Print any voice information
                                    for k in ["voice", "voice_name", "voiceName", "voiceId", "voice_id", "narrator", "voice_configuration"]:
                                        if k in mod_val:
                                            print(f"  {k} -> {mod_val[k]}")
                                            
            elif isinstance(days, list):
                print("Days is a list of length:", len(days))
                if len(days) > 0:
                    print("First day item type:", type(days[0]))
                    print("Keys of first day item:", list(days[0].keys()) if isinstance(days[0], dict) else "not a dict")

if __name__ == "__main__":
    inspect_transcripts()

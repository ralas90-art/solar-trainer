import json
from pathlib import Path

def inspect_transcripts_modules():
    base = Path("scripts")
    voice_counts = {}
    
    for f in ["narration_transcripts_part1_updated.json", "narration_transcripts_part2_updated.json"]:
        p = base / f
        if not p.exists():
            print(f"{f} does not exist")
            continue
            
        data = json.loads(p.read_text(encoding="utf-8"))
        days = data.get("days", [])
        for day in days:
            day_num = day.get("day_number")
            modules = day.get("modules", [])
            for mod in modules:
                mod_id = mod.get("module_id")
                title = mod.get("title")
                
                # Check for voice properties
                voice_cfg = mod.get("voice_configuration", {})
                voice_name = voice_cfg.get("voice_name") or voice_cfg.get("name") or mod.get("voice_name") or mod.get("voice") or mod.get("narrator")
                voice_id = voice_cfg.get("voice_id") or voice_cfg.get("id") or mod.get("voice_id")
                
                # Check slides for voices
                slides = mod.get("slides", [])
                slide_voices = set()
                for slide in slides:
                    s_voice = slide.get("voice") or slide.get("voice_name") or slide.get("narrator")
                    if s_voice:
                        slide_voices.add(s_voice)
                
                v_key = (voice_name, voice_id)
                voice_counts[mod_id] = {
                    "module_id": mod_id,
                    "title": title,
                    "day": day_num,
                    "voice_name": voice_name,
                    "voice_id": voice_id,
                    "slide_voices": list(slide_voices)
                }
                
    print(f"Total modules analyzed: {len(voice_counts)}")
    # Print distinct voices
    distinct_voices = set()
    for mod_id, info in voice_counts.items():
        v = info["voice_name"]
        vid = info["voice_id"]
        distinct_voices.add((v, vid))
        for sv in info["slide_voices"]:
            distinct_voices.add((sv, None))
            
    print("Distinct voices found:")
    for v in distinct_voices:
        print(" -", v)
        
    print("\nFirst 10 modules and their voices:")
    for mod_id in list(voice_counts.keys())[:10]:
        print(f" - {mod_id}: {voice_counts[mod_id]}")

if __name__ == "__main__":
    inspect_transcripts_modules()

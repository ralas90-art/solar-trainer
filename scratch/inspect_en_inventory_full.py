import json
from pathlib import Path

def inspect_full():
    base = Path("scripts")
    for f in ["audio_inventory_en_core.json", "audio_inventory_en_additive.json"]:
        p = base / f
        if p.exists():
            data = json.loads(p.read_text(encoding="utf-8"))
            print(f"\n=== {f} (Total items: {len(data)}) ===")
            keys = set()
            for x in data:
                keys.update(x.keys())
            print("Keys inside item objects:", keys)
            
            # Let's see some specific details
            voices = set()
            unknowns = 0
            for idx, x in enumerate(data):
                voice_name = x.get("voiceName", x.get("voice_name", x.get("voice", None)))
                voice_id = x.get("voiceId", x.get("voice_id", None))
                if voice_name:
                    voices.add((voice_name, voice_id))
                else:
                    unknowns += 1
                if idx < 5:
                    print(f"Sample item {idx}: {x}")
            print(f"Voices found in metadata: {voices}")
            print(f"Items without voiceName/voice_name/voice: {unknowns}")
            
if __name__ == "__main__":
    inspect_full()

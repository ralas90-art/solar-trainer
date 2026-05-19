from pathlib import Path

def inspect_md():
    base = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator")
    p1 = base / "ElevenLabs_Transcripts_V2_Modules.md"
    p2 = base / "ElevenLabs_Transcripts_V2_Modules_ES.md"
    p3 = base / "ElevenLabs_Transcripts_MainDays_ES.md"
    
    for p in [p1, p2, p3]:
        if p.exists():
            print(f"=== {p.name} ===")
            content = p.read_text(encoding="utf-8")
            lines = content.splitlines()
            for line in lines[:30]:
                print(line)
        else:
            print(f"{p.name} does not exist")

if __name__ == "__main__":
    inspect_md()

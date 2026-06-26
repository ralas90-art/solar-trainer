import re
from pathlib import Path

def main():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\_Archive_Legacy\2026-05-11\solar-trainer_leftovers\SeptiVolt_Delivery\ES\ElevenLabs_Transcripts\ElevenLabs_Transcripts_MainDays_ES.md")
    text = p.read_text(encoding="utf-8")
    
    headers = re.findall(r'^#+\s+(.*)', text, re.MULTILINE)
    
    in_day_2 = False
    in_day_3 = False
    in_day_4 = False
    
    print("=== Headers in Day 2 & Day 3 in ES transcripts ===")
    for h in headers:
        if "DÍA 2" in h or "DIA 2" in h or "DÍA 2" in h.upper():
            in_day_2 = True
            in_day_3 = False
        elif "DÍA 3" in h or "DIA 3" in h or "DÍA 3" in h.upper():
            in_day_2 = False
            in_day_3 = True
        elif "DÍA 4" in h or "DIA 4" in h or "DÍA 4" in h.upper():
            in_day_2 = False
            in_day_3 = False
            in_day_4 = True
        elif "DÍA 5" in h or "DIA 5" in h or "DÍA 5" in h.upper():
            in_day_4 = False
            
        if in_day_2 or in_day_3:
            print(f"  {h}")
            
if __name__ == "__main__":
    main()

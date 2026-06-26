import re
from pathlib import Path

def main():
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\_Archive_Legacy\2026-05-11\solar-trainer_leftovers\SeptiVolt_Delivery\ES\ElevenLabs_Transcripts\ElevenLabs_Transcripts_MainDays_ES.md")
    text = p.read_text(encoding="utf-8")
    
    # Let's find Módulo 1.2 in the text
    start_idx = text.find("Módulo 1.2:")
    if start_idx == -1:
        start_idx = text.find("Mdulo 1.2:")
        
    if start_idx != -1:
        end_idx = text.find("Módulo 1.3:", start_idx + 10)
        if end_idx == -1:
            end_idx = text.find("Mdulo 1.3:", start_idx + 10)
        print("=== Transcript for Módulo 1.2 ===")
        print(text[start_idx:end_idx])
    else:
        print("Módulo 1.2 not found in transcripts")

if __name__ == "__main__":
    main()

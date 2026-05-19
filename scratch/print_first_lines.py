from pathlib import Path
import sys

def print_first_lines():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator\ElevenLabs_Transcripts_V2_Modules.md")
    if not p.exists():
        print("MD file does not exist.")
        return
        
    lines = p.read_text(encoding="utf-8", errors="ignore").splitlines()
    print(f"Total lines: {len(lines)}")
    for idx, line in enumerate(lines[:100]):
        safe_text = line.encode("ascii", errors="replace").decode("ascii")
        print(f"{idx+1:3d}: {safe_text}")

if __name__ == "__main__":
    print_first_lines()

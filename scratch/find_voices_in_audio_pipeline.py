from pathlib import Path
import re
import sys

def parse_pipeline_log():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\audio_pipeline_all.log")
    if not p.exists():
        print("audio_pipeline_all.log does not exist.")
        return
        
    content = p.read_text(encoding="utf-8", errors="ignore")
    lines = content.splitlines()
    print(f"Total lines in audio_pipeline_all.log: {len(lines)}")
    
    # Let's search for "generating", "voice", "tom", "rachel", "dom"
    matches = []
    for idx, line in enumerate(lines):
        if any(term in line.lower() for term in ["generating", "saving", "voice", "audio"]):
            matches.append((idx + 1, line.strip()))
            
    print(f"Total matching lines: {len(matches)}")
    for line_num, text in matches[:200]:
        safe_text = text.encode("ascii", errors="replace").decode("ascii")
        print(f"Line {line_num}: {safe_text}")

if __name__ == "__main__":
    parse_pipeline_log()

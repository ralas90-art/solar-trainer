from pathlib import Path
import re
import sys

def inspect_all_logs():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\audio_pipeline_all.log")
    if not p.exists():
        print("audio_pipeline_all.log does not exist.")
        return
        
    content = p.read_text(encoding="utf-8", errors="ignore")
    print(f"Log size: {len(content)} characters.")
    
    terms = ["Rachel", "Tom", "Dom", "voice", "voice_id"]
    matches = []
    for idx, line in enumerate(content.splitlines()):
        for term in terms:
            if re.search(r"\b" + term + r"\b", line, re.IGNORECASE):
                matches.append((idx + 1, line.strip()))
                break
                
    print(f"Total matching lines in log: {len(matches)}")
    for line_num, text in matches[:100]:
        safe_text = text.encode("ascii", errors="replace").decode("ascii")
        print(f" - Line {line_num}: {safe_text[:150]}")

if __name__ == "__main__":
    inspect_all_logs()

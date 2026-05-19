from pathlib import Path
import re
import sys

def inspect_legacy_logs():
    # Force utf-8 stdout encoding if possible
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\_Archive_Legacy\2026-05-11\audio_pipeline.log")
    if not p.exists():
        print("Log file does not exist.")
        return
        
    content = p.read_text(encoding="utf-8", errors="ignore")
    print(f"Log size: {len(content)} characters.")
    
    terms = ["Rachel", "Tom", "Dom", "voice"]
    matches = []
    for idx, line in enumerate(content.splitlines()):
        for term in terms:
            if re.search(r"\b" + term + r"\b", line, re.IGNORECASE):
                matches.append((idx + 1, line.strip()))
                break
                
    print(f"Total matching lines in log: {len(matches)}")
    for line_num, text in matches[:100]:
        # Encode and decode back with ignore/replace to avoid terminal crash
        safe_text = text.encode("ascii", errors="replace").decode("ascii")
        print(f" - Line {line_num}: {safe_text[:150]}")

if __name__ == "__main__":
    inspect_legacy_logs()

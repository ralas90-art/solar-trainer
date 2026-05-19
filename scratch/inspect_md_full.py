from pathlib import Path
import re
import sys

def inspect_md():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    base = Path(r"c:\Users\12132\Documents\Claude\Projects\Solar Sales Accelorator")
    p = base / "ElevenLabs_Transcripts_V2_Modules.md"
    if not p.exists():
        print("MD file does not exist.")
        return
        
    content = p.read_text(encoding="utf-8", errors="ignore")
    print(f"MD size: {len(content)} characters.")
    
    # Let's search for "Voice" or similar words
    terms = ["voice", "Rachel", "Tom", "Dom", "narrator"]
    matches = []
    for idx, line in enumerate(content.splitlines()):
        for term in terms:
            if re.search(r"\b" + term + r"\b", line, re.IGNORECASE):
                matches.append((idx + 1, line.strip()))
                break
                
    print(f"Total matching lines in MD: {len(matches)}")
    for line_num, text in matches[:100]:
        safe_text = text.encode("ascii", errors="replace").decode("ascii")
        print(f" - Line {line_num}: {safe_text[:150]}")

if __name__ == "__main__":
    inspect_md()

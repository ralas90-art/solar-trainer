from pathlib import Path
import sys

def print_all_legacy_lines():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\_Archive_Legacy\2026-05-11\audio_pipeline.log")
    if not p.exists():
        print("Legacy log file does not exist.")
        return
        
    lines = p.read_text(encoding="utf-8", errors="ignore").splitlines()
    print(f"Total lines: {len(lines)}")
    for idx, line in enumerate(lines):
        safe_text = line.encode("ascii", errors="replace").decode("ascii")
        print(f"{idx+1:3d}: {safe_text}")

if __name__ == "__main__":
    print_all_legacy_lines()

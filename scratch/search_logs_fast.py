import os
from pathlib import Path

def search_logs():
    brain_dir = Path("C:\\Users\\12132\\.gemini\\antigravity\\brain")
    if not brain_dir.exists():
        print("Brain directory does not exist.")
        return

    print("Searching for manifest, voiceName, and other key terms in conversation logs...")
    terms = ["ElevenLabs_Production_Manifest.json", "voiceName", "rachel", "Rachel", "Tom", "tom", "dom", "Dom"]
    
    # We only look at files in brain/*/logs/ or brain/*/.system_generated/logs/
    for log_file in brain_dir.rglob("*.txt"):
        if "logs" in log_file.parts or ".system_generated" in log_file.parts:
            try:
                content = log_file.read_text(encoding="utf-8", errors="ignore")
                for term in terms:
                    if term in content:
                        print(f"\nFound term '{term}' in log: {log_file} ({log_file.stat().st_size} bytes)")
                        # print context around the term
                        lines = content.splitlines()
                        for idx, line in enumerate(lines):
                            if term in line:
                                start_idx = max(0, idx - 2)
                                end_idx = min(len(lines), idx + 3)
                                print(f"  --- Context around line {idx+1} ---")
                                for context_line in lines[start_idx:end_idx]:
                                    print(f"    {context_line[:200]}")
                                break  # only show one match per file for this term
            except Exception as e:
                pass

if __name__ == "__main__":
    search_logs()

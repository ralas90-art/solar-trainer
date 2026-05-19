from pathlib import Path
import re
import sys

def parse_legacy_pipeline_log():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
        
    p = Path(r"c:\Users\12132\Desktop\Antigravity Solar Sales Trainer Agent\_Archive_Legacy\2026-05-11\audio_pipeline.log")
    if not p.exists():
        print("Legacy log file does not exist.")
        return
        
    content = p.read_text(encoding="utf-8", errors="ignore")
    lines = content.splitlines()
    print(f"Total lines in legacy audio_pipeline.log: {len(lines)}")
    
    # Check for voice and module lines
    current_voice = None
    voice_mods = {}
    
    for idx, line in enumerate(lines):
        # Look for voice statements like "Voice: Rachel (21m00Tcm4TlvDq8ikWAM)" or similar
        voice_match = re.search(r"Voice:\s*(\w+)\s*\(([a-zA-Z0-9]+)\)", line)
        if voice_match:
            current_voice = voice_match.group(1)
            if current_voice not in voice_mods:
                voice_mods[current_voice] = set()
                
        # Look for generating modules, like "Processing Module: mod_1_1" or files being written
        mod_match = re.search(r"Processing Module:\s*(\w+)", line)
        if mod_match and current_voice:
            voice_mods[current_voice].add(mod_match.group(1))
            
        # File matches like "...mod_1_1..." or "mod_1_1_intro"
        file_match = re.search(r"Generating\s+(mod_\d+_\w+)\.mp3", line)
        if file_match and current_voice:
            mod_prefix = re.match(r"(mod_\d+_\d+)", file_match.group(1)) or re.match(r"(mod_\d+)", file_match.group(1))
            if mod_prefix:
                voice_mods[current_voice].add(mod_prefix.group(1))
                
    for voice, mods in voice_mods.items():
        print(f"Voice '{voice}' generated modules: {sorted(list(mods))} (total {len(mods)})")

if __name__ == "__main__":
    parse_legacy_pipeline_log()

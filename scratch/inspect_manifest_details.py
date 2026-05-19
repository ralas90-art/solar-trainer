import re
from pathlib import Path

def inspect_manifest_details():
    path = Path("frontend/lib/audio-manifest.ts")
    content = path.read_text(encoding="utf-8")
    
    # Let's find all instances of defaultVoiceId inside the module definitions
    # Structure is usually:
    # mod_X_Y: {
    #   moduleId: "mod_X_Y",
    #   defaultVoiceId: ...,
    # }
    
    # We can match `mod_(\d+_\d+):\s*\{\s*moduleId:\s*"mod_\1",\s*defaultVoiceId:\s*([^,}]+)`
    pattern = r'mod_(\d+_\d+\w*):\s*\{\s*moduleId:\s*"mod_\1",\s*defaultVoiceId:\s*([^,}]+)'
    matches = re.findall(pattern, content)
    
    print(f"Found {len(matches)} modules with defaultVoiceId in the static definition:")
    for mod, voice in matches:
        print(f" - {mod}: {voice.strip()}")

if __name__ == "__main__":
    inspect_manifest_details()

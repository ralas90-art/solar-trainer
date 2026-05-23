import os
import json
from pathlib import Path

def generate_manifest():
    print("=== Generating SeptiVolt Audio Manifest ===")
    
    audio_base = Path("frontend/public/audio/modules")
    if not audio_base.exists():
        print(f"Error: audio base directory {audio_base} does not exist.")
        return
        
    manifest = {}
    
    # Iterate through all module directories
    for mod_dir in sorted(audio_base.iterdir()):
        if not mod_dir.is_dir():
            continue
            
        mod_id = mod_dir.name
        # Skip es directory if it exists as a legacy folder
        if mod_id == "es":
            continue
            
        manifest[mod_id] = {}
        
        # Scan all .mp3 files in this module folder
        for file_path in sorted(mod_dir.glob("*.mp3")):
            file_name = file_path.name
            
            # Determine if it's Spanish or English
            if file_name.endswith("_es.mp3"):
                section_id = file_name[:-7]  # remove '_es.mp3'
                lang = "es"
            else:
                section_id = file_name[:-4]  # remove '.mp3'
                lang = "en"
                
            if section_id not in manifest[mod_id]:
                manifest[mod_id][section_id] = {"en": False, "es": False}
                
            manifest[mod_id][section_id][lang] = True

    # Generate the TypeScript file contents
    ts_content = f"""/**
 * AUTO-GENERATED SeptiVolt Audio Manifest
 * 
 * Generated: {Path(__file__).name}
 * Do not edit manually — run scripts/generate_audio_manifest.py to regenerate.
 */

export type AudioSectionAvailability = {{
  en: boolean
  es: boolean
}}

export const AUDIO_MANIFEST: Record<string, Record<string, AudioSectionAvailability>> = {json.dumps(manifest, indent=2)};
"""

    output_path = Path("frontend/lib/audio-manifest.generated.ts")
    output_path.write_text(ts_content, encoding="utf-8")
    print(f"Manifest successfully generated at {output_path}")
    print(f"Total modules mapped: {len(manifest)}")

if __name__ == "__main__":
    generate_manifest()

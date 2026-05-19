import json
import os
import shutil
import requests
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv("backend/.env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"
MODEL_ID = "eleven_v3"

def update_manifest_file(generated_files):
    manifest_path = Path("frontend/lib/audio-manifest.ts")
    if not manifest_path.exists():
        print("Manifest not found at", manifest_path)
        return
        
    content = manifest_path.read_text(encoding="utf-8")
    
    # We want to add these fields to each matched fileUrl segment.
    # Pattern to match: { id: "...", title: "...", fileUrl: "/audio/modules/mod_X_Y/file.mp3", hasStaticAsset: true }
    # We will replace `hasStaticAsset: true }` with `hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" }`
    
    for filename in generated_files:
        # Example filename: "mod_1_1_intro.mp3"
        # We look for a segment object containing this filename.
        # It looks like: { id: "mod_1_1_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_1/mod_1_1_intro.mp3", hasStaticAsset: true }
        
        # We need to make sure we don't duplicate the properties if we run it twice
        search_pattern = rf'(fileUrl:\s*"[^"]+{filename}",\s*hasStaticAsset:\s*true)(\s*\}})'
        
        replacement = r'\1, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" \2'
        
        if re.search(search_pattern, content):
            content = re.sub(search_pattern, replacement, content)
            print(f"Updated manifest for {filename}")
        else:
            # Maybe it already has the properties, let's check
            check_pattern = rf'fileUrl:\s*"[^"]+{filename}",\s*hasStaticAsset:\s*true,\s*voiceName:'
            if re.search(check_pattern, content):
                print(f"Manifest already updated for {filename}")
            else:
                print(f"Could not find segment in manifest for {filename}")
                
    manifest_path.write_text(content, encoding="utf-8")
    print("Manifest successfully saved.")

def regenerate_batch_1():
    print("Starting Batch 1 regeneration...")
    
    with open("artifacts/batch_1_dry_run_report.json", "r", encoding="utf-8") as f:
        report = json.load(f)
        
    backup_dir = Path("scratch/backup_audio_rachel")
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    audio_dir_base = Path("frontend/public/audio/modules")
    
    success_count = 0
    fail_count = 0
    generated_files = []

    for module in report["modules"]:
        mod_id = module["moduleId"]
        print(f"Processing module: {mod_id}")
        
        mod_audio_dir = audio_dir_base / mod_id
        mod_audio_dir.mkdir(parents=True, exist_ok=True)
        
        for file_info in module["files"]:
            file_name = file_info["fileName"]
            text = file_info["text"]
            
            output_path = mod_audio_dir / file_name
            
            # 1. Backup if exists
            if output_path.exists():
                backup_path = backup_dir / file_name
                shutil.copy2(output_path, backup_path)
                print(f"  Backed up {file_name} -> {backup_path}")
            
            # 2. Generate with ElevenLabs
            print(f"  Generating {file_name}...")
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": API_KEY
            }
            data = {
                "text": text,
                "model_id": MODEL_ID,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            
            try:
                response = requests.post(url, json=data, headers=headers)
                if response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(response.content)
                    print(f"  [OK] Saved {output_path}")
                    success_count += 1
                    generated_files.append(file_name)
                else:
                    print(f"  [ERROR] Failed to generate {file_name}: {response.status_code} {response.text}")
                    fail_count += 1
            except Exception as e:
                print(f"  [EXCEPTION] Error generating {file_name}: {e}")
                fail_count += 1

    # Update manifest
    if generated_files:
        update_manifest_file(generated_files)

    print(f"\nRegeneration complete. Success: {success_count}, Failed: {fail_count}")

if __name__ == "__main__":
    regenerate_batch_1()

import json
import os
import shutil
import requests
import re
from pathlib import Path
from dotenv import load_dotenv
import time

load_dotenv("backend/.env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD" # Tom
MODEL_ID = "eleven_v3"

def clean_text(value: str) -> str:
    text = " ".join(value.split())
    # Clean specific CP437 corruptions if any
    replacements = {
        'â€”': '—',
        'â€“': '–',
        'â€™': '’',
        'â€œ': '“',
        'â€': '”',
        'â€¦': '…'
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def extract_lesson_overview(module):
    for sec in module.get('sections', []):
        if sec.get('type') in ['text', 'quote'] and sec.get('content'):
            return clean_text(sec.get('content'))[:360]
    for sec in module.get('sections', []):
        if sec.get('type') == 'list' and sec.get('content'):
            return clean_text(sec.get('content'))
    return "Complete this module to build confidence for high-pressure homeowner conversations."

def update_manifest_file(generated_files):
    manifest_path = Path("frontend/lib/audio-manifest.ts")
    if not manifest_path.exists():
        print("Manifest not found at", manifest_path)
        return
        
    content = manifest_path.read_text(encoding="utf-8")
    
    for filename in generated_files:
        # Check if the file is already fully mapped
        check_pattern = rf'fileUrl:\s*"[^"]+{filename}",\s*hasStaticAsset:\s*true,\s*voiceName:'
        if re.search(check_pattern, content):
            continue
            
        search_pattern = rf'(fileUrl:\s*"[^"]+{filename}",\s*hasStaticAsset:\s*true)(\s*\}})'
        replacement = r'\1, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" \2'
        
        if re.search(search_pattern, content):
            content = re.sub(search_pattern, replacement, content)
        else:
            # We might need to add the entire segment entry if it was missing in manifest
            # Example missing entry
            mod_id_match = re.search(r'(mod_\d+_\d+)_', filename)
            if mod_id_match:
                mod_id = mod_id_match.group(1)
                mod_pattern = rf'({mod_id}:\s*\{{.*?segments:\s*\[)(.*?)(\]\s*\}})'
                match = re.search(mod_pattern, content, flags=re.DOTALL)
                if match:
                    prefix = match.group(1)
                    segments_str = match.group(2)
                    suffix = match.group(3)
                    
                    seg_id = filename.replace(".mp3", "")
                    title = "Segment" if "segment" in filename else "Intro/Outro"
                    if "intro" in filename: title = "Introduction"
                    elif "transition" in filename: title = "Transition to Simulation"
                    
                    file_url = f"/audio/modules/{mod_id}/{filename}"
                    new_entry = f'\n      {{ id: "{seg_id}", title: "{title}", fileUrl: "{file_url}", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" }},'
                    
                    # insert logic
                    if "transition" in segments_str and "transition" not in seg_id:
                        segments_str = re.sub(r'(\n\s*\{\s*id:\s*"[^"]*transition.*)', new_entry + r'\1', segments_str, count=1)
                    else:
                        segments_str += new_entry
                        
                    content = content[:match.start()] + prefix + segments_str + suffix + content[match.end():]

    manifest_path.write_text(content, encoding="utf-8")
    print("Manifest successfully saved for batch.")

def run_regeneration():
    with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
        modules_en = json.load(f)

    with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
        audio_inventory = json.load(f)

    # Filter targets
    target_mods = []
    for day in range(2, 8):
        for mid in audio_inventory.keys():
            if mid.startswith(f"mod_{day}_"):
                target_mods.append(mid)

    target_mods.sort(key=lambda x: [int(p) if p.isdigit() else p for p in re.split(r'(\d+)', x)])

    audio_dir_base = Path("frontend/public/audio/modules")
    backup_base = Path("scratch/backup_audio_rachel")

    total_success = 0
    total_failed = 0

    print(f"Total modules to process: {len(target_mods)}")

    for mid in target_mods:
        day_num = mid.split("_")[1]
        print(f"\nProcessing Batch {day_num} - Module {mid}...")
        
        module = modules_en.get(mid)
        if not module:
            print(f"ERROR: {mid} not found in modules_en.json")
            continue
            
        lesson_title = module.get('title', '')
        lesson_overview = extract_lesson_overview(module)
        
        sim_scenarios = []
        for sec in module.get('sections', []):
            if sec.get('type') == 'simulation':
                sim_scenarios.append(sec.get('title', ''))
        transition_scenario = sim_scenarios[0] if sim_scenarios else "assigned scenario"
        
        non_sim_sections = [s for s in module.get('sections', []) if s.get('type') != 'simulation']
        first_seg_text = clean_text(non_sim_sections[0].get('content', '')) if non_sim_sections else ""
        is_intro_redundant = first_seg_text.lower().startswith(lesson_overview.lower()[:50])
        
        intro_text = f"Welcome to {lesson_title}. Let's get started." if is_intro_redundant else f"Welcome to {lesson_title}. {lesson_overview}"
        
        mapped_segments = {}
        mapped_segments[f"{mid}_intro"] = intro_text
        
        for idx, sec in enumerate(non_sim_sections):
            seg_id = f"{mid}_segment_{idx + 1}"
            sec_text = clean_text(sec.get('content', ''))
            mapped_segments[seg_id] = sec_text if sec_text else f"Module Section: {sec.get('title')}"
        
        mapped_segments[f"{mid}_transition"] = f"Complete the knowledge check, then launch simulation scenario {transition_scenario}. Focus on clear discovery, concise framing, and confident next-step language."
        
        expected_files = audio_inventory.get(mid, {}).get('files', [])
        
        mod_audio_dir = audio_dir_base / mid
        mod_audio_dir.mkdir(parents=True, exist_ok=True)
        
        backup_dir = backup_base / f"batch_{day_num}" / mid
        backup_dir.mkdir(parents=True, exist_ok=True)
        
        generated_files = []
        
        for file_name in expected_files:
            stem = Path(file_name).stem
            if stem not in mapped_segments:
                print(f"WARNING: No text matched for {file_name}")
                continue
                
            text = mapped_segments[stem]
            output_path = mod_audio_dir / file_name
            
            # 1. Backup if exists
            if output_path.exists():
                backup_path = backup_dir / file_name
                shutil.copy2(output_path, backup_path)
            
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
                    print(f"  [OK] Saved {file_name}")
                    total_success += 1
                    generated_files.append(file_name)
                else:
                    print(f"  [ERROR] Failed to generate {file_name}: {response.status_code} {response.text}")
                    total_failed += 1
            except Exception as e:
                print(f"  [EXCEPTION] Error generating {file_name}: {e}")
                total_failed += 1
                
        if generated_files:
            update_manifest_file(generated_files)
            
    print(f"\nAll batches complete. Success: {total_success}, Failed: {total_failed}")

if __name__ == "__main__":
    run_regeneration()

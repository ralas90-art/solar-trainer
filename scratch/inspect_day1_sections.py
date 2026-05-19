import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load modules
with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

# Load expected files for day 1
with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
    audio_inventory = json.load(f)

day1_mods = ['mod_1_1', 'mod_1_2', 'mod_1_3', 'mod_1_4', 'mod_1_5', 'mod_1_6', 'mod_1_7', 'mod_1_8']

for mid in day1_mods:
    module = modules_en.get(mid)
    if not module:
        print(f"{mid}: NOT FOUND")
        continue
    
    sections = [s for s in module.get('sections', []) if s.get('type') != 'simulation']
    print(f"\n{mid}: {module.get('title')}")
    print(f"  Raw non-simulation sections ({len(sections)}):")
    for idx, s in enumerate(sections):
        print(f"    {idx+1}. title='{s.get('title')}', text_len={len(s.get('content', ''))}")
    
    expected_files = audio_inventory.get(mid, {}).get('files', [])
    print(f"  Expected files in inventory ({len(expected_files)}):")
    print(f"    {expected_files}")

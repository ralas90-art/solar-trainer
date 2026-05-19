import json
import sys

# Safe encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
    audio_inv = json.load(f)

day1_mods = ['mod_1_1', 'mod_1_2', 'mod_1_3', 'mod_1_4', 'mod_1_5', 'mod_1_6', 'mod_1_7', 'mod_1_8']

for mid in day1_mods:
    mod = modules_en.get(mid, {})
    files = audio_inv.get(mid, {}).get('files', [])
    sections = mod.get('sections', [])
    print(f"Module: {mid}")
    print(f"  Title: {mod.get('title')}")
    print(f"  Sections in modules_en.json ({len(sections)}):")
    for idx, sec in enumerate(sections):
        print(f"    Sec {idx+1}: Title='{sec.get('title')}', Content Length={len(sec.get('content', ''))}")
    print(f"  Audio files in inventory ({len(files)}):")
    for f in files:
        print(f"    - {f}")
    print("-" * 40)

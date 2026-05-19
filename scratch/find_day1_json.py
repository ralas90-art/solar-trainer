from pathlib import Path
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search for json files
json_files = list(Path('.').glob('**/*.json'))
print(f"Found {len(json_files)} JSON files in project.")

# Let's see which files contain references to mod_1_1 or Day 1 modules
day1_mods = ['mod_1_1', 'mod_1_2', 'mod_1_3', 'mod_1_4', 'mod_1_5', 'mod_1_6', 'mod_1_7', 'mod_1_8']

for jf in json_files:
    if 'node_modules' in jf.parts or '.vercel' in jf.parts or '.git' in jf.parts:
        continue
    try:
        # Check both utf-8 and utf-16
        data = None
        for enc in ['utf-8', 'utf-16']:
            try:
                with open(jf, 'r', encoding=enc) as f:
                    data = json.load(f)
                break
            except:
                pass
        if data is None:
            continue
        
        # Check if any day1_mods is in the keys or values
        found = []
        data_str = json.dumps(data)
        for m in day1_mods:
            if m in data_str:
                found.append(m)
        if found:
            print(f"File: {jf} contains Day 1 modules: {found}")
    except Exception as e:
        print(f"Error reading {jf}: {e}")

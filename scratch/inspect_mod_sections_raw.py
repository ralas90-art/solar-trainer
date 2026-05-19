import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

mod = modules_en.get('mod_1_1', {})
sections = mod.get('sections', [])
for idx, sec in enumerate(sections):
    print(f"Section {idx+1}: title='{sec.get('title')}', type='{sec.get('type')}'")

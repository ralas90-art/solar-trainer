import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
    inv = json.load(f)

for mod_id, data in inv.items():
    print(f"{mod_id}: {data.get('files', [])}")

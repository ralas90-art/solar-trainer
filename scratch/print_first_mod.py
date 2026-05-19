import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/narration_transcripts_part1_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

first_day = data['days'][0]
print("first_day keys:", list(first_day.keys()))
first_mod = first_day['modules'][0]
print("first_mod keys and content:", first_mod)

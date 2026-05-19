import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/curriculum_map.json', 'r', encoding='utf-8') as f:
    cmap = json.load(f)

day1 = cmap.get('days', [])[0]
mod1_1 = day1.get('modules', [])[0]
tsegs = mod1_1.get('transcript_segments', [])

print(f"Number of transcript segments in module 1.1: {len(tsegs)}")
if tsegs:
    print("First segment keys:", list(tsegs[0].keys()))
    print("First segment structure:")
    print(json.dumps(tsegs[0], indent=2))
    print("-" * 50)
    print("Last segment structure:")
    print(json.dumps(tsegs[-1], indent=2))

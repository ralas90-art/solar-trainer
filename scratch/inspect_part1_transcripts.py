import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/narration_transcripts_part1_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Keys in narration_transcripts_part1_updated.json:")
print(data.keys())

# Let's inspect the first day and the first module
days = data.get('days', [])
print(f"Number of days: {len(days)}")

if days:
    day = days[0]
    print(f"Day number: {day.get('day_number')}")
    modules = day.get('modules', [])
    print(f"Number of modules: {len(modules)}")
    if modules:
        mod = modules[0]
        print(f"Module keys: {list(mod.keys())}")
        print(f"Module ID: {mod.get('module_id')}")
        print(f"Module Title: {mod.get('module_title')}")
        slides = mod.get('slides', [])
        print(f"Number of slides: {len(slides)}")
        if slides:
            print("First slide keys:", list(slides[0].keys()))
            print("First slide:", json.dumps(slides[0], indent=2))

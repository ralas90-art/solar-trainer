import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/curriculum_map.json', 'r', encoding='utf-8') as f:
    cmap = json.load(f)

days = cmap.get('days', [])
print(f"Days in curriculum_map.json: {len(days)}")

if days:
    day = days[0]
    print(f"Day Keys: {list(day.keys())}")
    print(f"Day Number: {day.get('day_number')}")
    modules = day.get('modules', [])
    print(f"Modules: {len(modules)}")
    if modules:
        mod = modules[0]
        print(f"Module Keys: {list(mod.keys())}")
        print(f"Module ID: {mod.get('module_id')}")
        print(f"Module Title: {mod.get('module_title')}")
        
        # Let's see if there is audio or segments
        print("Module content sample:")
        print(json.dumps(mod, indent=2)[:1000])

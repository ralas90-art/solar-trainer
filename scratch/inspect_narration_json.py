import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/narration_transcripts_part1_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("program_title:", data.get('program_title'))
print("days_covered:", data.get('days_covered'))
days = data.get('days', [])
print("Days list length:", len(days))

for d_idx, day_item in enumerate(days):
    print(f"\nDay {d_idx+1} keys/type: {type(day_item)}")
    if isinstance(day_item, dict):
        print(f"  day_id: {day_item.get('day_id') or day_item.get('day')}")
        modules = day_item.get('modules', [])
        print(f"  Modules count: {len(modules)}")
        for m_idx, mod in enumerate(modules):
            print(f"    Module {m_idx+1}: id={mod.get('module_id')}, title='{mod.get('title')}'")
            sections = mod.get('sections', [])
            print(f"      Sections count: {len(sections)}")
            # Show first section details
            if sections:
                sec = sections[0]
                print(f"        First Section: id={sec.get('section_id')}, title='{sec.get('title')}', text len: {len(sec.get('text', ''))}")

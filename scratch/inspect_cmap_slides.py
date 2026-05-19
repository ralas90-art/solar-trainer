import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/curriculum_map.json', 'r', encoding='utf-8') as f:
    cmap = json.load(f)

day1 = cmap.get('days', [])[0]
mod1_1 = day1.get('modules', [])[0]
slides = mod1_1.get('slides', [])

print(f"Number of slides in mod_1_1: {len(slides)}")
for idx, slide in enumerate(slides):
    print(f"Slide {slide.get('slide_number')}: Title='{slide.get('slide_title')}'")
    # let's see keys
    print(f"  Keys: {list(slide.keys())}")
    # print some fields
    print(f"  audio_url: {slide.get('audio_url')}")
    print(f"  narrative: {slide.get('narrative') or slide.get('narration') or slide.get('trainer_script')}")
    print("-" * 50)

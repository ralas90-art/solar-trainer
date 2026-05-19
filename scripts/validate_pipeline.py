import json
from pathlib import Path

data = json.loads(Path('narration_transcripts_part1.json').read_text(encoding='utf-8'))
for day in data['days']:
    for mod in day['modules']:
        if mod['module_id'] == '1.1':
            slides = mod['slides']
            print(f"Module 1.1 found in Day {day['day_number']}")
            print(f"Slides to process: {len(slides)}")
            for s in slides:
                words = len(s['narration'].split())
                path = f"audio/day-{day['day_number']}/module-1.1/slide-{s['slide_number']}.mp3"
                print(f"  Slide {s['slide_number']:>2} | {words} words | -> {path}")

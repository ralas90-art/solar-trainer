import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load the narration transcripts json file
with open('scripts/narration_transcripts_part1_updated.json', 'r', encoding='utf-8') as f:
    transcripts = json.load(f)

print(f"Type of transcripts: {type(transcripts)}")
if isinstance(transcripts, list):
    print(f"Length: {len(transcripts)}")
    # Print first 3 segments
    for idx, item in enumerate(transcripts[:3]):
        print(f"[{idx}] module_id: {item.get('module_id')}, section_id: {item.get('section_id')}, text: '{item.get('text')[:100]}...'")
elif isinstance(transcripts, dict):
    print(f"Keys: {list(transcripts.keys())}")

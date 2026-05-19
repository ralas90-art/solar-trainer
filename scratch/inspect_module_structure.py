import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read modules_en.json
with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

mod1_1 = modules_en.get('mod_1_1', {})
print("mod1_1 main keys:")
print(list(mod1_1.keys()))

print("\nlessonOverview:")
print(mod1_1.get('lessonOverview'))

print("\ninstructionalSegments count:", len(mod1_1.get('instructionalSegments', [])))
for idx, seg in enumerate(mod1_1.get('instructionalSegments', [])):
    print(f"\nSegment {idx+1}:")
    print(f"  id: {seg.get('id')}")
    print(f"  title: {seg.get('title')}")
    print(f"  spokenTeachingScript: {seg.get('spokenTeachingScript')[:200]}...")
    print(f"  slideContent: {seg.get('slideContent')[:100]}...")

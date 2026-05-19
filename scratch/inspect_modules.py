import json

# Load modules_en.json
with open('scripts/modules_en.json', 'r', encoding='utf-16') as f:
    modules_en = json.load(f)

# Load audio_inventory_en_core.json
with open('scripts/audio_inventory_en_core.json', 'r', encoding='utf-8') as f:
    audio_inv = json.load(f)

# Let's inspect mod_1_1 in modules_en
m1_1 = modules_en.get('mod_1_1', {})
print("=== mod_1_1 in modules_en ===")
print("Keys:", list(m1_1.keys()))
print("Title:", m1_1.get('title'))
print("Subtitle:", m1_1.get('subtitle'))
print("Number of sections:", len(m1_1.get('sections', [])))
for idx, sec in enumerate(m1_1.get('sections', [])):
    print(f"Section {idx+1}:")
    print(f"  id: {sec.get('id')}")
    print(f"  title: {sec.get('title')}")
    print(f"  has content: {bool(sec.get('content'))}")
    print(f"  content (start): {sec.get('content', '')[:50]}...")

print("\n=== Audio inventory for mod_1_1 ===")
print(audio_inv.get('mod_1_1', {}))

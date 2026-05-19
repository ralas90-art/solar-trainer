import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/audio_inventory_map.json', 'r', encoding='utf-8') as f:
    audio_map = json.load(f)

print("=== audio_inventory_map.json keys ===")
print(list(audio_map.keys()))

print("\n=== en_core keys inside audio_inventory_map.json ===")
en_core = audio_map.get('en_core', {})
print(f"Number of modules in en_core: {len(en_core)}")
print("Keys (up to 10):", list(en_core.keys())[:10])

# Let's inspect mod_1_1 in en_core
m1_1 = en_core.get('mod_1_1', {})
print("\n=== mod_1_1 in en_core ===")
print("Type:", type(m1_1))
if isinstance(m1_1, dict):
    print("Keys:", list(m1_1.keys()))
    for k, v in m1_1.items():
        print(f"  {k}: {type(v)}")
        if isinstance(v, dict):
            print(f"    keys: {list(v.keys())}")
            if 'text' in v:
                print(f"    text (start): {v['text'][:50]}...")
            elif 'transcript' in v:
                print(f"    transcript (start): {v['transcript'][:50]}...")
            elif 'content' in v:
                print(f"    content (start): {v['content'][:50]}...")
        elif isinstance(v, list):
            print(f"    length: {len(v)}")
            if v:
                print(f"    first element type: {type(v[0])}")
                if isinstance(v[0], dict):
                    print(f"    first element keys: {list(v[0].keys())}")

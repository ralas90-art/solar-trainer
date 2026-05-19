import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/curriculum_map.json', 'r', encoding='utf-8') as f:
    cmap = json.load(f)

print("curriculum_map.json main keys:")
print(list(cmap.keys()))

# Let's search inside curriculum_map.json for mod_1_1 files or segments
# Let's write a recursive search function to find where "mod_1_1_intro.mp3" is mentioned and see the surrounding structure
def find_key_val(d, target, path=""):
    if isinstance(d, dict):
        for k, v in d.items():
            current_path = f"{path}.{k}" if path else k
            if k == target or v == target or (isinstance(v, str) and target in v):
                print(f"FOUND: {current_path} -> {v}")
            find_key_val(v, target, current_path)
    elif isinstance(d, list):
        for idx, item in enumerate(d):
            current_path = f"{path}[{idx}]"
            if item == target or (isinstance(item, str) and target in item):
                print(f"FOUND: {current_path} -> {item}")
            find_key_val(item, target, current_path)

print("\nSearching for 'mod_1_1_intro.mp3' in curriculum_map.json:")
find_key_val(cmap, 'mod_1_1_intro.mp3')

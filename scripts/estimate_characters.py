import json
from pathlib import Path

def get_chars(json_path, encoding, filter_ids=None):
    try:
        with open(json_path, 'r', encoding=encoding) as f:
            data = json.load(f)
        total = 0
        for mid, mod in data.items():
            if filter_ids and mid not in filter_ids:
                continue
            for section in mod.get('sections', []):
                total += len(section.get('content', ''))
        return total
    except Exception as e:
        print(f"Error reading {json_path}: {e}")
        return 0

missing_en = ['mod_1_5a', 'mod_1_5b', 'mod_1_7a', 'mod_3_7a', 'mod_3_7b', 'mod_4_1a', 'mod_4_2a', 'mod_4_2b', 'mod_4_4a', 'mod_4_8', 'mod_5_5a', 'mod_5_5b', 'mod_5_5c', 'mod_5_5d', 'mod_5_7', 'mod_5_8', 'mod_6_1a', 'mod_6_2a', 'mod_6_3a', 'mod_6_4a', 'mod_6_8']

en_total = get_chars('scripts/modules_en.json', 'utf-16', missing_en)
es_total = get_chars('scripts/modules_es.json', 'utf-16')

print(f"English Missing Characters: {en_total}")
print(f"Spanish Total Characters:   {es_total}")
print(f"Combined Total:            {en_total + es_total}")

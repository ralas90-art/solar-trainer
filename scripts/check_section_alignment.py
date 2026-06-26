import re
from pathlib import Path

es_file = Path('frontend/lib/modules.es.ts').read_text(encoding='utf-8')

for mod_id in ['mod_1_2', 'mod_1_5']:
    pattern = mod_id + r'.*?sections:\s*\[(.+?)workbookPrompts'
    match = re.search(pattern, es_file, re.DOTALL)
    if match:
        sections_block = match.group(1)
        types = re.findall(r'type:\s*["\'](\w+)["\']', sections_block)
        non_sim = [t for t in types if t != 'simulation']
        n = len(non_sim)
        seg_ids = [f'{mod_id}_intro'] + [f'{mod_id}_segment_{i+1}' for i in range(n)] + [f'{mod_id}_transition']
        print(f'\n{mod_id}: {n} sections -> expected section IDs:')
        for sid in seg_ids:
            print(f'  {sid}')
    else:
        print(f'{mod_id}: pattern not matched')

"""
Full section ID alignment validator.
Compares:
  - Section IDs the audio player would request (derived from modules.es.ts section count)
  - File names present on disk in frontend/public/audio/modules/{moduleId}/

Reports PASS or MISMATCH for each module in both EN and ES.
"""
import re
from pathlib import Path

audio_base = Path('frontend/public/audio/modules')
es_file_text = Path('frontend/lib/modules.es.ts').read_text(encoding='utf-8')
en_file_text = Path('frontend/lib/modules.ts').read_text(encoding='utf-8')

def get_section_count(file_text, mod_id):
    pattern = mod_id + r'.*?sections:\s*\[(.+?)workbookPrompts'
    match = re.search(pattern, file_text, re.DOTALL)
    if not match:
        return None
    sections_block = match.group(1)
    types = re.findall(r'type:\s*["\'](\w+)["\']', sections_block)
    return [t for t in types if t != 'simulation']

def expected_section_ids(mod_id, n_sections):
    return (
        [f'{mod_id}_intro'] +
        [f'{mod_id}_segment_{i+1}' for i in range(n_sections)] +
        [f'{mod_id}_transition']
    )

def disk_section_ids(mod_id, lang):
    mod_dir = audio_base / mod_id
    if not mod_dir.exists():
        return set()
    if lang == 'es':
        files = [f.name for f in mod_dir.glob('*_es.mp3')]
        return {f[:-7] for f in files}  # strip _es.mp3
    else:
        files = [f.name for f in mod_dir.glob('*.mp3') if not f.name.endswith('_es.mp3')]
        return {f[:-4] for f in files}  # strip .mp3

print("=== Section ID Alignment Report ===\n")
mismatches = []

for mod_dir in sorted(audio_base.iterdir()):
    if not mod_dir.is_dir():
        continue
    mod_id = mod_dir.name

    # Check English
    en_sections = get_section_count(en_file_text, mod_id)
    if en_sections is not None:
        expected_en = set(expected_section_ids(mod_id, len(en_sections)))
        on_disk_en = disk_section_ids(mod_id, 'en')
        missing_en = expected_en - on_disk_en
        extra_en = on_disk_en - expected_en
        if missing_en or extra_en:
            mismatches.append(mod_id)
            print(f'EN MISMATCH: {mod_id}')
            if missing_en:
                print(f'  Missing from disk: {sorted(missing_en)}')
            if extra_en:
                print(f'  Extra on disk:     {sorted(extra_en)}')

    # Check Spanish (only if files exist)
    on_disk_es = disk_section_ids(mod_id, 'es')
    if on_disk_es:
        es_sections = get_section_count(es_file_text, mod_id)
        if es_sections is not None:
            expected_es = set(expected_section_ids(mod_id, len(es_sections)))
            missing_es = expected_es - on_disk_es
            extra_es = on_disk_es - expected_es
            if missing_es or extra_es:
                mismatches.append(mod_id)
                print(f'ES MISMATCH: {mod_id}')
                if missing_es:
                    print(f'  Missing from disk: {sorted(missing_es)}')
                if extra_es:
                    print(f'  Extra on disk:     {sorted(extra_es)}')
            else:
                print(f'ES OK:       {mod_id} ({len(expected_es)} sections align perfectly)')

if not mismatches:
    print("\n✅ All section IDs align correctly.")
else:
    print(f"\n⚠️  {len(set(mismatches))} module(s) have mismatches. See above.")

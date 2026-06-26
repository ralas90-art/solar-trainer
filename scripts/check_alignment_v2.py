import re
from pathlib import Path

es_file_text = Path('frontend/lib/modules.es.ts').read_text(encoding='utf-8')
en_file_text = Path('frontend/lib/modules.ts').read_text(encoding='utf-8')
audio_base = Path('frontend/public/audio/modules')

def count_non_sim_sections(file_text, mod_id):
    """Count sections of a module that are not simulation type."""
    # Find the module definition
    idx = file_text.find(f'"{mod_id}"')
    if idx < 0:
        idx = file_text.find(f"'{mod_id}'")
    if idx < 0:
        return None
    # Find sections array start
    sec_start = file_text.find('sections:', idx)
    if sec_start < 0:
        return None
    # Find the opening bracket
    bracket_start = file_text.find('[', sec_start)
    # Walk forward to find matching closing bracket
    depth = 1
    pos = bracket_start + 1
    while pos < len(file_text) and depth > 0:
        if file_text[pos] == '[':
            depth += 1
        elif file_text[pos] == ']':
            depth -= 1
        pos += 1
    block = file_text[bracket_start:pos]
    # Count types
    types = re.findall(r"type:\s*[\"'](\w+)[\"']", block)
    return [t for t in types if t != 'simulation']

def es_disk_ids(mod_id):
    mod_dir = audio_base / mod_id
    if not mod_dir.exists():
        return set()
    return {f.name[:-7] for f in mod_dir.glob('*_es.mp3')}

print("=== Section Alignment for mod_1_2 and mod_1_5 ===")
for mod_id in ['mod_1_2', 'mod_1_5']:
    es_sections = count_non_sim_sections(es_file_text, mod_id)
    en_sections = count_non_sim_sections(en_file_text, mod_id)
    disk_es = es_disk_ids(mod_id)
    
    print(f"\n{mod_id}:")
    print(f"  EN module sections: {len(en_sections) if en_sections else '?'}")
    print(f"  ES module sections: {len(es_sections) if es_sections else '?'}")
    
    if es_sections is not None:
        n = len(es_sections)
        expected = (
            {f'{mod_id}_intro'} | 
            {f'{mod_id}_segment_{i+1}' for i in range(n)} | 
            {f'{mod_id}_transition'}
        )
        missing = expected - disk_es
        extra = disk_es - expected
        print(f"  Expected section IDs ({n+2}): {sorted(expected)}")
        print(f"  On disk (_es.mp3):     {sorted(disk_es)}")
        if missing:
            print(f"  MISSING from disk:   {sorted(missing)}")
        if extra:
            print(f"  EXTRA on disk (not in expected): {sorted(extra)}")
        if not missing and not extra:
            print("  RESULT: PERFECT ALIGNMENT")
        else:
            print("  RESULT: MISMATCH - player will request wrong IDs!")

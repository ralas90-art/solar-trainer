import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# We want to find where the actual transcripts for mod_1_1_intro.mp3, mod_1_1_segment_1.mp3, etc. are located.
# Let's inspect the files in scripts/ that might have it.

scripts_dir = Path('scripts')
json_files = list(scripts_dir.glob('*.json'))

for jf in json_files:
    try:
        # read with appropriate encoding
        for enc in ['utf-8', 'utf-16']:
            try:
                with open(jf, 'r', encoding=enc) as f:
                    data = json.load(f)
                break
            except:
                pass
        
        # let's see if this json has a mapping or text for "mod_1_1_intro" or similar
        # let's dumps to check if it's there
        data_str = json.dumps(data)
        if 'mod_1_1_intro' in data_str or 'mod_1_1_segment_1' in data_str or 'intro.mp3' in data_str:
            print(f"FOUND matching audio terms in {jf}!")
            # let's print a sample structure
            if isinstance(data, dict):
                print(f"Keys: {list(data.keys())[:5]}")
                # print some details about en_core if it exists
                if 'en_core' in data:
                    en_core = data['en_core']
                    print("  Found 'en_core' key!")
                    m1_1 = en_core.get('mod_1_1', {})
                    print("  mod_1_1 in 'en_core':", type(m1_1))
                    if isinstance(m1_1, dict):
                        print("  mod_1_1 keys:", list(m1_1.keys()))
                        # if there are files and also transcripts or scripts, let's see
                        if 'files' in m1_1:
                            print("  files:", m1_1['files'])
            elif isinstance(data, list):
                print(f"List structure, length {len(data)}")
    except Exception as e:
        print(f"Error checking {jf}: {e}")

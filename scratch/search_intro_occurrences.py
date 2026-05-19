from pathlib import Path
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search for the string "mod_1_1_intro" (or similar) in files
search_term = "mod_1_1_intro"
print(f"Searching for occurrences of '{search_term}'...")

for p in Path('.').glob('**/*'):
    if p.is_dir() or 'node_modules' in p.parts or '.git' in p.parts or '.vercel' in p.parts:
        continue
    # Only search text files
    if p.suffix in ['.json', '.py', '.ts', '.tsx', '.js', '.md', '.txt']:
        try:
            content = p.read_text(encoding='utf-8', errors='ignore')
            if search_term in content:
                print(f"FOUND in: {p}")
        except Exception as e:
            print(f"Error reading {p}: {e}")

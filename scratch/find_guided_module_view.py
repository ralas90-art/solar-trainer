from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's search where modules_en.json is loaded or imported, and where TrainingModuleView is defined
print("Searching for modules_en.json or curriculum loading...")

dirs = [Path('frontend/app'), Path('frontend/components'), Path('frontend/lib')]
checked = 0

for d in dirs:
    if not d.exists():
        continue
    for p in d.glob('**/*'):
        if p.is_dir() or 'node_modules' in p.parts:
            continue
        if p.suffix in ['.tsx', '.ts', '.js']:
            try:
                content = p.read_text(encoding='utf-8', errors='ignore')
                if 'modules_en.json' in content or 'curriculum' in content.lower() or 'TrainingModuleView' in content:
                    print(f"FOUND in: {p}")
                    # let's find references
                    lines = content.splitlines()
                    for idx, line in enumerate(lines):
                        if 'modules_en.json' in line or 'TrainingModuleView' in line:
                            print(f"  Line {idx+1}: {line.strip()}")
                checked += 1
            except:
                pass

print(f"Checked {checked} files.")

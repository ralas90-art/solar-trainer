from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Searching for 'LessonAudioPlayer' in frontend/app and frontend/components...")

dirs = [Path('frontend/app'), Path('frontend/components')]
checked = 0

for d in dirs:
    if not d.exists():
        continue
    for p in d.glob('**/*'):
        if p.is_dir() or 'node_modules' in p.parts or '.next' in p.parts or '.vercel' in p.parts:
            continue
        if p.suffix in ['.tsx', '.ts', '.js']:
            try:
                content = p.read_text(encoding='utf-8', errors='ignore')
                if 'LessonAudioPlayer' in content:
                    print(f"FOUND in: {p}")
                    lines = content.splitlines()
                    for idx, line in enumerate(lines):
                        if 'LessonAudioPlayer' in line:
                            print(f"  Line {idx+1}: {line.strip()}")
                checked += 1
            except:
                pass

print(f"Checked {checked} files.")

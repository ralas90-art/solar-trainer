from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search for the string "LessonAudioPlayer" in frontend/components and frontend/app
print("Searching for 'LessonAudioPlayer' in frontend...")

for p in Path('frontend').glob('**/*'):
    if p.is_dir() or 'node_modules' in p.parts:
        continue
    if p.suffix in ['.tsx', '.ts', '.js']:
        try:
            content = p.read_text(encoding='utf-8', errors='ignore')
            if 'LessonAudioPlayer' in content:
                print(f"FOUND in: {p}")
                # let's show line numbers containing it
                lines = content.splitlines()
                for idx, line in enumerate(lines):
                    if 'LessonAudioPlayer' in line:
                        print(f"  Line {idx+1}: {line.strip()}")
        except Exception as e:
            pass

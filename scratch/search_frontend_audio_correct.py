from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search in actual frontend subdirectories
dirs = [
    Path('frontend/app'),
    Path('frontend/components'),
    Path('frontend/hooks'),
    Path('frontend/context'),
    Path('frontend/lib'),
]

search_terms = [".mp3", "audioUrl", "playAudio", "/audio/"]
print("Searching in frontend folders...")

found = []
for d in dirs:
    if not d.exists():
        continue
    for p in d.glob('**/*'):
        if p.is_dir() or 'node_modules' in p.parts:
            continue
        if p.suffix in ['.ts', '.tsx', '.json', '.js', '.jsx']:
            try:
                content = p.read_text(encoding='utf-8', errors='ignore')
                for term in search_terms:
                    if term in content:
                        found.append((p, term))
            except Exception:
                pass

for p, term in list(set(found)):
    print(f"FOUND: {p} -> matches term '{term}'")

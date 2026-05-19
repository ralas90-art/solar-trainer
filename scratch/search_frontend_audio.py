from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's search for ".mp3" or "audio_url" or "audio" in frontend/src
search_terms = [".mp3", "audioUrl", "playAudio", "/audio/"]
print("Searching in frontend/src...")

found_occurrences = []

for p in Path('frontend/src').glob('**/*'):
    if p.is_dir() or 'node_modules' in p.parts or '.git' in p.parts:
        continue
    if p.suffix in ['.ts', '.tsx', '.json', '.js', '.jsx']:
        try:
            content = p.read_text(encoding='utf-8', errors='ignore')
            for term in search_terms:
                if term in content:
                    found_occurrences.append((p, term))
        except Exception:
            pass

for p, term in list(set(found_occurrences)):
    print(f"FOUND: {p} -> matches term '{term}'")

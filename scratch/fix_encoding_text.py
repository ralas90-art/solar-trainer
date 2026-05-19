import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

def fix_corrupted_cp437(text: str) -> str:
    # Handle the classic CP437-decoded UTF-8 corruptions
    replacements = {
        "ΓÇö": "—",
        "ΓÇô": "–",
        "ΓÇÖ": "'",  # standard apostrophe is safest for TTS
        "ΓÇ¥": '"',
        "ΓÇ\x9d": '"',
        "ΓÇ\x9c": '"',
        "ΓÇÿ": "'",
        "ΓÇÖ": "'",
        "\u00e2\u0080\u0094": "—",
        "\u00e2\u0080\u0093": "–",
        "\u00e2\u0080\u0099": "'",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

with open('artifacts/batch_1_dry_run_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

# Apply fix to all texts
for mod in report['modules']:
    for f in mod['files']:
        f['text'] = fix_corrupted_cp437(f['text'])

# Recalculate total character count (it should be slightly less since 3 corrupted chars become 1 normal char!)
total_char_count = sum(len(f['text']) for mod in report['modules'] for f in mod['files'])
report['total_character_count'] = total_char_count

# Write back fixed report
with open('artifacts/batch_1_dry_run_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print(f"Fixed report written. New total character count: {total_char_count:,}")

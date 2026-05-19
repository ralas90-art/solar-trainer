import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('artifacts/batch_1_dry_run_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

for mod in report['modules']:
    for f in mod['files']:
        if 'Γ' in f['title'] or 'Γ' in f['text']:
            print(f"Found encoding issue in: {f['fileName']}")
            print(f"  Title: {f['title']}")
            print(f"  Text: {f['text'][:100]}")

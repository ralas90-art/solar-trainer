import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read report from JSON
with open('artifacts/batch_1_dry_run_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

print(f"Total Batch 1 Characters: {report['total_character_count']:,}")
print("-" * 80)

for mod in report['modules']:
    print(f"\nModule {mod['moduleId']}: {mod['moduleTitle']}")
    print(f"Total Module Characters: {mod['charCount']:,}")
    print(f"{'File Name':<30} | {'Segment Title':<40} | {'Chars':<6}")
    print("-" * 85)
    for f in mod['files']:
        print(f"{f['fileName']:<30} | {f['title']:<40} | {f['charCount']:<6}")

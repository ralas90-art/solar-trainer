from pathlib import Path
import os

print("=== Checking for narration_transcripts.json ===")
paths = [
    Path("narration_transcripts.json"),
    Path("narration_transcripts_part1.json"),
    Path("narration_transcripts_part1_updated.json"),
    Path("narration_transcripts_part2.json"),
    Path("narration_transcripts_part2_updated.json"),
    Path("frontend/public/narration_transcripts.json"),
    Path("scripts/narration_transcripts.json"),
    Path("scripts/narration_transcripts_part1.json"),
]

for p in paths:
    if p.exists():
        print(f"FOUND: {p} ({p.stat().st_size} bytes)")
    else:
        print(f"NOT FOUND: {p}")

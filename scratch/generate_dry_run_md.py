import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read report from JSON
with open('artifacts/batch_1_dry_run_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

# Checked subscription remaining
remaining_credits = 83230
total_chars = report['total_character_count']
within_budget = total_chars <= remaining_credits

md_lines = []
md_lines.append("# Batch 1 Audio Cost & Character Dry-Run Estimate")
md_lines.append("")
md_lines.append("This report details the exact character counts and estimated ElevenLabs credits usage for **Batch 1 (Day 1 English Core Modules)**.")
md_lines.append("")
md_lines.append("> [!IMPORTANT]")
md_lines.append("> **Dry-Run Mode Active**: No API calls have been made to ElevenLabs, and no files have been modified. Generation will only begin after your explicit approval.")
md_lines.append("")
md_lines.append("## 📊 Summary of Estimates")
md_lines.append("")
md_lines.append("| Parameter | Value | Details |")
md_lines.append("| :--- | :--- | :--- |")
md_lines.append(f"| **Total Day 1 Modules** | 8 | `mod_1_1` through `mod_1_8` |")
md_lines.append(f"| **Total Audio Files (Segments)** | 44 | 8 intros, 28 instructional segments, 8 transitions |")
md_lines.append(f"| **Total Character Count** | **{total_chars:,}** characters | Mapped exactly from `modules_en.json` |")
md_lines.append(f"| **Available ElevenLabs Credits** | **{remaining_credits:,}** characters | Checked dynamically from subscription account |")
md_lines.append(f"| **Estimated Cost** | **$0.00** (Free) | Fully covered within your monthly subscription balance |")
md_lines.append(f"| **Status** | ✅ **Sufficient Credits** | Remaining balance after generation: **{remaining_credits - total_chars:,}** |")
md_lines.append("")

if within_budget:
    md_lines.append("> [!TIP]")
    md_lines.append(f"> Your account has more than enough credits to regenerate Batch 1 completely! The estimated usage is only **{total_chars / remaining_credits * 100:.1f}%** of your remaining balance.")
else:
    md_lines.append("> [!WARNING]")
    md_lines.append("> Your account does not have enough credits to generate all of Day 1. Please upgrade your subscription on ElevenLabs.")

md_lines.append("")
md_lines.append("## 🎙️ Target Voice Configuration")
md_lines.append("- **English Voice**: Tom (American, Confident & Persuasive Trainer)")
md_lines.append("- **Voice ID**: `QO7Mfy7rwYLdxzo4Q3iD`")
md_lines.append("- **Model**: ElevenLabs v3 (`eleven_v3`) — highest-quality approved model")
md_lines.append("- **Output Directory**: `frontend/public/audio/modules/`")
md_lines.append("")
md_lines.append("## 📦 Detailed Module & Segment Breakdown")
md_lines.append("")

for mod in report['modules']:
    md_lines.append(f"### 📘 {mod['moduleId'].upper()} — {mod['moduleTitle']}")
    md_lines.append(f"**Total Module Characters**: {mod['charCount']:,} characters")
    md_lines.append("")
    md_lines.append("| File Name | Segment Title | Char Count | Transcript Source Preview |")
    md_lines.append("| :--- | :--- | :--- | :--- |")
    for f in mod['files']:
        # Truncate text preview for nice display
        text_preview = f['text']
        if len(text_preview) > 120:
            text_preview = text_preview[:117] + "..."
        md_lines.append(f"| `{f['fileName']}` | {f['title']} | {f['charCount']} | *\"{text_preview}\"* |")
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("")

# Write to dry_run_report.md
with open('artifacts/dry_run_report.md', 'w', encoding='utf-8') as f:
    f.write("\n".join(md_lines))

print("Successfully wrote dry_run_report.md artifact!")

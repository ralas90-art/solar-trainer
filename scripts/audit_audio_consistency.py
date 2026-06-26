#!/usr/bin/env python3
"""
SeptiVolt Audio Consistency Audit Script
==========================================
Comprehensive guardrail that checks:
  1. File existence on disk for every section in all_audio_lessons.json
  2. Text hash match between current curriculum text and manifest
  3. Voice ID matches locale (Tom for EN, Alberto for ES)
  4. Model ID matches canonical eleven_v3
  5. Spanish coverage gaps
  6. Orphaned/untracked files on disk not in the curriculum
  7. Summary report with pass/fail per day

Usage:
  python scripts/audit_audio_consistency.py
  python scripts/audit_audio_consistency.py --day 1
  python scripts/audit_audio_consistency.py --verbose
"""

import json
import hashlib
import sys
from pathlib import Path
from collections import defaultdict

# ── Import canonical voice config ────────────────────────────────────────────
from audio_voice_config import (
    ENGLISH_VOICE_ID,
    SPANISH_VOICE_ID,
    MODEL_ID as CANONICAL_MODEL,
)

# ── Paths ────────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_JSON = PROJECT_ROOT / "scratch" / "all_audio_lessons.json"
MANIFEST_PATH = PROJECT_ROOT / "scripts" / "audio_manifest_standardized.json"
AUDIO_BASE_DIR = PROJECT_ROOT / "frontend" / "public" / "audio" / "modules"

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def get_text_hash(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def parse_day(module_id: str) -> int | None:
    import re
    m = re.match(r"mod_(\d+)_", module_id)
    return int(m.group(1)) if m else None


def load_json(path: Path) -> dict | list:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="SeptiVolt Audio Consistency Audit")
    parser.add_argument("--day", type=int, help="Audit only a specific day (1-7)")
    parser.add_argument("--verbose", action="store_true", help="Print every check, not just failures")
    args = parser.parse_args()

    if not SOURCE_JSON.exists():
        print(f"❌ Source JSON not found: {SOURCE_JSON}")
        sys.exit(1)

    lessons = load_json(SOURCE_JSON)
    manifest = load_json(MANIFEST_PATH) if MANIFEST_PATH.exists() else {}

    # ── Collect all expected sections ────────────────────────────────────────
    expected_files: dict[str, dict] = {}  # path_str -> info

    for lang_key, voice_id, suffix_fn in [
        ("english", ENGLISH_VOICE_ID, lambda sid: f"{sid}.mp3"),
        ("spanish", SPANISH_VOICE_ID, lambda sid: f"{sid}_es.mp3"),
    ]:
        lang_code = "en" if lang_key == "english" else "es"
        for mod in lessons.get(lang_key, []):
            mod_id = mod["moduleId"]
            day = parse_day(mod_id)
            if args.day and day != args.day:
                continue

            for sec in mod.get("sections", []):
                sec_id = sec["id"]
                text = sec.get("text", "").strip()
                if not text:
                    continue

                filename = suffix_fn(sec_id)
                rel_path = f"{mod_id}/{filename}"
                abs_path = AUDIO_BASE_DIR / mod_id / filename

                expected_files[str(abs_path)] = {
                    "moduleId": mod_id,
                    "sectionId": sec_id,
                    "lang": lang_code,
                    "day": day,
                    "text": text,
                    "text_hash": get_text_hash(text),
                    "expected_voice": voice_id,
                    "rel_path": rel_path,
                    "abs_path": abs_path,
                }

    # ── Run checks ───────────────────────────────────────────────────────────
    results = {
        "missing_files": [],
        "empty_files": [],
        "text_hash_mismatch": [],
        "voice_id_mismatch": [],
        "model_id_mismatch": [],
        "spanish_missing": [],
        "passed": [],
    }
    day_stats = defaultdict(lambda: {"pass": 0, "fail": 0, "total": 0})

    for path_str, info in expected_files.items():
        day = info["day"]
        day_stats[day]["total"] += 1
        issues = []

        # Check 1: File exists
        if not info["abs_path"].exists():
            issues.append("missing_file")
            results["missing_files"].append(info)
            if info["lang"] == "es":
                results["spanish_missing"].append(info)
        else:
            # Check 2: File not empty
            size = info["abs_path"].stat().st_size
            if size == 0:
                issues.append("empty_file")
                results["empty_files"].append(info)

            # Check 3-5: Manifest checks
            manifest_key = f"{info['moduleId']}:{info['sectionId']}:{info['lang']}"
            entry = manifest.get(manifest_key)
            if entry:
                # Text hash
                if entry.get("text_hash") != info["text_hash"]:
                    issues.append("text_hash_mismatch")
                    results["text_hash_mismatch"].append({
                        **info,
                        "manifest_hash": entry.get("text_hash"),
                        "current_hash": info["text_hash"],
                    })

                # Voice ID
                if entry.get("voice_id") != info["expected_voice"]:
                    issues.append("voice_id_mismatch")
                    results["voice_id_mismatch"].append({
                        **info,
                        "manifest_voice": entry.get("voice_id"),
                    })

                # Model ID
                if entry.get("model_id") != CANONICAL_MODEL:
                    issues.append("model_id_mismatch")
                    results["model_id_mismatch"].append({
                        **info,
                        "manifest_model": entry.get("model_id"),
                    })
            else:
                # Not in manifest at all — file exists but untracked
                if info["lang"] == "en":
                    issues.append("not_in_manifest")

        if issues:
            day_stats[day]["fail"] += 1
            if args.verbose:
                print(f"  ❌ {info['rel_path']}: {', '.join(issues)}")
        else:
            day_stats[day]["pass"] += 1
            results["passed"].append(info)
            if args.verbose:
                print(f"  ✅ {info['rel_path']}")

    # ── Check for orphaned files ─────────────────────────────────────────────
    orphaned = []
    if AUDIO_BASE_DIR.exists():
        expected_abs_set = set(expected_files.keys())
        for mp3 in AUDIO_BASE_DIR.rglob("*.mp3"):
            if str(mp3) not in expected_abs_set:
                mod_dir = mp3.parent.name
                day = parse_day(mod_dir)
                if args.day and day != args.day:
                    continue
                orphaned.append({
                    "path": str(mp3),
                    "rel_path": str(mp3.relative_to(AUDIO_BASE_DIR)),
                    "day": day,
                    "size_kb": mp3.stat().st_size / 1024,
                })

    # ── Summary Report ───────────────────────────────────────────────────────
    total_expected = len(expected_files)
    total_passed = len(results["passed"])
    total_failed = total_expected - total_passed

    print("\n" + "=" * 64)
    print("  SEPTIVOLT AUDIO CONSISTENCY AUDIT REPORT")
    print("=" * 64)

    print(f"\n  Total expected sections : {total_expected}")
    print(f"  ✅ Passed               : {total_passed}")
    print(f"  ❌ Failed               : {total_failed}")
    print(f"  🔇 Missing files        : {len(results['missing_files'])}")
    print(f"  📂 Empty files          : {len(results['empty_files'])}")
    print(f"  📝 Text hash mismatches : {len(results['text_hash_mismatch'])}")
    print(f"  🎤 Voice ID mismatches  : {len(results['voice_id_mismatch'])}")
    print(f"  🤖 Model ID mismatches  : {len(results['model_id_mismatch'])}")
    print(f"  🇪🇸 Spanish missing      : {len(results['spanish_missing'])}")
    print(f"  👻 Orphaned files       : {len(orphaned)}")

    # ── Per-Day Breakdown ────────────────────────────────────────────────────
    print("\n  ── Per-Day Breakdown ──")
    for day in sorted(day_stats.keys()):
        stats = day_stats[day]
        status = "✅" if stats["fail"] == 0 else "❌"
        print(f"    Day {day}: {status}  {stats['pass']}/{stats['total']} passed  ({stats['fail']} issues)")

    # ── Orphaned files detail ────────────────────────────────────────────────
    if orphaned:
        print(f"\n  ── Orphaned Files ({len(orphaned)}) ──")
        for o in orphaned[:20]:
            print(f"    👻 {o['rel_path']}  ({o['size_kb']:.1f} KB)")
        if len(orphaned) > 20:
            print(f"    ... and {len(orphaned) - 20} more")

    # ── Text hash mismatch detail ────────────────────────────────────────────
    if results["text_hash_mismatch"]:
        print(f"\n  ── Text Hash Mismatches ({len(results['text_hash_mismatch'])}) ──")
        for m in results["text_hash_mismatch"][:15]:
            print(f"    📝 {m['rel_path']} — manifest: {m['manifest_hash'][:8]}… vs current: {m['current_hash'][:8]}…")

    # ── Voice ID mismatch detail ─────────────────────────────────────────────
    if results["voice_id_mismatch"]:
        print(f"\n  ── Voice ID Mismatches ({len(results['voice_id_mismatch'])}) ──")
        for m in results["voice_id_mismatch"][:10]:
            print(f"    🎤 {m['rel_path']} — expected: {m['expected_voice'][:8]}… got: {m['manifest_voice'][:8] if m.get('manifest_voice') else 'none'}…")

    # ── Model ID mismatch detail ─────────────────────────────────────────────
    if results["model_id_mismatch"]:
        print(f"\n  ── Model ID Mismatches ({len(results['model_id_mismatch'])}) ──")
        for m in results["model_id_mismatch"][:10]:
            print(f"    🤖 {m['rel_path']} — expected: {CANONICAL_MODEL} got: {m['manifest_model']}")

    # ── Final verdict ────────────────────────────────────────────────────────
    print("\n" + "=" * 64)
    if total_failed == 0 and len(orphaned) == 0:
        print("  ✅ AUDIT PASSED — All audio is consistent and tracked.")
    elif total_failed == 0:
        print(f"  ⚠️  AUDIT MOSTLY PASSED — {len(orphaned)} orphaned files need review.")
    else:
        print(f"  ❌ AUDIT FAILED — {total_failed} issues found. Remediation required.")
    print("=" * 64 + "\n")

    # Return exit code for CI/CD
    sys.exit(1 if total_failed > 0 else 0)


if __name__ == "__main__":
    main()

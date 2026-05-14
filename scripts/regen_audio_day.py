"""
Batch Audio Regeneration Script — Tom Voice (QO7Mfy7rwYLdxzo4Q3iD)
===================================================================
Regenerates static MP3 audio files for a single training day using Tom's
voice + eleven_v3 model. Run one day at a time as credits allow.

Usage:
    python regen_audio_day.py --day 1
    python regen_audio_day.py --day 2
    python regen_audio_day.py --day 1 --dry-run   (preview only, no API calls)

Credit estimate per day:
    Each segment ~1,500–3,000 chars. A typical day has ~30–50 segments.
    One day ≈ 60,000–120,000 characters (roughly one Creator plan month).

ElevenLabs Creator plan: 100,000 chars/month.
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

# ── Config ───────────────────────────────────────────────────────────────────
VOICE_ID   = "QO7Mfy7rwYLdxzo4Q3iD"  # Tom — Confident & Persuasive Trainer
MODEL_ID   = "eleven_v3"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.92,
    "style": 0.48,
    "use_speaker_boost": True,
}
AUDIO_TAGS = ["professional", "engaging", "confident", "trainer"]

# Output directory mirrors the frontend public folder
OUTPUT_ROOT = Path("solar-trainer/frontend/public/audio/modules")

# Load API key from backend .env
def load_api_key() -> str:
    env_path = Path("solar-trainer/backend/.env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip()
    key = os.getenv("ELEVENLABS_API_KEY", "")
    if not key:
        print("ERROR: ELEVENLABS_API_KEY not found in solar-trainer/backend/.env or environment.")
        sys.exit(1)
    return key


def check_character_balance(api_key: str) -> tuple[int, int]:
    """Returns (characters_used, characters_limit) for the current billing period."""
    r = requests.get(
        "https://api.elevenlabs.io/v1/user/subscription",
        headers={"xi-api-key": api_key},
        timeout=10,
    )
    if r.status_code == 200:
        data = r.json()
        return data.get("character_count", 0), data.get("character_limit", 0)
    return 0, 0


def generate_segment(api_key: str, text: str, out_path: Path, dry_run: bool) -> bool:
    """Generate a single MP3 segment. Returns True on success."""
    char_count = len(text)

    if dry_run:
        print(f"    [DRY RUN] Would generate {char_count} chars → {out_path.name}")
        return True

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={
            "xi-api-key": api_key,
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
        },
        json={
            "text": text,
            "model_id": MODEL_ID,
            "voice_settings": VOICE_SETTINGS,
            "suggested_audio_tags": AUDIO_TAGS,
        },
        timeout=60,
    )

    if r.status_code == 200:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_bytes(r.content)
        print(f"    ✓ {out_path.name}  ({char_count} chars, {len(r.content)//1024} KB)")
        return True
    elif r.status_code == 429:
        print(f"    ✗ Rate limited — waiting 30s then retrying…")
        time.sleep(30)
        return generate_segment(api_key, text, out_path, dry_run)
    else:
        print(f"    ✗ Failed ({r.status_code}): {r.text[:200]}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Regenerate audio for one training day.")
    parser.add_argument("--day", type=int, required=True, help="Day number to regenerate (e.g. 1)")
    parser.add_argument("--dry-run", action="store_true", help="Preview only — no API calls made")
    args = parser.parse_args()

    api_key = load_api_key()

    # ── Load curriculum data ──────────────────────────────────────────────────
    # Try to find the narration transcripts JSON that has segment text
    transcript_files = [
        Path("narration_transcripts.json"),
        Path("narration_transcripts_part2_updated.json"),
        Path("solar-trainer/frontend/public/narration_transcripts.json"),
    ]

    segments: list[dict] = []
    for tf in transcript_files:
        if tf.exists():
            data = json.loads(tf.read_text(encoding="utf-8"))
            # Support both list and dict formats
            if isinstance(data, list):
                segments.extend(data)
            elif isinstance(data, dict):
                for v in data.values():
                    if isinstance(v, list):
                        segments.extend(v)
                    elif isinstance(v, dict):
                        segments.append(v)

    # Filter to the requested day
    day_str = f"day_{args.day}"
    day_segments = []
    for seg in segments:
        mod_id = seg.get("module_id", "") or seg.get("moduleId", "")
        if f"mod_{args.day}_" in mod_id or day_str in mod_id:
            day_segments.append(seg)

    if not day_segments:
        # Fallback: scan the current public/audio dir for existing files for this day
        day_pattern = OUTPUT_ROOT.glob(f"mod_{args.day}_*/*.mp3")
        existing = list(day_pattern)
        print(f"\nNo transcript data found for Day {args.day}.")
        print(f"Found {len(existing)} existing MP3s for this day in {OUTPUT_ROOT}")
        print("\nTo regenerate, ensure narration_transcripts.json is present beside this script.")
        sys.exit(0)

    # ── Pre-flight summary ────────────────────────────────────────────────────
    total_chars = sum(len(seg.get("text", "") or seg.get("narration_text", "")) for seg in day_segments)
    print(f"\n{'='*60}")
    print(f"  Day {args.day} Audio Regeneration — Tom Voice ({VOICE_ID})")
    print(f"{'='*60}")
    print(f"  Segments : {len(day_segments)}")
    print(f"  Total chars: {total_chars:,}")
    print(f"  Model    : {MODEL_ID}")
    print(f"  Dry run  : {args.dry_run}")

    if not args.dry_run:
        used, limit = check_character_balance(api_key)
        remaining = limit - used
        print(f"\n  ElevenLabs balance: {used:,} used / {limit:,} limit ({remaining:,} remaining)")
        if remaining < total_chars:
            print(f"\n  ⚠ WARNING: Only {remaining:,} chars remaining but need {total_chars:,}.")
            print(f"  Will generate as many as possible before hitting limit.\n")
        if remaining <= 0:
            print("\n  ✗ No characters remaining. Wait for monthly reset.")
            sys.exit(1)

    print(f"\n{'─'*60}")

    # ── Generate segments ─────────────────────────────────────────────────────
    success_count = 0
    fail_count = 0
    chars_used = 0

    for seg in day_segments:
        mod_id   = seg.get("module_id") or seg.get("moduleId", "unknown")
        seg_id   = seg.get("section_id") or seg.get("sectionId") or seg.get("segment_id", "segment")
        text     = seg.get("text") or seg.get("narration_text") or seg.get("spokenTeachingScript", "")

        if not text.strip():
            print(f"  ⚠ Skipping {mod_id}/{seg_id} — no text content")
            continue

        out_path = OUTPUT_ROOT / mod_id / f"{seg_id}.mp3"
        print(f"\n  Module: {mod_id}  Section: {seg_id}")

        ok = generate_segment(api_key, text, out_path, args.dry_run)
        if ok:
            success_count += 1
            chars_used += len(text)
        else:
            fail_count += 1

        if not args.dry_run:
            time.sleep(1.2)  # Respect rate limits (~50 req/min on Creator)

    # ── Summary ───────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  Done!  ✓ {success_count} generated   ✗ {fail_count} failed")
    print(f"  Characters used this run: {chars_used:,}")
    if not args.dry_run:
        print(f"\n  Files written to: {OUTPUT_ROOT}")
        print(f"  Commit the new MP3s to git and push to update the live site.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
SeptiVolt Solar Sales Rep Accelerator
Narration-to-Audio Generation Pipeline
=======================================
Phase 1 Test: Module 1.1 only

Voice: Rachel (21m00Tcm4TlvDq8ikWAM) — Professional, confident instructor
Model: eleven_v3_conversational
API Key: reads from ELEVENLABS_API_KEY environment variable

Usage:
  1. Set your API key:
       $env:ELEVENLABS_API_KEY = "your_key_here"   (PowerShell)
       set ELEVENLABS_API_KEY=your_key_here          (CMD)

  2. Run:
       python generate_audio_module11.py

  3. To override the test filter and generate ALL modules:
       python generate_audio_module11.py --all

Output:
  audio/day-{N}/module-{M.M}/slide-{S}.mp3
  narration_transcripts_part1_updated.json
  narration_transcripts_part2_updated.json
"""

import os
import sys
import json
import time
import logging
import requests
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────
# Always load from .env first — avoids stale session env vars
_ENV_FILE = Path(__file__).parent.parent / "backend" / ".env"
ELEVENLABS_API_KEY = ""
if _ENV_FILE.exists():
    for _line in _ENV_FILE.read_text(encoding="utf-8").splitlines():
        if _line.strip().startswith("ELEVENLABS_API_KEY="):
            ELEVENLABS_API_KEY = _line.split("=", 1)[1].strip()
            break
if not ELEVENLABS_API_KEY:
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")

VOICE_ID  = "QO7Mfy7rwYLdxzo4Q3iD"  # Tom – Confident & Persuasive Trainer
MODEL_ID  = "eleven_turbo_v2_5"      # Works on all account tiers
AUDIO_BASE_DIR     = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "modules"
PART1_JSON         = Path(__file__).parent / "narration_transcripts_part1_updated.json"
PART2_JSON         = Path(__file__).parent / "narration_transcripts_part2_updated.json"
RATE_LIMIT_DELAY   = 1.5   # seconds between API calls (free tier safe)
TEST_MODULE_ID     = "1.1"  # only process this module in test mode

# Voice settings — matches existing voice.py profile
VOICE_SETTINGS = {
    "stability": 0.55,
    "similarity_boost": 0.75,
    "style": 0.40,
    "use_speaker_boost": True
}

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("audio_pipeline.log", encoding="utf-8")
    ]
)
log = logging.getLogger("audio_pipeline")

# ─── ElevenLabs API ───────────────────────────────────────────────────────────
def call_elevenlabs(text: str) -> bytes | None:
    """
    Send narration text to ElevenLabs and return MP3 bytes.
    Returns None on failure.
    """
    if not ELEVENLABS_API_KEY:
        log.error("ELEVENLABS_API_KEY is not set. Export it before running.")
        return None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "Accept":        "audio/mpeg",
        "Content-Type":  "application/json",
        "xi-api-key":    ELEVENLABS_API_KEY,
    }

    payload = {
        "text":           text,
        "model_id":       MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)

        if resp.status_code == 429:
            retry_after = int(resp.headers.get("Retry-After", 10))
            log.warning(f"Rate limited. Waiting {retry_after}s before retry…")
            time.sleep(retry_after)
            resp = requests.post(url, headers=headers, json=payload, timeout=60)

        resp.raise_for_status()
        return resp.content

    except requests.exceptions.HTTPError as e:
        log.error(f"HTTP error from ElevenLabs: {e} — {resp.text[:200]}")
        return None
    except requests.exceptions.Timeout:
        log.error("ElevenLabs request timed out.")
        return None
    except Exception as e:
        log.error(f"Unexpected error calling ElevenLabs: {e}")
        return None


# ─── File helpers ─────────────────────────────────────────────────────────────
def get_audio_path(day_number: int, module_id: str, slide_number: int) -> Path:
    """Build the canonical audio file path."""
    return AUDIO_BASE_DIR / f"day-{day_number}" / f"module-{module_id}" / f"slide-{slide_number}.mp3"


def audio_url_from_path(path: Path) -> str:
    """Convert local path to web-ready URL string."""
    return "/" + path.as_posix()


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(data: dict, path: Path) -> None:
    out_path = path.with_name(path.stem + "_updated.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    log.info(f"Updated JSON saved → {out_path}")


# ─── Core Pipeline ────────────────────────────────────────────────────────────
def process_slide(day_number: int, module_id: str, slide: dict) -> bool:
    """
    Generate and save audio for a single slide.
    Returns True if audio was generated, False if skipped or failed.
    """
    slide_num   = slide["slide_number"]
    narration   = slide.get("narration", "").strip()
    audio_path  = get_audio_path(day_number, module_id, slide_num)
    audio_url   = audio_url_from_path(audio_path)

    # ── Skip if already has audio on disk ────────────────────────────────────
    if audio_path.exists():
        log.info(f"  [SKIP] {audio_path} already exists.")
        slide["audio_url"] = audio_url
        return False

    # ── Skip if no narration text ─────────────────────────────────────────────
    if not narration or narration == "missing_from_source":
        log.warning(f"  [SKIP] Module {module_id} Slide {slide_num} — no narration text.")
        return False

    # ── Generate audio ────────────────────────────────────────────────────────
    log.info(f"  [GEN ] Module {module_id} │ Slide {slide_num} │ ~{slide.get('estimated_seconds', '?')}s")
    audio_bytes = call_elevenlabs(narration)

    if audio_bytes is None:
        log.error(f"  [FAIL] Module {module_id} Slide {slide_num} — ElevenLabs returned no audio.")
        return False

    # ── Save MP3 ──────────────────────────────────────────────────────────────
    audio_path.parent.mkdir(parents=True, exist_ok=True)
    audio_path.write_bytes(audio_bytes)
    log.info(f"  [SAVE] {audio_path} ({len(audio_bytes)/1024:.1f} KB)")

    # ── Update JSON entry ─────────────────────────────────────────────────────
    slide["audio_url"] = audio_url
    return True


def run_pipeline(json_data: dict, filter_module: str | None = TEST_MODULE_ID) -> dict:
    """
    Iterate all days / modules / slides in the JSON.
    If filter_module is set, only process that module.
    """
    generated = 0
    skipped   = 0
    failed    = 0

    for day in json_data.get("days", []):
        day_num = day["day_number"]

        for mod in day.get("modules", []):
            mod_id = mod["module_id"]

            # Apply test filter
            if filter_module and mod_id != filter_module:
                continue

            log.info(f"\n{'─'*60}")
            log.info(f"Day {day_num} │ Module {mod_id} — {mod.get('module_title', '')}")
            log.info(f"{'─'*60}")

            for slide in mod.get("slides", []):
                ok = process_slide(day_num, mod_id, slide)
                if ok:
                    generated += 1
                    time.sleep(RATE_LIMIT_DELAY)  # polite rate limiting
                elif slide.get("audio_url"):
                    skipped += 1
                else:
                    failed += 1

    log.info(f"\n{'═'*60}")
    log.info(f"Pipeline complete │ Generated: {generated} │ Skipped: {skipped} │ Failed: {failed}")
    log.info(f"{'═'*60}\n")
    return json_data


# ─── Entry Point ──────────────────────────────────────────────────────────────
def main():
    generate_all = "--all" in sys.argv
    active_filter = None if generate_all else TEST_MODULE_ID

    if not ELEVENLABS_API_KEY:
        log.error("=" * 60)
        log.error("ELEVENLABS_API_KEY is not set!")
        log.error("Set it before running:")
        log.error('  PowerShell: $env:ELEVENLABS_API_KEY = "sk_..."')
        log.error('  CMD:        set ELEVENLABS_API_KEY=sk_...')
        log.error("=" * 60)
        sys.exit(1)

    mode_label = "ALL MODULES" if generate_all else f"TEST — Module {TEST_MODULE_ID} only"
    log.info(f"Starting SeptiVolt Audio Pipeline │ Mode: {mode_label}")
    log.info(f"Voice: Tom ({VOICE_ID}) │ Model: {MODEL_ID}")
    log.info(f"Output directory: {AUDIO_BASE_DIR.resolve()}\n")

    for json_path in [PART1_JSON, PART2_JSON]:
        if not json_path.exists():
            log.warning(f"JSON file not found: {json_path} — skipping.")
            continue

        log.info(f"\nLoading {json_path}…")
        data = load_json(json_path)
        data = run_pipeline(data, filter_module=active_filter)
        save_json(data, json_path)

    log.info("All done. Audio files are in /audio/")


if __name__ == "__main__":
    main()

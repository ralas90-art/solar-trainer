#!/usr/bin/env python3
"""
SeptiVolt Solar Sales Rep Accelerator
Unified Audio Generation Pipeline (V2 Rollout)
==============================================
Generates ElevenLabs audio for:
1. Missing English Additive Modules (using Tom voice)
2. Full Spanish Curriculum (using Alberto Rodriguez voice)

Model: eleven_v3
API Key: reads from ELEVENLABS_API_KEY environment variable

Usage:
  python scripts/generate_audio_all.py --lang es --all  (Spanish full)
  python scripts/generate_audio_all.py --lang en --all  (English missing only)
  python scripts/generate_audio_all.py --lang es --test (Test mod_1_1 Spanish)
"""

import os
import sys
import json
import time
import logging
import requests
import argparse
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────
_ENV_FILE = Path(__file__).parent.parent / "backend" / ".env"
ELEVENLABS_API_KEY = ""
if _ENV_FILE.exists():
    for _line in _ENV_FILE.read_text(encoding="utf-8").splitlines():
        if _line.strip().startswith("ELEVENLABS_API_KEY="):
            ELEVENLABS_API_KEY = _line.split("=", 1)[1].strip()
            break
if not ELEVENLABS_API_KEY:
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")

# Voice Mapping
VOICES = {
    "en": "QO7Mfy7rwYLdxzo4Q3iD",  # Tom
    "es": "l1zE9xgNpUTaQCZzpNJa"   # Alberto Rodriguez
}

MODEL_ID = "eleven_v3"
RATE_LIMIT_DELAY = 1.2  # seconds between API calls

# ─── Logging ──────────────────────────────────────────────────────────────────
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("audio_pipeline_all.log", encoding="utf-8")
    ]
)
log = logging.getLogger("audio_pipeline")

# ─── ElevenLabs API ───────────────────────────────────────────────────────────
def call_elevenlabs(text: str, voice_id: str) -> bytes | None:
    if not ELEVENLABS_API_KEY:
        log.error("ELEVENLABS_API_KEY is not set.")
        return None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.50,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        if resp.status_code == 429:
            retry_after = int(resp.headers.get("Retry-After", 10))
            log.warning(f"Rate limited. Waiting {retry_after}s...")
            time.sleep(retry_after)
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
        
        resp.raise_for_status()
        return resp.content
    except Exception as e:
        log.error(f"Error calling ElevenLabs: {e}")
        if 'resp' in locals():
            log.error(f"Response: {resp.text[:200]}")
        return None

# ─── Core Pipeline ────────────────────────────────────────────────────────────
def run_pipeline(lang: str, generate_all: bool = False, test_id: str = None):
    source_json = Path(__file__).parent / f"modules_{lang}.json"
    if not source_json.exists():
        log.error(f"Source JSON not found: {source_json}")
        return

    try:
        with open(source_json, "r", encoding="utf-16") as f:
            data = json.load(f)
    except Exception:
        with open(source_json, "r", encoding="utf-8") as f:
            data = json.load(f)

    voice_id = VOICES.get(lang)
    audio_base = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "modules"
    if lang == "es":
        audio_base = audio_base / "es"

    generated = 0
    skipped = 0
    failed = 0
    total_chars = 0

    log.info(f"Starting pipeline for language: {lang.upper()}")
    log.info(f"Source: {source_json} | Voice: {voice_id} | Model: {MODEL_ID}")

    # For English, we only want to generate missing modules or the specific test_id
    # For Spanish, we generate everything unless a test_id is specified
    
    for mod_id, module in data.items():
        # Filtering logic
        if test_id and mod_id != test_id:
            continue
        
        # If English and not test_id, check if it's a known core module (skip those if not --all)
        # Actually, the check-existing logic handles core vs additive perfectly.
        
        output_dir = audio_base / mod_id
        
        # English Safeguard: If the directory exists, we assume it's core or already generated.
        # This protects legacy "mod_ID_segment_N.mp3" files from being duplicated by "section_N.mp3".
        if lang == "en" and output_dir.exists():
            log.info(f"  [SKIP] English Module {mod_id} already has an audio directory. Skipping.")
            skipped += len(module.get("sections", []))
            continue

        log.info(f"\nProcessing Module: {mod_id}")
        
        for idx, section in enumerate(module.get("sections", [])):
            text = section.get("content", "").strip()
            if not text:
                text = f"Section: {section.get('title')}"
            
            output_file = output_dir / f"section_{idx + 1}.mp3"

            if output_file.exists():
                log.info(f"  [SKIP] {output_file.name} already exists.")
                skipped += 1
                continue

            log.info(f"  [GEN] Generating {output_file.name} ({len(text)} chars)")
            
            audio_bytes = call_elevenlabs(text, voice_id)
            if audio_bytes:
                output_dir.mkdir(parents=True, exist_ok=True)
                output_file.write_bytes(audio_bytes)
                log.info(f"  [SAVE] {output_file.name} ({len(audio_bytes)/1024:.1f} KB)")
                generated += 1
                total_chars += len(text)
                time.sleep(RATE_LIMIT_DELAY)
            else:
                log.error(f"  [FAIL] Could not generate audio for {output_file.name}")
                failed += 1

    log.info(f"\n{'═'*60}")
    log.info(f"Pipeline complete | Generated: {generated} | Skipped: {skipped} | Failed: {failed}")
    log.info(f"Estimated character usage: {total_chars}")
    log.info(f"{'═'*60}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SeptiVolt Unified Audio Generator")
    parser.add_argument("--lang", choices=["en", "es"], default="es", help="Language (en or es)")
    parser.add_argument("--all", action="store_true", help="Generate all missing modules")
    parser.add_argument("--test", action="store_true", help="Generate only mod_1_1")
    parser.add_argument("--module", type=str, help="Generate a specific module id")
    
    args = parser.parse_args()
    
    target_id = args.module if args.module else ("mod_1_1" if args.test else None)
    
    if not args.all and not target_id:
        log.warning("Neither --all, --test, nor --module specified. Defaulting to --test.")
        target_id = "mod_1_1"

    run_pipeline(args.lang, generate_all=args.all, test_id=target_id)

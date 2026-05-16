#!/usr/bin/env python3
"""
SeptiVolt Solar Sales Rep Accelerator
Spanish Audio Generation Pipeline
==================================
Generates ElevenLabs audio for the Spanish curriculum (Day 1 & Day 2).

Voice: Alberto Rodriguez (l1zE9xgNpUTaQCZzpNJa) — Latin American Spanish
Model: eleven_v3
API Key: reads from ELEVENLABS_API_KEY environment variable

Usage:
  1. Set your API key in .env or environment variable.
  2. Run:
       python scripts/generate_audio_es.py --test (for a single module)
       python scripts/generate_audio_es.py --all (for full curriculum)
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
# Load from .env first
_ENV_FILE = Path(__file__).parent.parent / "backend" / ".env"
ELEVENLABS_API_KEY = ""
if _ENV_FILE.exists():
    for _line in _ENV_FILE.read_text(encoding="utf-8").splitlines():
        if _line.strip().startswith("ELEVENLABS_API_KEY="):
            ELEVENLABS_API_KEY = _line.split("=", 1)[1].strip()
            break
if not ELEVENLABS_API_KEY:
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")

VOICE_ID  = "l1zE9xgNpUTaQCZzpNJa"  # Alberto Rodriguez (Spanish)
MODEL_ID  = "eleven_v3"
LOCALE    = "es"
AUDIO_BASE_DIR = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "modules" / LOCALE
SOURCE_JSON    = Path(__file__).parent / "modules_es.json"
RATE_LIMIT_DELAY = 1.0  # seconds between API calls

# Voice settings
VOICE_SETTINGS = {
    "stability": 0.50,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True
}

# ─── Logging ──────────────────────────────────────────────────────────────────
# Force UTF-8 for console output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("audio_pipeline_es.log", encoding="utf-8")
    ]
)
log = logging.getLogger("audio_pipeline_es")

# ─── ElevenLabs API ───────────────────────────────────────────────────────────
def call_elevenlabs(text: str) -> bytes | None:
    if not ELEVENLABS_API_KEY:
        log.error("ELEVENLABS_API_KEY is not set.")
        return None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
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
        return None

# ─── Core Pipeline ────────────────────────────────────────────────────────────
def run_pipeline(generate_all: bool = False, test_module_id: str = "mod_1_1"):
    if not SOURCE_JSON.exists():
        log.error(f"Source JSON not found: {SOURCE_JSON}")
        return

    # Try reading as UTF-16 then UTF-8
    try:
        with open(SOURCE_JSON, "r", encoding="utf-16") as f:
            data = json.load(f)
    except Exception:
        with open(SOURCE_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)

    generated = 0
    skipped = 0
    failed = 0
    total_chars = 0

    log.info(f"Loaded {len(data)} modules from {SOURCE_JSON}")

    for mod_id, module in data.items():
        if not generate_all and mod_id != test_module_id:
            continue

        log.info(f"\nProcessing Module: {mod_id} - {module.get('title')}")
        
        for idx, section in enumerate(module.get("sections", [])):
            text = section.get("content", "").strip()
            if not text:
                text = f"Sección del módulo: {section.get('title')}"
            
            total_chars += len(text)
            
            # Path: public/audio/modules/es/mod_X_Y/section_N.mp3
            output_dir = AUDIO_BASE_DIR / mod_id
            output_file = output_dir / f"section_{idx + 1}.mp3"

            if output_file.exists():
                log.info(f"  [SKIP] {output_file.name} already exists.")
                skipped += 1
                continue

            log.info(f"  [GEN] Generating {output_file.name} ({len(text)} chars)")
            
            audio_bytes = call_elevenlabs(text)
            if audio_bytes:
                output_dir.mkdir(parents=True, exist_ok=True)
                output_file.write_bytes(audio_bytes)
                log.info(f"  [SAVE] {output_file.name} ({len(audio_bytes)/1024:.1f} KB)")
                generated += 1
                time.sleep(RATE_LIMIT_DELAY)
            else:
                log.error(f"  [FAIL] Could not generate audio for {output_file.name}")
                failed += 1

    log.info(f"\n{'═'*60}")
    log.info(f"Pipeline complete | Generated: {generated} | Skipped: {skipped} | Failed: {failed}")
    log.info(f"Estimated character usage (generated only): {total_chars if generated > 0 else 0}")
    log.info(f"{'═'*60}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SeptiVolt Spanish Audio Generator")
    parser.add_argument("--all", action="store_true", help="Generate all modules")
    parser.add_argument("--test", action="store_true", help="Generate only mod_1_1")
    parser.add_argument("--module", type=str, help="Generate a specific module (e.g., mod_2_8)")
    
    args = parser.parse_args()
    
    if args.all:
        run_pipeline(generate_all=True)
    elif args.module:
        run_pipeline(generate_all=False, test_module_id=args.module)
    else:
        # Default to test if no args
        run_pipeline(generate_all=False, test_module_id="mod_1_1")

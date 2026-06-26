#!/usr/bin/env python3
"""
SeptiVolt Solar Sales Rep Accelerator
Standardized Audio Generation Script
======================================
Generates and standardizes ElevenLabs audio day-by-day.
English: Tom (QO7Mfy7rwYLdxzo4Q3iD) | Spanish: Alberto Rodriguez (l1zE9xgNpUTaQCZzpNJa)
Model: eleven_v3

Usage:
  python scripts/generate_standardized_audio.py --day 1 --day-complete-mode --dry-run
  python scripts/generate_standardized_audio.py --day 1 --day-complete-mode --replace-legacy
"""

import os
import sys
import json
import time
import logging
import requests
import argparse
import hashlib
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
_BACKEND_ENV = Path(__file__).parent.parent / "backend" / ".env"
if _BACKEND_ENV.exists():
    load_dotenv(_BACKEND_ENV)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")

# ── Import canonical voice config (single source of truth) ───────────────────
from audio_voice_config import (
    ENGLISH_VOICE_ID,
    SPANISH_VOICE_ID,
    MODEL_ID as DEFAULT_MODEL,
    VOICE_SETTINGS,
)

VOICES = {
    "tom_v3": ENGLISH_VOICE_ID,
    "alberto_v3": SPANISH_VOICE_ID,
}
RATE_LIMIT_DELAY = 1.0  # seconds between API calls

# Directories
PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_JSON = PROJECT_ROOT / "scratch" / "all_audio_lessons.json"
MANIFEST_PATH = PROJECT_ROOT / "scripts" / "audio_manifest_standardized.json"
AUDIO_BASE_DIR = PROJECT_ROOT / "frontend" / "public" / "audio" / "modules"

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(PROJECT_ROOT / "audio_pipeline_standardized.log", encoding="utf-8")
    ]
)
log = logging.getLogger("audio_standardizer")

# Load existing manifest
def load_manifest():
    if MANIFEST_PATH.exists():
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            log.warning(f"Failed to load manifest: {e}. Starting fresh.")
    return {}

def save_manifest(manifest):
    try:
        with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
    except Exception as e:
        log.error(f"Failed to save manifest: {e}")

def get_text_hash(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()

def get_remaining_characters():
    if not ELEVENLABS_API_KEY:
        log.error("ELEVENLABS_API_KEY not found.")
        return 0
    url = "https://api.elevenlabs.io/v1/user/subscription"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return data.get("character_limit", 0) - data.get("character_count", 0)
    except Exception as e:
        log.error(f"Error checking ElevenLabs balance: {e}")
        return 0

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
        "model_id": DEFAULT_MODEL,
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
        if 'resp' in locals():
            log.error(f"Response: {resp.text[:200]}")
        return None

def parse_day(module_id, day_label):
    import re
    m = re.match(r"mod_(\d+)_", module_id)
    if m:
        return int(m.group(1))
    
    # Check day label fallback
    for d in range(1, 8):
        if f"Day {d}" in day_label:
            return d
    return None

def main():
    parser = argparse.ArgumentParser(description="SeptiVolt Day-by-Day Audio Quality Standardization")
    parser.add_argument("--lang", choices=["en", "es"], help="Generate only 'en' or 'es'")
    parser.add_argument("--day", type=int, help="Filter by day (1-7)")
    parser.add_argument("--module", type=str, help="Filter by moduleId (e.g., mod_1_1)")
    parser.add_argument("--dry-run", action="store_true", help="Perform a dry run and estimate cost")
    parser.add_argument("--force", action="store_true", help="Force overwrite of Approved Final files")
    parser.add_argument("--replace-legacy", action="store_true", help="Overwrite Legacy files")
    parser.add_argument("--voice-standard", choices=["tom_v3", "alberto_v3"], help="Override voice standard")
    parser.add_argument("--day-complete-mode", action="store_true", help="Generate all English & Spanish for specified day")

    args = parser.parse_args()

    # CLI Rules Check
    if args.day_complete_mode and not args.day:
        parser.error("--day-complete-mode requires specifying a --day (1-7)")

    if not SOURCE_JSON.exists():
        log.error(f"Source JSON not found at: {SOURCE_JSON}")
        sys.exit(1)

    with open(SOURCE_JSON, "r", encoding="utf-8") as f:
        lessons_data = json.load(f)

    manifest = load_manifest()
    
    # Voice selections
    voice_en = VOICES["tom_v3"]
    voice_es = VOICES["alberto_v3"]
    if args.voice_standard == "tom_v3":
        voice_en = VOICES["tom_v3"]
    elif args.voice_standard == "alberto_v3":
        voice_es = VOICES["alberto_v3"]

    # 1. Collect all expected items based on arguments
    items = []
    
    # Process English
    if args.lang is None or args.lang == "en":
        for mod in lessons_data.get("english", []):
            mod_id = mod["moduleId"]
            day = parse_day(mod_id, mod.get("dayLabel", ""))
            
            if args.day and day != args.day:
                continue
            if args.module and mod_id != args.module:
                continue
                
            for sec in mod.get("sections", []):
                sec_id = sec["id"]
                text = sec["text"].strip()
                if not text:
                    continue
                
                # English path: public/audio/modules/{moduleId}/{sectionId}.mp3
                output_path = AUDIO_BASE_DIR / mod_id / f"{sec_id}.mp3"
                items.append({
                    "moduleId": mod_id,
                    "sectionId": sec_id,
                    "text": text,
                    "lang": "en",
                    "voice_id": voice_en,
                    "model_id": DEFAULT_MODEL,
                    "output_path": output_path
                })

    # Process Spanish
    if args.lang is None or args.lang == "es":
        for mod in lessons_data.get("spanish", []):
            mod_id = mod["moduleId"]
            day = parse_day(mod_id, mod.get("dayLabel", ""))
            
            if args.day and day != args.day:
                continue
            if args.module and mod_id != args.module:
                continue
                
            for sec in mod.get("sections", []):
                sec_id = sec["id"]
                text = sec["text"].strip()
                if not text:
                    continue
                
                # Spanish path: public/audio/modules/{moduleId}/{sectionId}_es.mp3
                output_path = AUDIO_BASE_DIR / mod_id / f"{sec_id}_es.mp3"
                items.append({
                    "moduleId": mod_id,
                    "sectionId": sec_id,
                    "text": text,
                    "lang": "es",
                    "voice_id": voice_es,
                    "model_id": DEFAULT_MODEL,
                    "output_path": output_path
                })

    if not items:
        log.info("No sections found matching criteria.")
        return

    # 2. Classify items
    categories = {
        "Approved English Final": [],
        "Approved Spanish Final": [],
        "Legacy English": [],
        "Missing Spanish": [],
        "Missing English": [],
        "Broken/Invalid": []
    }

    for item in items:
        path = item["output_path"]
        lang = item["lang"]
        sec_key = f"{item['moduleId']}:{item['sectionId']}:{lang}"
        
        # Check if exists physically
        exists = path.exists()
        size = path.stat().st_size if exists else 0
        
        if exists and size == 0:
            categories["Broken/Invalid"].append(item)
            item["category"] = "Broken/Invalid"
            continue
            
        # Check manifest
        entry = manifest.get(sec_key)
        is_manifest_match = False
        if entry:
            # Check voice ID, model ID, and text hash
            txt_hash = get_text_hash(item["text"])
            if (entry.get("voice_id") == item["voice_id"] and 
                entry.get("model_id") == item["model_id"] and 
                entry.get("text_hash") == txt_hash):
                is_manifest_match = True

        if lang == "en":
            if exists and is_manifest_match:
                categories["Approved English Final"].append(item)
                item["category"] = "Approved English Final"
            elif exists:
                categories["Legacy English"].append(item)
                item["category"] = "Legacy English"
            else:
                categories["Missing English"].append(item)
                item["category"] = "Missing English"
        elif lang == "es":
            if exists and is_manifest_match:
                categories["Approved Spanish Final"].append(item)
                item["category"] = "Approved Spanish Final"
            elif exists:
                # Spanish file exists but doesn't match manifest (legacy Alberto or mismatched text)
                categories["Broken/Invalid"].append(item)
                item["category"] = "Broken/Invalid"
            else:
                categories["Missing Spanish"].append(item)
                item["category"] = "Missing Spanish"

    # Print Inventory Classification
    log.info("\n=== Audio Inventory Classification Summary ===")
    for cat, cat_items in categories.items():
        char_sum = sum(len(x["text"]) for x in cat_items)
        log.info(f"  - {cat}: {len(cat_items)} files ({char_sum:,} characters)")

    # 3. Determine which files actually need to be generated
    to_generate = []
    to_skip = []
    
    for item in items:
        cat = item["category"]
        
        if cat in ["Approved English Final", "Approved Spanish Final"]:
            if args.force:
                to_generate.append(item)
            else:
                to_skip.append(item)
        elif cat in ["Legacy English", "Broken/Invalid"]:
            if args.force or args.replace_legacy:
                to_generate.append(item)
            else:
                to_skip.append(item)
        else:  # Missing English, Missing Spanish
            to_generate.append(item)

    total_req_chars = sum(len(x["text"]) for x in to_generate)
    log.info(f"\nTotal items to generate: {len(to_generate)} ({total_req_chars:,} characters)")
    log.info(f"Total items to skip: {len(to_skip)} ({sum(len(x['text']) for x in to_skip):,} characters)")

    # 4. Dry run check
    if args.dry_run:
        log.info("\n[DRY RUN] Projected file actions:")
        for idx, item in enumerate(to_generate):
            log.info(f"  {idx+1:3d}. [GENERATE] {item['lang'].upper()} -> {item['output_path'].relative_to(PROJECT_ROOT)} ({len(item['text'])} chars)")
        for idx, item in enumerate(to_skip):
            log.info(f"  {idx+1:3d}. [SKIP]     {item['lang'].upper()} -> {item['output_path'].relative_to(PROJECT_ROOT)} ({item['category']})")
        
        log.info(f"\n[DRY RUN] Estimated character quota consumption: {total_req_chars:,} characters")
        return

    # 5. Check remaining balance
    log.info("Querying ElevenLabs subscription status...")
    remaining_quota = get_remaining_characters()
    log.info(f"Remaining ElevenLabs Quota: {remaining_quota:,} characters")
    
    if total_req_chars > remaining_quota:
        log.error(f"FATAL: Quota is insufficient. Required: {total_req_chars:,} | Available: {remaining_quota:,} | Shortfall: {total_req_chars - remaining_quota:,} chars")
        sys.exit(1)

    if not to_generate:
        log.info("No audio generation required.")
        return

    # Confirm action
    log.info(f"Starting audio generation of {len(to_generate)} files...")

    # 6. Generate
    generated_count = 0
    failed_count = 0
    
    for idx, item in enumerate(to_generate):
        log.info(f"[{idx+1}/{len(to_generate)}] Generating {item['moduleId']} {item['sectionId']} ({item['lang']}) - {len(item['text'])} chars...")
        
        audio_bytes = call_elevenlabs(item["text"], item["voice_id"])
        if audio_bytes:
            # Create parent dirs
            item["output_path"].parent.mkdir(parents=True, exist_ok=True)
            
            # Save file
            item["output_path"].write_bytes(audio_bytes)
            
            # Verify file exists and is > 0
            if item["output_path"].exists() and item["output_path"].stat().st_size > 0:
                log.info(f"  [SAVED] {item['output_path'].relative_to(PROJECT_ROOT)} ({len(audio_bytes)/1024:.1f} KB)")
                generated_count += 1
                
                # Update manifest
                sec_key = f"{item['moduleId']}:{item['sectionId']}:{item['lang']}"
                manifest[sec_key] = {
                    "moduleId": item["moduleId"],
                    "sectionId": item["sectionId"],
                    "language": item["lang"],
                    "voice_id": item["voice_id"],
                    "model_id": item["model_id"],
                    "text_hash": get_text_hash(item["text"]),
                    "file_size": item["output_path"].stat().st_size,
                    "timestamp": time.time()
                }
                save_manifest(manifest)
                time.sleep(RATE_LIMIT_DELAY)
            else:
                log.error(f"  [ERROR] File validation failed for {item['output_path']}")
                failed_count += 1
        else:
            log.error(f"  [ERROR] ElevenLabs API failed for {item['moduleId']} {item['sectionId']}")
            failed_count += 1

    # Save manifest at the end
    save_manifest(manifest)

    # 7. Print Completion Report
    log.info("\n" + "="*60)
    log.info("STANDARD AUDIO LOCALIZATION RUN COMPLETE")
    log.info(f"  - Generated successfully: {generated_count}")
    log.info(f"  - Failed: {failed_count}")
    log.info("="*60 + "\n")

    # Generate Manifest completion report
    manifest_report = {
        "timestamp": time.time(),
        "day": args.day,
        "lang": args.lang,
        "generated": generated_count,
        "failed": failed_count,
        "total_req_chars": total_req_chars
    }
    with open(PROJECT_ROOT / "scripts" / "run_completion_report.json", "w", encoding="utf-8") as f:
        json.dump(manifest_report, f, indent=2)

if __name__ == "__main__":
    main()

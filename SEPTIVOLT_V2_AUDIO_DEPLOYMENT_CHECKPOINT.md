# SeptiVolt V2 Bilingual Audio Deployment Checkpoint

## Project State: `v2-bilingual-audio-release`
**Timestamp**: 2026-05-16
**Objective**: Final production-grade baseline for all English and Spanish audio assets.

---

## 1. Audio Architecture & Path Conventions
The system uses a locale-aware static asset resolution strategy with ElevenLabs fallback.

### Directory Structure
- **English Core**: `/public/audio/modules/mod_{id}/mod_{id}_{segment}.mp3`
- **English Additive**: `/public/audio/modules/mod_{id}/section_{n}.mp3`
- **Spanish Library**: `/public/audio/modules/es/mod_{id}/section_{n}.mp3`

### Path Resolution Logic (`narration-service.ts`)
1. **Try Static**: Check `/public/audio/modules/[es]/mod_{id}/[prefix]_[index].mp3`.
2. **Fallback**: If static asset is missing, trigger ElevenLabs API generation.
3. **Voice Selection**:
   - English: **Tom** (`QO7Mfy7rwYLdxzo4Q3iD`)
   - Spanish: **Alberto Rodriguez** (`l1zE9xgNpUTaQCZzpNJa`)

---

## 2. Technical Configurations

| Parameter | English | Spanish |
| :--- | :--- | :--- |
| **Model** | Eleven v3 | Eleven v3 |
| **Voice ID** | `QO7Mfy7rwYLdxzo4Q3iD` | `l1zE9xgNpUTaQCZzpNJa` |
| **Naming Convention** | `mod_` (Core) / `section_` (Add) | `section_` |
| **Total Modules** | 75 (58 Core / 17 Additive) | 76 |
| **Total Files** | 320 (Est) | 320 (Est) |

---

## 3. Inventory Summary (Immutable Backup)
- **Total Audio Files**: 640
- **Total English Modules**: 75
- **Total Spanish Modules**: 76
- **ElevenLabs Credit Balance**: 83,302 characters (Remaining)

---

## 4. Recovery & Rollback Instructions

### Emergency Rollback
If audio corruption is detected:
1. Revert to git tag: `v2-bilingual-audio-release`.
2. Restore `/public/audio/modules/` from backup manifests.
3. Run `npm run build` to verify path integrity.

### Retry Workflow
If specific modules are missing or corrupted:
1. Locate the module ID in `scripts/modules_en.json` or `scripts/modules_es.json`.
2. Delete the corrupted folder in `/public/audio/modules/`.
3. Run `scripts/generate_audio_all.py --lang [en|es]`.
4. The script will automatically skip existing valid directories and regenerate only the missing ones.

### Recovery from Scratch
If all audio is lost:
1. Ensure `.env` has valid `ELEVENLABS_API_KEY`.
2. Run `python scripts/generate_audio_all.py --lang es` (Full Spanish).
3. Run `python scripts/generate_audio_all.py --lang en` (Missing EN Additive).
4. **CAUTION**: Existing English core audio must be manually restored from `v2-bilingual-audio-release` backup as the script is configured to protect legacy files, not recreate them from scratch using legacy naming.

---

## 5. Deployment Notes
- **Hosting**: Vercel (Frontend) / Render (Backend).
- **Asset Size**: ~250MB total.
- **Build Step**: `npm run build` verifies that all static assets are mapped correctly.
- **CORS**: Ensure ElevenLabs domain is whitelisted if dynamic fallback is enabled.

---

## 6. Known Limitations
- **English Core Suffixes**: Legacy files use `_intro.mp3`, `_segment_n.mp3`, and `_transition.mp3`. V2/Spanish uses `section_n.mp3` uniformly.
- **Dynamic Fallback Latency**: Real-time ElevenLabs synthesis adds 2-5 seconds of delay per section. Static assets should always be preferred.

---

## 7. Manifests & Maps
- [EN Core Manifest](file:///scripts/audio_inventory_en_core.json)
- [EN Additive Manifest](file:///scripts/audio_inventory_en_additive.json)
- [Spanish Manifest](file:///scripts/audio_inventory_es.json)
- [Master Inventory Map](file:///scripts/audio_inventory_map.json)

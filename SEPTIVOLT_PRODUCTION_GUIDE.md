# SeptiVolt Production Guide & Canonical Structure

This document serves as the single source of truth for the workspace structure and production pipeline.

## 🚀 Canonical Source of Truth
The primary directory for all delivery assets is:
`SeptiVolt_Delivery/`

### 🇬🇧 English Curriculum (EN)
- **Master Curriculum:** `SeptiVolt_Delivery/EN/Curriculum/MASTER_CURRICULUM_PACK_V2_UNIFIED.md`
- **Audio Manifest:** `SeptiVolt_Delivery/EN/ElevenLabs_Transcripts/ElevenLabs_Production_Manifest.json`
- **Slides:**
    - `SeptiVolt_Delivery/EN/Slides_MainDays/` (Core curriculum)
    - `SeptiVolt_Delivery/EN/Slides_V2Modules/` (Additive V2 modules)

### 🇪🇸 Spanish Curriculum (ES)
- **Curriculum:** `SeptiVolt_Delivery/ES/Curriculum/MASTER_CURRICULUM_PACK_V2_ES_*.md` (Currently split by days)
- **Transcripts:** `SeptiVolt_Delivery/ES/ElevenLabs_Transcripts/`
- **Slides:** `SeptiVolt_Delivery/ES/Slides_MainDays/`

## 📂 Directory Map

| Asset Type | Location | Description |
| :--- | :--- | :--- |
| **Unified Curriculum** | `SeptiVolt_Delivery/EN/Curriculum/` | The complete V2 training manual. |
| **Transcripts** | `SeptiVolt_Delivery/[lang]/ElevenLabs_Transcripts/` | Inputs for ElevenLabs audio generation. |
| **Slides (Production)** | `SeptiVolt_Delivery/[lang]/Slides_*/` | Source PPTX and PDF slides. |
| **Slides (Frontend)** | `frontend/public/slides/` | PDFs served to the trainee web interface. |
| **Audio** | `frontend/public/audio/` | Generated narration files. |

## 🛠 Production Workflow
1. Update content in `SeptiVolt_Delivery/EN/Curriculum/MASTER_CURRICULUM_PACK_V2_UNIFIED.md`.
2. Sync changes to transcripts in `SeptiVolt_Delivery/EN/ElevenLabs_Transcripts/`.
3. Update `ElevenLabs_Production_Manifest.json` to trigger audio regeneration.
4. Export finalized slides to `frontend/public/slides/`.

---
*Last Updated: 2026-05-12*

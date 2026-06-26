"""
SeptiVolt Audio Voice Configuration — Single Source of Truth
=============================================================
All ElevenLabs voice parameters used by:
  - backend/voice.py           (real-time TTS fallback)
  - scripts/generate_standardized_audio.py  (static batch generation)
  - scripts/regen_audio_day.py              (day-by-day regeneration)
  - scripts/audit_audio_consistency.py      (guardrail audit)

DO NOT duplicate these constants elsewhere. Import from this file.
"""

# ── Voice IDs ────────────────────────────────────────────────────────────────
ENGLISH_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"   # Tom — American, Confident & Persuasive Trainer
SPANISH_VOICE_ID = "l1zE9xgNpUTaQCZzpNJa"   # Alberto Rodriguez — Spanish Narrator

# ── Model ────────────────────────────────────────────────────────────────────
MODEL_ID = "eleven_v3"

# ── Voice Settings ───────────────────────────────────────────────────────────
VOICE_SETTINGS = {
    "stability": 0.50,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
}

# ── Convenience Helpers ──────────────────────────────────────────────────────
def get_voice_id(language: str) -> str:
    """Return the canonical voice ID for a language code ('en' or 'es')."""
    return SPANISH_VOICE_ID if language == "es" else ENGLISH_VOICE_ID

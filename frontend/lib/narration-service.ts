import { getApiUrl } from "@/lib/utils"
import { AUDIO_MANIFEST } from "@/lib/audio-manifest.generated"

export type NarrationSource = {
  mode: "static_asset" | "elevenlabs_generated" | "speech_synthesis"
  src?: string
  error?: string
  isLanguageFallback?: boolean
  fallbackFrom?: string
  fallbackTo?: string
  fallbackReason?: string
}

export type NarrationRequest = {
  moduleId: string
  sectionId: string
  text: string
  voiceId?: string
  language?: string
}

const API_URL = getApiUrl()

// Tom — American, Confident & Persuasive Trainer (matches backend DEFAULT_VOICE_ID)
const DEFAULT_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"
// Alberto Rodriguez — Spanish Narrator (canonical Spanish voice)
const SPANISH_VOICE_ID = "l1zE9xgNpUTaQCZzpNJa"

// ─── Debug Logging ────────────────────────────────────────────────────────────
// Activate with: localStorage.setItem("septivolt_audio_debug", "true")
function debugLog(label: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return
  if (window.localStorage.getItem("septivolt_audio_debug") !== "true") return
  console.log(`[SeptiVolt Audio] ${label}`, data)
}

// ─── Fallback Warnings (always-on, deduped per session) ──────────────────────
// Unlike debugLog, these are NOT gated behind the debug flag: QA and production
// monitoring must see exactly which sections are audio-degraded. Deduped per
// module/section/tier so preview verticals (no static audio) don't flood the
// console on every replay.
const warnedFallbackKeys = new Set<string>()
function warnFallbackOnce(key: string, message: string) {
  if (typeof window === "undefined") return
  if (warnedFallbackKeys.has(key)) return
  warnedFallbackKeys.add(key)
  console.warn(message)
}

// ─── Manifest Lookup ──────────────────────────────────────────────────────────
/**
 * Checks if a given audio section exists in the static manifest.
 * Returns the public URL if found, or null if not tracked.
 *
 * Manifest is generated at build time by scripts/generate_audio_manifest.py
 * and reflects the actual files present in frontend/public/audio/modules/.
 */
function checkManifest(moduleId: string, sectionId: string, lang: "en" | "es"): string | null {
  const moduleMap = AUDIO_MANIFEST[moduleId]
  if (!moduleMap) return null
  const entry = moduleMap[sectionId]
  if (!entry) return null
  if (!entry[lang]) return null

  const suffix = lang === "es" ? `${sectionId}_es.mp3` : `${sectionId}.mp3`
  return `/audio/modules/${moduleId}/${suffix}`
}

// ─── ElevenLabs Generated Narration Fallback ──────────────────────────────────
async function tryGeneratedNarration(text: string, voiceId?: string) {
  try {
    const response = await fetch(`${API_URL}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice_id: voiceId ?? DEFAULT_VOICE_ID,
      }),
    })
    if (!response.ok) return null
    const audioBlob = await response.blob()
    return URL.createObjectURL(audioBlob)
  } catch {
    return null
  }
}

// ─── Main Resolver ────────────────────────────────────────────────────────────
export async function resolveNarrationSource(request: NarrationRequest): Promise<NarrationSource> {
  const isEs = request.language === "es"
  const { moduleId, sectionId } = request

  debugLog("Resolving audio", {
    moduleId,
    sectionId,
    language: request.language,
    isEs,
  })

  // ── Spanish Resolution Chain ────────────────────────────────────────────────
  if (isEs) {
    // Step 1: Spanish static asset (manifest lookup)
    const spanishPath = checkManifest(moduleId, sectionId, "es")
    if (spanishPath) {
      debugLog("Manifest HIT — Spanish", { path: spanishPath, fallback: false })
      return {
        mode: "static_asset",
        src: spanishPath,
        isLanguageFallback: false,
      }
    }

    debugLog("Manifest MISS — Spanish", {
      sectionId,
      reason: "Spanish asset not in manifest",
    })
    warnFallbackOnce(
      `${moduleId}/${sectionId}/es/manifest`,
      `[SeptiVolt Audio] FALLBACK: ${moduleId}/${sectionId} — no Spanish static MP3 in manifest. Trying ElevenLabs API.`
    )

    // Step 2: Spanish real-time TTS with Alberto Rodriguez voice
    const spanishGeneratedSrc = await tryGeneratedNarration(request.text, SPANISH_VOICE_ID)
    if (spanishGeneratedSrc) {
      debugLog("ElevenLabs generated narration — Spanish (Alberto)", { fallback: false })
      return {
        mode: "elevenlabs_generated",
        src: spanishGeneratedSrc,
        isLanguageFallback: false,
      }
    }

    debugLog("Spanish TTS failed — showing unavailable state", { sectionId })
    warnFallbackOnce(
      `${moduleId}/${sectionId}/es/elevenlabs`,
      `[SeptiVolt Audio] FALLBACK: ${moduleId}/${sectionId} — Spanish ElevenLabs failed. Spanish audio unavailable.`
    )

    // Step 3: Explicit unavailable state — NO automatic English fallback
    // The user must manually choose to switch to English
    return {
      mode: "speech_synthesis",
      error: "Narración en español no disponible. Cambie a inglés si lo desea.",
      isLanguageFallback: false,
      fallbackFrom: "es",
      fallbackReason: "Spanish asset and real-time TTS both unavailable",
    }
  }

  // ── English Resolution Chain ────────────────────────────────────────────────

  // Step 1: English static asset (manifest lookup)
  const englishPath = checkManifest(moduleId, sectionId, "en")
  if (englishPath) {
    debugLog("Manifest HIT — English", {
      path: englishPath,
      fallback: false,
    })
    return {
      mode: "static_asset",
      src: englishPath,
      isLanguageFallback: false,
    }
  }

  debugLog("Manifest MISS — English", {
    sectionId,
    reason: "English asset not in manifest either",
  })
  warnFallbackOnce(
    `${moduleId}/${sectionId}/en/manifest`,
    `[SeptiVolt Audio] FALLBACK: ${moduleId}/${sectionId} — no English static MP3 in manifest. Trying ElevenLabs API.`
  )

  // Step 2: ElevenLabs generated narration (real-time API with Tom voice)
  const generatedSrc = await tryGeneratedNarration(request.text, request.voiceId)
  if (generatedSrc) {
    debugLog("ElevenLabs generated narration — English", { fallback: false })
    return {
      mode: "elevenlabs_generated",
      src: generatedSrc,
      isLanguageFallback: false,
    }
  }

  // Step 3: Browser speech synthesis (last resort)
  debugLog("Fallback to browser speech synthesis", { fallback: false })
  warnFallbackOnce(
    `${moduleId}/${sectionId}/en/elevenlabs`,
    `[SeptiVolt Audio] FALLBACK: ${moduleId}/${sectionId} — ElevenLabs API failed. Falling back to browser TTS.`
  )
  return {
    mode: "speech_synthesis",
    error: "Narration is loading via your browser. Press Play to begin.",
    isLanguageFallback: false,
  }
}

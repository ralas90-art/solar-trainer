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

// ─── Debug Logging ────────────────────────────────────────────────────────────
// Activate with: localStorage.setItem("septivolt_audio_debug", "true")
function debugLog(label: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return
  if (window.localStorage.getItem("septivolt_audio_debug") !== "true") return
  console.log(`[SeptiVolt Audio] ${label}`, data)
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

  // ── Step 1: Spanish static asset (manifest lookup) ──────────────────────────
  if (isEs) {
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
  }

  // ── Step 2: English static asset (manifest lookup, with fallback flag) ────────
  const englishPath = checkManifest(moduleId, sectionId, "en")
  if (englishPath) {
    const fallbackReason = isEs ? "Spanish asset not in manifest" : undefined
    debugLog("Manifest HIT — English", {
      path: englishPath,
      fallback: isEs,
      fallbackReason,
    })
    return {
      mode: "static_asset",
      src: englishPath,
      isLanguageFallback: isEs,
      ...(isEs
        ? {
            fallbackFrom: "es",
            fallbackTo: "en",
            fallbackReason,
          }
        : {}),
    }
  }

  debugLog("Manifest MISS — English", {
    sectionId,
    reason: "English asset not in manifest either",
  })

  // ── Step 3: ElevenLabs generated narration (real-time API) ───────────────────
  const generatedSrc = await tryGeneratedNarration(request.text, request.voiceId)
  if (generatedSrc) {
    debugLog("ElevenLabs generated narration", { fallback: isEs })
    return {
      mode: "elevenlabs_generated",
      src: generatedSrc,
      isLanguageFallback: isEs,
      ...(isEs
        ? {
            fallbackFrom: "es",
            fallbackTo: "en",
            fallbackReason: "Spanish asset not in manifest",
          }
        : {}),
    }
  }

  // ── Step 4: Browser speech synthesis (last resort) ───────────────────────────
  debugLog("Fallback to browser speech synthesis", { fallback: isEs })
  return {
    mode: "speech_synthesis",
    error: "Audio asset not available. Using browser speech fallback.",
    isLanguageFallback: isEs,
    ...(isEs
      ? {
          fallbackFrom: "es",
          fallbackTo: "en",
          fallbackReason: "Spanish asset not in manifest",
        }
      : {}),
  }
}

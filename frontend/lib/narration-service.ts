import { getApiUrl } from "@/lib/utils"

export type NarrationSource = {
  mode: "static_asset" | "elevenlabs_generated" | "speech_synthesis"
  src?: string
  error?: string
  isLanguageFallback?: boolean
  fallbackFrom?: string
  fallbackTo?: string
}

export type NarrationRequest = {
  moduleId: string
  sectionId: string
  text: string
  voiceId?: string
  language?: string
}

const API_URL = getApiUrl()

async function tryStaticAsset(moduleId: string, assetName: string) {
  const staticUrl = `/audio/modules/${moduleId}/${assetName}.mp3`
  try {
    const response = await fetch(staticUrl, { method: "HEAD" })
    return response.ok ? staticUrl : null
  } catch {
    return null
  }
}

// Tom — American, Confident & Persuasive Trainer (matches backend DEFAULT_VOICE_ID)
const DEFAULT_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"

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

export async function resolveNarrationSource(request: NarrationRequest): Promise<NarrationSource> {
  const isEs = request.language === "es"

  // 1. Spanish static audio asset
  if (isEs) {
    const spanishStatic = await tryStaticAsset(request.moduleId, `${request.sectionId}_es`)
    if (spanishStatic) {
      return {
        mode: "static_asset",
        src: spanishStatic,
        isLanguageFallback: false
      }
    }
  }

  // 2. English static audio asset with fallback flag
  const englishStatic = await tryStaticAsset(request.moduleId, request.sectionId)
  if (englishStatic) {
    return {
      mode: "static_asset",
      src: englishStatic,
      isLanguageFallback: isEs,
      ...(isEs ? { fallbackFrom: "es", fallbackTo: "en" } : {})
    }
  }

  // 3. Generated or speech synthesis fallback with fallback flag if language is Spanish
  const generatedSrc = await tryGeneratedNarration(request.text, request.voiceId)
  if (generatedSrc) {
    return {
      mode: "elevenlabs_generated",
      src: generatedSrc,
      isLanguageFallback: isEs,
      ...(isEs ? { fallbackFrom: "es", fallbackTo: "en" } : {})
    }
  }

  return {
    mode: "speech_synthesis",
    error: "Audio asset not available. Using browser speech fallback.",
    isLanguageFallback: isEs,
    ...(isEs ? { fallbackFrom: "es", fallbackTo: "en" } : {})
  }
}

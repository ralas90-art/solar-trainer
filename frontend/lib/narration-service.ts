import { getApiUrl } from "@/lib/utils"

export type NarrationSource = {
  mode: "static_asset" | "elevenlabs_generated" | "speech_synthesis"
  src?: string
  error?: string
}

export type NarrationRequest = {
  moduleId: string
  sectionId: string
  text: string
  voiceId?: string
  locale?: string
}

const API_URL = getApiUrl()

async function tryStaticAsset(moduleId: string, sectionId: string, locale?: string) {
  const pathPrefix = locale === "es" ? "/audio/modules/es" : "/audio/modules"
  const staticUrl = `${pathPrefix}/${moduleId}/${sectionId}.mp3`
  try {
    const response = await fetch(staticUrl, { method: "HEAD" })
    return response.ok ? staticUrl : null
  } catch {
    return null
  }
}

// Tom — American, Confident & Persuasive Trainer
const DEFAULT_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"
// Alberto — Spanish (Latin American), Serious Narrative
const SPANISH_VOICE_ID = "l1zE9xgNpUTaQCZzpNJa"

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
  const staticSrc = await tryStaticAsset(request.moduleId, request.sectionId, request.locale)
  if (staticSrc) {
    return { mode: "static_asset", src: staticSrc }
  }

  const effectiveVoiceId = request.voiceId ?? (request.locale === "es" ? SPANISH_VOICE_ID : DEFAULT_VOICE_ID)
  const generatedSrc = await tryGeneratedNarration(request.text, effectiveVoiceId)
  if (generatedSrc) {
    return { mode: "elevenlabs_generated", src: generatedSrc }
  }

  return {
    mode: "speech_synthesis",
    error: "Audio asset not available. Using browser speech fallback.",
  }
}

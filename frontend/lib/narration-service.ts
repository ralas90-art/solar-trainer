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
}

const API_URL = getApiUrl()

async function tryStaticAsset(moduleId: string, sectionId: string) {
  const staticUrl = `/audio/modules/${moduleId}/${sectionId}.mp3`
  try {
    const response = await fetch(staticUrl, { method: "HEAD" })
    return response.ok ? staticUrl : null
  } catch {
    return null
  }
}

async function tryGeneratedNarration(text: string, voiceId?: string) {
  try {
    const response = await fetch(`${API_URL}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice_id: voiceId ?? "QO7Mfy7rwYLdxzo4Q3iD",
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
  const staticSrc = await tryStaticAsset(request.moduleId, request.sectionId)
  if (staticSrc) {
    return { mode: "static_asset", src: staticSrc }
  }

  const generatedSrc = await tryGeneratedNarration(request.text, request.voiceId)
  if (generatedSrc) {
    return { mode: "elevenlabs_generated", src: generatedSrc }
  }

  return {
    mode: "speech_synthesis",
    error: "Audio asset not available. Using browser speech fallback.",
  }
}

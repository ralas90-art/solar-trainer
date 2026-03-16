import { AlertTriangle, Headphones, PauseCircle, PlayCircle } from "lucide-react"

export function NarrationStatusCard({
  isPlaying,
  currentSectionTitle,
  sourceMode,
  completedCount,
  totalCount,
  errorMessage,
}: {
  isPlaying: boolean
  currentSectionTitle: string
  sourceMode: "static_asset" | "elevenlabs_generated" | "speech_synthesis"
  completedCount: number
  totalCount: number
  errorMessage: string | null
}) {
  const statusLabel = isPlaying ? "Playing" : "Paused"
  const sourceLabel =
    sourceMode === "static_asset"
      ? "Static lesson audio"
      : sourceMode === "elevenlabs_generated"
      ? "ElevenLabs-generated narration"
      : "Browser speech fallback"

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#FF5722]">
          <Headphones className="h-4 w-4" />
          <p className="font-hud text-[11px] uppercase tracking-[0.16em]">Audio Lesson</p>
        </div>
        <span className="text-xs text-[#94A3B8]">
          {completedCount}/{totalCount} sections complete
        </span>
      </div>
      <p className="mt-3 text-sm text-white">{currentSectionTitle}</p>
      <p className="mt-1 text-xs text-[#94A3B8]">{sourceLabel}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {isPlaying ? <PauseCircle className="h-4 w-4 text-[#FFB300]" /> : <PlayCircle className="h-4 w-4 text-[#FF5722]" />}
        <span className={isPlaying ? "text-[#FFB300]" : "text-[#FF5722]"}>{statusLabel}</span>
      </div>
      {errorMessage ? (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-[#F97316]/25 bg-[#F97316]/10 px-2 py-1 text-xs text-[#FDBA74]">
          <AlertTriangle className="h-3.5 w-3.5" />
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

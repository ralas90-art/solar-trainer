export function AudioProgressBar({ progressPercent, label }: { progressPercent: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-hud uppercase tracking-[0.14em] text-[#94A3B8]">{label}</span>
        <span className="font-hud text-[#FF5722]">{Math.round(progressPercent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-[linear-gradient(90deg,#FF5722,#FFB300)]" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }} />
      </div>
    </div>
  )
}

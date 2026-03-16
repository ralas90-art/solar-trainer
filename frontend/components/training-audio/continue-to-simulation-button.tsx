import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ContinueToSimulationButton({
  href,
  disabled,
}: {
  href: string
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#64748B]"
      >
        Complete audio lesson to unlock simulation
      </button>
    )
  }

  return (
    <Link href={href} className="btn-solar inline-flex items-center gap-2 px-5 py-3 text-sm">
      Continue to Simulation
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

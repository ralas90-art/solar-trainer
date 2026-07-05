"use client"

import { AppShell } from "@/components/platform/app-shell"
import { GuidedModuleExperience } from "@/components/training-module/guided-module-experience"
import { getTrainingModuleView } from "@/lib/training-module-view"
import { useCompanyVerticals } from "@/hooks/use-company-verticals"
import { checkModuleAccess } from "@/lib/vertical-access"
import { getVerticalByModuleId, VERTICALS } from "@/lib/verticals"
import Link from "next/link"
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react"

export default function TrainingModuleDetailPage({ params }: { params: { moduleId: string } }) {
  const { accessContext, loading } = useCompanyVerticals()
  const moduleView = getTrainingModuleView(params.moduleId)

  // ── Loading State ──
  if (loading) {
    return (
      <AppShell heading="Training Module" subheading="Verifying access...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5722]/60" />
        </div>
      </AppShell>
    )
  }

  // ── Module Not Found (unknown ID — existing behavior preserved) ──
  if (!moduleView) {
    return (
      <AppShell heading="Training Module" subheading="Module not found.">
        <div className="space-y-4">
          <p className="text-sm text-[#94A3B8]">This module route does not exist in local curriculum data.</p>
          <Link href="/my-training" className="btn-primary inline-flex px-4 py-2 text-sm">
            Back to module list
          </Link>
        </div>
      </AppShell>
    )
  }

  // ── Access Check ──
  const accessResult = checkModuleAccess(params.moduleId, accessContext)

  if (!accessResult.allowed) {
    const vertical = getVerticalByModuleId(params.moduleId)
    const verticalName = vertical ? VERTICALS[vertical.id]?.name || vertical.id : "this vertical"

    return (
      <AppShell heading="Training Not Available" subheading="This module is not enabled for your company.">
        <div className="max-w-lg space-y-6">
          {/* Access denied card */}
          <div className="glass-circuit hud-border rounded-[20px] p-6 border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/10 via-red-500/40 to-red-500/10" />

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <div className="space-y-2 min-w-0">
                <h3 className="font-display font-bold text-white text-base">
                  {verticalName} Training Not Enabled
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {accessResult.reason === "preview_only"
                    ? "This training vertical is currently in preview and not yet available for your company. It will be released in a future update."
                    : "This training vertical is not currently enabled for your company. Contact your administrator to request access."}
                </p>
              </div>
            </div>
          </div>

          {/* Back to training link */}
          <Link
            href="/my-training"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#FF5722]/30 bg-gradient-to-r from-[#FF5722]/15 to-[#FFB300]/15 text-sm font-bold uppercase tracking-widest text-[#FFD54F] hover:from-[#FF5722]/25 hover:to-[#FFB300]/25 hover:border-[#FF5722]/50 transition-all shadow-[0_0_20px_rgba(255,87,34,0.15)] font-hud"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Training
          </Link>
        </div>
      </AppShell>
    )
  }

  // ── Authorized — Show Module Content ──
  const firstScenario = moduleView.simulationScenarioIds[0]
  const simulationHref = firstScenario
    ? `/ai-simulator?moduleId=${moduleView.id}&scenarioId=${firstScenario}`
    : `/ai-simulator?moduleId=${moduleView.id}`

  return (
    <AppShell heading={`Training Module ${moduleView.moduleNumber}`} subheading={`${moduleView.dayLabel} - ${moduleView.estimatedTime}`}>
      <GuidedModuleExperience moduleView={moduleView} simulationHref={simulationHref} />
    </AppShell>
  )
}

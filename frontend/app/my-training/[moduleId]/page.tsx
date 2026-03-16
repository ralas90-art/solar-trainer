import { AppShell } from "@/components/platform/app-shell"
import { GuidedModuleExperience } from "@/components/training-module/guided-module-experience"
import { getTrainingModuleView } from "@/lib/training-module-view"
import Link from "next/link"

export default function TrainingModuleDetailPage({ params }: { params: { moduleId: string } }) {
  const moduleView = getTrainingModuleView(params.moduleId)

  if (!moduleView) {
    return (
      <AppShell heading="Training Module" subheading="Module not found.">
        <div className="space-y-4">
          <p className="text-sm text-[#94A3B8]">This module route does not exist in local curriculum data.</p>
          <Link href="/my-training" className="btn-solar inline-flex px-4 py-2 text-sm">
            Back to module list
          </Link>
        </div>
      </AppShell>
    )
  }

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

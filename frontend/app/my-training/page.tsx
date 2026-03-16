import { AppShell } from "@/components/platform/app-shell"
import { getTrainingModuleCatalog } from "@/lib/training-module-view"
import { InteractiveCurriculumClient } from "@/components/training-module/interactive-curriculum-client"

export default function MyTrainingPage() {
  // Pass a large limit so the user can browse the entire curriculum map.
  const moduleCatalog = getTrainingModuleCatalog(50)

  if (!moduleCatalog || moduleCatalog.length === 0) {
    return (
      <AppShell heading="Training Modules" subheading="Local curriculum data unavailable.">
        <p className="text-sm text-[#94A3B8]">No training modules were found in local curriculum sources.</p>
      </AppShell>
    )
  }

  return (
    <AppShell
      heading="My Training"
      subheading="Structured lesson flow that prepares you for high-pressure AI simulation reps."
    >
      <InteractiveCurriculumClient moduleCatalog={moduleCatalog} />
    </AppShell>
  )
}

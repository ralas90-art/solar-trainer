"use client"

import { GuidedModuleExperience } from "@/components/training-module/guided-module-experience"

export default function TrainingModuleDetailPage({ params }: { params: { moduleId: string } }) {
  return (
    <GuidedModuleExperience moduleId={params.moduleId} />
  )
}

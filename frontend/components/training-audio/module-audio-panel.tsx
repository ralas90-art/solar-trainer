"use client"

import { useState } from "react"
import { ContinueToSimulationButton } from "@/components/training-audio/continue-to-simulation-button"
import { LessonAudioPlayer } from "@/components/training-audio/lesson-audio-player"
import { ModuleAudioLesson } from "@/lib/training-audio"

export function ModuleAudioPanel({
  moduleId,
  lesson,
  simulationHref,
}: {
  moduleId: string
  lesson: ModuleAudioLesson
  simulationHref: string
}) {
  const [audioComplete, setAudioComplete] = useState(false)

  return (
    <section className="space-y-4">
      <LessonAudioPlayer moduleId={moduleId} lesson={lesson} onLessonComplete={() => setAudioComplete(true)} />
      <ContinueToSimulationButton href={simulationHref} disabled={!audioComplete} />
    </section>
  )
}

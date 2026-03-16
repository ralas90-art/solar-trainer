import { TrainingModuleView } from "@/lib/training-module-view"

export type AudioLessonSection = {
  id: string
  title: string
  narrationText: string
  estimatedDurationSec: number
  scriptLines: string[]
}

export type ModuleAudioLesson = {
  moduleId: string
  lessonTitle: string
  sections: AudioLessonSection[]
  totalEstimatedDurationSec: number
}

function estimateDurationSec(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  // ~150 wpm narration baseline
  return Math.max(18, Math.round((words / 150) * 60))
}

function makeSection(id: string, title: string, text: string, scriptLines: string[] = []): AudioLessonSection {
  return {
    id,
    title,
    narrationText: text,
    scriptLines,
    estimatedDurationSec: estimateDurationSec(text),
  }
}

export function buildModuleAudioLesson(module: TrainingModuleView): ModuleAudioLesson {
  const transitionScenario = module.simulationScenarioIds[0] ?? "assigned scenario"

  const firstSegmentScript = module.instructionalSegments[0]?.spokenTeachingScript ?? ""
  const isIntroRedundant = firstSegmentScript.toLowerCase().startsWith(module.lessonOverview.toLowerCase().slice(0, 50))

  const introSection = makeSection(
    `${module.id}_intro`,
    "Intro",
    isIntroRedundant 
      ? `Welcome to ${module.title}. Let's get started.`
      : `Welcome to ${module.title}. ${module.lessonOverview}`
  )
  const instructionalSections = module.instructionalSegments.map((segment) =>
    makeSection(segment.id, segment.title, segment.spokenTeachingScript, [segment.slideContent])
  )
  const transitionSection = makeSection(
    `${module.id}_transition`,
    "Transition to Simulation",
    `Complete the knowledge check, then launch simulation scenario ${transitionScenario}. Focus on clear discovery, concise framing, and confident next-step language.`
  )

  const sections: AudioLessonSection[] = [introSection, ...instructionalSections, transitionSection]

  return {
    moduleId: module.id,
    lessonTitle: `${module.title} Audio Lesson`,
    totalEstimatedDurationSec: sections.reduce((sum, section) => sum + section.estimatedDurationSec, 0),
    sections,
  }
}

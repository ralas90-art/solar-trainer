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

export function buildModuleAudioLesson(module: TrainingModuleView, language: string = "en"): ModuleAudioLesson {
  const isSpanish = language === "es"
  const transitionScenario = module.simulationScenarioIds[0] ?? (isSpanish ? "escenario asignado" : "assigned scenario")

  const firstSegmentScript = module.instructionalSegments[0]?.spokenTeachingScript ?? ""
  const isIntroRedundant = firstSegmentScript.toLowerCase().startsWith(module.lessonOverview.toLowerCase().slice(0, 50))

  const introTitle = isSpanish ? "Introducción" : "Intro"
  const introText = isIntroRedundant
    ? (isSpanish ? `Bienvenido a ${module.title}. Empecemos.` : `Welcome to ${module.title}. Let's get started.`)
    : (isSpanish ? `Bienvenido a ${module.title}. ${module.lessonOverview}` : `Welcome to ${module.title}. ${module.lessonOverview}`)

  const introSection = makeSection(
    `${module.id}_intro`,
    introTitle,
    introText
  )
  const instructionalSections = module.instructionalSegments.map((segment) =>
    makeSection(segment.id, segment.title, segment.spokenTeachingScript, [segment.slideContent])
  )
  const transitionTitle = isSpanish ? "Transición a la Simulación" : "Transition to Simulation"
  const transitionText = isSpanish
    ? `Complete la prueba de conocimientos y luego inicie el escenario de simulación ${transitionScenario}. Concéntrese en un descubrimiento claro, una presentación concisa y un lenguaje seguro para el siguiente paso.`
    : `Complete the knowledge check, then launch simulation scenario ${transitionScenario}. Focus on clear discovery, concise framing, and confident next-step language.`

  const transitionSection = makeSection(
    `${module.id}_transition`,
    transitionTitle,
    transitionText
  )

  const sections: AudioLessonSection[] = [introSection, ...instructionalSections, transitionSection]

  return {
    moduleId: module.id,
    lessonTitle: isSpanish ? `Lección de audio de ${module.title}` : `${module.title} Audio Lesson`,
    totalEstimatedDurationSec: sections.reduce((sum, section) => sum + section.estimatedDurationSec, 0),
    sections,
  }
}


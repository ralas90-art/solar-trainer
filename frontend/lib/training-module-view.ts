import { DAY_MODULES, MODULES, MODULE_SCENARIOS, ModuleContent, WorkbookPrompt } from "@/lib/modules"

export type KnowledgeCheckItem = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  feedback: string
}

export type TrainingModuleView = {
  id: string
  title: string
  moduleNumber: string
  dayLabel: string
  estimatedTime: string
  moduleTag: string
  lessonOverview: string
  keyConcepts: string[]
  presentationSummary: string[]
  instructionalSegments: ModuleInstructionalSegment[]
  visualSlides: ModuleVisualSlide[]
  workbookPrompts: WorkbookPrompt[]
  knowledgeChecks: KnowledgeCheckItem[]
  simulationScenarioIds: string[]
  nextModuleId: string | null
  nextModuleTitle: string | null
}

export type ModuleInstructionalSegment = {
  id: string
  title: string
  slideContent: string
  spokenTeachingScript: string
  workbookPromptIds: string[]
  quizMapping: string[]
}

export type ModuleVisualSlide = {
  id: string
  title: string
  imageSrc?: string
  caption?: string
}

type DayModuleMeta = {
  moduleNumber: string
  duration: string
  dayLabel: string
}

const MODULE_META = new Map<string, DayModuleMeta>()

for (const day of DAY_MODULES) {
  for (const module of day.modules) {
    MODULE_META.set(module.id, {
      moduleNumber: module.moduleNumber,
      duration: module.duration,
      dayLabel: `Day ${day.dayNumber}: ${day.title}`,
    })
  }
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function extractLessonOverview(module: ModuleContent) {
  const textSection = module.sections.find((section) => section.type === "text" || section.type === "quote")
  if (textSection?.content) {
    return cleanText(textSection.content).slice(0, 360)
  }
  const listSection = module.sections.find((section) => section.type === "list" && section.items?.length)
  if (listSection) {
    return cleanText(listSection.content)
  }
  return "Complete this module to build confidence for high-pressure homeowner conversations."
}

function extractKeyConcepts(module: ModuleContent) {
  const listSection = module.sections.find((section) => section.type === "list" && section.items?.length)
  if (listSection?.items?.length) {
    return listSection.items.slice(0, 5)
  }

  const fallbackText = module.sections
    .filter((section) => section.type === "text" && section.content)
    .flatMap((section) => section.content.split("\n"))
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 20)
    .slice(0, 5)

  if (fallbackText.length) return fallbackText

  return [
    "Acknowledge homeowner concern before offering a rebuttal.",
    "Use one diagnostic question to identify real decision friction.",
    "Bridge from concern to value with concrete language.",
  ]
}

function extractPresentationSummary(module: ModuleContent) {
  const slideSection = module.sections.find((section) => section.type === "slides" && section.slides?.length)
  if (slideSection?.slides?.length) {
    return slideSection.slides.slice(0, 6).map((slide) => `${slide.title}: ${cleanText(slide.content).slice(0, 120)}`)
  }

  const summaryFromSections = module.sections
    .filter((section) => section.type !== "simulation")
    .slice(0, 5)
    .map((section) => `${section.title}: ${cleanText(section.content).slice(0, 100)}`)

  return summaryFromSections.length ? summaryFromSections : ["Presentation summary will populate from this module's lesson sections."]
}

function extractSpokenTeachingScript(module: ModuleContent, keyConcepts: string[]) {
  // Broaden searching to catch more general training sections if no specific "script" is found
  const scriptSection = module.sections.find((section) =>
    /script|opener|dialogue|objection|close|phrase|checklist|strategy|basics|fundamentals|overview|workflow|psychology/i.test(`${section.title} ${section.content}`)
  )

  if (scriptSection?.items?.length) {
    return scriptSection.items.slice(0, 5)
  }

  if (scriptSection?.content) {
    const lines = scriptSection.content
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 16)
      .slice(0, 5)
    if (lines.length) return lines
  }

  // Improved fallback that uses the module's own title and subtitle to feel more unique
  const fallbackLines = [
    `Welcome to the lesson on ${module.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}.`,
    `In this section, we'll focus on: ${module.subtitle}.`,
    `Key Concept: "${keyConcepts[0] ?? "Master the foundational skills for this module."}"`,
    `Application: "${keyConcepts[1] ?? "Consider how this applies to your next homeowner conversation."}"`,
    `Summary: "${keyConcepts[2] ?? "Building competence requires consistent daily practice."}"`,
  ]

  return fallbackLines
}

function extractKnowledgeChecks(module: ModuleContent, keyConcepts: string[]): KnowledgeCheckItem[] {
  if (module.quiz?.questions?.length) {
    return module.quiz.questions.slice(0, 2).map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctIndex: question.correctAnswerIndex,
      feedback: question.explanation,
    }))
  }

  const conceptA = keyConcepts[0] ?? "Acknowledge concern before rebuttal."
  const conceptB = keyConcepts[1] ?? "Ask one calibrated diagnostic question."
  const conceptC = keyConcepts[2] ?? "Bridge toward a clear next step."

  return [
    {
      id: `${module.id}_kc_1`,
      question: "Which response best follows the SeptiVolt objection framework?",
      options: [conceptA, "Defend pricing immediately with no questions", "Delay and avoid commitment language"],
      correctIndex: 0,
      feedback: "You led with acknowledgment before pushing into persuasion.",
    },
    {
      id: `${module.id}_kc_2`,
      question: "What is the best second move after acknowledging concern?",
      options: ["Switch topics quickly", conceptB, conceptC],
      correctIndex: 1,
      feedback: "Diagnostic questions improve control and trust before closing language.",
    },
  ]
}

function extractInstructionalSegments(module: ModuleContent, keyConcepts: string[]): ModuleInstructionalSegment[] {
  const spokenFallback = extractSpokenTeachingScript(module, keyConcepts).join(" ")
  const quizIds = (module.quiz?.questions ?? []).map((question) => question.id)

  const segments = module.sections
    .filter((section) => section.type !== "simulation")
    .map((section, index) => {
      const sectionText = cleanText(section.content)
      const workbookPromptIds = (module.workbookPrompts ?? [])
        .filter((prompt) =>
          sectionText.length > 0 && sectionText.toLowerCase().includes(prompt.label.slice(0, 18).toLowerCase())
        )
        .map((prompt) => prompt.id)

      return {
        id: `${module.id}_segment_${index + 1}`,
        title: section.title,
        slideContent: sectionText,
        spokenTeachingScript: sectionText.length > 0 ? sectionText : `Module Section: ${section.title}`,
        workbookPromptIds,
        quizMapping: index === module.sections.length - 1 ? quizIds : [],
      }
    })

  if (segments.length) return segments

  return [
    {
      id: `${module.id}_segment_1`,
      title: "Instructional Core",
      slideContent: module.title,
      spokenTeachingScript: spokenFallback,
      workbookPromptIds: (module.workbookPrompts ?? []).map((prompt) => prompt.id),
      quizMapping: quizIds,
    },
  ]
}

function extractVisualSlides(module: ModuleContent): ModuleVisualSlide[] {
  const sectionSlides = module.sections.flatMap((section, sectionIndex) => {
    if (section.type === "slides" && section.slides?.length) {
      return section.slides
        .filter((slide) => Boolean(slide.image))
        .map((slide, slideIndex) => ({
          id: `${module.id}_slide_${sectionIndex + 1}_${slideIndex + 1}`,
          title: slide.title,
          imageSrc: slide.image,
          caption: cleanText(slide.content),
        }))
    }

    if (section.type === "image" && section.imageSrc) {
      return [
        {
          id: `${module.id}_image_${sectionIndex + 1}`,
          title: section.title,
          imageSrc: section.imageSrc,
          caption: cleanText(section.content),
        },
      ]
    }

    return []
  })

  return sectionSlides
}

function getNextModuleMeta(moduleId: string) {
  const ordered = DAY_MODULES.flatMap((day) => day.modules)
  const currentIndex = ordered.findIndex((module) => module.id === moduleId)
  if (currentIndex < 0 || currentIndex >= ordered.length - 1) {
    return { nextModuleId: null, nextModuleTitle: null }
  }

  const next = ordered[currentIndex + 1]
  return {
    nextModuleId: next.id,
    nextModuleTitle: next.title,
  }
}

function toView(module: ModuleContent): TrainingModuleView {
  const meta = MODULE_META.get(module.id)
  const moduleNumber = meta?.moduleNumber ?? module.id.replace("mod_", "").replaceAll("_", ".")
  const estimatedTime = meta?.duration ?? "20 min"
  const dayLabel = meta?.dayLabel ?? "Curriculum Module"

  const keyConcepts = extractKeyConcepts(module)
  const nextModule = getNextModuleMeta(module.id)

  return {
    id: module.id,
    title: module.title,
    moduleNumber,
    dayLabel,
    estimatedTime,
    moduleTag: module.subtitle,
    lessonOverview: extractLessonOverview(module),
    keyConcepts,
    presentationSummary: extractPresentationSummary(module),
    instructionalSegments: extractInstructionalSegments(module, keyConcepts),
    visualSlides: extractVisualSlides(module),
    workbookPrompts: module.workbookPrompts ?? [],
    knowledgeChecks: extractKnowledgeChecks(module, keyConcepts),
    simulationScenarioIds: MODULE_SCENARIOS[module.id] ?? [],
    nextModuleId: nextModule.nextModuleId,
    nextModuleTitle: nextModule.nextModuleTitle,
  }
}

export function getInstructorModuleScript(moduleId: string) {
  const module = MODULES[moduleId]
  if (!module) return []
  const keyConcepts = extractKeyConcepts(module)
  return extractSpokenTeachingScript(module, keyConcepts)
}

export function getTrainingModuleView(moduleId: string) {
  const module = MODULES[moduleId]
  return module ? toView(module) : null
}

export function getTrainingModuleCatalog(limit = 12) {
  const modules = Object.values(MODULES)
    .map(toView)
    .sort((a, b) => a.moduleNumber.localeCompare(b.moduleNumber, undefined, { numeric: true }))

  return modules.slice(0, limit)
}

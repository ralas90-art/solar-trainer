import { DAY_MODULES, MODULES, MODULE_SCENARIOS, ModuleContent, WorkbookPrompt } from "@/lib/modules"
export type { ModuleContent, WorkbookPrompt };
import { WHITE_LABEL } from "@/lib/white-label.config"
import { DAY_MODULES_ES, MODULES_ES } from "@/lib/modules_es"

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
  title?: string
  slideContent: string
  spokenTeachingScript: string
  workbookPromptIds: string[]
  quizMapping: string[]
}

export type ModuleVisualSlide = {
  id: string
  title?: string
  imageSrc?: string
  caption?: string
}

type DayModuleMeta = {
  moduleNumber: string
  duration: string
  dayLabel: string
}

// Map of maps for localized metadata
const MODULE_META_CACHE: Record<string, Map<string, DayModuleMeta>> = {
  en: new Map(),
  es: new Map(),
}

function getModuleMeta(locale: string = "en") {
  const targetLocale = locale === "es" ? "es" : "en"
  if (MODULE_META_CACHE[targetLocale].size > 0) {
    return MODULE_META_CACHE[targetLocale]
  }

  const days = targetLocale === "es" ? DAY_MODULES_ES : DAY_MODULES
  for (const day of days) {
    for (const module of day.modules) {
      MODULE_META_CACHE[targetLocale].set(module.id, {
        moduleNumber: module.moduleNumber,
        duration: module.duration,
        dayLabel: targetLocale === "es" ? `Día ${day.dayNumber}: ${day.title}` : `Day ${day.dayNumber}: ${day.title}`,
      })
    }
  }
  return MODULE_META_CACHE[targetLocale]
}

function cleanText(value: string | undefined | null) {
  if (!value) return ""
  return value.replace(/\s+/g, " ").trim()
}

function extractLessonOverview(module: ModuleContent, locale: string = "en") {
  const textSection = module.sections.find((section) => section.type === "text" || section.type === "quote")
  if (textSection?.content) {
    return cleanText(textSection.content).slice(0, 360)
  }
  const listSection = module.sections.find((section) => section.type === "list" && section.items?.length)
  if (listSection) {
    return cleanText(listSection.content)
  }
  return locale === "es" 
    ? "Completa este módulo para ganar confianza en conversaciones de alta presión con propietarios."
    : "Complete this module to build confidence for high-pressure homeowner conversations."
}

function extractKeyConcepts(module: ModuleContent, locale: string = "en") {
  const listSection = module.sections.find((section) => section.type === "list" && section.items?.length)
  if (listSection?.items?.length) {
    return listSection.items.slice(0, 5)
  }

  const fallbackText = module.sections
    .filter((section) => section.type === "text" && section.content)
    .flatMap((section) => section.content!.split("\n"))
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 20)
    .slice(0, 5)

  if (fallbackText.length) return fallbackText

  return locale === "es" ? [
    "Reconoce la preocupación del propietario antes de ofrecer una refutación.",
    "Usa una pregunta de diagnóstico para identificar la fricción real de la decisión.",
    "Conecta la preocupación con el valor con un lenguaje concreto.",
  ] : [
    "Acknowledge homeowner concern before offering a rebuttal.",
    "Use one diagnostic question to identify real decision friction.",
    "Bridge from concern to value with concrete language.",
  ]
}

function extractPresentationSummary(module: ModuleContent, locale: string = "en") {
  const slideSection = module.sections.find((section) => section.type === "slides" && section.slides?.length)
  if (slideSection?.slides?.length) {
    return slideSection.slides.slice(0, 6).map((slide) => `${slide.title}: ${cleanText(slide.content).slice(0, 120)}`)
  }

  const summaryFromSections = module.sections
    .filter((section) => section.type !== "simulation")
    .slice(0, 5)
    .map((section) => `${section.title}: ${cleanText(section.content).slice(0, 100)}`)

  return summaryFromSections.length ? summaryFromSections : [
    locale === "es" 
      ? "El resumen de la presentación se generará a partir de las secciones de la lección de este módulo."
      : "Presentation summary will populate from this module's lesson sections."
  ]
}

function extractSpokenTeachingScript(module: ModuleContent, keyConcepts: string[], locale: string = "en") {
  const scriptSection = module.sections.find((section) =>
    /script|opener|dialogue|objection|close|phrase|checklist|strategy|basics|fundamentals|overview|workflow|psychology|guión|apertura|diálogo|objeción|cierre|frase|estrategia|conceptos/i.test(`${section.title} ${section.content}`)
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

  const fallbackLines = locale === "es" ? [
    `Bienvenido a la lección sobre ${module.title.replace(/^Módulo\s+\d+(\.\d+)?:\s*/i, "")}.`,
    `En esta sección, nos enfocaremos en: ${module.subtitle}.`,
    `Concepto Clave: "${keyConcepts[0] ?? "Domina las habilidades fundamentales para este módulo."}"`,
    `Aplicación: "${keyConcepts[1] ?? "Considera cómo se aplica esto a tu próxima conversación con un propietario."}"`,
    `Resumen: "${keyConcepts[2] ?? "Construir competencia requiere práctica diaria constante."}"`,
  ] : [
    `Welcome to the lesson on ${module.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}.`,
    `In this section, we'll focus on: ${module.subtitle}.`,
    `Key Concept: "${keyConcepts[0] ?? "Master the foundational skills for this module."}"`,
    `Application: "${keyConcepts[1] ?? "Consider how this applies to your next homeowner conversation."}"`,
    `Summary: "${keyConcepts[2] ?? "Building competence requires consistent daily practice."}"`,
  ]

  return fallbackLines
}

function extractKnowledgeChecks(module: ModuleContent, keyConcepts: string[], locale: string = "en"): KnowledgeCheckItem[] {
  if (module.quiz?.questions?.length) {
    return module.quiz.questions.slice(0, 2).map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctIndex: question.correctAnswerIndex,
      feedback: question.explanation,
    }))
  }

  if (locale === "es") {
    const conceptA = keyConcepts[0] ?? "Reconoce la preocupación antes de la refutación."
    const conceptB = keyConcepts[1] ?? "Haz una pregunta diagnóstica calibrada."
    const conceptC = keyConcepts[2] ?? "Conecta hacia un siguiente paso claro."

    return [
      {
        id: `${module.id}_kc_1`,
        question: `¿Qué respuesta sigue mejor el marco de objeciones de ${WHITE_LABEL.companyName}?`,
        options: [conceptA, "Defiende el precio inmediatamente sin preguntas", "Retrasa y evita el lenguaje de compromiso"],
        correctIndex: 0,
        feedback: "Lideraste con reconocimiento antes de pasar a la persuasión.",
      },
      {
        id: `${module.id}_kc_2`,
        question: "¿Cuál es el mejor segundo paso después de reconocer la preocupación?",
        options: ["Cambia de tema rápidamente", conceptB, conceptC],
        correctIndex: 1,
        feedback: "Las preguntas de diagnóstico mejoran el control y la confianza antes del lenguaje de cierre.",
      },
    ]
  }

  const conceptA = keyConcepts[0] ?? "Acknowledge concern before rebuttal."
  const conceptB = keyConcepts[1] ?? "Ask one calibrated diagnostic question."
  const conceptC = keyConcepts[2] ?? "Bridge toward a clear next step."

  return [
    {
      id: `${module.id}_kc_1`,
      question: `Which response best follows the ${WHITE_LABEL.companyName} objection framework?`,
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

function extractInstructionalSegments(module: ModuleContent, keyConcepts: string[], locale: string = "en"): ModuleInstructionalSegment[] {
  const spokenFallback = extractSpokenTeachingScript(module, keyConcepts, locale).join(" ")
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
          title: slide.title || "",
          imageSrc: slide.image,
          caption: cleanText(slide.content),
        }))
    }

    if (section.type === "image" && section.imageSrc) {
      return [
        {
          id: `${module.id}_image_${sectionIndex + 1}`,
          title: section.title || "",
          imageSrc: section.imageSrc,
          caption: cleanText(section.content),
        },
      ]
    }

    return []
  })

  return sectionSlides
}

function getNextModuleMeta(moduleId: string, locale: string = "en") {
  const days = locale === "es" ? DAY_MODULES_ES : DAY_MODULES
  const ordered = days.flatMap((day) => day.modules)
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

function toView(module: ModuleContent, locale: string = "en"): TrainingModuleView {
  const metaMap = getModuleMeta(locale)
  const meta = metaMap.get(module.id)
  const moduleNumber = meta?.moduleNumber ?? module.id.replace("mod_", "").replaceAll("_", ".")
  const estimatedTime = meta?.duration ?? "20 min"
  const dayLabel = meta?.dayLabel ?? (locale === "es" ? "Módulo del Currículo" : "Curriculum Module")

  const keyConcepts = extractKeyConcepts(module, locale)
  const nextModule = getNextModuleMeta(module.id, locale)

  return {
    id: module.id,
    title: module.title,
    moduleNumber,
    dayLabel,
    estimatedTime,
    moduleTag: module.subtitle || "",
    lessonOverview: extractLessonOverview(module, locale),
    keyConcepts,
    presentationSummary: extractPresentationSummary(module, locale),
    instructionalSegments: extractInstructionalSegments(module, keyConcepts, locale),
    visualSlides: extractVisualSlides(module),
    workbookPrompts: module.workbookPrompts ?? [],
    knowledgeChecks: extractKnowledgeChecks(module, keyConcepts, locale),
    simulationScenarioIds: MODULE_SCENARIOS[module.id] ?? [],
    nextModuleId: nextModule.nextModuleId,
    nextModuleTitle: nextModule.nextModuleTitle,
  }
}

export function getInstructorModuleScript(moduleId: string, locale: string = "en") {
  const modules = locale === "es" ? MODULES_ES : MODULES
  const module = modules[moduleId] || MODULES[moduleId] // Fallback to EN if ES missing
  if (!module) return []
  const keyConcepts = extractKeyConcepts(module, locale)
  return extractSpokenTeachingScript(module, keyConcepts, locale)
}

export function getTrainingModuleView(moduleId: string, locale: string = "en") {
  const modules = locale === "es" ? MODULES_ES : MODULES
  const module = modules[moduleId] || MODULES[moduleId] // Fallback to EN if ES missing
  return module ? toView(module, locale) : null
}

export function getTrainingModuleCatalog(locale: string = "en", limit = 100) {
  const modulesData = locale === "es" ? MODULES_ES : MODULES
  
  // Use localized modules, but potentially merge with EN if some are missing in ES
  const modulesMap = { ...MODULES, ...(locale === "es" ? MODULES_ES : {}) }
  
  const modules = Object.values(modulesMap)
    .map((m) => toView(m, locale))
    .sort((a, b) => {
      // Sort by module number correctly (e.g. 1.1, 1.2, 1.10)
      const aParts = a.moduleNumber.split('.').map(Number);
      const bParts = b.moduleNumber.split('.').map(Number);
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return aVal - bVal;
      }
      return 0;
    })

  return modules.slice(0, limit)
}

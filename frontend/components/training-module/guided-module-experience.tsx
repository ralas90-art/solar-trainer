"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { StartSimulationButton, TrainingModuleHeader } from "@/components/platform/training-module-components"
import { LessonAudioPlayer, ModuleCatalogEntry } from "@/components/training-audio/lesson-audio-player"
import { QuizModule } from "@/components/quiz"
import { WorkbookPromptBlock } from "@/components/workbook-prompt"
import { AudioLessonProgress, loadAudioProgress } from "@/lib/audio-progress-storage"
import { TrainingModuleView } from "@/lib/training-module-view"
import {
  loadTrainingModuleProgress,
  updateTrainingModuleProgress,
} from "@/lib/training-module-progress"
import { buildModuleAudioLesson } from "@/lib/training-audio"
import { SLIDE_START_PAGES, WHITE_LABEL, getGoogleSlidesEmbedUrl } from "@/lib/white-label.config"
import { 
  SkipForward, 
  Zap, 
  Trophy, 
  X,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  FileQuestion,
  Sparkles,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Compass,
  Menu,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { getLanguagePreference } from "@/lib/i18n"
import { canBypassTrainingLocks } from "@/lib/auth-bypass"
import { SCENARIO_LOCK_RULES } from "@/lib/scenario-lock-mapping"
import { useLanguage } from "@/hooks/use-language"

const PdfSlideViewer = dynamic(
  () => import("@/components/pdf-slide-viewer").then((m) => ({ default: m.PdfSlideViewer })),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-sm text-[#94A3B8]">Loading slides...</div> }
)

type WorkbookSummary = {
  completed: number
  total: number
  complete: boolean
}

export function GuidedModuleExperience({
  moduleView,
  simulationHref,
  moduleCatalog,
  onModuleSelect,
}: {
  moduleView: TrainingModuleView
  simulationHref: string
  moduleCatalog?: ModuleCatalogEntry[]
  onModuleSelect?: (moduleId: string) => void
}) {
  const { user } = useAuth()
  const { language: lang, setLanguage } = useLanguage()

  const [activeAudioSectionId, setActiveAudioSectionId] = useState("")
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioComplete, setAudioComplete] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [workbookSummary, setWorkbookSummary] = useState<WorkbookSummary>({ completed: 0, total: 0, complete: false })
  
  // Custom Celebrations / Success / Retry Modals states
  const [showPerfectModal, setShowPerfectModal] = useState(false)
  const [showPassingModal, setShowPassingModal] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizPercentage, setQuizPercentage] = useState<number | null>(null)

  const [visualSlideIndex, setVisualSlideIndex] = useState(0)
  const [coachingScore, setCoachingScore] = useState<number | "">("")
  const [coachingNotes, setCoachingNotes] = useState("")
  const [coachingSaved, setCoachingSaved] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)
  // Auto-advance to next module after audio completes
  const [autoNextModule, setAutoNextModule] = useState(false)
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null)

  // Step-by-step instructions collapse/expand state
  const [instructionsExpanded, setInstructionsExpanded] = useState(true)

  // Admin bypass drawer state
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false)

  // Reset quiz attempt state
  const [quizAttempt, setQuizAttempt] = useState(0)

  const lesson = useMemo(() => buildModuleAudioLesson(moduleView), [moduleView])

  const quiz = useMemo(
    () => ({
      title: `${moduleView.title} Knowledge Check`,
      questions: moduleView.knowledgeChecks.map((item) => ({
        id: item.id,
        question: item.question,
        options: item.options,
        correctAnswerIndex: item.correctIndex,
        explanation: item.feedback,
      })),
    }),
    [moduleView]
  )

  const dayNumber = Number.parseInt(moduleView.id.split("_")[1] ?? "", 10)
  const pdfUrl = Number.isFinite(dayNumber)
    ? WHITE_LABEL.dayPdfPaths[dayNumber as keyof typeof WHITE_LABEL.dayPdfPaths]
    : undefined
  const slideStartPage = SLIDE_START_PAGES[moduleView.id] ?? 1
  const pptxDownloadUrl = pdfUrl ? pdfUrl.replace(/\.pdf$/i, ".pptx") : undefined

  // Lock rule and passing threshold
  const associatedLockRule = useMemo(() => {
    return Object.values(SCENARIO_LOCK_RULES).find(
      (rule) => rule.requiredModuleId === moduleView.id
    )
  }, [moduleView.id])

  const passingThreshold = associatedLockRule?.requiredQuizThreshold ?? 80

  // Admin groups for drawer navigation
  const adminGroups = useMemo(() => {
    const groups: Record<string, ModuleCatalogEntry[]> = {}
    if (!moduleCatalog) return groups
    for (const entry of moduleCatalog) {
      if (!groups[entry.dayLabel]) {
        groups[entry.dayLabel] = []
      }
      groups[entry.dayLabel].push(entry)
    }
    return groups
  }, [moduleCatalog])

  // Bilingual Expert Pro Tips resolution
  const renderedTips = useMemo(() => {
    if (associatedLockRule?.proTips && associatedLockRule.proTips.length > 0) {
      return associatedLockRule.proTips.map((tip) => tip[lang] || tip.en)
    }
    return [
      lang === "es"
        ? "💡 Consejo Experto: Mantén el control de la conversación respondiendo objeciones complejas con micro-acuerdos antes de proceder al cierre."
        : "💡 Expert Pro Tip: Maintain control of the conversation by validating complex objections and establishing micro-agreements before moving to the close."
    ]
  }, [associatedLockRule, lang])

  // Dynamic Spanish/English slide resolution
  const slideUrl = useMemo(() => {
    return getGoogleSlidesEmbedUrl(moduleView.id, lang)
  }, [lang, moduleView.id])

  const activeSegment = useMemo(() => {
    const sectionMatch = moduleView.instructionalSegments.find((segment) => segment.id === activeAudioSectionId)
    if (sectionMatch) return sectionMatch
    return moduleView.instructionalSegments[0]
  }, [moduleView.instructionalSegments, activeAudioSectionId])

  const hasBypass = canBypassTrainingLocks(user)
  const simulationUnlocked = hasBypass || (audioComplete && quizComplete)
  const moduleComplete = audioComplete && quizComplete && simulationComplete

  useEffect(() => {
    const lessonProgress = loadAudioProgress(moduleView.id)
    if (lessonProgress?.lessonCompleted) {
      setAudioComplete(true)
    }

    const stored = loadTrainingModuleProgress(moduleView.id)
    if (!stored) return
    setAudioComplete(stored.audioCompleted || lessonProgress?.lessonCompleted || false)
    setQuizComplete(stored.quizCompleted)
    setQuizScore(stored.quizScore ?? null)
    setQuizPercentage(stored.quizPercentage ?? null)
    setSimulationComplete(stored.simulationCompleted)
    setCoachingScore(stored.coachingScore ?? "")
    setCoachingNotes(stored.coachingNotes ?? "")
  }, [moduleView.id])

  const handleAudioProgressChange = (snapshot: {
    overallProgress: number
    activeSectionId: string
    completedCount: number
    totalCount: number
    lessonCompleted: boolean
  }) => {
    setActiveAudioSectionId(snapshot.activeSectionId)
    setAudioProgress(snapshot.overallProgress)
    if (snapshot.lessonCompleted && !audioComplete) {
      setAudioComplete(true)
      updateTrainingModuleProgress(moduleView.id, { audioCompleted: true })
    }
  }

  const handleAudioComplete = () => {
    setAudioComplete(true)
    updateTrainingModuleProgress(moduleView.id, { audioCompleted: true })

    // Auto-next module: start countdown if enabled and next module exists
    if (autoNextModule && moduleView.nextModuleId && onModuleSelect) {
      setAutoNextCountdown(5)
    }
  }

  // Countdown timer for auto-next module
  useEffect(() => {
    if (autoNextCountdown === null) return
    if (autoNextCountdown <= 0) {
      if (moduleView.nextModuleId && onModuleSelect) {
        onModuleSelect(moduleView.nextModuleId)
      }
      setAutoNextCountdown(null)
      return
    }
    const t = window.setTimeout(() => setAutoNextCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000)
    return () => window.clearTimeout(t)
  }, [autoNextCountdown, moduleView.nextModuleId, onModuleSelect])

  const cancelAutoNext = () => setAutoNextCountdown(null)

  const handleQuizComplete = (score: number) => {
    const pct = Math.round((score / quiz.questions.length) * 100)
    setQuizScore(score)
    setQuizPercentage(pct)

    const isPassed = pct >= passingThreshold
    setQuizComplete(isPassed)

    updateTrainingModuleProgress(moduleView.id, {
      quizScore: score,
      quizPercentage: pct,
      quizCompleted: isPassed,
    })

    if (pct === 100) {
      setShowPerfectModal(true)
    } else if (isPassed) {
      setShowPassingModal(true)
    } else {
      setShowRetryModal(true)
    }
  }

  const handleSaveCoaching = () => {
    const normalizedScore = typeof coachingScore === "number" ? coachingScore : null
    updateTrainingModuleProgress(moduleView.id, {
      audioCompleted: true,
      quizCompleted: true,
      simulationCompleted: true,
      coachingScore: normalizedScore,
      coachingNotes,
      moduleCompleted: true,
      completedAt: new Date().toISOString(),
    })
    setSimulationComplete(true)
    setCoachingSaved(true)
    window.setTimeout(() => setCoachingSaved(false), 1800)
  }

  const onLessonProgressLoad = (value: AudioLessonProgress | null) => {
    if (value?.activeSectionId) {
      setActiveAudioSectionId(value.activeSectionId)
    }
  }

  useEffect(() => {
    onLessonProgressLoad(loadAudioProgress(moduleView.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleView.id])

  const instructionsTexts = {
    en: {
      title: "How to Complete This Lesson",
      subtitle: "Follow these stages in sequence to complete the courseware and unlock the simulator.",
      step1: "Press Play",
      sub1: "Listen to the audio training while following the slides.",
      step2: "Follow Slides",
      sub2: "Follow slide deck lessons closely.",
      step3: "Complete Workbook",
      sub3: "Answer workbook questions (required practice).",
      step4: "Pass Knowledge Check",
      sub4: `Pass at the required passing threshold (${passingThreshold}%).`,
      step5: "Unlock AI Simulator",
      sub5: "Practice in real-time interactive sales roleplay.",
      completed: "Completed",
      inProgress: "In Progress",
      locked: "Locked"
    },
    es: {
      title: "Cómo Completar esta Lección",
      subtitle: "Sigue estas etapas en secuencia para completar el curso y desbloquear el simulador.",
      step1: "Reproducir Audio",
      sub1: "Escucha el entrenamiento de audio mientras sigues las diapositivas.",
      step2: "Seguir Diapositivas",
      sub2: "Sigue de cerca las lecciones del panel de diapositivas.",
      step3: "Completar Cuaderno",
      sub3: "Responde las preguntas del cuaderno (práctica obligatoria).",
      step4: "Superar la Prueba",
      sub4: `Aprueba el cuestionario con el umbral requerido (${passingThreshold}%).`,
      step5: "Simulador de IA",
      sub5: "Practica con simulaciones de ventas interactivas en tiempo real.",
      completed: "Completado",
      inProgress: "En Progreso",
      locked: "Bloqueado"
    }
  }

  const text = instructionsTexts[lang] || instructionsTexts["en"]

  return (
    <div className="space-y-6 pb-32 sm:pb-36">
      {/* Top Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 -mb-2">
        {/* Language Selection Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(lang === "es" ? "en" : "es")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFD54F] transition-colors hover:bg-white/10 font-hud"
          >
            {lang === "es" ? "Training in English" : "Entrenamiento en Español"}
          </button>
          <span className="text-[10px] text-[#94A3B8] hidden sm:inline">
            {lang === "es" ? "Cambiar diapositivas y narración a inglés" : "Switch slides and narration to Spanish"}
          </span>
        </div>

        {/* Admin control panel button */}
        {canBypassTrainingLocks(user) && (
          <button
            type="button"
            onClick={() => setAdminDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#FF5722]/40 bg-[#FF5722]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFD54F] shadow-[0_0_15px_rgba(255,87,34,0.15)] transition-all hover:bg-[#FF5722]/20 font-hud"
          >
            <ShieldAlert className="h-4 w-4 animate-pulse text-[#FF5722]" />
            {lang === "es" ? "Panel de Admin / Demo" : "Admin / Demo Panel"}
          </button>
        )}
      </div>

      <TrainingModuleHeader
        title={moduleView.title}
        description={moduleView.lessonOverview}
        estimatedTime={moduleView.estimatedTime}
        moduleTag={moduleView.moduleTag}
        audioComplete={audioComplete}
        workbookComplete={workbookSummary.complete || moduleView.workbookPrompts.length === 0}
        quizComplete={quizComplete}
        simulationComplete={simulationComplete}
      />

      {/* Step-by-Step Instructions Panel */}
      <div className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 relative overflow-hidden transition-all duration-300">
        {/* Glow border element */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF5722]/10 via-[#FF5722]/50 to-[#FF5722]/10" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 text-[#FFD54F]">
              <Compass className="h-5 w-5 animate-pulse text-[#FF5722]" />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-white sm:text-lg uppercase tracking-wide">
                {text.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-[#94A3B8]">
                {text.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setInstructionsExpanded(!instructionsExpanded)}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            {instructionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {instructionsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/5">
            {/* Step 1 */}
            <div className={cn(
              "relative rounded-xl border p-3 flex flex-col justify-between space-y-2 transition-all",
              audioComplete 
                ? "border-emerald-500/25 bg-emerald-500/5" 
                : "border-white/5 bg-white/[0.02]"
            )}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[9px] tracking-[0.15em] text-[#FF5722] uppercase">STAGE 01</span>
                  {audioComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-[#FFD54F] animate-pulse" />
                  )}
                </div>
                <h4 className="font-display text-xs font-bold text-white mt-1">{text.step1}</h4>
                <p className="text-[10px] leading-relaxed text-[#94A3B8]">{text.sub1}</p>
              </div>
              <div className="text-[9px] font-hud uppercase tracking-wider text-right font-medium mt-1">
                {audioComplete ? (
                  <span className="text-emerald-400">{text.completed}</span>
                ) : (
                  <span className="text-[#FFD54F]">{text.inProgress}</span>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className={cn(
              "relative rounded-xl border p-3 flex flex-col justify-between space-y-2 transition-all",
              audioProgress > 0 || audioComplete
                ? "border-emerald-500/25 bg-emerald-500/5" 
                : "border-white/5 bg-white/[0.02]"
            )}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[9px] tracking-[0.15em] text-[#FF5722] uppercase">STAGE 02</span>
                  {audioProgress > 0 || audioComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>
                <h4 className="font-display text-xs font-bold text-white mt-1">{text.step2}</h4>
                <p className="text-[10px] leading-relaxed text-[#94A3B8]">{text.sub2}</p>
              </div>
              <div className="text-[9px] font-hud uppercase tracking-wider text-right font-medium mt-1">
                {audioProgress > 0 || audioComplete ? (
                  <span className="text-emerald-400">{text.completed}</span>
                ) : (
                  <span className="text-slate-500">{text.locked}</span>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className={cn(
              "relative rounded-xl border p-3 flex flex-col justify-between space-y-2 transition-all",
              workbookSummary.complete || moduleView.workbookPrompts.length === 0
                ? "border-emerald-500/25 bg-emerald-500/5" 
                : "border-white/5 bg-white/[0.02]"
            )}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[9px] tracking-[0.15em] text-[#FF5722] uppercase">STAGE 03</span>
                  {workbookSummary.complete || moduleView.workbookPrompts.length === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>
                <h4 className="font-display text-xs font-bold text-white mt-1">{text.step3}</h4>
                <p className="text-[10px] leading-relaxed text-[#94A3B8]">{text.sub3}</p>
              </div>
              <div className="text-[9px] font-hud uppercase tracking-wider text-right font-medium mt-1">
                {workbookSummary.complete || moduleView.workbookPrompts.length === 0 ? (
                  <span className="text-emerald-400">{text.completed}</span>
                ) : (
                  <span className="text-[#FFD54F]">
                    {workbookSummary.completed}/{workbookSummary.total} Done
                  </span>
                )}
              </div>
            </div>

            {/* Step 4 */}
            <div className={cn(
              "relative rounded-xl border p-3 flex flex-col justify-between space-y-2 transition-all",
              quizComplete 
                ? "border-emerald-500/25 bg-emerald-500/5" 
                : "border-white/5 bg-white/[0.02]"
            )}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[9px] tracking-[0.15em] text-[#FF5722] uppercase">STAGE 04</span>
                  {quizComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <FileQuestion className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>
                <h4 className="font-display text-xs font-bold text-white mt-1">{text.step4}</h4>
                <p className="text-[10px] leading-relaxed text-[#94A3B8]">{text.sub4}</p>
              </div>
              <div className="text-[9px] font-hud uppercase tracking-wider text-right font-medium mt-1">
                {quizComplete ? (
                  <span className="text-emerald-400">{text.completed}</span>
                ) : (
                  <span className="text-slate-500">{text.locked}</span>
                )}
              </div>
            </div>

            {/* Step 5 */}
            <div className={cn(
              "relative rounded-xl border p-3 flex flex-col justify-between space-y-2 transition-all",
              simulationComplete 
                ? "border-emerald-500/25 bg-emerald-500/5" 
                : "border-white/5 bg-white/[0.02]"
            )}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[9px] tracking-[0.15em] text-[#FF5722] uppercase">STAGE 05</span>
                  {simulationComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>
                <h4 className="font-display text-xs font-bold text-white mt-1">{text.step5}</h4>
                <p className="text-[10px] leading-relaxed text-[#94A3B8]">{text.sub5}</p>
              </div>
              <div className="text-[9px] font-hud uppercase tracking-wider text-right font-medium mt-1">
                {simulationComplete ? (
                  <span className="text-emerald-400">{text.completed}</span>
                ) : (
                  <span className="text-slate-500">{text.locked}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-next countdown banner */}
      {autoNextCountdown !== null && moduleView.nextModuleId && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF5722]/25 bg-[#FF5722]/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#FFD54F]">
            <SkipForward className="h-4 w-4 shrink-0" />
            <span>
              Advancing to{" "}
              <span className="font-semibold">{moduleView.nextModuleTitle ?? "next module"}</span>{" "}
              in <span className="font-bold tabular-nums">{autoNextCountdown}s</span>…
            </span>
          </div>
          <button
            type="button"
            onClick={cancelAutoNext}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#CBD5E1] hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Auto-next toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setAutoNextModule((prev) => !prev)
            cancelAutoNext()
          }}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors",
            autoNextModule
              ? "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FFD54F]"
              : "border-white/10 bg-white/5 text-[#94A3B8]"
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          {autoNextModule ? "Auto-Next Module: On" : "Auto-Next Module: Off"}
        </button>
        <p className="hidden sm:block text-xs text-[#64748B]">
          {autoNextModule
            ? "Will auto-advance to the next module when audio ends."
            : "Will pause at end of module audio."}
        </p>
      </div>

      <LessonAudioPlayer
        moduleId={moduleView.id}
        moduleTitle={moduleView.title}
        lesson={lesson}
        variant="mini_dock"
        onLessonComplete={handleAudioComplete}
        onSectionChange={setActiveAudioSectionId}
        onProgressChange={handleAudioProgressChange}
        onModuleSelect={onModuleSelect}
        moduleCatalog={moduleCatalog}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-black text-white sm:text-2xl">Lesson Surface</h3>
            <span className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-1.5 text-xs font-hud uppercase tracking-[0.12em] text-[#FFD54F]">
              Audio {Math.round(audioProgress)}%
            </span>
          </div>

          {WHITE_LABEL.presentationMode === "google_slides" && (
            slideUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={slideUrl}
                  title={`${moduleView.title} presentation`}
                  width="100%"
                  style={{ aspectRatio: "16/9", border: 0 }}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Training Slides Unavailable</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                      The presentation deck for this module is currently being updated. You can still proceed with the audio narration and simulation below.
                  </p>
              </div>
            )
          )}

          {WHITE_LABEL.presentationMode === "local_pdf" && pdfUrl ? (
            <PdfSlideViewer
              pdfUrl={pdfUrl}
              initialPage={slideStartPage}
              downloadUrl={pptxDownloadUrl}
              title={moduleView.title}
            />
          ) : null}

          {WHITE_LABEL.presentationMode !== "local_pdf" && moduleView.visualSlides.length > 0 ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
                <img
                  src={moduleView.visualSlides[visualSlideIndex].imageSrc}
                  alt={moduleView.visualSlides[visualSlideIndex].title}
                  className="aspect-video w-full rounded-xl object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#CBD5E1]">
                  {moduleView.visualSlides[visualSlideIndex].title}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVisualSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CBD5E1]"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVisualSlideIndex((prev) => Math.min(moduleView.visualSlides.length - 1, prev + 1))
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CBD5E1]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {moduleView.workbookPrompts.length > 0 ? (
          <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5">
            <h3 className="font-display text-xl font-black text-white sm:text-2xl mb-4">Workbook Practice</h3>
            <WorkbookPromptBlock moduleId={moduleView.id} prompts={moduleView.workbookPrompts} onProgressChange={setWorkbookSummary} />
            <p className="mt-4 text-xs text-[#94A3B8]">
              Workbook completion: {workbookSummary.completed}/{workbookSummary.total}
            </p>
          </section>
        ) : (
          <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 flex items-center justify-center">
             <p className="text-[#94A3B8] text-sm">No workbook exercises for this module.</p>
          </section>
        )}
      </div>

      {audioComplete ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <h3 className="font-display text-xl font-black text-white sm:text-2xl">Knowledge Check</h3>
          {!quizComplete ? (
            <QuizModule 
              key={`${moduleView.id}-quiz-${quizAttempt}`}
              quiz={quiz} 
              onComplete={handleQuizComplete} 
              passingThreshold={passingThreshold}
            />
          ) : null}
          {quizComplete ? (
            <p className="rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/10 p-3 text-sm text-[#FFE6B3]">
              Knowledge check completed. Simulation is now unlocked.
            </p>
          ) : null}
        </section>
      ) : null}

      {simulationUnlocked ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <h3 className="font-display text-xl font-black text-white sm:text-2xl">Simulation</h3>
          <StartSimulationButton
            scenarioName={moduleView.simulationScenarioIds[0] ?? "Scenario assigned in simulator"}
            skillsTested={["Discovery", "Objection Handling", "Closing"]}
            targetScore="85+"
            href={simulationHref}
          />
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#FF5722]">Simulation Debrief</p>
            <p className="text-sm text-[#CBD5E1]">
              After running the simulator, log your coaching score and notes to close the module.
            </p>
            <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
              <input
                type="number"
                min={0}
                max={100}
                value={coachingScore}
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setCoachingScore(Number.isFinite(value) ? value : "")
                }}
                placeholder="Score (0-100)"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
              />
              <textarea
                rows={3}
                value={coachingNotes}
                onChange={(event) => setCoachingNotes(event.target.value)}
                placeholder="Coach notes and improvements..."
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveCoaching}
              className="rounded-xl border border-[#FF5722]/25 bg-[#FF5722]/10 px-4 py-2 text-sm text-[#FFD54F]"
            >
              Save Coaching Feedback
            </button>
            {coachingSaved ? <p className="text-xs text-[#FFB300]">Feedback saved.</p> : null}
          </div>
        </section>
      ) : null}

      {moduleComplete ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-3">
          <h3 className="font-display text-xl font-black text-white">Module Completed</h3>
          <p className="text-sm text-[#CBD5E1]">
            Lesson, quiz, simulation, and coaching feedback are complete.
          </p>
          {moduleView.nextModuleId ? (
            <button
              type="button"
              onClick={() => onModuleSelect && onModuleSelect(moduleView.nextModuleId!)}
              className="btn-primary inline-flex px-4 py-2 text-sm"
            >
              Continue to {moduleView.nextModuleTitle ?? `Module ${moduleView.nextModuleId}`}
            </button>
          ) : (
            <p className="text-sm text-[#FFE6B3]">You have completed the final module in the current curriculum order.</p>
          )}
        </section>
      ) : null}

      <AnimatePresence>
        {/* Admin/Demo Bypass Drawer */}
        {adminDrawerOpen && (
          <div key="admin-bypass-drawer" className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdminDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-md h-full border-l border-white/10 bg-[rgba(15,23,42,0.98)] p-6 shadow-2xl backdrop-blur-xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#FF5722]" />
                  <div>
                    <h3 className="font-display font-black text-white uppercase tracking-wider text-base">
                      {lang === "es" ? "Biblioteca de Módulos" : "Module Library"}
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-hud tracking-widest uppercase">
                      Admin Lock Bypass Active
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminDrawerOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
                {Object.entries(adminGroups).map(([dayLabel, modules]) => (
                  <div key={dayLabel} className="space-y-1.5">
                    <h4 className="font-hud text-[11px] font-bold text-[#FF9800] uppercase tracking-wider pl-1">
                      {dayLabel}
                    </h4>
                    <div className="space-y-1">
                      {modules.map((mod) => {
                        const isCurrent = mod.id === moduleView.id;
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => {
                              if (onModuleSelect) {
                                onModuleSelect(mod.id);
                              }
                              setAdminDrawerOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all border",
                              isCurrent
                                ? "bg-[rgba(255,87,34,0.15)] border-[#FF5722]/40 text-white font-bold"
                                : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                            )}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="truncate font-semibold">{mod.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}</p>
                              <p className="text-[9px] text-[#64748B] font-hud uppercase tracking-wider">{mod.id}</p>
                            </div>
                            {mod.isCompleted ? (
                              <span className="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                                {lang === "es" ? "Hecho" : "Done"}
                              </span>
                            ) : (
                              <span className="shrink-0 rounded bg-slate-500/10 px-1.5 py-0.5 text-[9px] text-slate-500 border border-slate-500/10">
                                {lang === "es" ? "Pendiente" : "Pending"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* 1. Perfect Score Celebration Modal (100% Score) */}
        {showPerfectModal && (
          <div key="perfect-score-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPerfectModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-amber-500/30 bg-gradient-to-b from-[#1E293B]/95 via-[#0F172A]/98 to-[#020617]/100 p-8 shadow-[0_0_60px_rgba(245,158,11,0.2),inset_0_0_24px_rgba(245,158,11,0.02)] text-center text-white"
            >
              <button
                type="button"
                onClick={() => setShowPerfectModal(false)}
                className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl rounded-full" />

              <div className="relative mb-6 flex justify-center">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/20 to-amber-950/20 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                  <Trophy className="w-12 h-12 text-[#FFD54F] animate-bounce" />
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-30" />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-wider uppercase font-display bg-gradient-to-r from-[#FF9800] via-[#FFD54F] to-[#FFD54F] bg-clip-text text-transparent mb-2">
                {lang === "es" ? "⚡ ¡CALIFICACIÓN PERFECTA!" : "⚡ PERFECT SCORE CONQUERED!"}
              </h2>

              <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4 animate-pulse">
                🏆 {lang === "es" ? "¡100% DE APROBACIÓN!" : "100% PERFECT SCORE UNLOCKED!"}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                {lang === "es" 
                  ? `¡Increíble trabajo! Has completado el cuestionario de "${moduleView.title}" con un puntaje perfecto. El simulador de IA interactivo ahora está completamente desbloqueado para que practiques.`
                  : `Masterful performance! You've completed the knowledge check for "${moduleView.title}" with a perfect 100% score. The interactive AI simulator is fully unlocked.`}
              </p>

              {/* Expert Pro Tips */}
              <div className="text-left rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6 space-y-2">
                <p className="text-xs font-hud uppercase tracking-widest text-[#FFD54F] font-bold">
                  {lang === "es" ? "💡 CONSEJO EXPERTO PRO" : "💡 EXPERT PRO TIPS"}
                </p>
                <div className="space-y-2">
                  {renderedTips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-slate-200 leading-relaxed">{tip}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={simulationHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FF5722]/30 bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(255,87,34,0.4)] transition-all hover:brightness-110 active:scale-98"
                >
                  <Zap className="h-4 w-4 text-white fill-white animate-pulse" />
                  {lang === "es" ? "Iniciar Simulador" : "Launch Simulator"}
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPerfectModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {lang === "es" ? "Continuar Curso" : "Continue Courseware"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Passing Score Success Modal (80% - 99%) */}
        {showPassingModal && (
          <div key="passing-score-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPassingModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-emerald-500/30 bg-gradient-to-b from-[#1E293B]/95 via-[#0F172A]/98 to-[#020617]/100 p-8 shadow-[0_0_50px_rgba(16,185,129,0.15),inset_0_0_24px_rgba(16,185,129,0.02)] text-center text-white"
            >
              <button
                type="button"
                onClick={() => setShowPassingModal(false)}
                className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-emerald-500/20 to-transparent blur-2xl rounded-full" />

              <div className="relative mb-6 flex justify-center">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/20 to-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Award className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-wider uppercase font-display text-emerald-400 mb-2">
                {lang === "es" ? "⚡ ¡SIMULADOR DESBLOQUEADO!" : "⚡ SIMULATOR UNLOCKED!"}
              </h2>

              <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4 animate-pulse">
                {lang === "es" ? `PUNTUACIÓN: ${quizPercentage}%` : `SCORE: ${quizPercentage}% (PASSING)`}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                {lang === "es"
                  ? `¡Excelente! Has superado el umbral requerido (${passingThreshold}%) para "${moduleView.title}". Estás listo para poner en práctica tus conocimientos en el simulador interactivo.`
                  : `Great job! You've passed the threshold (${passingThreshold}%) for "${moduleView.title}". The interactive sales roleplay simulator is now fully unlocked for real-time practice.`}
              </p>

              {/* Expert Pro Tips */}
              <div className="text-left rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6 space-y-2">
                <p className="text-xs font-hud uppercase tracking-widest text-emerald-400 font-bold">
                  {lang === "es" ? "💡 CONSEJO EXPERTO PRO" : "💡 EXPERT PRO TIPS"}
                </p>
                <div className="space-y-2">
                  {renderedTips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-slate-200 leading-relaxed">{tip}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={simulationHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all hover:brightness-110 active:scale-98"
                >
                  <Zap className="h-4 w-4 text-white fill-white animate-pulse" />
                  {lang === "es" ? "Iniciar Simulador" : "Launch Simulator"}
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPassingModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {lang === "es" ? "Continuar Curso" : "Continue Courseware"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 3. Retry Guidance Modal (Score < passingThreshold) */}
        {showRetryModal && (
          <div key="retry-guidance-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRetryModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-rose-500/30 bg-gradient-to-b from-[#1E293B]/95 via-[#0F172A]/98 to-[#020617]/100 p-8 shadow-[0_0_50px_rgba(244,63,94,0.15),inset_0_0_24px_rgba(244,63,94,0.02)] text-center text-white"
            >
              <button
                type="button"
                onClick={() => setShowRetryModal(false)}
                className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-rose-500/20 to-transparent blur-2xl rounded-full" />

              <div className="relative mb-6 flex justify-center">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-2 border-rose-500/40 bg-gradient-to-b from-rose-500/20 to-rose-950/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <RotateCcw className="w-10 h-10 text-rose-400 animate-spin-slow" />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-wider uppercase font-display text-rose-400 mb-2">
                {lang === "es" ? "⚠️ REINTENTO REQUERIDO" : "⚠️ RETRY REQUIRED"}
              </h2>

              <div className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-rose-400 uppercase mb-4 animate-pulse">
                {lang === "es"
                  ? `PUNTUACIÓN: ${quizPercentage}% (Umbral: ${passingThreshold}%)`
                  : `SCORE: ${quizPercentage}% (Threshold: ${passingThreshold}%)`}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                {lang === "es"
                  ? `No has alcanzado la puntuación de aprobación requerida del ${passingThreshold}%. Te recomendamos revisar la presentación y el cuaderno antes de intentar de nuevo.`
                  : `You didn't reach the required passing threshold of ${passingThreshold}%. Take some time to review the slides and workbook prompts to master the material before retrying.`}
              </p>

              {/* The Closer's Edge coaching panel */}
              <div className="text-left rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 mb-6 space-y-2">
                <p className="text-xs font-hud uppercase tracking-widest text-rose-400 font-bold">
                  {lang === "es" ? "💡 LA VENTAJA DEL CERRADOR" : "💡 THE CLOSER'S EDGE"}
                </p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {lang === "es"
                    ? "Revisa la lección de audio y repasa los términos clave de la objeción antes del siguiente intento. La precisión cognitiva y la confianza se construyen a través de la práctica deliberada. ¡Tú puedes!"
                    : "Review the audio lesson segments and objection patterns before your next run. Building deliberate precision and conversational confidence is how we unlock absolute mastery. You got this!"}
                </p>
                {renderedTips.length > 0 && (
                  <div className="border-t border-rose-500/10 pt-2 mt-2 space-y-1">
                    {renderedTips.map((tip, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 italic leading-relaxed">{tip}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowRetryModal(false);
                    setQuizAttempt((prev) => prev + 1);
                  }}
                  className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)] transition-all hover:brightness-110 active:scale-98"
                >
                  <RotateCcw className="inline h-4 w-4 mr-2" />
                  {lang === "es" ? "Intentar Nuevamente" : "Try Again"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRetryModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {lang === "es" ? "Revisar Lecciones" : "Review Lessons"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

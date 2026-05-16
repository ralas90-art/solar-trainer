"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { StartSimulationButton, TrainingModuleHeader } from "@/components/platform/training-module-components"
import { LessonAudioPlayer, ModuleCatalogEntry } from "@/components/training-audio/lesson-audio-player"
import { QuizModule } from "@/components/quiz"
import { WorkbookPromptBlock } from "@/components/workbook-prompt"
import { AudioLessonProgress, loadAudioProgress } from "@/lib/audio-progress-storage"
import { TrainingModuleView } from "@/lib/training-module-view"
import { useLanguage } from "@/context/language-context"
import { SkipForward, Zap, CheckCircle2, MonitorPlay } from "lucide-react"
import { cn } from "@/lib/utils"
import { buildModuleAudioLesson } from "@/lib/training-audio"
import { WHITE_LABEL, SLIDE_START_PAGES } from "@/lib/white-label.config"
import { loadTrainingModuleProgress, updateTrainingModuleProgress, TrainingModuleProgress, loadAllTrainingModuleProgress } from "@/lib/training-module-progress"
import { getTrainingModuleView, getTrainingModuleCatalog } from "@/lib/training-module-view"
import { AppShell } from "@/components/platform/app-shell"
import { ICON_MAP } from "@/components/platform/icon-registry"

const PdfSlideViewer = dynamic(
  () => import("@/components/pdf-slide-viewer").then((m) => ({ default: m.PdfSlideViewer })),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-sm text-[#94A3B8]">Loading...</div> }
)

type WorkbookSummary = {
  completed: number
  total: number
  complete: boolean
}

export function GuidedModuleExperience({
  moduleId,
  onModuleSelect,
}: {
  moduleId: string
  onModuleSelect?: (moduleId: string) => void
}) {
  const router = useRouter()
  const { locale, t } = useLanguage()

  // Resolve module data locally
  const moduleView = useMemo(() => getTrainingModuleView(moduleId, locale), [moduleId, locale])
  const moduleCatalog = useMemo(() => getTrainingModuleCatalog(locale), [locale])
  const moduleProgressMap = useMemo(() => loadAllTrainingModuleProgress(), [])

  const simulationHref = useMemo(() => {
    if (!moduleView) return ""
    const firstScenario = moduleView.simulationScenarioIds[0]
    return firstScenario
      ? `/ai-simulator?moduleId=${moduleView!.id}&scenarioId=${firstScenario}`
      : `/ai-simulator?moduleId=${moduleView!.id}`
  }, [moduleView])
  const [activeAudioSectionId, setActiveAudioSectionId] = useState("")
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioComplete, setAudioComplete] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [workbookSummary, setWorkbookSummary] = useState<WorkbookSummary>({ completed: 0, total: 0, complete: false })
  const [visualSlideIndex, setVisualSlideIndex] = useState(0)
  const [coachingScore, setCoachingScore] = useState<number | "">("")
  const [coachingNotes, setCoachingNotes] = useState("")
  const [coachingSaved, setCoachingSaved] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)
  // Auto-advance to next module after audio completes
  const [autoNextModule, setAutoNextModule] = useState(false)
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null)

  const lesson = useMemo(() => moduleView ? buildModuleAudioLesson(moduleView, locale) : null, [moduleView, locale])

  const quiz = useMemo(
    () => {
      if (!moduleView) return null
      return {
        title: `${moduleView.title} ${t("kc_suffix", { en: "Knowledge Check", es: "Verificación de Conocimientos" })}`,
        questions: moduleView.knowledgeChecks.map((item) => ({
          id: item.id,
          question: item.question,
          options: item.options,
          correctAnswerIndex: item.correctIndex,
          explanation: item.feedback,
        })),
      }
    },
    [moduleView, t]
  )

  const dayNumber = moduleView ? Number.parseInt(moduleView!.id.split("_")[1] ?? "", 10) : NaN
  const pdfUrl = Number.isFinite(dayNumber)
    ? WHITE_LABEL.dayPdfPaths[dayNumber as keyof typeof WHITE_LABEL.dayPdfPaths]
    : undefined
  const slideStartPage = moduleView ? (SLIDE_START_PAGES[moduleView!.id] ?? 1) : 1
  const pptxDownloadUrl = pdfUrl ? pdfUrl.replace(/\.pdf$/i, ".pptx") : undefined

  const resolvedSlideUrl = useMemo(() => {
    if (!moduleView) return "";
    
    const isValid = (url: any) => 
      typeof url === "string" && 
      url !== "" && 
      !url.startsWith("PASTE_") &&
      !url.includes("PLACEHOLDER");

    const dayNum = Number.parseInt(moduleView.id.split("_")[1] ?? "", 10);

    // 4-Tier Fallback Hierarchy
    if (locale === "es") {
      // 1. ES Specific
      const esSpecific = (WHITE_LABEL as any).slideEmbedUrls_es?.[moduleView.id];
      if (isValid(esSpecific)) return esSpecific;
      
      // 2. ES Day Default
      const esDay = (WHITE_LABEL as any).slideEmbedUrls_es?.[dayNum];
      if (isValid(esDay)) return esDay;
    }
    
    // 3. EN Specific
    const enSpecific = WHITE_LABEL.slideEmbedUrls[moduleView.id];
    if (isValid(enSpecific)) return enSpecific;
    
    // 4. EN Day Default
    const enDay = WHITE_LABEL.slideEmbedUrls[dayNum];
    if (isValid(enDay)) return enDay;

    return "";
  }, [moduleView, locale]);

  const isPlaceholderUrl = (url: string) => {
    return url === "" || url.includes("PASTE_") || url.includes("PLACEHOLDER");
  };

  const activeSegment = useMemo(() => {
    if (!moduleView) return null
    const sectionMatch = moduleView.instructionalSegments.find((segment) => segment.id === activeAudioSectionId)
    if (sectionMatch) return sectionMatch
    return moduleView.instructionalSegments[0]
  }, [moduleView, activeAudioSectionId])

  const simulationUnlocked = audioComplete && quizComplete
  const moduleComplete = audioComplete && quizComplete && simulationComplete

  // URL Protection Check
  useEffect(() => {
    if (!moduleView) return
    // Skip protection if admin unlock is active in localStorage
    const adminUnlockKey = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_admin_unlock_dev`
    const adminUnlock = typeof window !== 'undefined' && window.localStorage.getItem(adminUnlockKey) === 'true'
    if (adminUnlock) return

    // If we have catalog and progress, verify this module isn't locked
    if (moduleCatalog && moduleCatalog.length > 0) {
      // Find index of current module
      const currentIndex = moduleCatalog.findIndex(m => m.id === moduleView!.id)
      if (currentIndex > 0) {
        // Check if all previous modules are completed
        let allPreviousCompleted = true
        for (let i = 0; i < currentIndex; i++) {
          if (!moduleProgressMap[moduleCatalog[i].id]?.moduleCompleted) {
            allPreviousCompleted = false
            break
          }
        }

        if (!allPreviousCompleted) {
          // Locked! Redirect
          router.push('/my-training?error=locked')
        }
      }
    }
  }, [moduleView?.id, moduleCatalog, moduleProgressMap, router])

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!moduleView) return
    // Only track "module_started" once per mount to avoid duplicates
    if (hasInitialized.current) return
    hasInitialized.current = true

    const lessonProgress = loadAudioProgress(moduleView!.id)
    if (lessonProgress?.lessonCompleted) {
      setAudioComplete(true)
    }

    const stored = loadTrainingModuleProgress(moduleView!.id)
    
    // Track module opened as a "module_started" event with normalization protection
    updateTrainingModuleProgress(moduleView!.id, {
      lastInteractionAt: new Date().toISOString()
    }, 'module_started')

    if (!stored) return
    setAudioComplete(stored.audioCompleted || lessonProgress?.lessonCompleted || false)
    setQuizComplete(stored.quizCompleted)
    setSimulationComplete(stored.simulationCompleted)
    setCoachingScore(stored.coachingScore ?? "")
    setCoachingNotes(stored.coachingNotes ?? "")
  }, [moduleView?.id])

  const handleAudioProgressChange = (snapshot: {
    overallProgress: number
    activeSectionId: string
    completedCount: number
    totalCount: number
    lessonCompleted: boolean
  }) => {
    if (!moduleView) return
    setActiveAudioSectionId(snapshot.activeSectionId)
    setAudioProgress(snapshot.overallProgress)
    if (snapshot.lessonCompleted && !audioComplete) {
      setAudioComplete(true)
      updateTrainingModuleProgress(moduleView!.id, { audioCompleted: true }, 'audio_completed')
    }
  }

  const handleAudioComplete = () => {
    if (!moduleView) return
    setAudioComplete(true)
    updateTrainingModuleProgress(moduleView!.id, { audioCompleted: true }, 'audio_completed')

    // Auto-next module: start countdown if enabled and next module exists
    if (autoNextModule && moduleView.nextModuleId && onModuleSelect) {
      setAutoNextCountdown(5)
    }
  }

  // Countdown timer for auto-next module
  useEffect(() => {
    if (!moduleView) return
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
  }, [autoNextCountdown, moduleView?.nextModuleId, onModuleSelect])

  const cancelAutoNext = () => setAutoNextCountdown(null)

  const handleQuizComplete = () => {
    if (!moduleView) return
    setQuizComplete(true)
    updateTrainingModuleProgress(moduleView!.id, { 
      quizCompleted: true,
      lastInteractionAt: new Date().toISOString()
    }, 'quiz_completed')
  }

  const handleSaveCoaching = () => {
    if (!moduleView) return
    const normalizedScore = typeof coachingScore === "number" ? coachingScore : null
    updateTrainingModuleProgress(moduleView!.id, {
      audioCompleted: true,
      quizCompleted: true,
      simulationCompleted: true,
      coachingScore: normalizedScore,
      coachingNotes,
      moduleCompleted: true,
      completedAt: new Date().toISOString(),
      lastInteractionAt: new Date().toISOString()
    }, 'coaching_saved')
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
    if (moduleView) {
      onLessonProgressLoad(loadAudioProgress(moduleView!.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleView?.id])

  if (!moduleView) {
    return (
      <AppShell heading="Training Module" subheading="Module not found.">
        <div className="space-y-4">
          <p className="text-sm text-[#94A3B8]">
            {t("not_found", {
              en: "This module route does not exist in local curriculum data.",
              es: "Esta ruta de mÃ³dulo no existe en los datos del currÃ­culo local."
            })}
          </p>
          <Link href="/my-training" className="btn-primary inline-flex px-4 py-2 text-sm">
            {t("back", { en: "Back to module list", es: "Volver a la lista de mÃ³dulos" })}
          </Link>
        </div>
      </AppShell>
    )
  }

  const heading = t("heading", {
    en: `Training Module ${moduleView.moduleNumber}`,
    es: `MÃ³dulo de Entrenamiento ${moduleView.moduleNumber}`
  })

  return (
    <AppShell heading={heading} subheading={`${moduleView.dayLabel} - ${moduleView.estimatedTime}`}>
      <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-6 pb-32 sm:pb-36">
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

      {/* Auto-next countdown banner */}
      {autoNextCountdown !== null && moduleView.nextModuleId && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF5722]/25 bg-[#FF5722]/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#FFD54F]">
            <SkipForward className="h-4 w-4 shrink-0" />
            <span>
              {t("advancing", { en: "Advancing to", es: "Avanzando a" })}{" "}
              <span className="font-semibold">{moduleView.nextModuleTitle ?? "next module"}</span>{" "}
              {t("in", { en: "in", es: "en" })}{" "}
              <span className="font-bold tabular-nums">{autoNextCountdown}s</span>â€¦
            </span>
          </div>
          <button
            type="button"
            onClick={cancelAutoNext}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#CBD5E1] hover:bg-white/20 transition-colors"
          >
            {t("cancel", { en: "Cancel", es: "Cancelar" })}
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
          {autoNextModule 
            ? t("auto_next_on", { en: "Auto-Next Module: On", es: "Auto-Avance: Activado" }) 
            : t("auto_next_off", { en: "Auto-Next Module: Off", es: "Auto-Avance: Desactivado" })}
        </button>
        <p className="hidden sm:block text-xs text-[#64748B]">
          {autoNextModule
            ? t("auto_next_desc_on", { en: "Will auto-advance to the next module when audio ends.", es: "Avanzará automáticamente al siguiente módulo al terminar el audio." })
            : t("auto_next_desc_off", { en: "Will pause at end of module audio.", es: "Se pausará al finalizar el audio del módulo." })}
        </p>
      </div>

      <LessonAudioPlayer
        moduleId={moduleView!.id}
        moduleTitle={moduleView.title}
        lesson={lesson!}
        variant="mini_dock"
        onLessonComplete={handleAudioComplete}
        onSectionChange={setActiveAudioSectionId}
        onProgressChange={handleAudioProgressChange}
        onModuleSelect={onModuleSelect}
        moduleCatalog={moduleCatalog}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-black text-white sm:text-2xl">
              {t("lesson_surface", { en: "Lesson Surface", es: "Superficie de Lección" })}
            </h3>
            <span className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-1.5 text-xs font-hud uppercase tracking-[0.12em] text-[#FFD54F]">
              {t("audio", { en: "Audio", es: "Audio" })} {Math.round(audioProgress)}%
            </span>
          </div>

          {WHITE_LABEL.presentationMode === "google_slides" ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl">
              {isPlaceholderUrl(resolvedSlideUrl) ? (
                <div className="flex aspect-video w-full flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#FF5722]/10" />
                    <MonitorPlay className="relative h-12 w-12 text-[#FF5722]/40" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">
                    {t("slides_coming_soon", { 
                      en: "Visual Presentation Coming Soon", 
                      es: "Presentación Visual Próximamente" 
                    })}
                  </h4>
                  <p className="mt-2 max-w-sm text-sm text-[#94A3B8]">
                    {t("slides_desc", { 
                      en: "The specialized visual slide deck for this module is currently being finalized. Use the audio and workbook to continue.", 
                      es: "La presentación visual especializada para este módulo se está finalizando. Utiliza el audio y el cuaderno para continuar." 
                    })}
                  </p>
                </div>
              ) : (
                <iframe
                  src={resolvedSlideUrl}
                  title={`${moduleView.title} presentation`}
                  width="100%"
                  style={{ aspectRatio: "16/9", border: 0 }}
                  allowFullScreen
                />
              )}
            </div>
          ) : null}

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
                    {t("prev", { en: "Prev", es: "Anterior" })}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVisualSlideIndex((prev) => Math.min(moduleView.visualSlides.length - 1, prev + 1))
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CBD5E1]"
                  >
                    {t("next", { en: "Next", es: "Siguiente" })}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {moduleView.workbookPrompts.length > 0 ? (
          <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5">
            <h3 className="font-display text-xl font-black text-white sm:text-2xl mb-4">
              {t("workbook_practice", { en: "Workbook Practice", es: "Práctica del Cuaderno" })}
            </h3>
            <WorkbookPromptBlock moduleId={moduleView!.id} prompts={moduleView.workbookPrompts} onProgressChange={setWorkbookSummary} />
            <p className="mt-4 text-xs text-[#94A3B8]">
              {t("workbook_completion", { en: "Workbook completion", es: "Progreso del cuaderno" })}: {workbookSummary.completed}/{workbookSummary.total}
            </p>
          </section>
        ) : (
          <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 flex items-center justify-center text-center">
             <p className="text-[#94A3B8] text-sm">
               {t("no_workbook", { en: "No workbook exercises for this module.", es: "No hay ejercicios de cuaderno para este módulo." })}
             </p>
          </section>
        )}
      </div>

      {audioComplete ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <h3 className="font-display text-xl font-black text-white sm:text-2xl">
            {t("knowledge_check", { en: "Knowledge Check", es: "Verificación de Conocimientos" })}
          </h3>
          {!quizComplete ? <QuizModule quiz={quiz!} onComplete={handleQuizComplete} /> : null}
          {quizComplete ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/10 p-4 text-sm text-[#FFE6B3]">
              <CheckCircle2 className="h-5 w-5 text-[#FFD54F] shrink-0" />
              <p>{t("quiz_complete_msg", { en: "Knowledge check completed. Simulation is now unlocked.", es: "Verificación completada. La simulación ha sido desbloqueada." })}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {simulationUnlocked ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-4">
          <h3 className="font-display text-xl font-black text-white sm:text-2xl">
            {t("simulation", { en: "Simulation", es: "Simulación" })}
          </h3>
          <StartSimulationButton
            scenarioName={moduleView.simulationScenarioIds[0] ?? (locale === "es" ? "Escenario asignado" : "Scenario assigned")}
            skillsTested={locale === "es" ? ["Descubrimiento", "Manejo de Objeciones", "Cierre"] : ["Discovery", "Objection Handling", "Closing"]}
            targetScore="85+"
            href={simulationHref}
          />
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#FF5722]">
              {t("sim_debrief", { en: "Simulation Debrief", es: "Resumen de Simulación" })}
            </p>
            <p className="text-sm text-[#CBD5E1]">
              {t("sim_debrief_desc", { en: "After running the simulator, log your coaching score and notes to close the module.", es: "Después de ejecutar el simulador, registra tu puntaje y notas de coaching para cerrar el módulo." })}
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
                placeholder={t("score_placeholder", { en: "Score (0-100)", es: "Puntaje (0-100)" })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
              />
              <textarea
                rows={3}
                value={coachingNotes}
                onChange={(event) => setCoachingNotes(event.target.value)}
                placeholder={t("notes_placeholder", { en: "Coach notes and improvements...", es: "Notas de mejora y coaching..." })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveCoaching}
              className="rounded-xl border border-[#FF5722]/25 bg-[#FF5722]/10 px-4 py-2 text-sm text-[#FFD54F]"
            >
              {t("save_feedback", { en: "Save Coaching Feedback", es: "Guardar Feedback de Coaching" })}
            </button>
            {coachingSaved ? <p className="text-xs text-[#FFB300]">{t("saved", { en: "Feedback saved.", es: "Feedback guardado." })}</p> : null}
          </div>
        </section>
      ) : null}

      {moduleComplete ? (
        <section className="glass-circuit hud-border rounded-[20px] p-4 sm:p-5 space-y-3">
          <h3 className="font-display text-xl font-black text-white">
            {t("module_completed", { en: "Module Completed", es: "Módulo Completado" })}
          </h3>
          <p className="text-sm text-[#CBD5E1]">
            {t("module_complete_desc", { en: "Lesson, quiz, simulation, and coaching feedback are complete.", es: "La lección, el quiz, la simulación y el feedback de coaching están completos." })}
          </p>
          {moduleView.nextModuleId ? (
            <button
              type="button"
              onClick={() => onModuleSelect && onModuleSelect(moduleView.nextModuleId!)}
              className="btn-primary inline-flex px-4 py-2 text-sm"
            >
              {t("continue_to", { en: "Continue to", es: "Continuar a" })} {moduleView.nextModuleTitle ?? `Module ${moduleView.nextModuleId}`}
            </button>
          ) : (
            <p className="text-sm text-[#FFE6B3]">
              {t("final_module_msg", { en: "You have completed the final module in the current curriculum order.", es: "Has completado el último módulo en el orden actual del currículo." })}
            </p>
          )}
        </section>
      ) : null}
      </div>
    </div>
  </AppShell>
  )
}

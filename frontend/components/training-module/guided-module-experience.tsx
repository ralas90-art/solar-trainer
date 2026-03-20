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
import { SLIDE_START_PAGES, WHITE_LABEL } from "@/lib/white-label.config"
import { SkipForward, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const activeSegment = useMemo(() => {
    const sectionMatch = moduleView.instructionalSegments.find((segment) => segment.id === activeAudioSectionId)
    if (sectionMatch) return sectionMatch
    return moduleView.instructionalSegments[0]
  }, [moduleView.instructionalSegments, activeAudioSectionId])

  const simulationUnlocked = audioComplete && quizComplete
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

  const handleQuizComplete = () => {
    setQuizComplete(true)
    updateTrainingModuleProgress(moduleView.id, { quizCompleted: true })
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

  return (
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

          {WHITE_LABEL.presentationMode === "google_slides" && Number.isFinite(dayNumber) ? (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                src={WHITE_LABEL.slideEmbedUrls[dayNumber as keyof typeof WHITE_LABEL.slideEmbedUrls]}
                title={`Day ${dayNumber} presentation`}
                width="100%"
                style={{ aspectRatio: "16/9", border: 0 }}
                allowFullScreen
              />
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
          {!quizComplete ? <QuizModule quiz={quiz} onComplete={handleQuizComplete} /> : null}
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
              className="btn-solar inline-flex px-4 py-2 text-sm"
            >
              Continue to {moduleView.nextModuleTitle ?? `Module ${moduleView.nextModuleId}`}
            </button>
          ) : (
            <p className="text-sm text-[#FFE6B3]">You have completed the final module in the current curriculum order.</p>
          )}
        </section>
      ) : null}
    </div>
  )
}

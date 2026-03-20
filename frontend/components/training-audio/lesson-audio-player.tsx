"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AudioSectionList } from "@/components/training-audio/audio-section-list"
import { AudioProgressBar } from "@/components/training-audio/audio-progress-bar"
import { NarrationStatusCard } from "@/components/training-audio/narration-status-card"
import { AudioLessonSection, ModuleAudioLesson } from "@/lib/training-audio"
import { resolveNarrationSource } from "@/lib/narration-service"
import { AudioLessonProgress, loadAudioProgress, saveAudioProgress } from "@/lib/audio-progress-storage"
import { cn } from "@/lib/utils"
import {
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  Lock,
  BookOpen,
  ChevronRight,
  Zap,
  SkipForward,
} from "lucide-react"

type SourceMode = "static_asset" | "elevenlabs_generated" | "speech_synthesis"
type PlayerVariant = "default" | "compact" | "mini_dock"

type AudioProgressSnapshot = {
  overallProgress: number
  activeSectionId: string
  completedCount: number
  totalCount: number
  lessonCompleted: boolean
}

export type ModuleCatalogEntry = {
  id: string
  title: string
  dayLabel: string
  isCompleted?: boolean
  isActive?: boolean
}

export function LessonAudioPlayer({
  moduleId,
  moduleTitle,
  lesson,
  onLessonComplete,
  onSectionChange,
  onProgressChange,
  onModuleSelect,
  moduleCatalog,
  variant = "default",
  className,
  autoAdvance = false,
}: {
  moduleId: string
  moduleTitle?: string
  lesson: ModuleAudioLesson
  onLessonComplete?: () => void
  onSectionChange?: (sectionId: string) => void
  onProgressChange?: (snapshot: AudioProgressSnapshot) => void
  onModuleSelect?: (moduleId: string) => void
  moduleCatalog?: ModuleCatalogEntry[]
  variant?: PlayerVariant
  className?: string
  autoAdvance?: boolean
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const generatedUrlRef = useRef<string | null>(null)
  const ttsIntervalRef = useRef<number | null>(null)
  const activeSectionRef = useRef<AudioLessonSection | null>(null)

  const [activeSectionId, setActiveSectionId] = useState(lesson.sections[0]?.id ?? "intro")
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [sourceMode, setSourceMode] = useState<SourceMode>("speech_synthesis")
  const [audioError, setAudioError] = useState<string | null>(null)
  const [resumeTimeSec, setResumeTimeSec] = useState(0)
  const [sectionElapsedSec, setSectionElapsedSec] = useState(0)
  const [sectionDurationSec, setSectionDurationSec] = useState(lesson.sections[0]?.estimatedDurationSec ?? 30)
  const [lessonStarted, setLessonStarted] = useState(false)
  const [showSections, setShowSections] = useState(variant !== "compact")
  const [isExpanded, setIsExpanded] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  // Seamless = auto-play the next section without pausing
  const [seamlessMode, setSeamlessMode] = useState(true)
  // Module switcher tab in expanded dock
  const [expandedTab, setExpandedTab] = useState<"now_playing" | "curriculum">("now_playing")
  // Expanded day groups in curriculum tab
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  const sectionIndex = Math.max(0, lesson.sections.findIndex((section) => section.id === activeSectionId))
  const activeSection = lesson.sections[sectionIndex] ?? lesson.sections[0]
  activeSectionRef.current = activeSection

  const completedCount = useMemo(
    () => lesson.sections.filter((section) => completedSections[section.id]).length,
    [lesson.sections, completedSections]
  )

  const lessonCompleted = completedCount === lesson.sections.length && lesson.sections.length > 0

  const overallProgress = useMemo(() => {
    if (!lesson.sections.length) return 0
    const completedPart = (completedCount / lesson.sections.length) * 100
    const currentPart = (sectionElapsedSec / Math.max(sectionDurationSec, 1)) * (100 / lesson.sections.length)
    return Math.max(0, Math.min(100, completedPart + currentPart))
  }, [lesson.sections.length, completedCount, sectionElapsedSec, sectionDurationSec])

  // Group moduleCatalog by day for the curriculum tab
  const groupedCatalog = useMemo(() => {
    if (!moduleCatalog) return {}
    const groups: Record<string, ModuleCatalogEntry[]> = {}
    for (const mod of moduleCatalog) {
      const day = mod.dayLabel || "General"
      if (!groups[day]) groups[day] = []
      groups[day].push(mod)
    }
    return groups
  }, [moduleCatalog])

  // Auto-expand the active module's day in curriculum tab
  useEffect(() => {
    if (!moduleCatalog) return
    const activeMod = moduleCatalog.find((m) => m.isActive)
    if (activeMod?.dayLabel) {
      setExpandedDays((prev) => ({ ...prev, [activeMod.dayLabel]: true }))
    }
  }, [moduleCatalog])

  const persistProgress = (
    partial?: Partial<AudioLessonProgress>,
    targetSectionId = activeSectionId,
    targetResumeTime = sectionElapsedSec
  ) => {
    const payload: AudioLessonProgress = {
      moduleId,
      lessonStarted,
      lessonCompleted,
      activeSectionId: targetSectionId,
      sectionCompletion: completedSections,
      resumeTimeSec: targetResumeTime,
      updatedAt: new Date().toISOString(),
      ...partial,
    }
    saveAudioProgress(payload)
  }

  const stopTtsTimer = () => {
    if (ttsIntervalRef.current !== null) {
      window.clearInterval(ttsIntervalRef.current)
      ttsIntervalRef.current = null
    }
  }

  const stopAllPlayback = () => {
    setIsPlaying(false)
    stopTtsTimer()
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const markSectionCompleted = (sectionId: string) => {
    setCompletedSections((prev) => ({ ...prev, [sectionId]: true }))
  }

  const advanceToNextSection = () => {
    const nextIndex = sectionIndex + 1
    if (nextIndex < lesson.sections.length) {
      const nextSection = lesson.sections[nextIndex]
      setActiveSectionId(nextSection.id)
      setSectionElapsedSec(0)
      setResumeTimeSec(0)
      // seamlessMode = auto-play after loading
      void loadSectionAudio(nextSection, 0, seamlessMode)
    } else {
      setIsPlaying(false)
      if (onLessonComplete) onLessonComplete()
    }
  }

  const handleSectionEnded = () => {
    const currentId = activeSectionRef.current?.id
    if (!currentId) return
    markSectionCompleted(currentId)
    persistProgress(
      {
        lessonStarted: true,
        lessonCompleted: completedCount + 1 >= lesson.sections.length,
      },
      currentId,
      0
    )
    advanceToNextSection()
  }

  const startTtsPlayback = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !activeSectionRef.current) {
      setAudioError("Browser speech synthesis is unavailable on this device.")
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(activeSectionRef.current.narrationText)
    utterance.rate = playbackRate
    utterance.pitch = 1
    utterance.onend = () => {
      stopTtsTimer()
      setIsPlaying(false)
      handleSectionEnded()
    }
    utterance.onerror = () => {
      stopTtsTimer()
      setIsPlaying(false)
      setAudioError("Narration playback failed. Retry the section.")
    }
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    stopTtsTimer()
    ttsIntervalRef.current = window.setInterval(() => {
      setSectionElapsedSec((prev) => {
        const next = prev + 1
        if (next >= sectionDurationSec) {
          stopTtsTimer()
          return sectionDurationSec
        }
        return next
      })
    }, 1000)
  }

  const loadSectionAudio = async (section: AudioLessonSection, resumeFromSec = 0, autoPlay = false) => {
    stopAllPlayback()
    setIsLoadingAudio(true)
    setAudioError(null)
    setSectionDurationSec(section.estimatedDurationSec)
    setSectionElapsedSec(resumeFromSec)
    setResumeTimeSec(resumeFromSec)

    if (generatedUrlRef.current) {
      URL.revokeObjectURL(generatedUrlRef.current)
      generatedUrlRef.current = null
    }

    const source = await resolveNarrationSource({
      moduleId,
      sectionId: section.id,
      text: section.narrationText,
    })

    setSourceMode(source.mode)

    if (source.src && audioRef.current) {
      audioRef.current.src = source.src
      audioRef.current.load()
      if (source.mode === "elevenlabs_generated") {
        generatedUrlRef.current = source.src
      }
    }

    if (source.error) {
      setAudioError(source.error)
    }

    setIsLoadingAudio(false)

    // Seamless auto-play: start playing immediately after loading
    if (autoPlay && source.src && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setAudioError("Audio playback was blocked. Press Play to continue."))
    } else if (autoPlay && source.mode === "speech_synthesis") {
      startTtsPlayback()
    }
  }

  const handlePlayPause = () => {
    if (!activeSectionRef.current || isLoadingAudio) return
    if (!lessonStarted) setLessonStarted(true)

    if (sourceMode === "speech_synthesis") {
      if (!isPlaying) {
        if (sectionElapsedSec > 0 && typeof window !== "undefined" && window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
          setIsPlaying(true)
          if (ttsIntervalRef.current === null) {
            ttsIntervalRef.current = window.setInterval(() => {
              setSectionElapsedSec((prev) => Math.min(sectionDurationSec, prev + 1))
            }, 1000)
          }
        } else {
          startTtsPlayback()
        }
      } else {
        if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause()
        }
        stopTtsTimer()
        setIsPlaying(false)
      }
      return
    }

    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setAudioError("Audio playback was blocked. Try interacting with the page and press Play again."))
    }
  }

  const handleRestart = () => {
    setSectionElapsedSec(0)
    setResumeTimeSec(0)
    if (sourceMode === "speech_synthesis") {
      startTtsPlayback()
      return
    }
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }

  const handleSelectSection = (sectionId: string) => {
    const nextSection = lesson.sections.find((section) => section.id === sectionId)
    if (!nextSection) return
    setActiveSectionId(sectionId)
    setResumeTimeSec(0)
    setSectionElapsedSec(0)
    void loadSectionAudio(nextSection, 0)
  }

  const handleSeek = (value: number) => {
    const seekTarget = Math.max(0, Math.min(sectionDurationSec, value))
    if (sourceMode === "speech_synthesis") return
    if (audioRef.current) {
      audioRef.current.currentTime = seekTarget
    }
    setSectionElapsedSec(seekTarget)
    persistProgress(undefined, activeSectionId, seekTarget)
  }

  const stepSection = (direction: -1 | 1) => {
    const nextIndex = sectionIndex + direction
    if (nextIndex < 0 || nextIndex >= lesson.sections.length) return
    handleSelectSection(lesson.sections[nextIndex].id)
  }

  useEffect(() => {
    setShowSections(variant !== "compact")
    setIsExpanded(false)
    setAudioError(null)

    const stored = loadAudioProgress(moduleId)
    if (!stored) {
      const firstSection = lesson.sections[0]
      if (firstSection) {
        setActiveSectionId(firstSection.id)
        setCompletedSections({})
        setLessonStarted(false)
        setSectionElapsedSec(0)
        setResumeTimeSec(0)
        void loadSectionAudio(firstSection, 0)
      }
      return
    }

    setLessonStarted(stored.lessonStarted)
    setCompletedSections(stored.sectionCompletion ?? {})
    setActiveSectionId(stored.activeSectionId || activeSection.id)
    setResumeTimeSec(stored.resumeTimeSec || 0)
    const sectionToLoad =
      lesson.sections.find((section) => section.id === stored.activeSectionId) ?? activeSection
    void loadSectionAudio(sectionToLoad, stored.resumeTimeSec || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    if (lessonCompleted && onLessonComplete) {
      onLessonComplete()
    }
  }, [lessonCompleted, onLessonComplete])

  useEffect(() => {
    persistProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonStarted, lessonCompleted, activeSectionId, completedSections, sectionElapsedSec])

  useEffect(() => {
    if (!onProgressChange) return
    onProgressChange({
      overallProgress,
      activeSectionId,
      completedCount,
      totalCount: lesson.sections.length,
      lessonCompleted,
    })
  }, [onProgressChange, overallProgress, activeSectionId, completedCount, lesson.sections.length, lessonCompleted])

  useEffect(() => {
    if (onSectionChange) onSectionChange(activeSectionId)
  }, [onSectionChange, activeSectionId])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current
    const onLoadedMetadata = () => {
      const realDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : sectionDurationSec
      setSectionDurationSec(Math.round(realDuration))
      if (resumeTimeSec > 0) {
        audio.currentTime = Math.min(resumeTimeSec, realDuration - 0.1)
      }
    }
    const onTimeUpdate = () => {
      setSectionElapsedSec(audio.currentTime)
    }
    const onEnded = () => {
      setIsPlaying(false)
      handleSectionEnded()
    }
    const onError = () => {
      setIsPlaying(false)
      setAudioError("Unable to load this audio section. You can retry or continue with script text.")
    }

    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  })

  useEffect(() => {
    return () => {
      stopAllPlayback()
      if (generatedUrlRef.current) {
        URL.revokeObjectURL(generatedUrlRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Curriculum Tab (in expanded dock) ───────────────────────────────────────
  const renderCurriculumTab = () => {
    if (!moduleCatalog || moduleCatalog.length === 0) {
      return (
        <p className="text-sm text-[#94A3B8] py-4 text-center">
          No curriculum data available.
        </p>
      )
    }

    return (
      <div className="space-y-2">
        {Object.entries(groupedCatalog).map(([dayLabel, mods]) => {
          const isExpDay = expandedDays[dayLabel]
          const dayCompleted = mods.every((m) => m.isCompleted)

          return (
            <div key={dayLabel} className="space-y-0.5">
              <button
                type="button"
                onClick={() => setExpandedDays((prev) => ({ ...prev, [dayLabel]: !prev[dayLabel] }))}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpDay ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  )}
                  <span className={cn("text-xs font-medium", dayCompleted ? "text-[#94A3B8]" : "text-white")}>
                    {dayLabel}
                  </span>
                </div>
                {dayCompleted && <CheckCircle2 className="w-3 h-3 text-[#FFB300]" />}
              </button>

              {isExpDay && (
                <div className="pl-5 border-l border-white/10 ml-3 space-y-0.5">
                  {mods.map((mod) => {
                    const isActive = mod.isActive
                    const isCompleted = mod.isCompleted
                    // Modules are never "locked" - always navigable for review
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          if (onModuleSelect) {
                            onModuleSelect(mod.id)
                            setIsExpanded(false)
                          }
                        }}
                        disabled={!onModuleSelect}
                        className={cn(
                          "w-full flex items-start gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all",
                          isActive
                            ? "bg-[rgba(255,87,34,0.12)] border border-[#FF5722]/30 text-white"
                            : isCompleted
                            ? "hover:bg-white/5 text-[#94A3B8] hover:text-white"
                            : "hover:bg-white/5 text-[#64748B] hover:text-[#94A3B8]"
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className={cn("w-3 h-3", isActive ? "text-[#FFB300]" : "text-[#FFB300]/60")} />
                          ) : isActive ? (
                            <PlayCircle className="w-3 h-3 text-[#FF5722]" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-[#64748B]/40" />
                          )}
                        </div>
                        <span className={cn("line-clamp-2 leading-snug", isActive && "font-medium")}>
                          {mod.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderMainPlayer = () => (
    <section
      className={cn(
        "glass-circuit hud-border rounded-[20px] p-5",
        variant === "compact" ? "space-y-3" : "space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={cn("font-display font-black text-white", variant === "compact" ? "text-lg" : "text-2xl")}>
            Lesson Audio
          </h3>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {activeSection?.title ?? "Section"} - {Math.round(overallProgress)}% complete
          </p>
        </div>
        {variant === "compact" ? (
          <button
            type="button"
            onClick={() => setShowSections((prev) => !prev)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#CBD5E1]"
          >
            {showSections ? "Hide sections" : "Show sections"}
          </button>
        ) : null}
      </div>

      <NarrationStatusCard
        isPlaying={isPlaying}
        currentSectionTitle={activeSection?.title ?? "Section"}
        sourceMode={sourceMode}
        completedCount={completedCount}
        totalCount={lesson.sections.length}
        errorMessage={audioError}
      />

      <AudioProgressBar progressPercent={overallProgress} label="Lesson progress" />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={isLoadingAudio}
          className="btn-solar px-4 py-2 text-sm disabled:opacity-60"
        >
          {isLoadingAudio ? "Loading..." : isPlaying ? "Pause" : sectionElapsedSec > 0 ? "Resume" : "Play Lesson"}
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#CBD5E1]"
        >
          Restart
        </button>
        {variant !== "compact" ? (
          <button
            type="button"
            onClick={() => void loadSectionAudio(activeSection, sectionElapsedSec)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#CBD5E1]"
          >
            Retry Audio
          </button>
        ) : null}
        {/* Seamless toggle */}
        <button
          type="button"
          onClick={() => setSeamlessMode((prev) => !prev)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm transition-colors",
            seamlessMode
              ? "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FFD54F]"
              : "border-white/10 bg-white/5 text-[#94A3B8]"
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          {seamlessMode ? "Seamless On" : "Seamless Off"}
        </button>
      </div>

      {showSections ? (
        <AudioSectionList
          sections={lesson.sections}
          activeSectionId={activeSectionId}
          completedSections={completedSections}
          onSelectSection={handleSelectSection}
        />
      ) : null}
    </section>
  )

  const renderMiniDockPlayer = () => (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#FF5722]/20 bg-[rgba(18,18,18,0.97)] px-3 py-2 backdrop-blur-md sm:px-4">
        <div className="mx-auto max-w-5xl space-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={isLoadingAudio}
                className="btn-solar min-h-[42px] min-w-[78px] px-3 py-2 text-xs disabled:opacity-60"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              {/* Seamless toggle — compact */}
              <button
                type="button"
                onClick={() => setSeamlessMode((prev) => !prev)}
                title={seamlessMode ? "Seamless mode on — sections play continuously" : "Seamless mode off — pauses between sections"}
                className={cn(
                  "hidden sm:flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs transition-colors",
                  seamlessMode
                    ? "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FFD54F]"
                    : "border-white/10 bg-white/5 text-[#94A3B8]"
                )}
              >
                <Zap className="w-3 h-3" />
                {seamlessMode ? "Seamless" : "Manual"}
              </button>
            </div>

            {/* Centered Module Title */}
            <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="font-display font-bold text-white tracking-wide truncate max-w-xs">{moduleTitle ?? "Lesson Audio"}</p>
              <p className="text-[10px] text-[#FFD54F] font-hud uppercase tracking-widest">{activeSection?.title ?? "Section"}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-[#94A3B8]">{Math.round(overallProgress)}% complete</p>
              </div>
              {/* Skip to next section */}
              <button
                type="button"
                onClick={() => stepSection(1)}
                title="Skip to next section"
                className="inline-flex min-h-[42px] items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-[#CBD5E1]"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex min-h-[42px] items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-[#CBD5E1]"
              >
                {isExpanded ? "Close" : "Expand"}
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#FF5722,#FFB300)]" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/60 px-2 pb-0 sm:px-4" onClick={() => setIsExpanded(false)}>
          <div
            className="glass-circuit hud-border mx-auto w-full max-w-5xl rounded-t-2xl p-4 sm:p-5 md:max-w-3xl lg:max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header row */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-black text-white">Lesson Audio</p>
                <p className="text-xs text-[#94A3B8]">{activeSection?.title ?? "Section"}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Seamless toggle */}
                <button
                  type="button"
                  onClick={() => setSeamlessMode((prev) => !prev)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    seamlessMode
                      ? "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FFD54F]"
                      : "border-white/10 bg-white/5 text-[#94A3B8]"
                  )}
                >
                  <Zap className="w-3 h-3" />
                  {seamlessMode ? "Seamless On" : "Seamless Off"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CBD5E1]"
                >
                  Close
                </button>
              </div>
            </div>

            <NarrationStatusCard
              isPlaying={isPlaying}
              currentSectionTitle={activeSection?.title ?? "Section"}
              sourceMode={sourceMode}
              completedCount={completedCount}
              totalCount={lesson.sections.length}
              errorMessage={audioError}
            />

            <div className="mt-3 space-y-2">
              <AudioProgressBar progressPercent={overallProgress} label="Lesson progress" />
              <input
                type="range"
                min={0}
                max={Math.max(1, sectionDurationSec)}
                value={Math.min(sectionElapsedSec, sectionDurationSec)}
                onChange={(event) => handleSeek(Number(event.target.value))}
                disabled={sourceMode === "speech_synthesis"}
                className="w-full accent-[#FF5722] disabled:opacity-40"
              />
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>{Math.round(sectionElapsedSec)}s</span>
                <span>{Math.round(sectionDurationSec)}s</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <button
                type="button"
                onClick={() => stepSection(-1)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#CBD5E1]"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={isLoadingAudio}
                className="btn-solar px-3 py-2 text-xs disabled:opacity-60"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => stepSection(1)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#CBD5E1]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#CBD5E1]"
              >
                Restart
              </button>
              <select
                value={String(playbackRate)}
                onChange={(event) => setPlaybackRate(Number(event.target.value))}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-[#CBD5E1]"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>

            {/* Tabs: Now Playing / Curriculum */}
            <div className="mt-4 flex gap-2 border-b border-white/10 pb-0">
              <button
                type="button"
                onClick={() => setExpandedTab("now_playing")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
                  expandedTab === "now_playing"
                    ? "border-[#FF5722] text-white"
                    : "border-transparent text-[#94A3B8] hover:text-white"
                )}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Now Playing
              </button>
              {moduleCatalog && moduleCatalog.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpandedTab("curriculum")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
                    expandedTab === "curriculum"
                      ? "border-[#FF5722] text-white"
                      : "border-transparent text-[#94A3B8] hover:text-white"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Curriculum
                </button>
              )}
            </div>

            <div className="mt-3 max-h-[30vh] overflow-y-auto pr-1">
              {expandedTab === "now_playing" ? (
                <AudioSectionList
                  sections={lesson.sections}
                  activeSectionId={activeSectionId}
                  completedSections={completedSections}
                  onSelectSection={handleSelectSection}
                />
              ) : (
                renderCurriculumTab()
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )

  return (
    <>
      {variant === "mini_dock" ? renderMiniDockPlayer() : renderMainPlayer()}
      <audio ref={audioRef} className="hidden" />
    </>
  )
}

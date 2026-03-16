"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AudioSectionList } from "@/components/training-audio/audio-section-list"
import { AudioProgressBar } from "@/components/training-audio/audio-progress-bar"
import { NarrationStatusCard } from "@/components/training-audio/narration-status-card"
import { AudioLessonSection, ModuleAudioLesson } from "@/lib/training-audio"
import { resolveNarrationSource } from "@/lib/narration-service"
import { AudioLessonProgress, loadAudioProgress, saveAudioProgress } from "@/lib/audio-progress-storage"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

type SourceMode = "static_asset" | "elevenlabs_generated" | "speech_synthesis"
type PlayerVariant = "default" | "compact" | "mini_dock"

type AudioProgressSnapshot = {
  overallProgress: number
  activeSectionId: string
  completedCount: number
  totalCount: number
  lessonCompleted: boolean
}

export function LessonAudioPlayer({
  moduleId,
  moduleTitle,
  lesson,
  onLessonComplete,
  onSectionChange,
  onProgressChange,
  variant = "default",
  className,
}: {
  moduleId: string
  moduleTitle?: string
  lesson: ModuleAudioLesson
  onLessonComplete?: () => void
  onSectionChange?: (sectionId: string) => void
  onProgressChange?: (snapshot: AudioProgressSnapshot) => void
  variant?: PlayerVariant
  className?: string
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
      void loadSectionAudio(nextSection, 0)
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

  const loadSectionAudio = async (section: AudioLessonSection, resumeFromSec = 0) => {
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
    // Reset transient layout state when module changes
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
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#FF5722]/20 bg-[rgba(18,18,18,0.95)] px-3 py-2 backdrop-blur-md sm:px-4">
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
            </div>
            
            {/* Centered Module Title */}
            <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="font-display font-bold text-white tracking-wide truncate max-w-xs">{moduleTitle ?? "Lesson Audio"}</p>
              <p className="text-[10px] text-[#FFD54F] font-hud uppercase tracking-widest">{activeSection?.title ?? "Section"}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-[#94A3B8]">{Math.round(overallProgress)}% complete</p>
              </div>
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
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-black text-white">Lesson Audio</p>
                <p className="text-xs text-[#94A3B8]">{activeSection?.title ?? "Section"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CBD5E1]"
              >
                Close
              </button>
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

            <div className="mt-3 max-h-[34vh] overflow-y-auto pr-1">
              <AudioSectionList
                sections={lesson.sections}
                activeSectionId={activeSectionId}
                completedSections={completedSections}
                onSelectSection={handleSelectSection}
              />
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

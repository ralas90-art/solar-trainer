"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { TrainingModuleView } from "@/lib/training-module-view"
import { GuidedModuleExperience } from "@/components/training-module/guided-module-experience"
import { loadTrainingModuleProgress, saveTrainingModuleProgress } from "@/lib/training-module-progress"
import { ModuleCatalogEntry } from "@/components/training-audio/lesson-audio-player"
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Lock,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { canBypassTrainingLocks } from "@/lib/auth-bypass"

export function InteractiveCurriculumClient({ moduleCatalog }: { moduleCatalog: TrainingModuleView[] }) {
  const { user } = useAuth()
  const hasBypass = useMemo(() => canBypassTrainingLocks(user), [user])

  // Group modules by day, excluding placeholder noisy modules
  const groupedModules = useMemo(() => {
    const groups: Record<string, TrainingModuleView[]> = {}
    moduleCatalog.forEach((mod) => {
      const day = mod.dayLabel || "General Curriculum"
      if (day === "Curriculum Module") return
      if (!groups[day]) groups[day] = []
      groups[day].push(mod)
    })
    return groups
  }, [moduleCatalog])

  const [activeModuleId, setActiveModuleId] = useState<string>("")
  const [firstIncompleteModuleId, setFirstIncompleteModuleId] = useState<string>("")
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [moduleProgress, setModuleProgress] = useState<Record<string, any>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string>("")

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    const t = setTimeout(() => setToastMessage(""), 3000)
    return () => clearTimeout(t)
  }, [])

  const refreshProgress = useCallback(() => {
    const progress: Record<string, any> = {}
    let firstIncompleteId = ""

    for (const mod of moduleCatalog) {
      if (mod.dayLabel === "Curriculum Module") continue
      const p = loadTrainingModuleProgress(mod.id)
      progress[mod.id] = p
      if (!firstIncompleteId && (!p || !p.moduleCompleted)) {
        firstIncompleteId = mod.id
      }
    }

    setModuleProgress(progress)
    setFirstIncompleteModuleId(firstIncompleteId)
    return firstIncompleteId
  }, [moduleCatalog])

  useEffect(() => {
    const firstIncompleteId = refreshProgress()

    const initialId = firstIncompleteId || moduleCatalog[0]?.id || ""
    setActiveModuleId(initialId)

    const activeMod = moduleCatalog.find((m) => m.id === initialId)
    if (activeMod?.dayLabel) {
      setExpandedDays((prev) => ({ ...prev, [activeMod.dayLabel]: true }))
    }
  }, [moduleCatalog, refreshProgress])

  const activeModule = useMemo(
    () => moduleCatalog.find((m) => m.id === activeModuleId),
    [activeModuleId, moduleCatalog]
  )

  const handleModuleSelect = useCallback((moduleId: string) => {
    // Check locks unless bypassed
    const mod = moduleCatalog.find((m) => m.id === moduleId)
    if (!mod) return
    const isCompleted = moduleProgress[mod.id]?.moduleCompleted
    const isLocked = !hasBypass && !isCompleted && mod.id !== firstIncompleteModuleId
    if (isLocked) return

    setActiveModuleId(moduleId)
    setIsDropdownOpen(false)
    // Ensure the day containing this module is expanded
    if (mod?.dayLabel) {
      setExpandedDays((prev) => ({ ...prev, [mod.dayLabel]: true }))
    }
    // Refresh progress so new completion states are reflected
    refreshProgress()
  }, [moduleCatalog, refreshProgress, hasBypass, firstIncompleteModuleId, moduleProgress])

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }))
  }

  // Build catalog entries for the audio player's in-dock curriculum tab
  const playerCatalog = useMemo<ModuleCatalogEntry[]>(() => {
    return moduleCatalog
      .filter((m) => m.dayLabel !== "Curriculum Module")
      .map((m) => ({
        id: m.id,
        title: m.title,
        dayLabel: m.dayLabel,
        isCompleted: moduleProgress[m.id]?.moduleCompleted ?? false,
        isActive: m.id === activeModuleId,
      }))
  }, [moduleCatalog, moduleProgress, activeModuleId])

  // Summary stats for the banner button
  const totalModules = playerCatalog.length
  const completedModules = playerCatalog.filter((m) => m.isCompleted).length

  if (!moduleCatalog.length || !activeModule) {
    return <div className="p-8 text-center text-[#94A3B8]">Loading curriculum...</div>
  }

  const simulationHref = activeModule.simulationScenarioIds[0]
    ? `/ai-simulator?moduleId=${activeModule.id}&scenarioId=${activeModule.simulationScenarioIds[0]}`
    : `/ai-simulator?moduleId=${activeModule.id}`

  return (
    <div className="flex flex-col gap-6">
      {/* ── Curriculum Map Banner ── */}
      <div className="relative z-40">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10 w-full sm:w-auto"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722] shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="text-left flex-1 sm:flex-none min-w-0">
            <p className="font-display font-bold truncate">Curriculum Map</p>
            <p className="text-xs text-[#94A3B8]">
              {completedModules}/{totalModules} modules complete · {activeModule.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}
            </p>
          </div>
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#FF5722,#FFB300)]"
                style={{ width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-[#94A3B8] tabular-nums">{Math.round(totalModules > 0 ? (completedModules / totalModules) * 100 : 0)}%</span>
          </div>
          <ChevronDown className={cn("h-5 w-5 text-[#94A3B8] transition-transform shrink-0", isDropdownOpen && "rotate-180")} />
        </button>

        {isDropdownOpen && (
          <div className="fixed inset-x-4 top-24 max-h-[70vh] z-50 flex flex-col md:absolute md:left-0 md:top-full md:inset-x-auto md:w-full md:max-w-sm md:mt-2 md:max-h-none md:flex-none rounded-[20px] border border-white/10 bg-[rgba(18,18,18,0.98)] p-4 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-white text-sm">Full Curriculum</p>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="rounded-lg p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall progress bar */}
            <div className="mb-3 space-y-1">
              <div className="flex justify-between text-xs text-[#94A3B8]">
                <span>Overall progress</span>
                <span className="tabular-nums">{completedModules}/{totalModules}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#FF5722,#FFB300)] transition-all"
                  style={{ width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Admin / Demo Controls or Trainee Lock Progression Info */}
            <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              {hasBypass ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-[#FFB300] animate-pulse" />
                      <span className="text-xs font-bold text-[#FFB300] uppercase tracking-wider">Admin Bypass Active</span>
                    </div>
                    <span className="text-[10px] text-[#64748B]">Bypass active for testing</span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">You have unrestricted access to all modules and simulator scenarios.</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        // Clear all module progress
                        moduleCatalog.forEach((m) => saveTrainingModuleProgress({
                          moduleId: m.id,
                          moduleCompleted: false,
                          audioCompleted: false,
                          quizCompleted: false,
                          simulationCompleted: false,
                          coachingScore: null,
                          coachingNotes: "",
                          quizScore: 0,
                          quizPercentage: 0,
                          updatedAt: new Date().toISOString(),
                        }))
                        refreshProgress()
                        showToast("All progress has been reset successfully!")
                      }}
                      className="flex-1 text-[11px] font-semibold py-1 px-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/20 transition-all text-center"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => {
                        // Mark all modules completed
                        moduleCatalog.forEach((m) => saveTrainingModuleProgress({
                          moduleId: m.id,
                          moduleCompleted: true,
                          audioCompleted: true,
                          quizCompleted: true,
                          simulationCompleted: true,
                          coachingScore: 100,
                          coachingNotes: "Admin Bypass Completed",
                          quizScore: 100,
                          quizPercentage: 100,
                          completedAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }))
                        refreshProgress()
                        showToast("All modules unlocked & marked completed!")
                      }}
                      className="flex-1 text-[11px] font-semibold py-1 px-2 rounded bg-[#FF5722]/20 hover:bg-[#FF5722]/30 text-[#FF5722] border border-[#FF5722]/20 transition-all text-center"
                    >
                      Unlock All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#FFB300] mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white">Trainee Locked Progression</span>
                    <p className="text-[11px] text-[#94A3B8]">Modules unlock sequentially. Complete lessons and pass quizzes to unlock subsequent modules.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1 no-scrollbar space-y-2">
              {Object.entries(groupedModules).map(([dayLabel, modules]) => {
                const isExpanded = expandedDays[dayLabel]
                const dayCompleted = modules.every((m) => moduleProgress[m.id]?.moduleCompleted)
                const dayInProgress = modules.some((m) => m.id === activeModuleId || moduleProgress[m.id]?.audioCompleted)

                return (
                  <div key={dayLabel} className="space-y-0.5">
                    <button
                      onClick={() => toggleDay(dayLabel)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                        )}
                        <span className={cn(
                          "font-medium text-sm",
                          dayCompleted ? "text-[#94A3B8]" : dayInProgress ? "text-white" : "text-[#CBD5E1]"
                        )}>
                          {dayLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dayCompleted && <CheckCircle2 className="w-4 h-4 text-[#FFB300]" />}
                        <span className="text-xs text-[#64748B] tabular-nums">
                          {modules.filter((m) => moduleProgress[m.id]?.moduleCompleted).length}/{modules.length}
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="pl-6 space-y-0.5 mt-0.5 border-l border-white/10 ml-3">
                        {modules.map((mod) => {
                          const isActive = mod.id === activeModuleId
                          const isCompleted = moduleProgress[mod.id]?.moduleCompleted
                          const hasAudio = moduleProgress[mod.id]?.audioCompleted
                          const isInProgress = !isCompleted && (isActive || hasAudio)
                          const isLocked = !hasBypass && !isCompleted && mod.id !== firstIncompleteModuleId

                          return (
                            <button
                              key={mod.id}
                              onClick={() => {
                                if (isLocked) {
                                  showToast("Please complete the previous module first to unlock this lesson!")
                                  return
                                }
                                handleModuleSelect(mod.id)
                              }}
                              className={cn(
                                "w-full flex items-start gap-2 p-2 rounded-lg text-left text-sm transition-all relative overflow-hidden",
                                isLocked
                                  ? "opacity-50 cursor-not-allowed text-[#64748B]"
                                  : isActive
                                  ? "bg-[rgba(255,87,34,0.1)] border border-[#FF5722]/30 text-white"
                                  : isCompleted
                                  ? "hover:bg-white/5 text-[#94A3B8] hover:text-white"
                                  : "hover:bg-white/5 text-[#CBD5E1]"
                              )}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isLocked ? (
                                  <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className={cn("w-3.5 h-3.5", isActive ? "text-[#FFB300]" : "text-[#FFB300]/70")} />
                                ) : isActive ? (
                                  <PlayCircle className="w-3.5 h-3.5 text-[#FF5722]" />
                                ) : isInProgress ? (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF5722]/60 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF5722]/60" />
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-[#94A3B8]/30" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={cn(
                                  "line-clamp-2 leading-snug block",
                                  isActive ? "font-medium" : ""
                                )}>
                                  {mod.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}
                                </span>
                                {isLocked ? (
                                  <span className="text-xs text-[#64748B]">Locked</span>
                                ) : isInProgress && !isActive ? (
                                  <span className="text-xs text-[#FF5722]/70">In progress</span>
                                ) : isCompleted ? (
                                  <span className="text-xs text-[#FFB300]/60">Completed</span>
                                ) : null}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 relative z-0">
        <GuidedModuleExperience
          key={activeModule.id}
          moduleView={activeModule}
          simulationHref={simulationHref}
          moduleCatalog={playerCatalog}
          onModuleSelect={handleModuleSelect}
        />
      </main>

      {/* Premium Lock Overlay Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-red-500/30 bg-[#121212] px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Lock className="w-4 h-4 text-red-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

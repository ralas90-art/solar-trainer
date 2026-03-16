"use client"

import { useState, useMemo, useEffect } from "react"
import { TrainingModuleView } from "@/lib/training-module-view"
import { GuidedModuleExperience } from "@/components/training-module/guided-module-experience"
import { loadTrainingModuleProgress } from "@/lib/training-module-progress"
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function InteractiveCurriculumClient({ moduleCatalog }: { moduleCatalog: TrainingModuleView[] }) {
  // Group modules by day, excluding the placeholder "Curriculum Module" ones that clutter the UI
  const groupedModules = useMemo(() => {
    const groups: Record<string, TrainingModuleView[]> = {}
    moduleCatalog.forEach((mod) => {
      const day = mod.dayLabel || "General Curriculum"
      if (day === "Curriculum Module") return // Skip the rogue modules
      if (!groups[day]) groups[day] = []
      groups[day].push(mod)
    })
    return groups
  }, [moduleCatalog])

  const [activeModuleId, setActiveModuleId] = useState<string>("")
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [moduleProgress, setModuleProgress] = useState<Record<string, any>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    // Load progress for all modules
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

    // Set initial active module
    const initialId = firstIncompleteId || moduleCatalog[0]?.id || ""
    setActiveModuleId(initialId)

    // Expand the day that contains the active module
    const activeMod = moduleCatalog.find(m => m.id === initialId)
    if (activeMod && activeMod.dayLabel) {
      setExpandedDays(prev => ({ ...prev, [activeMod.dayLabel]: true }))
    }
  }, [moduleCatalog])

  const activeModule = useMemo(() => moduleCatalog.find(m => m.id === activeModuleId), [activeModuleId, moduleCatalog])

  const toggleDay = (day: string) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }))
  }

  if (!moduleCatalog.length || !activeModule) {
    return <div className="p-8 text-center text-[#94A3B8]">Loading curriculum...</div>
  }

  const simulationHref = activeModule.simulationScenarioIds[0]
    ? `/ai-simulator?moduleId=${activeModule.id}&scenarioId=${activeModule.simulationScenarioIds[0]}`
    : `/ai-simulator?moduleId=${activeModule.id}`

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Dropdown for Curriculum Map */}
      <div className="relative z-40">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10 w-full sm:w-auto"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="text-left flex-1 sm:flex-none">
            <p className="font-display font-bold">Curriculum Map</p>
            <p className="text-xs text-[#94A3B8]">Select a day or module to jump to it</p>
          </div>
          <ChevronDown className={cn("h-5 w-5 text-[#94A3B8] transition-transform", isDropdownOpen && "rotate-180")} />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-full max-w-sm rounded-[20px] border border-white/10 bg-[rgba(18,18,18,0.98)] p-4 shadow-2xl backdrop-blur-xl">
            <div className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-3">
              {Object.entries(groupedModules).map(([dayLabel, modules]) => {
                const isExpanded = expandedDays[dayLabel]
                const dayCompleted = modules.every(m => moduleProgress[m.id]?.moduleCompleted)
                
                return (
                  <div key={dayLabel} className="space-y-1">
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
                          dayCompleted ? "text-[#94A3B8]" : "text-white"
                        )}>
                          {dayLabel}
                        </span>
                      </div>
                      {dayCompleted && <CheckCircle2 className="w-4 h-4 text-[#FFB300]" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-3">
                        {modules.map(mod => {
                          const isActive = mod.id === activeModuleId
                          const isCompleted = moduleProgress[mod.id]?.moduleCompleted
                          
                          return (
                            <button
                              key={mod.id}
                              onClick={() => {
                                setActiveModuleId(mod.id)
                                setIsDropdownOpen(false)
                              }}
                              className={cn(
                                "w-full flex items-start gap-2 p-2 rounded-lg text-left text-sm transition-all",
                                isActive
                                  ? "bg-[rgba(255,87,34,0.1)] border border-[#FF5722]/30 text-white"
                                  : "hover:bg-white/5 text-[#94A3B8]"
                              )}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className={cn("w-3.5 h-3.5", isActive ? "text-[#FFB300]" : "text-[#FFB300]/60")} />
                                ) : isActive ? (
                                  <PlayCircle className="w-3.5 h-3.5 text-[#FF5722]" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-[#94A3B8]/40" />
                                )}
                              </div>
                              <span className={cn(
                                "line-clamp-2 leading-snug",
                                isActive ? "font-medium" : ""
                              )}>
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
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 relative z-0">
        <GuidedModuleExperience 
            key={activeModule.id} 
            moduleView={activeModule} 
            simulationHref={simulationHref} 
        />
      </main>
    </div>
  )
}

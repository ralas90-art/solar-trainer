"use client"

import { useState, useMemo, useCallback } from "react"
import { TrainingModuleView } from "@/lib/training-module-view"
import { TrainingModuleProgress } from "@/lib/training-module-progress"
import { ModuleCard } from "./module-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"
import { useAnalytics } from "@/lib/analytics"
import { useAuth } from "@/context/AuthContext"
import { WHITE_LABEL } from "@/lib/white-label.config"
import { cn } from "@/lib/utils"
import { Search, Filter, BookOpen, Layers, Unlock, Lock } from "lucide-react"

interface CurriculumLibraryProps {
  moduleCatalog: TrainingModuleView[]
  moduleProgress: Record<string, TrainingModuleProgress | null>
  isLoading?: boolean
}

export function CurriculumLibrary({ moduleCatalog, moduleProgress, isLoading = false }: CurriculumLibraryProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { trackFilterUsed, trackSearchUsed } = useAnalytics()
  const [searchQuery, setSearchQuery] = useState("")
  const [dayFilter, setDayFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const adminUnlockKey = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_admin_unlock_dev`
  const [adminUnlock, setAdminUnlock] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(adminUnlockKey) === 'true'
    }
    return false
  })

  // Handle Admin Unlock persistence
  const toggleAdminUnlock = useCallback(() => {
    const newValue = !adminUnlock
    setAdminUnlock(newValue)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(adminUnlockKey, String(newValue))
    }
  }, [adminUnlock])

  // Group modules by day for rendering
  const groupedModules = useMemo(() => {
    if (isLoading) return {}

    const groups: Record<string, TrainingModuleView[]> = {}
    
    // Sort modules by moduleNumber first to ensure linear progression check is accurate
    const sortedCatalog = [...moduleCatalog].sort((a, b) => 
      a.moduleNumber.localeCompare(b.moduleNumber, undefined, { numeric: true })
    )

    // Calculate locking and status
    let lastCompleted = true
    const modulesWithStatus = sortedCatalog.map((mod, index) => {
      const p = moduleProgress[mod.id]
      const isCompleted = p?.moduleCompleted ?? false
      
      // Admin unlock logic: 
      // 1. Only works if explicitly enabled
      // 2. Purely for navigation/UI (isLocked = false)
      // 3. DOES NOT change isCompleted or counts towards real progress
      const isLocked = adminUnlock ? false : (!lastCompleted && index > 0)
      
      const res = { 
        ...mod, 
        isLocked,
        isCompleted,
        isInProgress: !isCompleted && !isLocked && (p?.audioCompleted || p?.quizCompleted || p?.simulationCompleted)
      }
      
      // Update lastCompleted for the next module in line
      // Note: Admin unlock DOES NOT update this, ensuring sequential logic remains "real"
      if (!isCompleted) lastCompleted = false
      
      return res
    })

    // Filter
    const filtered = modulesWithStatus.filter(mod => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === "" || 
                           mod.title.toLowerCase().includes(searchLower) || 
                           mod.lessonOverview.toLowerCase().includes(searchLower)
      
      const matchesDay = dayFilter === "all" || mod.dayLabel.includes(dayFilter)
      
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "completed" && mod.isCompleted) ||
                           (statusFilter === "in-progress" && mod.isInProgress) ||
                           (statusFilter === "locked" && mod.isLocked) ||
                           (statusFilter === "available" && !mod.isLocked && !mod.isCompleted)

      const matchesType = typeFilter === "all" ||
                         (typeFilter === "roleplay" && mod.simulationScenarioIds.length > 0) ||
                         (typeFilter === "quiz" && mod.knowledgeChecks.length > 0) ||
                         (typeFilter === "workbook" && mod.workbookPrompts.length > 0)

      return matchesSearch && matchesDay && matchesStatus && matchesType
    })

    // Group by day
    filtered.forEach(mod => {
      const day = mod.dayLabel || "General"
      if (!groups[day]) groups[day] = []
      groups[day].push(mod)
    })

    return groups
  }, [moduleCatalog, moduleProgress, searchQuery, dayFilter, statusFilter, typeFilter, isLoading, adminUnlock])

  const days = useMemo(() => {
    const d = new Set<string>()
    moduleCatalog.forEach(m => d.add(m.dayLabel.split(":")[0].trim()))
    return Array.from(d).sort()
  }, [moduleCatalog])

  const clearFilters = () => {
    setSearchQuery("")
    setDayFilter("all")
    setStatusFilter("all")
    setTypeFilter("all")
  }

  const showAdminToggle = user?.role === 'admin' && process.env.NODE_ENV !== 'production'

  return (
    <div className="space-y-8">
      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder={t("search_modules", { en: "Search modules, titles, or concepts...", es: "Buscar módulos, títulos o conceptos..." })}
            className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl text-sm focus:ring-[#FF5722] transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              trackSearchUsed(e.target.value)
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <Select value={dayFilter} onValueChange={(v) => {
            setDayFilter(v)
            trackFilterUsed('day', v)
          }}>
            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-xs w-full sm:w-[140px]">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#FF5722]" />
                <SelectValue placeholder="Day" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">{t("all_days", { en: "All Days", es: "Todos los Días" })}</SelectItem>
              {days.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => {
            setStatusFilter(v)
            trackFilterUsed('status', v)
          }}>
            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-xs w-full sm:w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#FF5722]" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">{t("all_statuses", { en: "All Statuses", es: "Todos los Estados" })}</SelectItem>
              <SelectItem value="completed">{t("completed", { en: "Completed", es: "Completados" })}</SelectItem>
              <SelectItem value="in-progress">{t("in_progress", { en: "In Progress", es: "En Progreso" })}</SelectItem>
              <SelectItem value="locked">{t("locked", { en: "Locked", es: "Bloqueados" })}</SelectItem>
              <SelectItem value="available">{t("available", { en: "Available", es: "Disponibles" })}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(v) => {
            setTypeFilter(v)
            trackFilterUsed('type', v)
          }}>
            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-xs w-full sm:w-[140px]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#FF5722]" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">{t("all_types", { en: "All Types", es: "Todos los Tipos" })}</SelectItem>
              <SelectItem value="roleplay">{t("roleplay", { en: "Roleplay", es: "Roleplay" })}</SelectItem>
              <SelectItem value="quiz">{t("quiz", { en: "Quiz", es: "Quiz" })}</SelectItem>
              <SelectItem value="workbook">{t("workbook", { en: "Workbook", es: "Libro de Trabajo" })}</SelectItem>
            </SelectContent>
          </Select>

          {showAdminToggle && (
            <button
              onClick={toggleAdminUnlock}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold",
                adminUnlock 
                  ? "bg-[#FF5722]/10 border-[#FF5722]/50 text-[#FF5722]" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              )}
            >
              {adminUnlock ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {adminUnlock ? "DEV UNLOCK: ON" : "DEV UNLOCK: OFF"}
            </button>
          )}
        </div>
      </div>

      {/* Library Grid */}
      <div className="space-y-12">
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-[300px] rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.entries(groupedModules).length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-slate-500">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-slate-400 font-medium">
              {t("no_results", { en: "No modules match your current filters.", es: "No hay módulos que coincidan con tus filtros." })}
            </p>
            <button 
              onClick={clearFilters}
              className="text-[#FF5722] text-sm font-bold hover:underline"
            >
              {t("clear_filters", { en: "Clear all filters", es: "Limpiar todos los filtros" })}
            </button>
          </div>
        ) : (
          Object.entries(groupedModules).map(([dayLabel, modules]) => (
            <section key={dayLabel} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-display font-black text-white uppercase tracking-tight italic">
                  {dayLabel}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {modules.map((mod) => (
                  <ModuleCard 
                    key={mod.id} 
                    module={mod} 
                    progress={moduleProgress[mod.id]} 
                    isLocked={(mod as any).isLocked}
                    lockReason={(mod as any).isLocked ? t("lock_linear", { en: "Complete previous modules to unlock", es: "Completa los módulos anteriores para desbloquear" }) : undefined}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

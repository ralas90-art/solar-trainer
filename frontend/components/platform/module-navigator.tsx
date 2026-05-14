"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight, BookOpen, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { getTrainingModuleCatalog, TrainingModuleView } from "@/lib/training-module-view"
import { cn } from "@/lib/utils"

export function ModuleNavigator() {
  const { locale, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [modules, setModules] = useState<TrainingModuleView[]>([])

  useEffect(() => {
    setModules(getTrainingModuleCatalog(locale))
  }, [locale])

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.moduleNumber.includes(searchQuery) ||
    m.dayLabel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group by day label
  const groupedModules = filteredModules.reduce((acc, m) => {
    if (!acc[m.dayLabel]) acc[m.dayLabel] = []
    acc[m.dayLabel].push(m)
    return acc
  }, {} as Record<string, TrainingModuleView[]>)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-medium text-[#CBD5E1] transition-all hover:border-[#FF5722]/40 hover:bg-white/10 active:scale-95"
      >
        <BookOpen className="h-4 w-4 text-[#FF5722]" />
        <span className="hidden sm:inline">{t("nav_modules", { en: "Browse Modules", es: "Ver Módulos" })}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[60] w-[320px] sm:w-[400px] max-h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-[#1A1A1A] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t("search_modules", { en: "Find a lesson...", es: "Buscar lección..." })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#FF5722]/50"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-2 custom-scrollbar">
              {Object.entries(groupedModules).length > 0 ? (
                Object.entries(groupedModules).map(([day, dayModules]) => (
                  <div key={day} className="mb-4 last:mb-0">
                    <p className="px-3 py-2 text-[10px] font-hud uppercase tracking-[0.2em] text-[#64748B]">
                      {day}
                    </p>
                    <div className="space-y-1">
                      {dayModules.map((module) => (
                        <Link
                          key={module.id}
                          href={`/my-training/${module.id}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/5 group-hover:border-[#FF5722]/30 transition-colors">
                            <span className="text-xs font-black text-[#FF5722]">{module.moduleNumber}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF5722] transition-colors">
                              {module.title.split(":").pop()?.trim()}
                            </h4>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                                <Clock className="h-3 w-3" /> {module.estimatedTime}
                              </span>
                              <span className="text-[10px] text-[#64748B] uppercase tracking-wider">{module.moduleTag}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#64748B] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-[#1E1E1E] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">
                    {t("no_results", { en: "No modules found matching your search.", es: "No se encontraron módulos." })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

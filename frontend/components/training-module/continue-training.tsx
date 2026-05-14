"use client"

import { useMemo, useEffect } from "react"
import { TrainingModuleView } from "@/lib/training-module-view"
import { TrainingModuleProgress, getRecommendedModule } from "@/lib/training-module-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/context/language-context"
import { useAnalytics } from "@/lib/analytics"
import { ArrowRight, Play, RefreshCcw, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ContinueTrainingProps {
  moduleCatalog: TrainingModuleView[]
  moduleProgress: Record<string, TrainingModuleProgress | null>
  isLoading?: boolean
}

export function ContinueTraining({ moduleCatalog, moduleProgress, isLoading = false }: ContinueTrainingProps) {
  const { t } = useLanguage()
  const { trackModuleResumed, trackModuleStarted } = useAnalytics()

  const stats = useMemo(() => {
    if (!moduleCatalog.length) return null

    const total = moduleCatalog.length
    const completedModules = moduleCatalog.filter(m => moduleProgress[m.id]?.moduleCompleted)
    const completedCount = completedModules.length
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0
    
    const activeModule = getRecommendedModule(moduleCatalog, moduleProgress)
    const isFinished = completedCount === total && total > 0
    
    const p = activeModule ? moduleProgress[activeModule.id] : null
    const isInProgress = !!(p && !p.moduleCompleted && (p.audioCompleted || p.quizCompleted || p.simulationCompleted))

    return {
      total,
      completedCount,
      percent,
      activeModule,
      isFinished,
      isInProgress
    }
  }, [moduleCatalog, moduleProgress])

  if (isLoading || !stats) {
    return (
      <Card className="overflow-hidden border-white/5 bg-[#1A1A1A] relative shadow-2xl">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full max-w-2xl">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex items-center gap-6 pt-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <Skeleton className="h-14 w-48 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  const { activeModule, percent, completedCount, total, isFinished, isInProgress } = stats

  const handleCTAClick = () => {
    if (!activeModule) return
    
    if (isInProgress) {
      trackModuleResumed(activeModule.id, activeModule.title)
    } else if (!isFinished) {
      trackModuleStarted(activeModule.id, activeModule.title)
    }
  }

  if (isFinished) {
    const recommendedModule = moduleCatalog[0]
    
    return (
      <Card className="overflow-hidden border-white/5 bg-[#1A1A1A] relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB300] to-[#FF5722]" />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-[#FFB300]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-hud text-[10px] uppercase tracking-[0.2em] font-black">
                {t("curriculum_complete", { en: "Curriculum Mastery Achieved", es: "Maestría del Currículo Alcanzada" })}
              </span>
            </div>
            <h2 className="text-3xl font-display font-black text-white">
              {t("review_title", { en: "You've completed the core path!", es: "¡Has completado el camino principal!" })}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("review_desc", { 
                en: "Excellent work. You've cleared all modules. We recommend revisiting core drills to maintain peak performance or exploring new AI simulations.", 
                es: "Excelente trabajo. Has superado todos los módulos. Recomendamos revisar los ejercicios principales para mantener un rendimiento máximo o explorar nuevas simulaciones de IA." 
              })}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 max-w-[200px]">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-hud uppercase tracking-wider">
                  <span>{t("overall_mastery", { en: "Overall Mastery", es: "Maestría General" })}</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-1.5 bg-white/5" />
              </div>
            </div>
          </div>
          <Link href={`/my-training/${recommendedModule?.id || ""}`} onClick={() => recommendedModule && trackModuleStarted(recommendedModule.id, recommendedModule.title)}>
            <Button size="lg" className="btn-primary h-14 px-8 rounded-xl flex items-center gap-2 group whitespace-nowrap">
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              {t("review_cta", { en: "Review Training", es: "Revisar Entrenamiento" })}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const isStarted = completedCount > 0 || isInProgress

  return (
    <Card className="overflow-hidden border-white/5 bg-[#1A1A1A] relative shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5722] to-[#FFB300]" />
      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 text-[#FF5722]">
            <Play className="w-4 h-4" />
            <span className="font-hud text-[10px] uppercase tracking-[0.2em] font-black">
              {isInProgress 
                ? t("resume_tag", { en: "Resume Module", es: "Reanudar Módulo" })
                : isStarted
                  ? t("continue_tag", { en: "Next Module", es: "Siguiente Módulo" })
                  : t("start_tag", { en: "Initialize Path", es: "Iniciar Camino" })
              }
            </span>
          </div>
          <h2 className="text-3xl font-display font-black text-white">
            {activeModule?.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "") || "Welcome to Training"}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {activeModule?.dayLabel} · {activeModule?.estimatedTime}
            <br />
            {t("continue_desc", { 
              en: "Pick up precisely where you left off. Your progress is saved automatically.", 
              es: "Retoma exactamente donde lo dejaste. Tu progreso se guarda automáticamente." 
            })}
          </p>
          <div className="flex items-center gap-6 pt-2">
            <div className="flex-1 max-w-[200px]">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-hud uppercase tracking-wider">
                <span>{t("curriculum_progress", { en: "Progress", es: "Progreso" })}</span>
                <span>{percent}%</span>
              </div>
              <Progress value={percent} className="h-1.5 bg-white/5" />
            </div>
            <div className="text-xs text-slate-500 font-hud uppercase tracking-wider">
              {completedCount} / {total} {t("modules", { en: "Modules", es: "Módulos" })}
            </div>
          </div>
        </div>
        <Link href={`/my-training/${activeModule?.id || ""}`} onClick={handleCTAClick}>
          <Button size="lg" className="btn-primary h-14 px-8 rounded-xl flex items-center gap-2 group whitespace-nowrap">
            {isInProgress
              ? t("resume_cta", { en: "Resume Training", es: "Reanudar Entrenamiento" })
              : isStarted
                ? t("next_cta", { en: "Start Next Module", es: "Iniciar Siguiente Módulo" })
                : t("start_cta", { en: "Start Training", es: "Iniciar Entrenamiento" })
            }
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

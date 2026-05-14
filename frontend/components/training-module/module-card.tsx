"use client"

import { TrainingModuleView } from "@/lib/training-module-view"
import { TrainingModuleProgress } from "@/lib/training-module-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { 
  BookOpen, 
  Mic, 
  CheckSquare, 
  PenTool, 
  Clock, 
  Lock, 
  CheckCircle2, 
  CircleDot,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ModuleCardProps {
  module: TrainingModuleView
  progress: TrainingModuleProgress | null
  isLocked: boolean
  lockReason?: string
}

export function ModuleCard({ module, progress, isLocked, lockReason }: ModuleCardProps) {
  const { t } = useLanguage()

  const isCompleted = progress?.moduleCompleted ?? false
  const isInProgress = !isCompleted && !isLocked && (progress?.audioCompleted || progress?.quizCompleted || progress?.simulationCompleted)
  
  const status = isLocked ? "locked" : isCompleted ? "completed" : isInProgress ? "in-progress" : "start"

  // Helper to check if a content type exists in this module
  const hasType = {
    lesson: true, // All have lesson content
    roleplay: module.simulationScenarioIds.length > 0,
    quiz: module.knowledgeChecks.length > 0,
    workbook: module.workbookPrompts.length > 0
  }

  return (
    <Card className={cn(
      "group relative flex flex-col border-white/5 bg-white/5 transition-all duration-300",
      isLocked ? "opacity-60" : "hover:bg-white/[0.08] hover:border-white/10"
    )}>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header: Status & Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {status === "completed" && (
              <Badge className="bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/20 gap-1.5 py-1 px-3">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-wider">{t("completed", { en: "Completed", es: "Completado" })}</span>
              </Badge>
            )}
            {status === "in-progress" && (
              <Badge className="bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20 gap-1.5 py-1 px-3">
                <CircleDot className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">{t("in_progress", { en: "In Progress", es: "En Progreso" })}</span>
              </Badge>
            )}
            {status === "locked" && (
              <Badge className="bg-slate-800 text-slate-400 border-white/5 gap-1.5 py-1 px-3">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-wider">{t("locked", { en: "Locked", es: "Bloqueado" })}</span>
              </Badge>
            )}
          </div>
          
          {isCompleted && progress && progress.coachingScore !== null && (
            <div className="flex items-center gap-1 text-[#FFB300] font-hud text-xs">
              <Trophy className="w-3 h-3" />
              <span>{progress.coachingScore}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className={cn(
            "font-display font-bold text-lg leading-tight group-hover:text-[#FF5722] transition-colors",
            isLocked ? "text-slate-500" : "text-white"
          )}>
            {module.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")}
          </h3>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {module.lessonOverview}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {hasType.lesson && <div title="Lesson" className="p-1.5 rounded-md bg-white/5 text-slate-400"><BookOpen className="w-3 h-3" /></div>}
                {hasType.roleplay && <div title="Roleplay" className="p-1.5 rounded-md bg-white/5 text-slate-400 border-l border-[#121212]"><Mic className="w-3 h-3" /></div>}
                {hasType.quiz && <div title="Quiz" className="p-1.5 rounded-md bg-white/5 text-slate-400 border-l border-[#121212]"><CheckSquare className="w-3 h-3" /></div>}
                {hasType.workbook && <div title="Workbook" className="p-1.5 rounded-md bg-white/5 text-slate-400 border-l border-[#121212]"><PenTool className="w-3 h-3" /></div>}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-hud uppercase">
                <Clock className="w-3 h-3" />
                <span>{module.estimatedTime}</span>
              </div>
            </div>
          </div>

          {isLocked ? (
            <div className="text-[10px] text-slate-600 font-medium italic">
              {lockReason || t("lock_generic", { en: "Unlock by completing previous modules", es: "Desbloquea completando los módulos anteriores" })}
            </div>
          ) : (
            <Link href={`/my-training/${module.id}`}>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full h-11 rounded-xl border-white/10 text-sm font-bold transition-all group-hover:border-[#FF5722]/50 group-hover:bg-[#FF5722]/5",
                  status === "completed" ? "text-slate-400" : "text-white"
                )}
              >
                {status === "completed" ? t("review", { en: "Review", es: "Revisar" }) : 
                 status === "in-progress" ? t("continue", { en: "Continue", es: "Continuar" }) : 
                 t("start", { en: "Start", es: "Iniciar" })}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

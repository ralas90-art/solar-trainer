"use client"

import { useMemo } from "react"
import { TrainingModuleView } from "@/lib/training-module-view"
import { TrainingModuleProgress, getRecommendedModule } from "@/lib/training-module-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { ArrowRight, BookOpen, RotateCcw, Target } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnalyticsSnapshot } from "@/lib/analytics-api"

interface RecommendationsProps {
  moduleCatalog: TrainingModuleView[]
  moduleProgress: Record<string, TrainingModuleProgress | null>
  analytics?: AnalyticsSnapshot | null
}

export function Recommendations({ moduleCatalog, moduleProgress, analytics }: RecommendationsProps) {
  const { t } = useLanguage()

  const suggestions = useMemo(() => {
    const active = getRecommendedModule(moduleCatalog, moduleProgress)
    const completed = moduleCatalog.filter(m => moduleProgress[m.id]?.moduleCompleted)
    
    const list: any[] = []

    // 1. Primary: Continue Current or Start Next (Curriculum Path)
    if (active) {
      const isStarted = !!(moduleProgress[active.id] && !moduleProgress[active.id]?.moduleCompleted)
      list.push({
        type: 'primary',
        module: active,
        title: isStarted ? t("rec_resume", { en: "Resume Active Path", es: "Reanudar Camino Activo" }) : t("rec_next", { en: "Next Step in Curriculum", es: "Siguiente Paso del Currículo" }),
        icon: <Target className="w-5 h-5 text-[#FF5722]" />,
        desc: active.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")
      })
    }

    // 2. Intelligent: Skill Gap Practice (Based on Analytics)
    if (analytics) {
      // Find weakest skill
      const weakest = Object.entries(analytics.skills)
        .sort(([, a], [, b]) => a.score - b.score)[0]
      
      if (weakest) {
        const skillName = weakest[0]
        // Find a module that addresses this skill and isn't completed yet
        // For now, we'll map skill names to keywords in module titles
        const skillModule = moduleCatalog.find(m => 
          !moduleProgress[m.id]?.moduleCompleted && 
          m.title.toLowerCase().includes(skillName.toLowerCase()) &&
          m.id !== active?.id
        )

        if (skillModule) {
          list.push({
            type: 'skill-gap',
            module: skillModule,
            title: t("rec_skill_gap", { en: "Focus Drill: " + skillName.charAt(0).toUpperCase() + skillName.slice(1), es: "Práctica de Enfoque: " + skillName }),
            icon: <Target className="w-5 h-5 text-purple-400" />,
            desc: skillModule.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")
          })
        }
      }
    }

    // 3. Sequential: Upcoming Skills (Fallback if no skill gap found)
    if (list.length < 3) {
      const nextSequential = moduleCatalog.find(m => 
        !moduleProgress[m.id]?.moduleCompleted && 
        !list.some(s => s.module.id === m.id)
      )
      if (nextSequential) {
        list.push({
          type: 'secondary',
          module: nextSequential,
          title: t("rec_sequential", { en: "Upcoming Skills", es: "Habilidades Próximas" }),
          icon: <BookOpen className="w-5 h-5 text-blue-400" />,
          desc: nextSequential.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")
        })
      }
    }

    // 4. Review: A completed module (preferably core or high difficulty)
    const reviewModule = completed.length > 0 ? completed[0] : null
    if (reviewModule && list.length < 3) {
      list.push({
        type: 'review',
        module: reviewModule,
        title: t("rec_review", { en: "Mastery Review", es: "Revisión de Maestría" }),
        icon: <RotateCcw className="w-5 h-5 text-[#FFB300]" />,
        desc: reviewModule.title.replace(/^Module\s+\d+(\.\d+)?:\s*/i, "")
      })
    }

    return list.slice(0, 3)
  }, [moduleCatalog, moduleProgress, analytics, t])

  if (!suggestions.length) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight italic">
          {t("recommended_for_you", { en: "Personalized Recommendations", es: "Recomendaciones Personalizadas" })}
        </h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-hud">
          {t("rec_subtext", { en: "Deterministic insights based on your progress", es: "Perspectivas deterministas basadas en tu progreso" })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((s, idx) => (
          <Card key={`${s.module.id}-${idx}`} className="group border-white/5 bg-[#1A1A1A] hover:bg-[#222] transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-hud uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-slate-400 transition-colors">
                    {s.title}
                  </span>
                </div>
                <h4 className="text-sm font-display font-bold text-white line-clamp-2 leading-snug">
                  {s.desc}
                </h4>
              </div>
              
              <Link href={`/my-training/${s.module.id}`}>
                <Button variant="ghost" className="w-full justify-between h-10 text-xs text-[#FF5722] hover:text-[#FFB300] hover:bg-white/5 p-0 group/btn">
                  <span>{t("jump_in", { en: "Jump In", es: "Entrar" })}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

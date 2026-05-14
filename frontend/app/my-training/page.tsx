"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/platform/app-shell"
import { WHITE_LABEL } from "@/lib/white-label.config"
import { getTrainingModuleCatalog, TrainingModuleView } from "@/lib/training-module-view"
import { loadTrainingModuleProgress, TrainingModuleProgress } from "@/lib/training-module-progress"
import { loadUserGamification, UserGamification } from "@/lib/gamification-core"
import { ContinueTraining } from "@/components/training-module/continue-training"
import { CurriculumLibrary } from "@/components/training-module/curriculum-library"
import { GamificationBar } from "@/components/training-module/gamification-bar"
import { Recommendations } from "@/components/training-module/recommendations"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/AuthContext"
import { fetchAnalyticsSnapshot, AnalyticsSnapshot } from "@/lib/analytics-api"

export default function MyTrainingPage() {
  const { locale, t } = useLanguage()
  const [moduleCatalog, setModuleCatalog] = useState<TrainingModuleView[]>([])
  const [moduleProgress, setModuleProgress] = useState<Record<string, TrainingModuleProgress | null>>({})
  const [gamification, setGamification] = useState<UserGamification | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function init() {
      // Fetch a large limit to see the full curriculum
      const catalog = getTrainingModuleCatalog(locale, 100)
      setModuleCatalog(catalog)

      const progress: Record<string, TrainingModuleProgress | null> = {}
      catalog.forEach(mod => {
        progress[mod.id] = loadTrainingModuleProgress(mod.id)
      })
      setModuleProgress(progress)
      setGamification(loadUserGamification())

      if (user) {
        try {
          const ana = await fetchAnalyticsSnapshot(user.id)
          setAnalytics(ana)
        } catch (e) {
          console.error("Failed to fetch analytics for recommendations", e)
        }
      }
      
      setIsLoading(false)
    }

    init()
  }, [locale, user])

  if (isLoading) {
    return (
      <AppShell heading="Training" subheading="Initializing curriculum path...">
        <div className="flex h-[40vh] items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#FF5722] border-t-transparent rounded-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      heading={t("my_training_heading", { en: "My Training", es: "Mi Entrenamiento" })}
      subheading={t("my_training_subheading", { 
        en: `Browse the full curriculum or continue your specialized ${WHITE_LABEL.industry.toLowerCase()} sales track.`, 
        es: `Explora el currículo completo o continúa tu camino especializado en ventas de ${WHITE_LABEL.industry.toLowerCase()}.` 
      })}
    >
      <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
        {/* TOP: Gamification HUD */}
        {gamification && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <GamificationBar gamification={gamification} />
          </section>
        )}

        {/* MIDDLE: Continue Training & Recommendations */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
          <div className="xl:col-span-2 space-y-10">
            <section>
              <ContinueTraining moduleCatalog={moduleCatalog} moduleProgress={moduleProgress} />
            </section>
            
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <Recommendations moduleCatalog={moduleCatalog} moduleProgress={moduleProgress} analytics={analytics} />
            </section>
          </div>

          <div className="hidden xl:block space-y-6">
            {/* Optional Sidebar info or stats could go here later */}
            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
              <h4 className="text-xs font-hud uppercase tracking-widest text-[#FF5722] font-black">
                {t("training_tip", { en: "Pro Training Tip", es: "Consejo Pro de Entrenamiento" })}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("tip_text", { 
                  en: "Completing daily simulations significantly improves your retention and close rates. Aim for a 5-day streak to unlock advanced modules.", 
                  es: "Completar simulaciones diarias mejora significativamente tu retención y tasas de cierre. Apunta a una racha de 5 días para desbloquear módulos avanzados." 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM: Curriculum Library */}
        <section className="space-y-8 pt-6 border-t border-white/5">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter italic">
              {t("curriculum_library", { en: "Curriculum Library", es: "Biblioteca del Currículo" })}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              {t("curriculum_library_desc", { en: `Master each phase of the ${WHITE_LABEL.industry.toLowerCase()} sales cycle through structured lessons and simulations.`, es: `Domina cada fase del ciclo de ventas de ${WHITE_LABEL.industry.toLowerCase()} a través de lecciones y simulaciones estructuradas.` })}
            </p>
          </div>
          <CurriculumLibrary moduleCatalog={moduleCatalog} moduleProgress={moduleProgress} />
        </section>
      </div>
    </AppShell>
  )
}

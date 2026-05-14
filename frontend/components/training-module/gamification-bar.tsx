"use client"

import { useMemo } from "react"
import { getLevelInfo, getMotivationalMessage, UserGamification } from "@/lib/gamification-core"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Flame, Star } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"
import { WHITE_LABEL } from "@/lib/white-label.config"

interface GamificationBarProps {
  gamification: UserGamification
  className?: string
}

export function GamificationBar({ gamification, className }: GamificationBarProps) {
  const { t, locale } = useLanguage()
  
  const levelInfo = useMemo(() => {
    return getLevelInfo(gamification.totalXp)
  }, [gamification.totalXp])

  const message = useMemo(() => {
    return getMotivationalMessage(levelInfo.level, levelInfo.progress, locale)
  }, [levelInfo.level, levelInfo.progress, locale])

  const awardCount = useMemo(() => {
    return Object.keys(gamification.xpAwards || {}).length
  }, [gamification.xpAwards])

  return (
    <Card className={cn("overflow-hidden border-white/5 bg-[#121212]/80 backdrop-blur-xl shadow-2xl", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LEVEL & XP SECTION */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5722] to-[#FFB300] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black border-2 border-[#FF5722]/30 shadow-inner">
                <div className="text-center">
                  <span className="block text-[10px] font-hud uppercase tracking-tighter text-[#94A3B8] leading-none mb-1">LVL</span>
                  <span className="text-2xl font-display font-black text-white leading-none">{levelInfo.level}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 md:w-64 space-y-2">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#FFB300] fill-[#FFB300]" />
                    {t("xp_rank", { 
                      en: `${WHITE_LABEL.industry} Apprentice`, 
                      es: `Aprendiz de ${WHITE_LABEL.industry}` 
                    })}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-hud uppercase tracking-widest">
                    {gamification.totalXp} / {levelInfo.totalXp + levelInfo.targetXpForNextLevel - levelInfo.currentXpInLevel} XP
                  </p>
                </div>
                <span className="text-[10px] text-[#FFB300] font-hud font-bold">
                  {Math.round(levelInfo.progress)}%
                </span>
              </div>
              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF5722] to-[#FFB300] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,87,34,0.5)]"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* MESSAGE & STATS */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="flex-1 hidden lg:block">
              <p className="text-sm text-slate-400 italic leading-relaxed border-l-2 border-[#FF5722]/20 pl-4">
                "{message}"
              </p>
            </div>

            <div className="flex items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-[#FF5722]/30 transition-colors">
                  <Flame className={cn("w-5 h-5 transition-colors", gamification.currentStreak > 0 ? "text-[#FF5722] fill-[#FF5722]/20" : "text-slate-600")} />
                </div>
                <span className="text-[10px] font-hud uppercase tracking-widest text-slate-500">{t("streak", { en: "Streak", es: "Racha" })}</span>
                <span className="text-lg font-display font-black text-white">{gamification.currentStreak}</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-[#FFB300]/30 transition-colors">
                  <Trophy className="w-5 h-5 text-[#FFB300]" />
                </div>
                <span className="text-[10px] font-hud uppercase tracking-widest text-slate-500">{t("awards", { en: "Awards", es: "Premios" })}</span>
                <span className="text-lg font-display font-black text-white">{awardCount}</span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

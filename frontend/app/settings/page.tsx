"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { useTrainingStreak } from "@/hooks/use-training-streak"
import { cn } from "@/lib/utils"
import { buildScenarioProgressMap, getCompletedCount } from "@/lib/simulation-progress"
import { loadDebriefs } from "@/lib/debrief-storage"
import {
  User, Globe, Bell, Award, BookOpen, Zap, Flame,
  CheckCircle, Lock, ChevronRight, Shield, Star,
  BarChart3, Target, TrendingUp, Volume2
} from "lucide-react"
import { useState, useEffect } from "react"

type ProfileTab = "info" | "progress" | "achievements" | "notifications"

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
const MODULES_PER_DAY = [8, 8, 8, 8, 8, 8, 9]

const ACHIEVEMENTS = [
  { id: "first_sim", icon: Zap, label: "First Simulation", desc: "Completed your first AI role-play", earned: true, color: "text-[#FF5722]" },
  { id: "perfect_score", icon: Star, label: "Perfect Score", desc: "Scored 100% on a simulation", earned: false, color: "text-[#FFB300]" },
  { id: "day1_cert", icon: Award, label: "Day 1 Certified", desc: "Passed the Day 1 certification exam", earned: true, color: "text-[#FFD54F]" },
  { id: "streak_5", icon: Flame, label: "5-Day Streak", desc: "Trained 5 days in a row", earned: false, color: "text-[#F97316]" },
  { id: "bilingual", icon: Globe, label: "Bilingual Operator", desc: "Completed a module in Spanish", earned: false, color: "text-[#94A3B8]" },
  { id: "top_closer", icon: Target, label: "Top Closer", desc: "Scored top 10% on a closing scenario", earned: true, color: "text-[#FF5722]" },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { language, setLanguage, isSpanish } = useLanguage()
  const { streak: canonicalStreak } = useTrainingStreak()
  const [activeTab, setActiveTab] = useState<ProfileTab>("info")
  const [completedSims, setCompletedSims] = useState(0)
  const [avgScore, setAvgScore] = useState(0)
  const [notifSim, setNotifSim] = useState(true)
  const [notifCert, setNotifCert] = useState(true)
  const [notifCoach, setNotifCoach] = useState(false)

  const t = (en: string, es: string) => isSpanish ? es : en

  useEffect(() => {
    const map = buildScenarioProgressMap({})
    setCompletedSims(getCompletedCount(map))
    // Load debriefs async — hits backend API when userId is set, localStorage otherwise
    loadDebriefs(user?.username).then((debriefs) => {
      if (debriefs.length > 0) {
        const avg = debriefs.reduce((s, d) => s + d.score, 0) / debriefs.length
        setAvgScore(Math.round(avg))
      }
    }).catch(() => {})
    try {
      localStorage.setItem("septivolt_settings_visited", "true")
    } catch (e) {}
  }, [user?.username])

  const initials = (user?.username ?? "SO")
    .split(/[\s_-]/).map((w: string) => w[0]?.toUpperCase()).join("").slice(0, 2)

  const TABS: Array<{ id: ProfileTab; label: string; icon: React.ElementType }> = [
    { id: "info", label: t("Personal Info", "Info Personal"), icon: User },
    { id: "progress", label: t("Training Progress", "Progreso"), icon: BookOpen },
    { id: "achievements", label: t("Achievements", "Logros"), icon: Award },
    { id: "notifications", label: t("Notifications", "Notificaciones"), icon: Bell },
  ]

  return (
    <AppShell
      heading={t("My Profile", "Mi Perfil")}
      subheading={t("Account identity, training progress, achievements, and notification preferences.", "Identidad, progreso de capacitación, logros y preferencias de notificación.")}
    >
      <div className="space-y-6 max-w-5xl">

        {/* Identity Card */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFB300] flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.35)]">
                <span className="font-display font-black text-2xl text-white">{initials}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-400 border-2 border-[#1A1A1A] shadow" />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-display font-black text-2xl text-white">{user?.username ?? "SeptivoltOperator"}</h2>
                <span className={cn(
                  "rounded px-2.5 py-0.5 text-[10px] font-hud uppercase tracking-wider font-bold",
                  user?.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                  user?.role === "manager" ? "bg-blue-500/10 text-blue-400 border border-blue-500/25" :
                  "bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/30"
                )}>
                  {user?.role?.toUpperCase() ?? "TRAINEE"}
                </span>
              </div>
              <p className="text-sm text-[#94A3B8]">{user ? `${user.username}@septivolt.com` : "operator@septivolt.com"}</p>

              {/* XP bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-hud text-[10px] uppercase tracking-wider text-[#64748B]">XP Progress — Level 4</span>
                  <span className="font-hud text-[10px] text-[#FF5722]">2,840 / 5,000 XP</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFB300]" style={{ width: "56.8%", boxShadow: "0 0 8px rgba(249,115,22,0.5)" }} />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 rounded-xl border border-[#FF5722]/25 bg-[#FF5722]/5 px-4 py-3 shrink-0">
              <Flame className="h-5 w-5 text-[#FF5722]" />
              <div>
                <p className="font-hud text-[10px] uppercase tracking-wider text-[#64748B]">Streak</p>
                <p className="font-display font-black text-xl text-white">{canonicalStreak} <span className="text-sm font-normal text-[#94A3B8]">days</span></p>
              </div>
            </div>
          </div>

          {/* Stat Row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t("Sims Completed", "Sims"), value: String(completedSims), icon: Zap, color: "text-[#FF5722]" },
              { label: t("Avg Score", "Promedio"), value: avgScore > 0 ? `${avgScore}%` : "—", icon: BarChart3, color: "text-[#FFB300]" },
              { label: t("Certs Earned", "Certs"), value: "2", icon: Award, color: "text-[#FFD54F]" },
              { label: t("Modules Done", "Módulos"), value: "14", icon: BookOpen, color: "text-[#94A3B8]" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-white/5 bg-white/5 p-3 flex items-center gap-3">
                <Icon className={cn("h-5 w-5 shrink-0", color)} />
                <div>
                  <p className={cn("font-hud font-bold text-lg leading-none", color)}>{value}</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 font-hud uppercase tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar + Content */}
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">

          {/* Tab Nav */}
          <div className="flex flex-row lg:flex-col gap-1 rounded-2xl border border-white/5 bg-[#1A1A1A] p-2 h-fit overflow-x-auto lg:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full whitespace-nowrap shrink-0",
                  activeTab === id
                    ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]"
                    : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {activeTab === id && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 min-w-0">

            {/* Personal Info */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-[#FF5722]" /> {t("Personal Information", "Información Personal")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{t("Your account identity and platform preferences.", "Tu identidad de cuenta y preferencias de plataforma.")}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: t("Username", "Usuario"), value: user?.username ?? "SeptivoltOperator", locked: true },
                    { label: t("Email", "Correo"), value: user ? `${user.username}@septivolt.com` : "operator@septivolt.com", locked: true },
                  ].map(({ label, value, locked }) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{label}</label>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#CBD5E1]">
                        {locked && <Lock className="h-3.5 w-3.5 text-[#64748B] shrink-0" />}
                        <span className="truncate">{value}</span>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Assigned Role", "Rol")}</label>
                    <div className={cn(
                      "rounded-xl border px-4 py-3 text-sm font-bold flex items-center gap-2",
                      user?.role === "admin" ? "border-red-500/30 bg-red-500/5 text-red-400" :
                      user?.role === "manager" ? "border-blue-500/30 bg-blue-500/5 text-blue-400" :
                      "border-[#FF5722]/30 bg-[#FF5722]/5 text-[#FF5722]"
                    )}>
                      <Shield className="h-4 w-4" />
                      {user?.role?.toUpperCase() ?? "TRAINEE"}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Training Language", "Idioma")}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["en", "es"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                            language === lang
                              ? "border-[#FF5722] bg-[#FF5722]/10 text-white"
                              : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                          )}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {lang === "en" ? "English" : "Español"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Narration Voice", "Voz")}</label>
                  <select className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50">
                    <option value="tom">Tom — US Professional (Default)</option>
                    <option value="rachel">Rachel — US Energetic Coach</option>
                    <option value="dom">Dom — US Senior Executive</option>
                  </select>
                </div>
                <button className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  {t("Save Preferences", "Guardar Preferencias")}
                </button>
              </div>
            )}

            {/* Training Progress */}
            {activeTab === "progress" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#FF5722]" /> {t("Training Progress", "Progreso de Capacitación")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{t("Your 7-day curriculum completion by day.", "Progreso del currículo de 7 días por día.")}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-3">
                  {DAYS.map((day, i) => {
                    const total = MODULES_PER_DAY[i]
                    const done = i === 0 ? 5 : i === 1 ? 2 : 0 // placeholder counts
                    const pct = Math.round((done / total) * 100)
                    return (
                      <div key={day} className="rounded-xl border border-white/5 bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-white">{day}</span>
                          <span className="font-hud text-xs text-[#64748B]">{done}/{total} modules</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-green-400" : pct > 0 ? "bg-gradient-to-r from-[#FF5722] to-[#FFB300]" : "bg-white/10")}
                            style={{ width: `${Math.max(pct, 0)}%` }}
                          />
                        </div>
                        <div className="mt-1.5 text-right">
                          <span className={cn("font-hud text-[10px] font-bold", pct === 100 ? "text-green-400" : pct > 0 ? "text-[#FF5722]" : "text-[#64748B]")}>
                            {pct === 100 ? "✓ COMPLETE" : pct > 0 ? `${pct}% IN PROGRESS` : "NOT STARTED"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Achievements */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#FFB300]" /> {t("Achievements", "Logros")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{t("Earned badges and upcoming milestones.", "Insignias ganadas y próximos hitos.")}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {ACHIEVEMENTS.map(({ id, icon: Icon, label, desc, earned, color }) => (
                    <div key={id} className={cn(
                      "rounded-xl border p-4 flex items-start gap-3 transition-all",
                      earned
                        ? "border-white/10 bg-white/5"
                        : "border-white/5 bg-white/[0.02] opacity-50"
                    )}>
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        earned ? "bg-white/10" : "bg-white/5"
                      )}>
                        {earned ? <Icon className={cn("h-5 w-5", color)} /> : <Lock className="h-5 w-5 text-[#64748B]" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">{label}</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{desc}</p>
                        {earned && <span className="mt-1.5 inline-block badge-primary">Earned</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#FF5722]" /> {t("Notification Preferences", "Preferencias de Notificación")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{t("Control what activity triggers platform alerts.", "Controla qué actividad genera alertas.")}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-3">
                  {[
                    { label: t("Simulation completed", "Simulación completada"), sub: t("Get notified when a sim run is scored", "Notificar al terminar una simulación"), val: notifSim, set: setNotifSim },
                    { label: t("Certification updates", "Actualizaciones de certificación"), sub: t("Alerts for new certs earned or expiring", "Alertas para certs nuevas o por vencer"), val: notifCert, set: setNotifCert },
                    { label: t("AI coaching report ready", "Reporte de coaching listo"), sub: t("When a new debrief report is available", "Cuando hay un nuevo reporte de debrief"), val: notifCoach, set: setNotifCoach },
                  ].map(({ label, sub, val, set }) => (
                    <div key={label} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-white">{label}</p>
                        <p className="text-xs text-[#94A3B8]">{sub}</p>
                      </div>
                      <button
                        onClick={() => set(!val)}
                        className={cn("w-12 h-6 rounded-full p-1 transition-colors duration-200 shrink-0", val ? "bg-[#FF5722]" : "bg-white/10")}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm", val ? "translate-x-6" : "translate-x-0")} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/5 p-4 text-xs text-[#94A3B8]">
                  <p className="font-hud font-bold text-[#FFB300] uppercase tracking-wider text-[10px] mb-1">Note</p>
                  Push notifications require backend integration. Email delivery is managed by your workspace administrator.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

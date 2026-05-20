"use client"

import { AppShell } from "@/components/platform/app-shell"
import {
  LeaderboardListItem,
  ModuleCard,
  NotificationPill,
  ProgressCard,
  ScoreDisplayCard,
  SectionEyebrow,
  SkillProgressRow,
  StatCard,
  WidgetCard,
} from "@/components/platform/dashboard-widgets"
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Flame,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  X,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getDashboardStats, DashboardStats } from "@/lib/dashboard-data"

import { api } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { SCENARIO_TO_MODULE } from "@/lib/modules"
import { cn } from "@/lib/utils"

const onboardingTasks = [
  {
    key: "assessment" as const,
    titleEn: "Profile Assessment",
    titleEs: "Evaluación de Perfil",
    descEn: "Complete your diagnostic profile assessment.",
    descEs: "Complete su evaluación diagnóstica de perfil.",
    link: "/solar-sales-training-assessment",
  },
  {
    key: "roleplay" as const,
    titleEn: "First Simulation",
    titleEs: "Primera Simulación",
    descEn: "Complete your first AI roleplay scenario.",
    descEs: "Complete su primer escenario de juego de rol con IA.",
    link: "/ai-simulator",
  },
  {
    key: "leaderboard" as const,
    titleEn: "View Leaderboards",
    titleEs: "Ver Clasificaciones",
    descEn: "Explore team performance and closers pacing.",
    descEs: "Explore el rendimiento del equipo y el ritmo de cierres.",
    link: "/leaderboards",
  },
  {
    key: "analytics" as const,
    titleEn: "Explore Analytics",
    titleEs: "Explorar Analíticas",
    descEn: "Review your detailed skill and objection feedback.",
    descEs: "Revise su desglose de habilidades y objeciones.",
    link: "/analytics",
  },
  {
    key: "settings" as const,
    titleEn: "Configure Settings",
    titleEs: "Configurar Ajustes",
    descEn: "Customize narration voices and simulation rules.",
    descEs: "Personalice voces de narración y reglas de simulación.",
    link: "/dashboard/settings",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { isSpanish } = useLanguage()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isDismissed, setIsDismissed] = useState(false)
  const [taskStates, setTaskStates] = useState({
    assessment: false,
    roleplay: false,
    leaderboard: false,
    analytics: false,
    settings: false,
  })

  // Enterprise launch checklist states
  const [readiness, setReadiness] = useState<any | null>(null)
  const [isAdminDismissed, setIsAdminDismissed] = useState(false)
  const [loadingReadiness, setLoadingReadiness] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const t = (en: string, es: string) => isSpanish ? es : en

  const isAdmin = user?.role === "admin"
  const isManager = user?.role === "manager"
  const hasAdminAccess = isAdmin || isManager

  // Load admin checklist dismiss state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("septivolt_admin_launch_dismissed") === "true"
      setIsAdminDismissed(dismissed)
    }
  }, [])

  // Fetch company launch readiness
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "manager")) return
    
    async function fetchReadiness() {
      if (!user) return
      try {
        setLoadingReadiness(true)
        const companyId = user.companyId || "cresca_test"
        const data = await api.get<any>(`/api/v1/companies/${companyId}/readiness`, {
          headers: { "X-User-Id": user.username }
        })
        setReadiness(data)
      } catch (err) {
        console.error("Failed to fetch launch readiness score:", err)
      } finally {
        setLoadingReadiness(false)
      }
    }
    
    fetchReadiness()
  }, [user])

  // Open Welcome Modal if setup is not completed and welcome modal not dismissed
  useEffect(() => {
    if (hasAdminAccess && readiness && readiness.setup_completed === false && readiness.setup_dismissed === false) {
      const localDismissed = localStorage.getItem(`welcome_dismissed_${user?.companyId}`) === "true"
      if (!localDismissed) {
        setShowWelcomeModal(true)
      }
    }
  }, [readiness, hasAdminAccess, user?.companyId])

  const handleDismissWelcomeModal = async () => {
    setShowWelcomeModal(false)
    try {
      localStorage.setItem(`welcome_dismissed_${user?.companyId}`, "true")
      const companyId = user?.companyId || "cresca_test"
      await api.post(`/api/v1/companies/${companyId}/setup`, {
        setup_dismissed: true
      }, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setReadiness((prev: any) => prev ? { ...prev, setup_dismissed: true } : null)
    } catch (e) {
      console.error("Failed to dismiss welcome modal:", e)
    }
  }

  useEffect(() => {
    const username = user?.username
    if (!username) {
      // Unauthenticated / demo fallback: read from localStorage
      _loadOnboardingFromLocal()
      return
    }
    // Try backend first, fall back to localStorage on error
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(username)}/onboarding`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tasks) {
          const tasks = data.tasks as Record<string, boolean>
          // Merge with localStorage visit signals (parens required when mixing ?? with ||)
          const hasAssessment = tasks.assessment ?? (
            localStorage.getItem("septivolt_assessment_completed") === "true" ||
            localStorage.getItem("septivolt_funnel_state") !== null
          )
          const hasRoleplay = tasks.roleplay ??
            (localStorage.getItem("septivolt_debrief_records") !== null)
          const hasLeaderboard = tasks.leaderboard ??
            (localStorage.getItem("septivolt_leaderboard_visited") === "true")
          const hasAnalytics = tasks.analytics ??
            (localStorage.getItem("septivolt_analytics_visited") === "true")
          const hasSettings = tasks.settings ??
            (localStorage.getItem("septivolt_settings_visited") === "true")
          setTaskStates({
            assessment: !!hasAssessment,
            roleplay: !!hasRoleplay,
            leaderboard: !!hasLeaderboard,
            analytics: !!hasAnalytics,
            settings: !!hasSettings,
          })
          const dismissed = localStorage.getItem("septivolt_onboarding_dismissed") === "true"
          setIsDismissed(dismissed)
        } else {
          _loadOnboardingFromLocal()
        }
      })
      .catch(() => _loadOnboardingFromLocal())
  }, [user?.username])

  function _loadOnboardingFromLocal() {
    try {
      const dismissed = localStorage.getItem("septivolt_onboarding_dismissed") === "true"
      setIsDismissed(dismissed)
      const hasAssessment = localStorage.getItem("septivolt_assessment_completed") === "true" ||
                            localStorage.getItem("septivolt_funnel_state") !== null ||
                            localStorage.getItem("septivolt_onboarding_task_assessment") === "true"
      const hasRoleplay = (stats && stats.completedMilestones > 0) ||
                          localStorage.getItem("septivolt_debrief_records") !== null ||
                          localStorage.getItem("septivolt_onboarding_task_roleplay") === "true"
      const hasLeaderboard = localStorage.getItem("septivolt_leaderboard_visited") === "true" ||
                             localStorage.getItem("septivolt_onboarding_task_leaderboard") === "true"
      const hasAnalytics = localStorage.getItem("septivolt_analytics_visited") === "true" ||
                           localStorage.getItem("septivolt_onboarding_task_analytics") === "true"
      const hasSettings = localStorage.getItem("septivolt_settings_visited") === "true" ||
                          localStorage.getItem("septivolt_onboarding_task_settings") === "true"
      setTaskStates({
        assessment: !!hasAssessment,
        roleplay: !!hasRoleplay,
        leaderboard: !!hasLeaderboard,
        analytics: !!hasAnalytics,
        settings: !!hasSettings,
      })
    } catch (e) {
      console.error("Failed to load onboarding states:", e)
    }
  }

  const toggleTask = (key: keyof typeof taskStates) => {
    const newVal = !taskStates[key]
    setTaskStates(prev => ({ ...prev, [key]: newVal }))
    // Persist to backend if authenticated
    const username = user?.username
    if (username) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(username)}/onboarding`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: { [key]: newVal } }),
      }).catch(() => {})
    }
    // Always also persist to localStorage as fallback
    try {
      localStorage.setItem(`septivolt_onboarding_task_${key}`, newVal ? "true" : "false")
    } catch (e) {
      console.error(e)
    }
  }

  const completedCount = Object.values(taskStates).filter(Boolean).length
  const totalTasks = 5
  const progressPercent = Math.round((completedCount / totalTasks) * 100)


  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      try {
        const data = await api.get<any>(`/api/v1/analytics/snapshot?user_id=${user.username}`)
        
        // Map backend payload to DashboardStats
        const mappedStats: DashboardStats = {
          streak: data.currentTrainingStreak,
          overallScore: data.overallPerformanceScore,
          simWinRate: data.simWinRate,
          goalAchievement: data.fieldGoalAchievement,
          attentionFlags: data.coachingInsights.filter((i: any) => i.severity === 'high').length,
          certificationProgress: data.levelProgress,
          completedMilestones: data.simulationsCompleted,
          totalMilestones: 10,
          recentSimulations: data.simulationHistory.slice(0, 3).map((item: any) => ({
            label: item.scenarioName,
            score: item.score,
            subtitle: item.skillsTested.join(", ")
          })),
          skillProgress: Object.entries(data.skills).map(([label, info]: [string, any]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: info.score
          })),
          lastModuleId: SCENARIO_TO_MODULE[data.simulationHistory[0]?.id] || (data.simulationHistory.length > 0 ? "mod_1_1" : "mod_1_1"),
          todayChallengeScenarioId: data.recommendations[0]?.title.includes("Practice") ? "d2d_1" : "discovery_1"
        }
        setStats(mappedStats)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setStats(getDashboardStats())
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (isLoading || !stats) {
    return (
      <AppShell heading="Dashboard" subheading="Loading your performance command center...">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#FF5722] border-t-transparent rounded-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      heading="Dashboard"
      subheading="A daily operating view for training momentum, AI performance, and immediate coaching priorities."
    >
      <div className="space-y-6">
        {/* Company Launch Checklist (Admins & Managers Only) */}
        {hasAdminAccess && !isAdminDismissed && readiness && (
          <WidgetCard className="bg-[linear-gradient(135deg,rgba(18,18,18,0.95),rgba(255,87,34,0.05)_50%,rgba(18,18,18,0.95))] border border-[#FF5722]/15 shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => {
                  setIsAdminDismissed(true)
                  try {
                    localStorage.setItem("septivolt_admin_launch_dismissed", "true")
                  } catch (e) {}
                }}
                className="rounded-full p-1.5 hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors"
                title={t("Dismiss Checklist", "Descartar Lista")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-2.5 py-0.5 font-hud text-[10px] uppercase tracking-widest text-[#FFB300]">
                    <Sparkles className="h-3 w-3 text-[#FF5722]" />
                    {t("COMPANY LAUNCH CHECKLIST", "LISTA DE LANZAMIENTO")}
                  </span>
                  {readiness.score === 100 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 font-hud text-[10px] uppercase tracking-widest text-green-400 font-bold animate-pulse">
                      <ShieldCheck className="h-3 w-3" />
                      {t("LAUNCH READY", "LISTO PARA EL LANZAMIENTO")}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl font-black text-white tracking-tight">
                  {t("Enterprise Onboarding & Launch Plan", "Plan de Configuración y Lanzamiento")}
                </h2>
                <p className="text-sm text-[#94A3B8] max-w-2xl">
                  {t(
                    "Customize your company settings, establish API/webhook pipelines, and build your team. Achieve 100% readiness to go live.",
                    "Personalice la configuración, establezca conexiones de API y cree su equipo. Obtenga 100% de preparación para comenzar."
                  )}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-center min-w-[160px]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-black text-white">{readiness.score}%</span>
                  <span className="text-sm text-[#64748B]">{t("Ready", "Preparado")}</span>
                </div>
                <div className="mt-2 w-full h-1.5 overflow-hidden rounded-full bg-white/5 min-w-[160px]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF5722] to-[#FFB300] transition-all duration-500 ease-out" 
                    style={{ width: `${readiness.score}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  key: "profile" as const,
                  titleEn: "Intelligence Profile",
                  titleEs: "Perfil de Inteligencia",
                  descEn: "Define brand overview, tone, products, and objections.",
                  descEs: "Defina el resumen de la marca, tono, productos y objeciones.",
                  link: "/settings/company?tab=setup&step=1"
                },
                {
                  key: "integration" as const,
                  titleEn: "CRM Integrations",
                  titleEs: "Integraciones CRM",
                  descEn: "Connect GHL or custom webhooks for metric syncs.",
                  descEs: "Conecte GHL o webhooks para sincronizar métricas.",
                  link: "/settings/company?tab=setup&step=4"
                },
                {
                  key: "roster" as const,
                  titleEn: "Team Roster",
                  titleEs: "Personal del Equipo",
                  descEn: "Register managers and sales reps to the platform.",
                  descEs: "Registre gerentes y representantes en la plataforma.",
                  link: "/settings/company?tab=setup&step=6"
                },
                {
                  key: "assets" as const,
                  titleEn: "Sales Assets",
                  titleEs: "Recursos de Venta",
                  descEn: "Publish approved script templates for rep coaching.",
                  descEs: "Publique guiones aprobados para representantes.",
                  link: "/settings/company?tab=setup&step=5"
                }
              ].map((item, idx) => {
                const cp = readiness.checkpoints[item.key]
                const isCompleted = cp?.completed

                return (
                  <div 
                    key={item.key}
                    className={cn(
                      "group relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between min-h-[140px] text-left",
                      isCompleted 
                        ? "border-green-500/20 bg-green-500/[0.02] hover:bg-green-500/[0.04]" 
                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20 shrink-0" />
                        )}
                        <span className="font-hud text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
                          {t("Task", "Tarea")} {idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 flex-1">
                      <Link href={item.link} className="block group/link">
                        <h4 className={cn(
                          "font-display text-sm font-bold leading-tight group-hover/link:text-[#FFB300] transition-colors flex items-center gap-1",
                          isCompleted ? "text-white/60 line-through decoration-white/20" : "text-white"
                        )}>
                          {t(item.titleEn, item.titleEs)}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all shrink-0 translate-x-[-4px] group-hover:translate-x-0" />
                        </h4>
                      </Link>
                      <p className="text-xs text-[#64748B] leading-snug">
                        {t(item.descEn, item.descEs)}
                      </p>
                      {cp?.details && (
                        <p className="text-[10px] text-[#475569] font-mono leading-none mt-1">{cp.details}</p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-hud tracking-wider">
                      <span className={cn(isCompleted ? "text-green-400" : "text-yellow-500")}>
                        {isCompleted ? t("COMPLETE", "COMPLETADO") : t("PENDING", "PENDIENTE")}
                      </span>
                      <Link href={item.link} className="text-[#94A3B8] hover:text-white transition-colors uppercase font-bold">
                        {t("Go", "Ir")}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Launch Setup Wizard Button */}
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
              <Link
                href="/settings/company?tab=setup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-lg shadow-[#FF5722]/20"
              >
                <Sparkles className="h-4 w-4 text-[#FFB300]" />
                {t("Launch Guided Setup Wizard", "Iniciar Asistente de Configuración")}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </WidgetCard>
        )}

        {/* Restore Admin Launch Checklist Trigger */}
        {hasAdminAccess && isAdminDismissed && readiness && (
          <div className="flex justify-end -mb-2">
            <button 
              onClick={() => {
                setIsAdminDismissed(false);
                try { localStorage.removeItem("septivolt_admin_launch_dismissed"); } catch(e) {}
              }}
              className="text-[11px] font-hud uppercase tracking-wider text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition-all bg-white/5 border border-white/5 px-3 py-1.5 rounded-full hover:border-[#FF5722]/30 hover:bg-[#FF5722]/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFB300]" />
              {t("Show Launch Checklist", "Mostrar Lista de Lanzamiento")} ({readiness.score}%)
            </button>
          </div>
        )}

        {/* Rep Onboarding Checklist */}
        {!hasAdminAccess && isDismissed && progressPercent < 100 && (
          <div className="flex justify-end -mb-2">
            <button 
              onClick={() => {
                setIsDismissed(false);
                try { localStorage.removeItem("septivolt_onboarding_dismissed"); } catch(e) {}
              }}
              className="text-[11px] font-hud uppercase tracking-wider text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition-all bg-white/5 border border-white/5 px-3 py-1.5 rounded-full hover:border-[#FF5722]/30 hover:bg-[#FF5722]/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFB300]" />
              {t("Show Onboarding Checklist", "Mostrar Lista de Incorporación")} ({progressPercent}%)
            </button>
          </div>
        )}

        {!hasAdminAccess && !isDismissed && (
          <WidgetCard className="bg-[linear-gradient(135deg,rgba(18,18,18,0.95),rgba(255,87,34,0.05)_50%,rgba(18,18,18,0.95))] border border-white/5 shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => {
                  setIsDismissed(true)
                  try {
                    localStorage.setItem("septivolt_onboarding_dismissed", "true")
                  } catch (e) {}
                }}
                className="rounded-full p-1.5 hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors"
                title={t("Dismiss Onboarding", "Descartar Incorporación")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-2.5 py-0.5 font-hud text-[10px] uppercase tracking-widest text-[#FFB300]">
                    <Sparkles className="h-3 w-3 text-[#FF5722]" />
                    {t("ONBOARDING PATH", "RUTA DE INCORPORACIÓN")}
                  </span>
                  {progressPercent === 100 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 font-hud text-[10px] uppercase tracking-widest text-green-400 font-bold animate-pulse">
                      <Trophy className="h-3 w-3" />
                      {t("100% COMPLETE", "100% COMPLETADO")}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl font-black text-white tracking-tight">
                  {t("First-Time Operator Setup", "Configuración Inicial de Operador")}
                </h2>
                <p className="text-sm text-[#94A3B8] max-w-2xl">
                  {t("Accelerate your onboarding by exploring the core platforms, launching your first simulator, and configuring settings. Unlock +250 XP upon full completion.", 
                     "Acelere su incorporación explorando las plataformas principales, iniciando su primer simulador y configurando los ajustes. Desbloquee +250 XP al completarlo todo.")}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-center min-w-[160px]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-black text-white">{completedCount}</span>
                  <span className="text-sm text-[#64748B]">/ {totalTasks} {t("tasks", "tareas")}</span>
                  <span className="ml-3 font-hud text-xs text-[#FFB300] font-black">{progressPercent}%</span>
                </div>
                <div className="mt-2 w-full h-1.5 overflow-hidden rounded-full bg-white/5 min-w-[160px]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF5722] to-[#FFB300] transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {onboardingTasks.map((task, idx) => {
                const isCompleted = taskStates[task.key]
                return (
                  <div 
                    key={task.key}
                    className={cn(
                      "group relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between min-h-[140px] text-left",
                      isCompleted 
                        ? "border-green-500/20 bg-green-500/[0.02] hover:bg-green-500/[0.04]" 
                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => toggleTask(task.key)}
                        className="rounded-lg p-1 hover:bg-white/5 transition-colors shrink-0"
                        title={isCompleted ? t("Mark uncompleted", "Marcar como incompleto") : t("Mark completed", "Marcar como completado")}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20 group-hover:text-white/40" />
                        )}
                      </button>
                      <span className="font-hud text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
                        {t("Step", "Paso")} {idx + 1}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 flex-1">
                      <Link href={task.link} className="block group/link">
                        <h4 className={cn(
                          "font-display text-sm font-bold leading-tight group-hover/link:text-[#FFB300] transition-colors flex items-center gap-1",
                          isCompleted ? "text-white/60 line-through decoration-white/20" : "text-white"
                        )}>
                          {t(task.titleEn, task.titleEs)}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all shrink-0 translate-x-[-4px] group-hover:translate-x-0" />
                        </h4>
                      </Link>
                      <p className="text-xs text-[#64748B] leading-snug">
                        {t(task.descEn, task.descEs)}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-hud tracking-wider">
                      <span className={cn(isCompleted ? "text-green-400/70" : "text-[#FFB300]")}>
                        +50 XP
                      </span>
                      <Link href={task.link} className="text-[#94A3B8] hover:text-white transition-colors uppercase font-bold">
                        {t("Go", "Ir")}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </WidgetCard>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <WidgetCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(255,87,34,0.14),rgba(18,18,18,0.96)_38%,rgba(255,179,0,0.12))]">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,87,34,0.18),transparent_55%)] lg:block" />
            <NotificationPill icon={Sparkles} label="Recommended next action" tone="cyan" />
            <div className="relative mt-5 max-w-2xl">
              <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
                {stats.lastModuleId ? (
                   `Resume ${stats.lastModuleId.replace("mod_", "Module ").replace("_", ".")} drills to maintain your momentum.`
                ) : (
                  "Start your first training drill to build identity and momentum."
                )}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#CBD5E1]">
                You have completed {stats.completedMilestones} of {stats.totalMilestones} core milestones. 
                Complete the next module to unlock more high-level simulations.
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={stats.lastModuleId ? `/my-training/${stats.lastModuleId}` : "/my-training"}
                className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                {stats.lastModuleId ? "Resume Training" : "Start Training"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <NotificationPill icon={Flame} label={`${stats.streak} day streak active`} tone="lime" />
              <NotificationPill icon={ShieldCheck} label="Certification on track" tone="slate" />
            </div>
          </WidgetCard>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <ProgressCard
              label="Today's AI Challenge"
              value={stats.todayChallengeScenarioId?.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Discovery Drills"}
              progress={stats.certificationProgress}
              detail="Complete this random challenge to bank extra XP and keep your streak alive."
              href={`/ai-simulator?scenario=${stats.todayChallengeScenarioId}`}
            />
            <ProgressCard
              label="Certification Progress"
              value={`${stats.completedMilestones} / ${stats.totalMilestones} milestones`}
              progress={stats.certificationProgress}
              detail="Milestone completion across the core rep path."
            />
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Current Streak" value={`${stats.streak} Days`} change="Active daily training" icon={Flame} accent="lime" />
          <StatCard label="Overall Score" value={stats.overallScore.toString()} change="Blended simulation + KPI achievement" icon={TrendingUp} />
          <StatCard label="Goal Achievement" value={`${stats.goalAchievement}%`} change="Real KPI progress vs targets" icon={Target} />
          <StatCard label="Sim Win Rate" value={`${stats.simWinRate}%`} change="Simulator wins / attempts only" icon={Radar} />
          <StatCard label="Attention Flags" value={`${stats.attentionFlags} Flags`} change="KPI, simulation, & coaching bottlenecks" icon={AlertTriangle} accent="lime" />
        </section>

        <section className="grid gap-6 2xl:grid-cols-2">
          <WidgetCard>
            <SectionEyebrow label="Performance command center" action="Live training telemetry" />
            <div className="grid gap-4 lg:grid-cols-3">
              {stats.recentSimulations.length > 0 ? (
                <>
                  <ScoreDisplayCard
                    label="Recent AI Simulation"
                    score={stats.recentSimulations[0].score}
                    subtitle={stats.recentSimulations[0].subtitle}
                  />
                  <div className="space-y-4 lg:col-span-2">
                    {stats.recentSimulations.slice(1).map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{item.label}</p>
                            <p className="mt-1 text-sm text-[#94A3B8]">{item.subtitle}</p>
                          </div>
                          <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-2 font-hud text-[#FF5722]">
                            {item.score}/100
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="lg:col-span-3 py-12 text-center text-[#94A3B8]">
                  <p>No simulation data recorded yet. Launch the simulator to see your results here.</p>
                </div>
              )}
            </div>
          </WidgetCard>

          <WidgetCard>
            <SectionEyebrow label="Progress by skill category" action="Weekly view" />
            <div className="space-y-5">
              {stats.skillProgress.map((item) => (
                <SkillProgressRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </WidgetCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-1">
          <WidgetCard>
            <SectionEyebrow label="What needs attention now" action="Priority Practice" />
            <div className="grid gap-6 md:grid-cols-2">
              <Link href={`/my-training/${stats.lastModuleId || "mod_1_1"}`} className="block transition-transform hover:scale-[1.01]">
                <div className="h-full rounded-2xl border-[#FFB300]/15 bg-[rgba(255,179,0,0.08)] p-5">
                  <div className="flex items-center gap-2 text-[#FFB300]">
                    <Target className="h-4 w-4" />
                    <span className="font-hud text-[11px] uppercase tracking-[0.16em]">Recommended next module</span>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-white">
                    {stats.lastModuleId === 'mod_1_1' ? 'Vision Casting: Goal Setting' : 'Objection Stack: Price Pressure'}
                  </p>
                  <p className="mt-2 text-sm text-[#CBD5E1]">
                    AI is flagging late value anchoring in your recent sims. One 14-minute drill should close the gap.
                  </p>
                </div>
              </Link>
              <Link href="/ai-simulator" className="block transition-transform hover:scale-[1.01]">
                <div className="h-full rounded-2xl border border-white/5 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-[#FF5722]">
                    <Brain className="h-4 w-4" />
                    <span className="font-hud text-[11px] uppercase tracking-[0.16em]">Badge progress</span>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-white">Closer Circuit Badge</p>
                  <p className="mt-2 text-sm text-[#CBD5E1]">
                    240 XP until next level. Completing today&apos;s challenge and one simulator win clears it.
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="volt-progress h-full w-[76%]" />
                  </div>
                </div>
              </Link>
            </div>
          </WidgetCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <ModuleCard
            title="Resume Training"
            subtitle="Continue your rep path training precisely where you left off."
            progress={stats.certificationProgress}
            badge="Priority"
            href={stats.lastModuleId ? `/my-training/${stats.lastModuleId}` : "/my-training"}
          />
          <ModuleCard
            title="AI Simulator Queue"
            subtitle="Custom simulations are generated based on your weak points."
            progress={stats.simWinRate}
            badge="Live queue"
            href="/ai-simulator"
          />
          <ModuleCard
            title="Certification Path"
            subtitle="View your progress toward becoming a certified Septivolt Closer."
            progress={stats.certificationProgress}
            badge="On track"
            href="/certifications"
          />
        </section>
      </div>
    </AppShell>
  )
}

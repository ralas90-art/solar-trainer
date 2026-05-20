"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { loadDebriefs, DebriefRecord } from "@/lib/debrief-storage"
import { isDemoModeActive, getDemoRoster } from "@/lib/demo-mode"
import { buildScenarioProgressMap, getCompletedCount } from "@/lib/simulation-progress"
import {
  Users, Zap, Award, BarChart3, AlertTriangle,
  MessageSquare, Target, TrendingUp, Clock,
  ChevronRight, CheckCircle, History, Plus, Trash2, Edit, Save, ShieldCheck
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Simulated team roster — replace with backend API when available
const TEAM_ROSTER = [
  { id: "1", name: "Sarah Connor",    email: "sarah@septivolt.com",  role: "Trainee",  dayProgress: 5, totalDays: 7, lastScore: 88, active: true,  needsAttention: false },
  { id: "2", name: "John Doe",        email: "john@septivolt.com",   role: "Trainee",  dayProgress: 2, totalDays: 7, lastScore: 64, active: true,  needsAttention: true  },
  { id: "3", name: "Maria Rodriguez", email: "maria@septivolt.com",  role: "Trainee",  dayProgress: 1, totalDays: 7, lastScore: 71, active: false, needsAttention: false },
  { id: "4", name: "Derek Burns",     email: "derek@septivolt.com",  role: "Trainee",  dayProgress: 0, totalDays: 7, lastScore: 0,  active: false, needsAttention: true  },
  { id: "5", name: "Ana Gutierrez",   email: "ana@septivolt.com",    role: "Trainee",  dayProgress: 7, totalDays: 7, lastScore: 93, active: true,  needsAttention: false },
]

const REP_FLAGS_DETAILS = {
  "2": {
    issueEn: "Defensive tone during Lease vs Purchase objections",
    issueEs: "Tono defensivo durante objeciones de Arrendamiento vs Compra",
    reasonEn: "Completed Day 5 Objection Stack with 64% (below target). Defensive tone rated, customer interrupted.",
    reasonEs: "Completó la pila de objeciones del día 5 con 64%. Tono calificado como defensivo, interrumpió al cliente.",
    actionsEn: [
      "Practice lease-rebuttal simulation with Guarded Gloria",
      "Review utility price locking guidelines",
      "Review active listening scripts on lease objections"
    ],
    actionsEs: [
      "Practicar simulación de refutación con Guarded Gloria",
      "Revisar directrices de bloqueo de tarifas de servicios públicos",
      "Revisar guiones de escucha activa sobre objeciones de arrendamiento"
    ]
  },
  "demo-rep-2": {
    issueEn: "Defensive tone during Lease vs Purchase objections",
    issueEs: "Tono defensivo durante objeciones de Arrendamiento vs Compra",
    reasonEn: "Completed Day 5 Objection Stack with 64% (below target). Defensive tone rated, customer interrupted.",
    reasonEs: "Completó la pila de objeciones del día 5 con 64%. Tono calificado como defensivo, interrumpió al cliente.",
    actionsEn: [
      "Practice lease-rebuttal simulation with Guarded Gloria",
      "Review utility price locking guidelines",
      "Review active listening scripts on lease objections"
    ],
    actionsEs: [
      "Practicar simulación de refutación con Guarded Gloria",
      "Revisar directrices de bloqueo de tarifas de servicios públicos",
      "Revisar guiones de escucha activa sobre objeciones de arrendamiento"
    ]
  },
  "4": {
    issueEn: "Foundations lesson quiz lockout",
    issueEs: "Bloqueo por examen de lección de Fundamentos",
    reasonEn: "Scored 52% on Day 1 Foundations Quiz. Currently locked out of simulator scenarios.",
    reasonEs: "Obtuvo 52% en el examen de Fundamentos del Día 1. Bloqueado de los escenarios del simulador.",
    actionsEn: [
      "Review Day 1 Video Materials in curriculum",
      "Retake Day 1 Foundations Quiz to reach 80% passing",
      "Complete introductory workbook exercises"
    ],
    actionsEs: [
      "Revisar materiales de video del Día 1 en el currículo",
      "Volver a tomar el examen del Día 1 para alcanzar el 80%",
      "Completar ejercicios de introducción del libro de trabajo"
    ]
  },
  "demo-rep-4": {
    issueEn: "Foundations lesson quiz lockout",
    issueEs: "Bloqueo por examen de lección de Fundamentos",
    reasonEn: "Scored 52% on Day 1 Foundations Quiz. Currently locked out of simulator scenarios.",
    reasonEs: "Obtuvo 52% en el examen de Fundamentos del Día 1. Bloqueado de los escenarios del simulador.",
    actionsEn: [
      "Review Day 1 Video Materials in curriculum",
      "Retake Day 1 Foundations Quiz to reach 80% passing",
      "Complete introductory workbook exercises"
    ],
    actionsEs: [
      "Revisar materiales de video del Día 1 en el currículo",
      "Volver a tomar el examen del Día 1 para alcanzar el 80%",
      "Completar ejercicios de introducción del libro de trabajo"
    ]
  },
  "demo-rep-7": {
    issueEn: "Roof layout site qualification failure",
    issueEs: "Fallo de calificación de sitio y diseño de techo",
    reasonEn: "Completed Day 3 Consultative Discovery with 60%. Failed roof shading and site qualification criteria.",
    reasonEs: "Completó Descubrimiento Consultivo del Día 3 con 60%. Falló criterios de sombreado y calificación del sitio.",
    actionsEn: [
      "Practice discovery drills with Busy Brian",
      "Review roof shade & decision-maker scripts",
      "Complete site analysis diagnostic module"
    ],
    actionsEs: [
      "Practicar simulacros de descubrimiento con Busy Brian",
      "Revisar guiones de sombreado y tomadores de decisiones",
      "Completar módulo de diagnóstico de análisis de sitio"
    ]
  }
}

export default function ManagerCommandCenterPage() {
  const { user } = useAuth()
  const { isSpanish } = useLanguage()
  const t = (en: string, es: string) => isSpanish ? es : en

  const [recentDebriefs, setRecentDebriefs] = useState<DebriefRecord[]>([])
  const [teamSimCount, setTeamSimCount] = useState(0)
  const [challengeText, setChallengeText] = useState("")
  const [coachNote, setCoachNote] = useState("")
  const [savedNote, setSavedNote] = useState(false)
  const [roster, setRoster] = useState(TEAM_ROSTER)
  const [isDemo, setIsDemo] = useState(false)

  // Teams & Organization states
  const [teams, setTeams] = useState<any[]>([])
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingTeamName, setEditingTeamName] = useState("")

  // Expandable flags states
  const [expandedRepId, setExpandedRepId] = useState<string | null>(null)
  const [repNotes, setRepNotes] = useState<Record<string, string>>({})
  const [savedReps, setSavedReps] = useState<Record<string, boolean>>({})

  const fetchTeams = (activeDemo: boolean) => {
    if (!user || user.companyId === "demo" || activeDemo) {
      // Mock teams for Demo Mode
      setTeams([
        {
          id: "demo_team_1",
          name: "Residential Sales",
          company_id: "cresca_test",
          manager_id: null,
          stats: { rep_count: 3, started_count: 3, completed_count: 3, sims_count: 12 }
        },
        {
          id: "demo_team_2",
          name: "Commercial Closers",
          company_id: "cresca_test",
          manager_id: null,
          stats: { rep_count: 2, started_count: 1, completed_count: 0, sims_count: 2 }
        }
      ])
      return
    }

    setLoadingTeams(true)
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/companies/${encodeURIComponent(user.companyId)}/teams`,
      { credentials: "include", headers: { "X-User-Id": user.username } }
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTeams(data)
      })
      .catch((err) => {
        console.error("Failed to load teams:", err)
      })
      .finally(() => {
        setLoadingTeams(false)
      })
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    const activeDemo = isDemo || isDemoModeActive()
    if (activeDemo) {
      const mockNewTeam = {
        id: `mock_team_${Date.now()}`,
        name: newTeamName,
        company_id: user?.companyId || "cresca_test",
        manager_id: null,
        stats: { rep_count: 0, started_count: 0, completed_count: 0, sims_count: 0 }
      }
      setTeams(prev => [...prev, mockNewTeam])
      setNewTeamName("")
      return
    }

    try {
      const companyId = user?.companyId || "cresca_test"
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/companies/${encodeURIComponent(companyId)}/teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user?.username || ""
          },
          body: JSON.stringify({ name: newTeamName })
        }
      )
      if (!res.ok) throw new Error("Failed to create team")
      setNewTeamName("")
      fetchTeams(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRenameTeam = async (teamId: string) => {
    if (!editingTeamName.trim()) return

    const activeDemo = isDemo || isDemoModeActive()
    if (activeDemo) {
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, name: editingTeamName } : t))
      setEditingTeamId(null)
      setEditingTeamName("")
      return
    }

    try {
      const companyId = user?.companyId || "cresca_test"
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/companies/${encodeURIComponent(companyId)}/teams/${teamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user?.username || ""
          },
          body: JSON.stringify({ name: editingTeamName })
        }
      )
      if (!res.ok) throw new Error("Failed to rename team")
      setEditingTeamId(null)
      setEditingTeamName("")
      fetchTeams(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm(t("Are you sure you want to delete this team?", "¿Está seguro de que desea eliminar este equipo?"))) return

    const activeDemo = isDemo || isDemoModeActive()
    if (activeDemo) {
      setTeams(prev => prev.filter(t => t.id !== teamId))
      return
    }

    try {
      const companyId = user?.companyId || "cresca_test"
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/companies/${encodeURIComponent(companyId)}/teams/${teamId}`,
        {
          method: "DELETE",
          headers: {
            "X-User-Id": user?.username || ""
          }
        }
      )
      if (!res.ok) throw new Error("Failed to delete team")
      fetchTeams(false)
      // Reload roster since users in deleted team are now unassigned
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAssignTeam = async (username: string, teamId: string) => {
    const activeDemo = isDemo || isDemoModeActive()
    if (activeDemo) {
      // In demo mode, update local roster state
      setRoster(prev => prev.map(r => r.name === username ? { ...r, team_id: teamId } as any : r))
      alert(t(`Assigned ${username} to team successfully (Demo Mode)`, `Representante ${username} asignado al equipo con éxito (Modo Demo)`))
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(username)}/team`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user?.username || ""
          },
          body: JSON.stringify({ team_id: teamId })
        }
      )
      if (!res.ok) throw new Error("Failed to assign team")
      fetchTeams(false)
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  // Load saved notes from localStorage
  useEffect(() => {
    try {
      const loadedNotes: Record<string, string> = {}
      roster.forEach(rep => {
        const note = localStorage.getItem(`septivolt_coaching_note_${rep.id}`)
        if (note) {
          loadedNotes[rep.id] = note
        }
      })
      setRepNotes(loadedNotes)
    } catch (e) {
      console.error(e)
    }
  }, [roster])

  const saveRepNote = (repId: string, text: string) => {
    setRepNotes(prev => ({ ...prev, [repId]: text }))
    setSavedReps(prev => ({ ...prev, [repId]: true }))
    // Persist note to backend API (repId may be username or numeric id)
    if (user?.username && !isDemo) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(repId)}/coaching-note`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", "X-User-Id": user.username },
          body: JSON.stringify({ notes: text }),
        }
      ).catch(() => {
        // Silent fail — localStorage is still written below
      })
    }
    try {
      localStorage.setItem(`septivolt_coaching_note_${repId}`, text)
    } catch (e) {
      console.error(e)
    }
    setTimeout(() => {
      setSavedReps(prev => ({ ...prev, [repId]: false }))
    }, 2000)
  }


  useEffect(() => {
    const activeDemo = isDemoModeActive()
    setIsDemo(activeDemo)
    fetchTeams(activeDemo)
    const debriefs = loadDebriefs(user?.username)
    debriefs.then((records) => setRecentDebriefs(records.slice(0, 3))).catch(() => {})
    const map = buildScenarioProgressMap({})
    if (activeDemo) {
      setRoster(getDemoRoster())
      setTeamSimCount(142)
    } else if (user?.companyId) {
      // Load live roster from backend
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/companies/${encodeURIComponent(user.companyId)}/roster`,
        { credentials: "include", headers: { "X-User-Id": user.username } }
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.roster) {
            // Map API roster to the local shape the page expects
            const mapped = data.roster.map((m: any) => ({
              id: String(m.id ?? m.username),
              name: m.username,
              email: m.email ?? "",
              role: m.role ?? "Trainee",
              dayProgress: m.completed_sims ?? 0,
              totalDays: 7,
              lastScore: m.last_score ?? 0,
              active: m.active ?? true,
              needsAttention: m.needs_attention ?? false,
              team_id: m.team_id ?? null,
            }))
            setRoster(mapped)
            // Pre-load coaching notes from API response
            const notes: Record<string, string> = {}
            data.roster.forEach((m: any) => {
              if (m.coaching_notes) notes[String(m.id ?? m.username)] = m.coaching_notes
            })
            setRepNotes(notes)
            setTeamSimCount(
              data.roster.reduce((sum: number, m: any) => sum + (m.completed_sims ?? 0), 0)
            )
          } else {
            setRoster(TEAM_ROSTER)
            setTeamSimCount(getCompletedCount(map))
          }
        })
        .catch(() => {
          setRoster(TEAM_ROSTER)
          setTeamSimCount(getCompletedCount(map))
        })
    } else {
      setRoster(TEAM_ROSTER)
      setTeamSimCount(getCompletedCount(map))
    }
  }, [user?.username])

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  const activeReps = roster.filter(r => r.active).length
  const flagged = roster.filter(r => r.needsAttention)
  const avgScore = roster.filter(r => r.lastScore > 0).length
    ? Math.round(roster.filter(r => r.lastScore > 0).reduce((s, r) => s + r.lastScore, 0) / roster.filter(r => r.lastScore > 0).length)
    : 0

  return (
    <AppShell
      heading={t("Manager Command Center", "Centro de Mando")}
      subheading={t("Daily rep overview, team KPIs, coaching flags, and challenge management.", "Visión diaria de representantes, KPIs del equipo y gestión de coaching.")}
    >
      <div className="space-y-6 max-w-6xl">


        {/* Daily Briefing Strip */}
        <div className="rounded-2xl border border-[#FF5722]/20 bg-gradient-to-r from-[#FF5722]/8 via-[#1A1A1A] to-[#1A1A1A] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Daily Briefing</p>
            <h2 className="font-display font-black text-xl text-white mt-0.5">{today}</h2>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              {activeReps} reps active · {flagged.length} need{flagged.length === 1 ? "s" : ""} attention · {teamSimCount} sims completed
            </p>
          </div>
          <Link href="/analytics" className="btn-solar-outline px-4 py-2 text-xs inline-flex items-center gap-2 shrink-0">
            <BarChart3 className="h-4 w-4" />
            {t("Full Analytics", "Ver Analíticas")}
          </Link>
        </div>

        {/* KPI Wall */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: t("Active Reps Today", "Reps Activos"), value: String(activeReps), icon: Users, color: "text-[#FF5722]", border: "border-[#FF5722]/20", bg: "bg-[#FF5722]/5" },
            { label: t("Avg Team Score", "Puntaje Promedio"), value: `${avgScore}%`, icon: BarChart3, color: "text-[#FFB300]", border: "border-[#FFB300]/20", bg: "bg-[#FFB300]/5" },
            { label: t("Sims This Session", "Sims"), value: String(teamSimCount), icon: Zap, color: "text-[#FFD54F]", border: "border-[#FFD54F]/20", bg: "bg-[#FFD54F]/5" },
            { label: t("Needs Attention", "Requieren Atención"), value: String(flagged.length), icon: AlertTriangle, color: flagged.length > 0 ? "text-red-400" : "text-green-400", border: flagged.length > 0 ? "border-red-500/20" : "border-green-500/20", bg: flagged.length > 0 ? "bg-red-500/5" : "bg-green-500/5" },
          ].map(({ label, value, icon: Icon, color, border, bg }) => (
            <div key={label} className={cn("rounded-2xl border p-5", border, bg)}>
              <Icon className={cn("h-5 w-5 mb-3", color)} />
              <p className={cn("font-display font-black text-3xl", color)}>{value}</p>
              <p className="font-hud text-[10px] uppercase tracking-wider text-[#64748B] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left Column */}
          <div className="space-y-6">

            {/* Rep Roster Table */}
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A]">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF5722]" /> {t("Rep Roster", "Lista de Representantes")}
                  </h3>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{roster.length} reps under your workspace</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-hud uppercase tracking-wider text-[#64748B]">
                      <th className="px-5 py-3 text-left">Rep</th>
                      <th className="px-5 py-3 text-left">Team Assignment</th>
                      <th className="px-5 py-3 text-left">Day Progress</th>
                      <th className="px-5 py-3 text-left">Last Score</th>
                      <th className="px-5 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {roster.map((rep: any) => {
                      const pct = Math.round((rep.dayProgress / rep.totalDays) * 100)
                      return (
                        <tr key={rep.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FFB300] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                {rep.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm">{rep.name}</p>
                                <p className="text-[10px] text-[#64748B]">{rep.email}</p>
                              </div>
                              {rep.needsAttention && <AlertTriangle className="h-3.5 w-3.5 text-red-400 ml-1 shrink-0" />}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              value={rep.team_id || ""}
                              onChange={(e) => handleAssignTeam(rep.name, e.target.value)}
                              className="bg-[#121212] text-xs text-[#CBD5E1] border border-white/10 rounded-xl px-3 py-1.5 outline-none focus:border-[#FF5722]/50 cursor-pointer"
                            >
                              <option value="" className="text-slate-400">-- {t("Unassigned", "Sin Asignar")} --</option>
                              {teams.map((t) => (
                                <option key={t.id} value={t.id} className="text-white">
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
                                <div className={cn("h-full rounded-full", pct === 100 ? "bg-green-400" : "bg-gradient-to-r from-[#FF5722] to-[#FFB300]")} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="font-hud text-[10px] text-[#94A3B8]">Day {rep.dayProgress}/{rep.totalDays}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={cn("font-hud text-sm font-bold", rep.lastScore >= 80 ? "text-green-400" : rep.lastScore >= 70 ? "text-[#FFB300]" : rep.lastScore > 0 ? "text-red-400" : "text-[#64748B]")}>
                              {rep.lastScore > 0 ? `${rep.lastScore}%` : "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("h-2 w-2 rounded-full shrink-0", rep.active ? "bg-green-400 animate-pulse" : "bg-[#64748B]")} />
                              <span className="text-xs text-[#94A3B8]">{rep.active ? "Online" : "Offline"}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teams & Organization */}
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FFB300]" /> {t("Teams & Organization", "Equipos y Organización")}
                  </h3>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    {teams.length} {teams.length === 1 ? t("team configured", "equipo configurado") : t("teams configured", "equipos configurados")}
                  </p>
                </div>
              </div>

              {/* Create Team Form */}
              <form onSubmit={handleCreateTeam} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder={t("Enter new team name...", "Nombre del nuevo equipo...")}
                  className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-4 py-2 text-xs text-white outline-none focus:border-[#FF5722]/50 placeholder:text-[#64748B]"
                />
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 text-xs font-bold font-hud uppercase tracking-wider flex items-center gap-1.5 shrink-0 rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("Create", "Crear")}
                </button>
              </form>

              {/* Team list */}
              {loadingTeams ? (
                <p className="text-xs text-slate-400 animate-pulse">{t("Loading teams...", "Cargando equipos...")}</p>
              ) : teams.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                  <Users className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">{t("No teams defined yet.", "No hay equipos definidos aún.")}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {teams.map((team) => {
                    const stats = team.stats || { rep_count: 0, started_count: 0, completed_count: 0, sims_count: 0 }
                    // Readiness criteria: if all reps in the team have completed training (at least 3 sims completed per rep)
                    // If rep_count > 0 and completed_count == rep_count: Team is "Setup Complete"
                    const isTeamReady = stats.rep_count > 0 && stats.completed_count >= stats.rep_count

                    return (
                      <div
                        key={team.id}
                        className="rounded-xl border border-white/5 bg-[#121212] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          {editingTeamId === team.id ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={editingTeamName}
                                onChange={(e) => setEditingTeamName(e.target.value)}
                                className="rounded-lg border border-white/10 bg-[#1A1A1A] px-2 py-1 text-xs text-white outline-none focus:border-[#FF5722]/50"
                              />
                              <button
                                type="button"
                                onClick={() => handleRenameTeam(team.id)}
                                className="text-green-400 hover:text-green-300 p-1"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{team.name}</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTeamId(team.id)
                                  setEditingTeamName(team.name)
                                }}
                                className="text-slate-400 hover:text-white p-1 transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 items-center">
                            {/* Readiness Badge */}
                            {isTeamReady ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                <ShieldCheck className="h-3 w-3" />
                                {t("Setup Complete", "Instalación Completa")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                <AlertTriangle className="h-3 w-3" />
                                {t("Pending setup", "Pendiente")}
                              </span>
                            )}

                            {/* Rep count indicator */}
                            <span className="text-[11px] text-[#94A3B8]">
                              {stats.rep_count} {stats.rep_count === 1 ? t("rep", "rep") : t("reps", "reps")}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 transition-all"
                            title={t("Delete team", "Eliminar equipo")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Focus Flags */}
            {flagged.length > 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-4 w-4 text-red-400" /> {t("Focus Flags", "Alertas de Atención")}
                </h3>
                <div className="space-y-2">
                  {flagged.map((rep) => {
                    const isExpanded = expandedRepId === rep.id
                    const details = REP_FLAGS_DETAILS[rep.id as keyof typeof REP_FLAGS_DETAILS] || {
                      issueEn: "Needs simulator practice",
                      issueEs: "Requiere práctica en simulador",
                      reasonEn: "Recent performance scores are below the team benchmark of 80%.",
                      reasonEs: "Los puntajes de rendimiento recientes están por debajo del estándar del equipo del 80%.",
                      actionsEn: ["Complete pending modules", "Practice with Busy Brian or Guarded Gloria", "Review performance diagnostics"],
                      actionsEs: ["Completar módulos pendientes", "Practicar con Busy Brian o Guarded Gloria", "Revisar diagnósticos de rendimiento"]
                    }

                    return (
                      <div key={rep.id} className="rounded-xl border border-red-500/15 bg-red-500/5 overflow-hidden transition-all duration-300">
                        <button 
                          onClick={() => setExpandedRepId(isExpanded ? null : rep.id)}
                          className="w-full flex items-center justify-between p-4 gap-3 text-left hover:bg-red-500/10 transition-colors focus:outline-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FFB300] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                              {rep.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-white truncate">{rep.name}</p>
                              <p className="text-[11px] text-red-400 font-medium mt-0.5">
                                {t(details.issueEn, details.issueEs)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-hud uppercase tracking-wider text-[#94A3B8]">
                              {isExpanded ? t("Collapse", "Contraer") : t("Expand", "Expandir")}
                            </span>
                            <ChevronRight className={cn("h-4 w-4 text-[#94A3B8] transition-transform duration-200", isExpanded ? "rotate-90 text-[#FF5722]" : "")} />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 border-t border-red-500/10 bg-black/35 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="space-y-1">
                              <p className="text-[10px] font-hud uppercase tracking-wider text-[#64748B]">{t("Reason for Flag", "Causa de la Alerta")}</p>
                              <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">{t(details.reasonEn, details.reasonEs)}</p>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-hud uppercase tracking-wider text-[#64748B]">{t("Recommended Coaching Actions", "Acciones de Coaching Recomendadas")}</p>
                              <div className="space-y-1.5">
                                {(isSpanish ? details.actionsEs : details.actionsEn).map((action, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#FFB300] mt-1.5 shrink-0" />
                                    <span>{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-hud uppercase tracking-wider text-[#64748B]">{t("Coaching Notes", "Notas de Coaching")}</label>
                                {savedReps[rep.id] && (
                                  <span className="text-[9px] font-hud uppercase font-bold text-green-400 animate-pulse">{t("Saved", "Guardado")}</span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <textarea
                                  value={repNotes[rep.id] ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setRepNotes(prev => ({ ...prev, [rep.id]: val }))
                                  }}
                                  onBlur={(e) => saveRepNote(rep.id, e.target.value)}
                                  placeholder={t("Type private notes to guide your 1-on-1 session...", "Escriba notas privadas para guiar la sesión individual...")}
                                  className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-xs text-[#CBD5E1] placeholder:text-[#64748B] outline-none focus:border-[#FF5722]/50 resize-none min-h-[56px]"
                                  rows={2}
                                />
                                <button
                                  onClick={() => saveRepNote(rep.id, repNotes[rep.id] ?? "")}
                                  className="px-3 rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-[#FFD54F] hover:text-white transition-all text-xs font-hud uppercase tracking-wider shrink-0 font-bold"
                                >
                                  {t("Save", "Guardar")}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-5">

            {/* Daily Challenge */}
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
              <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-[#FFB300]" /> {t("Daily Challenge", "Desafío del Día")}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{t("Challenge Description", "Descripción")}</label>
                  <textarea
                    value={challengeText}
                    onChange={e => setChallengeText(e.target.value)}
                    rows={3}
                    placeholder={t("e.g. Complete the Objection Handling sim with 80%+ score before EOD...", "e.g. Completa la simulación de objeciones con 80%+...")}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] placeholder:text-[#64748B] outline-none focus:border-[#FF5722]/50 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{t("Target Metric", "Métrica")}</label>
                    <select className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-xs text-[#CBD5E1] outline-none focus:border-[#FF5722]/50">
                      <option>Sim Score</option>
                      <option>Modules Completed</option>
                      <option>Certs Earned</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">{t("Deadline", "Plazo")}</label>
                    <select className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-xs text-[#CBD5E1] outline-none focus:border-[#FF5722]/50">
                      <option>End of Day</option>
                      <option>End of Week</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
                <button className="w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  {t("Send Challenge to Team", "Enviar Desafío al Equipo")}
                </button>
              </div>
            </div>

            {/* Coach Notes */}
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
              <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-[#FF5722]" /> {t("Coaching Notes", "Notas de Coaching")}
              </h3>
              <textarea
                value={coachNote}
                onChange={e => { setCoachNote(e.target.value); setSavedNote(false) }}
                rows={4}
                placeholder={t("Private coaching notes for your team session...", "Notas privadas para tu sesión de coaching...")}
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] placeholder:text-[#64748B] outline-none focus:border-[#FF5722]/50 resize-none"
              />
              <button
                onClick={() => setSavedNote(true)}
                className={cn("mt-2 w-full py-2 rounded-xl text-xs font-hud uppercase tracking-wider font-bold transition-all", savedNote ? "bg-green-500/10 border border-green-500/30 text-green-400" : "btn-solar-outline")}
              >
                {savedNote ? <span className="flex items-center justify-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" /> Saved</span> : t("Save Note", "Guardar Nota")}
              </button>
            </div>

            {/* Recent AI Coaching Reports */}
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#FFD54F]" /> {t("Recent AI Reports", "Reportes Recientes")}
                </h3>
                <Link href="/analytics/debriefs" className="text-[10px] font-hud uppercase tracking-wide text-[#FF5722] hover:text-[#FFB300] flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              {recentDebriefs.length > 0 ? (
                <div className="space-y-2">
                  {recentDebriefs.map((d) => (
                    <div key={d.id} className="rounded-xl border border-white/5 bg-white/5 p-3 flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", d.passed ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20")}>
                        {d.passed ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-white truncate">{d.scenarioName}</p>
                        <p className="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {new Date(d.completedAt).toLocaleDateString()}
                          <span className="text-[#64748B]">·</span>
                          <span className={d.passed ? "text-green-400" : "text-red-400"}>{d.score}%</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <History className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">{t("No coaching reports yet. Complete simulations to generate AI debriefs.", "Sin reportes. Completa simulaciones para generar debriefs.")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

"use client"

import { AppShell } from "@/components/platform/app-shell"
import { FeatureGate } from "@/components/auth/FeatureGate"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import {
  ShieldAlert, Users, Settings, Key, Activity,
  ToggleLeft, Trash2, AlertTriangle, CheckCircle,
  Copy, RotateCcw, Globe, Zap, Lock, ChevronDown
} from "lucide-react"
import { useEffect, useState } from "react"
import { isDemoModeActive, toggleDemoMode } from "@/lib/demo-mode"
import { api } from "@/lib/api-client"

// Audit log — placeholder entries (replace with backend GET /admin/audit-log)
const AUDIT_LOG = [
  { id: "1", action: "User login",           actor: "admin",         at: "2 min ago",   type: "auth"   },
  { id: "2", action: "Cert issued: Day 1",   actor: "sarah.connor",  at: "18 min ago",  type: "cert"   },
  { id: "3", action: "Sim completed",        actor: "john.doe",      at: "45 min ago",  type: "sim"    },
  { id: "4", action: "Settings updated",     actor: "admin",         at: "2 hrs ago",   type: "config" },
  { id: "5", action: "User invited",         actor: "manager",       at: "4 hrs ago",   type: "auth"   },
  { id: "6", action: "Strict gating toggled",actor: "admin",         at: "Yesterday",   type: "config" },
]

const EVENT_COLORS: Record<string, string> = {
  auth:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cert:   "bg-[#FFD54F]/10 text-[#FFD54F] border-[#FFD54F]/20",
  sim:    "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20",
  config: "bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/20",
}

// Simulated all-users roster (admin view)
const ALL_USERS = [
  { id: "1", name: "Alex Mercer",     email: "alex@septivolt.com",   role: "admin",   status: "Active",    lastActive: "5 min ago" },
  { id: "2", name: "Sarah Connor",    email: "sarah@septivolt.com",  role: "manager", status: "Active",    lastActive: "2 hrs ago" },
  { id: "3", name: "John Doe",        email: "john@septivolt.com",   role: "trainee", status: "Active",    lastActive: "1 day ago" },
  { id: "4", name: "Maria Rodriguez", email: "maria@septivolt.com",  role: "trainee", status: "Onboarding",lastActive: "Just now"  },
  { id: "5", name: "Derek Burns",     email: "derek@septivolt.com",  role: "trainee", status: "Inactive",  lastActive: "5 days ago"},
]

export default function AdminControlCenterPage() {
  const { user } = useAuth()
  const { isSpanish } = useLanguage()
  const t = (en: string, es: string) => isSpanish ? es : en

  const [spanishMode, setSpanishMode] = useState(true)
  const [strictGating, setStrictGating] = useState(true)
  const [elevenLabsEnabled, setElevenLabsEnabled] = useState(false)
  const [dangerConfirm, setDangerConfirm] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [integrationStatuses, setIntegrationStatuses] = useState<Record<string, { status: string; label: string; provider: string }> | null>(null)
  const [loadingStatuses, setLoadingStatuses] = useState(true)

  useEffect(() => {
    setDemoMode(isDemoModeActive())
  }, [])

  useEffect(() => {
    async function loadIntegrationStatuses() {
      if (isDemoModeActive()) {
        setIntegrationStatuses({
          elevenlabs: { status: "server-side-only", label: "ElevenLabs TTS", provider: "elevenlabs" },
          openai: { status: "configured", label: "OpenAI GPT-4", provider: "openai" },
          vapi: { status: "not-set", label: "Vapi AI Voice", provider: "vapi" }
        })
        setElevenLabsEnabled(true)
        setLoadingStatuses(false)
        return
      }
      if (!user?.username) return
      try {
        const data = await api.get<any>("/api/v1/admin/integration-status", {
          headers: { "X-User-Id": user.username }
        })
        setIntegrationStatuses(data)
        if (data.elevenlabs?.status === "configured") {
          setElevenLabsEnabled(true)
        }
      } catch (err) {
        console.error("Failed to fetch integration statuses:", err)
      } finally {
        setLoadingStatuses(false)
      }
    }
    loadIntegrationStatuses()
  }, [user?.username])

  const handleToggleDemoMode = (enabled: boolean) => {
    toggleDemoMode(enabled)
    setDemoMode(enabled)
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  return (
    <FeatureGate allowedRoles={["admin"]}>
      <AppShell
        heading={t("Admin Control Center", "Centro de Control Admin")}
        subheading={t("Platform configuration, user management, integrations, and system oversight.", "Configuración de plataforma, gestión de usuarios e integraciones del sistema.")}
      >
        <div className="space-y-6 max-w-6xl">

          {/* Access Banner */}
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-white">Admin Access Active</p>
              <p className="text-xs text-[#94A3B8]">Logged in as <span className="text-red-400 font-mono">{user?.username ?? "admin"}</span> · All actions are logged to the audit trail</p>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Platform Status", value: "Operational", sub: "All systems nominal", color: "text-green-400", dot: "bg-green-400" },
              { label: "Total Users",     value: String(ALL_USERS.length), sub: "1 admin · 1 manager · 3 trainees", color: "text-[#FF5722]", dot: "bg-[#FF5722]" },
              { label: "Active Sessions", value: "3", sub: "Right now", color: "text-[#FFB300]", dot: "bg-[#FFB300]" },
              { label: "Platform Build",  value: "v2.4.2", sub: "Enterprise readiness stabilization release", color: "text-[#94A3B8]", dot: "bg-[#64748B]" },
            ].map(({ label, value, sub, color, dot }) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
                  <p className="font-hud text-[10px] uppercase tracking-wider text-[#64748B]">{label}</p>
                </div>
                <p className={cn("font-display font-black text-xl", color)}>{value}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left column */}
            <div className="space-y-6">

              {/* User Management Table */}
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A]">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF5722]" /> {t("User Management", "Gestión de Usuarios")}
                  </h3>
                  <button className="btn-primary px-3 py-1.5 text-[10px] inline-flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> {t("Invite User", "Invitar Usuario")}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-hud uppercase tracking-wider text-[#64748B]">
                        <th className="px-5 py-3 text-left">User</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Last Active</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ALL_USERS.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FFB300] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                {u.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{u.name}</p>
                                <p className="text-[10px] text-[#64748B]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-hud uppercase tracking-wide font-bold border",
                              u.role === "admin"   ? "bg-red-500/10 text-red-400 border-red-500/25" :
                              u.role === "manager" ? "bg-blue-500/10 text-blue-400 border-blue-500/25" :
                              "bg-green-500/10 text-green-400 border-green-500/25"
                            )}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("h-2 w-2 rounded-full shrink-0", u.status === "Active" ? "bg-green-400 animate-pulse" : u.status === "Onboarding" ? "bg-[#FFB300]" : "bg-[#64748B]")} />
                              <span className="text-xs text-[#94A3B8]">{u.status}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#94A3B8]">{u.lastActive}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button className="text-[10px] font-hud uppercase tracking-wide text-[#FFB300] hover:text-[#FF5722] transition-colors">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Log */}
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
                <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-[#FFB300]" /> {t("Audit Log", "Registro de Auditoría")}
                </h3>
                <div className="space-y-2">
                  {AUDIT_LOG.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                      <span className={cn("rounded px-2 py-0.5 text-[9px] font-hud uppercase tracking-wide border shrink-0", EVENT_COLORS[entry.type] ?? "bg-white/5 text-[#94A3B8] border-white/10")}>{entry.type}</span>
                      <p className="text-sm text-white flex-1 min-w-0 truncate">{entry.action}</p>
                      <span className="text-[10px] text-[#64748B] font-mono shrink-0">{entry.actor}</span>
                      <span className="text-[10px] text-[#64748B] shrink-0">{entry.at}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[10px] text-[#64748B]">Showing last {AUDIT_LOG.length} events · Full log requires backend persistence</p>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <h3 className="font-display font-black text-base text-red-400 flex items-center gap-2 mb-1">
                  <Trash2 className="h-4 w-4" /> {t("Danger Zone", "Zona de Peligro")}
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">Destructive actions are non-functional until backend safety handlers are confirmed.</p>
                <div className="space-y-2">
                  {[
                    { id: "debriefs", label: "Clear All Debrief History", sub: "Removes all AI coaching reports from local storage" },
                    { id: "progress", label: "Reset User Progress", sub: "Clears all module + simulation progress data" },
                  ].map(({ id, label, sub }) => (
                    <div key={id} className="flex items-center justify-between gap-4 rounded-xl border border-red-500/15 bg-red-500/5 p-4">
                      <div>
                        <p className="font-semibold text-sm text-white">{label}</p>
                        <p className="text-xs text-[#94A3B8]">{sub}</p>
                      </div>
                      {dangerConfirm === id ? (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setDangerConfirm(null)} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-[#94A3B8] hover:text-white transition-colors">Cancel</button>
                          <button
                            onClick={() => {
                              // Non-destructive until backend is wired — just clear confirm state
                              setDangerConfirm(null)
                            }}
                            className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20 transition-colors font-bold"
                          >
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDangerConfirm(id)} className="shrink-0 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20 transition-colors font-bold">
                          {t("Reset", "Resetear")}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">

              {/* Platform Config */}
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
                <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4 text-[#FF5722]" /> {t("Platform Config", "Configuración de Plataforma")}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Spanish Language Mode", sub: "Enable bilingual training across all modules", val: spanishMode, set: setSpanishMode, disabled: false },
                    { label: "Strict Curriculum Gating", sub: "Require quiz pass before sim access", val: strictGating, set: setStrictGating, disabled: false },
                    { label: "ElevenLabs AI Narration", sub: "Managed server-side via environment settings", val: elevenLabsEnabled, set: () => {}, disabled: true },
                    { label: "Safe Demo Mode", sub: "Populate sample enterprise training data", val: demoMode, set: handleToggleDemoMode, disabled: false },
                  ].map(({ label, sub, val, set, disabled }) => (
                    <div key={label} className={cn("flex items-center justify-between gap-3 p-3 rounded-xl border border-white/5 bg-white/5", disabled && "opacity-60")}>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-white">{label}</p>
                        <p className="text-[10px] text-[#94A3B8]">{sub}</p>
                      </div>
                      <button
                        onClick={() => !disabled && set(!val)}
                        disabled={disabled}
                        className={cn("w-11 h-6 rounded-full p-1 transition-colors duration-200 shrink-0", val ? "bg-[#FF5722]" : "bg-white/10", disabled && "cursor-not-allowed")}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm", val ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* API / Integrations */}
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
                <h3 className="font-display font-black text-base text-white flex items-center gap-2 mb-1">
                  <Key className="h-4 w-4 text-[#FFD54F]" /> {t("Integrations & API Keys", "Integraciones y Claves API")}
                </h3>
                <p className="text-[10px] text-[#64748B] mb-4">
                  {t(
                    "API key statuses are queried securely from the backend. Raw credentials are never exposed.",
                    "Los estados de las claves API se consultan de forma segura desde el servidor. Las credenciales sin procesar nunca se exponen."
                  )}
                </p>
                <div className="space-y-3">
                  {loadingStatuses ? (
                    <div className="text-xs text-[#64748B] animate-pulse">Loading status checks...</div>
                  ) : integrationStatuses ? (
                    Object.values(integrationStatuses).map(({ label, status }) => {
                      const statusLabel =
                        status === "configured" ? t("Configured", "Configurado") :
                        status === "server-side-only" ? t("Server-side only", "Solo Servidor") :
                        t("Not Set", "No Configurado")

                      const badgeClass =
                        status === "configured" ? "bg-green-500/10 text-green-400 border-green-500/25" :
                        status === "server-side-only" ? "bg-blue-500/10 text-blue-400 border-blue-500/25" :
                        "bg-white/5 text-[#94A3B8] border-white/10"

                      return (
                        <div key={label} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/5 bg-[#1C1C1C]">
                          <span className="text-xs font-semibold text-white">{label}</span>
                          <span className={cn("rounded px-2.5 py-0.5 text-[10px] font-hud uppercase tracking-wider font-bold border", badgeClass)}>
                            {statusLabel}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-xs text-red-400">Failed to load integration status checks.</div>
                  )}
                </div>
                <div className="mt-4 rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/5 p-3 text-[10px] text-[#94A3B8]">
                  <span className="text-[#FFB300] font-bold font-hud uppercase tracking-wider">Security Note</span> — API keys are strictly configured via server environment variables. Never commit credentials to the code repository or save them locally.
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </FeatureGate>
  )
}

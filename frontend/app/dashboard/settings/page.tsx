"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import {
  User,
  Users,
  CreditCard,
  Lock,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  Volume2,
  Zap,
  Check,
  ChevronRight,
  Plus,
  Palette,
  Building2,
  Link as LinkIcon,
  Image as ImageIcon,
  Award
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardSettingsPage() {
  const { user } = useAuth()
  const { language, setLanguage, isSpanish } = useLanguage()
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "white-label" | "rules">("profile")
  
  // Simulated configuration state
  const [lockoutThreshold, setLockoutThreshold] = useState(80)
  const [rodriguezOverride, setRodriguezOverride] = useState(true)
  const [spanishAudioPriority, setSpanishAudioPriority] = useState(true)
  const [strictLockout, setStrictLockout] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState("tom")

  // White-label configuration state (Growth tier unlocked, Enterprise gated)
  const [companyName, setCompanyName] = useState("SeptiVolt")
  const [logoUrl, setLogoUrl] = useState("")
  const [brandColor, setBrandColor] = useState("#FF5722")
  const [engSlideUrl, setEngSlideUrl] = useState("")
  const [espSlideUrl, setEspSlideUrl] = useState("")
  const [wlSaved, setWlSaved] = useState(false)

  // Simulated Team Roster
  const [teamRoster, setTeamRoster] = useState([
    { name: "Sarah Connor", email: "sarah@septivolt.com", role: "Manager", status: "Active", lastActive: "2 hours ago" },
    { name: "John Doe", email: "john@septivolt.com", role: "Trainee", status: "Active", lastActive: "1 day ago" },
    { name: "Maria Rodriguez", email: "maria@septivolt.com", role: "Trainee", status: "Onboarding", lastActive: "Just now" },
    { name: "Alex Mercer", email: "alex@septivolt.com", role: "Admin", status: "Active", lastActive: "5 mins ago" },
  ])

  const t = (en: string, es: string) => (isSpanish ? es : en)

  return (
    <AppShell 
      heading={t("Operator Settings", "Configuración de Operador")}
      subheading={t("Manage profile, team access permissions, white-label configurations, and simulator rules.", "Gestione perfil, permisos de acceso al equipo, configuraciones de marca blanca y reglas del simulador.")}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        
        {/* Left Side Tab Navigation */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#1A1A1A] p-3 h-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full",
              activeTab === "profile" 
                ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]" 
                : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
            )}
          >
            <User className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <p className="truncate leading-none">{t("User Profile", "Perfil de Usuario")}</p>
              <span className="text-[10px] text-[#94A3B8] font-normal">{t("Personal preferences", "Preferencias personales")}</span>
            </div>
            <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", activeTab === "profile" ? "translate-x-0.5" : "text-transparent")} />
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full",
              activeTab === "team" 
                ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]" 
                : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
            )}
          >
            <Users className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <p className="truncate leading-none">{t("Team & Roster", "Equipo y Lista")}</p>
              <span className="text-[10px] text-[#94A3B8] font-normal">{t("Manage access roles", "Gestionar roles de acceso")}</span>
            </div>
            <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", activeTab === "team" ? "translate-x-0.5" : "text-transparent")} />
          </button>

          <button
            onClick={() => setActiveTab("white-label")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full",
              activeTab === "white-label" 
                ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]" 
                : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
            )}
          >
            <CreditCard className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <p className="truncate leading-none">{t("Billing & White-Label", "Facturación y Marca Blanca")}</p>
              <span className="text-[10px] text-[#94A3B8] font-normal">{t("Starter / Growth / Enterprise", "Starter / Growth / Enterprise")}</span>
            </div>
            <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", activeTab === "white-label" ? "translate-x-0.5" : "text-transparent")} />
          </button>

          <button
            onClick={() => setActiveTab("rules")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full",
              activeTab === "rules" 
                ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]" 
                : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <p className="truncate leading-none">{t("Simulator Rules", "Reglas del Simulador")}</p>
              <span className="text-[10px] text-[#94A3B8] font-normal">{t("Thresholds & lockouts", "Umbrales y bloqueos")}</span>
            </div>
            <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", activeTab === "rules" ? "translate-x-0.5" : "text-transparent")} />
          </button>
        </div>

        {/* Right Side Content Pane */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: USER PROFILE */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-[#FF5722]" />
                  {t("User Profile Preferences", "Preferencias del Perfil de Usuario")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {t("Configure your primary login parameters, training language, and active role scope.", "Configure sus parámetros de inicio de sesión primarios, idioma de capacitación y alcance de rol activo.")}
                </p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">{t("Username", "Nombre de usuario")}</label>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#CBD5E1]">
                    {user?.username ?? "SeptivoltOperator"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">{t("Assigned Role", "Rol Asignado")}</label>
                  <div className="rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/5 px-4 py-3 text-sm text-[#FFD54F] font-bold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#FF5722]" />
                    {user?.role ? user.role.toUpperCase() : "MANAGER"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">{t("Preferred Language", "Idioma Preferido")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLanguage("en")}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2",
                        !isSpanish 
                          ? "border-[#FF5722] bg-[#FF5722]/10 text-white" 
                          : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                      )}
                    >
                      <Globe className="h-4 w-4" /> English
                    </button>
                    <button
                      onClick={() => setLanguage("es")}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2",
                        isSpanish 
                          ? "border-[#FF5722] bg-[#FF5722]/10 text-white" 
                          : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                      )}
                    >
                      <Globe className="h-4 w-4" /> Español
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">{t("Active Voice Over Style", "Estilo de Narración de Voz")}</label>
                  <select 
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-xs text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                  >
                    <option value="tom">Tom (Default US Professional)</option>
                    <option value="rachel">Rachel (US Energetic Coach)</option>
                    <option value="dom">Dom (US Senior Executive)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM & ROSTER */}
          {activeTab === "team" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#FF5722]" />
                    {t("Team Roster & Access Scopes", "Lista de Equipo y Alcances de Acceso")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {t("Manage roles, track activity telemetry, and invite trainees under your workspace organization.", "Gestione roles, rastree la telemetría de actividad e invite a aprendices bajo la organización de su espacio de trabajo.")}
                  </p>
                </div>

                <button className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-hud uppercase tracking-wider shrink-0 self-start sm:self-center">
                  <Plus className="h-4 w-4" />
                  {t("Invite Rep", "Invitar Representante")}
                </button>
              </div>

              <div className="h-px bg-white/5 w-full" />

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/5">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm text-[#CBD5E1]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-xs font-bold text-[#64748B] uppercase tracking-wider font-hud">
                      <th className="px-6 py-4">{t("Team Member", "Miembro del Equipo")}</th>
                      <th className="px-6 py-4">{t("Role", "Rol")}</th>
                      <th className="px-6 py-4">{t("Status", "Estado")}</th>
                      <th className="px-6 py-4">{t("Last Active", "Última Actividad")}</th>
                      <th className="px-6 py-4 text-right">{t("Actions", "Acciones")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamRoster.map((rep) => (
                      <tr key={rep.email} className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFB300] flex items-center justify-center font-bold text-white text-xs">
                              {rep.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{rep.name}</p>
                              <p className="text-xs text-[#94A3B8]">{rep.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "rounded px-2.5 py-1 text-[10px] font-hud uppercase tracking-wider font-bold",
                            rep.role === "Admin" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                            rep.role === "Manager" ? "bg-blue-500/10 text-blue-400 border border-blue-500/25" :
                            "bg-green-500/10 text-green-400 border border-green-500/25"
                          )}>
                            {rep.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "h-2 w-2 rounded-full",
                              rep.status === "Active" ? "bg-green-400 animate-pulse" : "bg-amber-400"
                            )} />
                            <span className="text-xs">{rep.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#94A3B8]">
                          {rep.lastActive}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs text-[#FFD54F] hover:text-[#FF5722] font-semibold uppercase tracking-wider font-hud">
                            {t("Edit", "Editar")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING & WHITE-LABEL */}
          {activeTab === "white-label" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#FF5722]" />
                  {t("White-Label & Brand Configuration", "Configuración de Marca")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {t("Customize workspace identity, training slide URLs, voice settings, and certificate branding.", "Personalice la identidad del espacio de trabajo, URLs de diapositivas y configuración de voz.")}
                </p>
              </div>

              <div className="h-px bg-white/5" />

              {/* Billing Tiers */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-widest text-[#64748B]">Starter</p>
                    <h4 className="font-display font-bold text-2xl text-white mt-1">$149<span className="text-xs font-normal text-[#94A3B8]">/mo</span></h4>
                    <p className="text-xs text-[#94A3B8] mt-1">{t("Basic simulation core.", "Simulación básica.")}</p>
                  </div>
                  <p className="mt-3 text-[10px] font-hud uppercase tracking-wide text-[#64748B]">Inactive</p>
                </div>
                <div className="rounded-xl border border-[#FF5722]/50 bg-[#FF5722]/5 p-4 relative flex flex-col justify-between shadow-[0_0_20px_rgba(255,87,34,0.1)]">
                  <div className="absolute top-0 right-0 bg-[#FF5722] px-2 py-0.5 text-[9px] font-hud uppercase font-black text-white tracking-widest">{t("ACTIVE", "ACTIVO")}</div>
                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-widest text-[#FFB300]">Growth</p>
                    <h4 className="font-display font-bold text-2xl text-white mt-1">$499<span className="text-xs font-normal text-[#94A3B8]">/mo</span></h4>
                    <p className="text-xs text-[#CBD5E1] mt-1">{t("Bilingual slides, team pipelines, analytics.", "Diapositivas bilingües, analíticas.")}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-green-400">
                    <Check className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-hud uppercase tracking-wide font-black">{t("Current Tier", "Nivel Actual")}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-widest text-[#FFD54F]">Enterprise</p>
                    <h4 className="font-display font-bold text-2xl text-white mt-1">$1,299<span className="text-xs font-normal text-[#94A3B8]">/mo</span></h4>
                    <p className="text-xs text-[#94A3B8] mt-1">{t("Full white-label, custom domain, dedicated API.", "Marca blanca completa, dominio propio.")}</p>
                  </div>
                  <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FFB300] text-xs font-bold text-white uppercase tracking-wider font-hud hover:shadow-[0_0_15px_rgba(255,87,34,0.3)] transition-all">{t("Upgrade", "Actualizar")}</button>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Brand Identity — Growth unlocked */}
              <div className="space-y-4">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" /> {t("Brand Identity", "Identidad de Marca")}
                  <span className="badge-primary ml-1">Growth</span>
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Company / Workspace Name", "Nombre de Empresa")}</label>
                    <input
                      value={companyName}
                      onChange={e => { setCompanyName(e.target.value); setWlSaved(false) }}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                      placeholder="SeptiVolt"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Logo URL", "URL del Logo")}</label>
                    <div className="flex gap-2">
                      <input
                        value={logoUrl}
                        onChange={e => { setLogoUrl(e.target.value); setWlSaved(false) }}
                        className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                        placeholder="https://cdn.example.com/logo.png"
                      />
                      <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                        {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" onError={() => {}} /> : <ImageIcon className="h-5 w-5 text-[#64748B]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Color + Certificate Preview */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Primary Brand Color", "Color Principal")}</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={e => { setBrandColor(e.target.value); setWlSaved(false) }}
                        className="h-10 w-10 rounded-lg border border-white/10 bg-[#121212] cursor-pointer p-0.5"
                      />
                      <input
                        value={brandColor}
                        onChange={e => { setBrandColor(e.target.value); setWlSaved(false) }}
                        className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-4 py-2.5 text-sm text-[#CBD5E1] font-mono outline-none focus:border-[#FF5722]/50"
                      />
                    </div>
                  </div>
                  {/* Certificate branding preview */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Certificate Branding Preview", "Vista Previa de Certificado")}</label>
                    <div className="rounded-xl border border-white/10 bg-[#121212] p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: brandColor + "20", border: `1px solid ${brandColor}40` }}>
                        <Award className="h-5 w-5" style={{ color: brandColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{companyName || "SeptiVolt"}</p>
                        <p className="text-[10px] text-[#94A3B8]">Certificate of Completion · Day 1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Slide URL Overrides — Growth */}
              <div className="space-y-3">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2">
                  <LinkIcon className="h-3.5 w-3.5" /> {t("Training Slide URLs", "URLs de Diapositivas")}
                  <span className="badge-primary ml-1">Growth</span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">English Slides (Google Slides embed URL)</label>
                    <input
                      value={engSlideUrl}
                      onChange={e => { setEngSlideUrl(e.target.value); setWlSaved(false) }}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                      placeholder="https://docs.google.com/presentation/d/.../embed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Spanish Slides (URL de Diapositivas en Español)</label>
                    <input
                      value={espSlideUrl}
                      onChange={e => { setEspSlideUrl(e.target.value); setWlSaved(false) }}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                      placeholder="https://docs.google.com/presentation/d/.../embed"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Voice Config Placeholder */}
              <div className="space-y-3">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5" /> {t("Voice Configuration", "Configuración de Voz")}
                  <span className="badge-primary ml-1">Growth</span>
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">{t("Default Narration Voice", "Voz Predeterminada")}</label>
                  <select className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50">
                    <option value="tom">Tom — US Professional (Default)</option>
                    <option value="rachel">Rachel — US Energetic Coach</option>
                    <option value="dom">Dom — US Senior Executive</option>
                  </select>
                </div>
              </div>

              {/* Enterprise-only: Domain + API key */}
              <div className="rounded-xl border border-[#FFB300]/25 bg-[#FFB300]/5 p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4 z-10 rounded-xl">
                  <ShieldAlert className="h-7 w-7 text-[#FFB300] mb-2" />
                  <p className="font-display font-bold text-white text-sm">{t("Enterprise: Custom Domain & API Keys", "Enterprise: Dominio y Claves API")}</p>
                  <p className="text-xs text-[#94A3B8] max-w-sm mt-1">{t("Custom training subdomain and dedicated ElevenLabs API key require an Enterprise plan.", "El subdominio personalizado y la clave API de ElevenLabs requieren el plan Enterprise.")}</p>
                  <button className="mt-3 rounded-lg border border-[#FFB300]/40 bg-[#FFB300]/10 px-4 py-1.5 text-[10px] font-hud uppercase tracking-wider font-black text-[#FFD54F] hover:bg-[#FFB300]/20 transition-all">{t("Upgrade to Enterprise", "Actualizar a Enterprise")}</button>
                </div>
                <div className="space-y-3 filter blur-[2px] pointer-events-none select-none">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Custom Workspace Domain</label>
                  <div className="rounded-lg border border-white/5 bg-[#121212] px-3 py-2 text-xs text-slate-400">training.yourdomain.com</div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">ElevenLabs API Key</label>
                  <div className="rounded-lg border border-white/5 bg-[#121212] px-3 py-2 text-xs text-slate-400 font-mono">el_••••••••••••••••</div>
                </div>
              </div>

              <button
                onClick={() => setWlSaved(true)}
                className={cn("btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2 transition-all", wlSaved ? "opacity-70" : "")}
              >
                {wlSaved ? <><Check className="h-4 w-4" /> {t("Saved", "Guardado")}</> : <><Zap className="h-4 w-4" /> {t("Save Brand Configuration", "Guardar Configuración")}</>}
              </button>
            </div>
          )}

          {/* TAB 4: SIMULATOR RULES */}
          {activeTab === "rules" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#FF5722]" />
                  {t("Simulator Gating & Curriculum Rules", "Reglas del Simulador y Gating")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {t("Configure strict certification score requirements, automatic simulator lockouts, and voice behavior defaults.", "Configure requisitos estrictos de puntaje de certificación, bloqueos automáticos del simulador y comportamientos de voz por defecto.")}
                </p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-5">
                {/* Rule 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-sm">{t("Default Quiz Unlock Threshold", "Umbral de Desbloqueo por Defecto")}</p>
                    <p className="text-xs text-[#94A3B8]">{t("Reps must clear lessons quizzes at this minimum score to unlock simulator scenarios.", "Representantes deben pasar los exámenes de lección con este puntaje mínimo para desbloquear los escenarios del simulador.")}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input 
                      type="range" 
                      min="60" 
                      max="100" 
                      step="5" 
                      value={lockoutThreshold}
                      onChange={(e) => setLockoutThreshold(Number(e.target.value))}
                      className="accent-[#FF5722] cursor-pointer"
                    />
                    <span className="font-hud text-sm font-bold text-[#FFD54F] min-w-[40px] text-right">{lockoutThreshold}%</span>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-sm">{t("Strict Curriculum Gating Lockout", "Bloqueo Estricto de Gating")}</p>
                    <p className="text-xs text-[#94A3B8]">{t("Require complete lesson passing before simulator launch is accessible.", "Requiere aprobación completa de la lección antes de que el lanzamiento del simulador sea accesible.")}</p>
                  </div>
                  <button 
                    onClick={() => setStrictLockout(!strictLockout)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative shrink-0",
                      strictLockout ? "bg-[#FF5722]" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                      strictLockout ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                {/* Rule 3 */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-sm">{t("Rodriguez Family 100% Passing Target", "Meta de Aprobación del 100% de la Familia Rodríguez")}</p>
                    <p className="text-xs text-[#94A3B8]">{t("Enforce maximum perfection standard score threshold target mapping override for high-pressure certification scenarios.", "Aplicar un umbral de puntuación estándar máximo de perfección para el escenario de certificación bajo alta presión.")}</p>
                  </div>
                  <button 
                    onClick={() => setRodriguezOverride(!rodriguezOverride)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative shrink-0",
                      rodriguezOverride ? "bg-[#FF5722]" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                      rodriguezOverride ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                {/* Rule 4 */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-sm">{t("Spanish Audio Fallback Priority", "Prioridad de Fallback de Audio en Español")}</p>
                    <p className="text-xs text-[#94A3B8]">{t("Prioritize real-time Spanish synthesizers when localized static assets are missing, instead of reverting to English narrator voices.", "Priorice sintetizadores de español en tiempo real si faltan recursos estáticos, en lugar de volver a las voces de narrador en inglés.")}</p>
                  </div>
                  <button 
                    onClick={() => setSpanishAudioPriority(!spanishAudioPriority)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative shrink-0",
                      spanishAudioPriority ? "bg-[#FF5722]" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                      spanishAudioPriority ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  )
}

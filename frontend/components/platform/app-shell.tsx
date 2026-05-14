"use client"

import { cn } from "@/lib/utils"
import { Bell, Search, Sparkles, Trophy, X, Zap, BarChart3, CreditCard, BookOpen, Menu } from "lucide-react"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import { ModuleNavigator } from "./module-navigator"
import {
  RecentActivity,
  getRecentActivity,
  formatTimeAgo,
} from "@/lib/dashboard-data"
import { useLanguage } from "@/context/language-context"
import { LogOut, Globe } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { FeatureGate } from "@/components/auth/FeatureGate"
import { WHITE_LABEL } from "@/lib/white-label.config"
import { ShieldCheck } from "lucide-react"

export function AppShell({
  children,
  heading,
  subheading,
}: {
  children: ReactNode
  heading: string
  subheading: string
}) {
  const { user, logout } = useAuth()
  const { locale, setLocale, t } = useLanguage()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activities, setActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    setActivities(getRecentActivity())
  }, [])

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "es" : "en")
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-body">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 border-r border-white/5 bg-[#1A1A1A] lg:block">
          <SidebarContent t={t} logout={logout} />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] border-r border-white/5 animate-in slide-in-from-left duration-300">
              <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-[#FF5722] mr-2" />
                  <span className="font-display font-black text-xl tracking-tight">{WHITE_LABEL.companyName.toUpperCase()}</span>
                  {WHITE_LABEL.isDemoMode && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 font-bold uppercase tracking-widest">
                      Demo
                    </span>
                  )}
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#64748B] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent t={t} logout={logout} onLinkClick={() => setMobileMenuOpen(false)} />
            </aside>
          </div>
        )}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(18,18,18,0.88)] backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#CBD5E1]"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <p className="font-hud text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                  {t("header_tag", { en: "Sales Training OS", es: "Sistema de Entrenamiento" })} {user && `// Rep: ${user.id}`}
                </p>
                <h1 className="truncate font-display text-2xl font-black text-white">{heading}</h1>
                <p className="mt-1 hidden text-sm text-[#94A3B8] sm:block">{subheading}</p>
              </div>

              <div className="hidden flex-1 justify-center lg:flex px-4">
                <ModuleNavigator />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-[#FFD54F] transition-colors hover:border-[#FF5722]/30"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {locale.toUpperCase()}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#CBD5E1] transition-colors hover:border-[#FF5722]/30"
                  >
                    <Bell className="h-4 w-4" />
                    {activities.length > 0 && (
                      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#FFB300] shadow-[0_0_10px_rgba(255,179,0,0.7)]" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 shadow-2xl brand-glow-subtle z-50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-hud text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                          {t("recent_activity", { en: "Recent Activity", es: "Actividad Reciente" })}
                        </p>
                        <button onClick={() => setNotificationsOpen(false)} className="text-[#64748B] hover:text-white">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {activities.length > 0 ? (
                          activities.map((activity) => (
                            <div key={`${activity.id}-${activity.timestamp}`} className="rounded-xl border border-white/5 bg-white/5 p-3">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg border",
                                  activity.type === "simulation" ? "border-[#FF5722]/20 bg-[#FF5722]/10 text-[#FF5722]" :
                                  activity.type === "quiz" ? "border-[#FFB300]/20 bg-[#FFB300]/10 text-[#FFB300]" :
                                  "border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]"
                                )}>
                                  {activity.type === "simulation" ? <Zap className="h-4 w-4" /> : 
                                   activity.type === "quiz" ? <Sparkles className="h-4 w-4" /> : 
                                   <Search className="h-4 w-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-white">{activity.title}</p>
                                  <p className="text-[10px] text-[#94A3B8]">
                                    {formatTimeAgo(activity.timestamp)} {t("ago", { en: "ago", es: "atrás" })}
                                    {activity.score !== undefined && ` • ${t("score", { en: "Score", es: "Puntaje" })}: ${activity.score}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-xs text-[#64748B]">
                            {t("no_activity", { en: "No recent activity found.", es: "No se encontró actividad reciente." })}
                          </div>
                        )}
                        <Link 
                          href="/dashboard" 
                          onClick={() => setNotificationsOpen(false)}
                          className="block pt-2 text-center text-[10px] font-hud uppercase tracking-[0.16em] text-[#FF5722] hover:text-[#FFB300]"
                        >
                          {t("view_history", { en: "View full performance history", es: "Ver historial completo" })}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={logout}
                  title={t("logout", { en: "Logout", es: "Cerrar Sesión" })}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#CBD5E1] transition-colors hover:border-red-500/30 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ t, logout, onLinkClick }: { t: any, logout: () => void, onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {!onLinkClick && (
        <div className="flex h-16 items-center px-6 border-b border-white/5">
          <Zap className="h-6 w-6 text-[#FF5722] mr-2" />
          <span className="font-display font-black text-xl tracking-tight">{WHITE_LABEL.companyName.toUpperCase()}</span>
          {WHITE_LABEL.isDemoMode && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 font-bold uppercase tracking-widest">
              Demo
            </span>
          )}
        </div>
      )}
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/dashboard" 
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white"
        >
          <Zap className="h-4 w-4" /> {t("nav_dashboard", { en: "Dashboard", es: "Panel" })}
        </Link>
        {WHITE_LABEL.isDemoMode && (
          <Link 
            href="/manager" 
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF5722]/10 hover:bg-[#FF5722]/20 transition-colors text-sm font-bold text-[#FF5722]"
          >
            <ShieldCheck className="h-4 w-4" /> Manager Console
          </Link>
        )}
        <Link 
          href="/my-training" 
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white"
        >
          <BookOpen className="h-4 w-4" /> {t("nav_curriculum", { en: "Curriculum", es: "Currículo" })}
        </Link>
        <Link 
          href="/ai-simulator" 
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white"
        >
          <Sparkles className="h-4 w-4" /> {t("nav_simulator", { en: "AI Simulator", es: "Simulador IA" })}
        </Link>
        
        <FeatureGate allowedRoles={["admin", "manager"]}>
          <div className="pt-4 pb-2 px-4">
            <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
              {t("nav_mgmt", { en: "Management", es: "Administración" })}
            </p>
          </div>
          
          <Link 
            href="/dashboard/usage" 
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white"
          >
            <BarChart3 className="h-4 w-4" /> {t("nav_usage", { en: "Usage Analytics", es: "Analítica de Uso" })}
          </Link>

          <Link 
            href="/settings/billing" 
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white"
          >
            <CreditCard className="h-4 w-4" /> {t("nav_billing", { en: "Billing & Plans", es: "Facturación" })}
          </Link>
        </FeatureGate>
        
        <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
          <Link 
            href="/leaderboards" 
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white text-[#FFB300]"
          >
            <Trophy className="h-4 w-4" /> {t("nav_rankings", { en: "Team Rankings", es: "Clasificación" })}
          </Link>
        </FeatureGate>
      </nav>
      
      {onLinkClick && (
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => {
              onLinkClick();
              logout();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium text-red-400"
          >
            <LogOut className="h-4 w-4" /> {t("logout", { en: "Logout", es: "Cerrar Sesión" })}
          </button>
        </div>
      )}
    </div>
  )
}

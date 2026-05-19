"use client"

import { cn } from "@/lib/utils"
import { Bell, BookOpen, History, Search, Sparkles, Trophy, X, Zap, Menu, Settings, Award, User, Users, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import {
  RecentActivity,
  getRecentActivity,
  formatTimeAgo,
} from "@/lib/dashboard-data"
import { useAuth } from "@/context/AuthContext"
import { LogOut } from "lucide-react"
import { FeatureGate } from "@/components/auth/FeatureGate"
import { isDemoModeActive } from "@/lib/demo-mode"
import { useLanguage } from "@/hooks/use-language"

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
  const { isSpanish } = useLanguage()
  const t = (en: string, es: string) => isSpanish ? es : en
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setActivities(getRecentActivity())
    setIsDemo(isDemoModeActive())
  }, [])

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#121212] text-white font-body">
      <div className="flex min-h-screen">
        {/* Sidebar for Navigation */}
        <aside className="hidden w-64 border-r border-white/5 bg-[#1A1A1A] lg:block">
          <div className="flex h-16 items-center px-6 border-b border-white/5">
            <Zap className="h-6 w-6 text-[#FF5722] mr-2" />
            <span className="font-display font-black text-xl tracking-tight">SEPTIVOLT</span>
          </div>
          <nav className="p-4 space-y-1">
            {/* ── Core Navigation ── */}
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Zap className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/my-training" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <BookOpen className="h-4 w-4" /> My Training
            </Link>
            <Link href="/ai-simulator" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Sparkles className="h-4 w-4" /> AI Simulator
            </Link>
            <Link href="/certifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Award className="h-4 w-4" /> Certifications
            </Link>

            {/* ── Account ── */}
            <div className="pt-4 pb-1 px-4">
              <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Account</p>
            </div>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Settings className="h-4 w-4" /> Settings
            </Link>

            {/* ── Management (tier-gated) ── */}
            <FeatureGate allowedTiers={["growth", "enterprise"]}>
              <div className="pt-4 pb-1 px-4">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Management</p>
              </div>
              <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
                <Search className="h-4 w-4" /> Analytics
              </Link>
              <Link href="/analytics/debriefs" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-400 hover:text-white ml-3">
                <History className="h-3.5 w-3.5" /> AI Coaching Reports
              </Link>
            </FeatureGate>

            <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
              <Link href="/leaderboards" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white text-[#FFB300]">
                <Trophy className="h-4 w-4" /> Team Rankings
              </Link>
            </FeatureGate>

            <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
              <Link href="/team-hub" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
                <Users className="h-4 w-4 text-blue-400" /> Manager Command Center
              </Link>
            </FeatureGate>

            <FeatureGate allowedRoles={["admin"]}>
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-red-400 hover:text-white">
                <ShieldAlert className="h-4 w-4" /> Admin Control Center
              </Link>
            </FeatureGate>
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(18,18,18,0.88)] backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#CBD5E1] transition-colors hover:border-[#FF5722]/30 lg:hidden shrink-0"
                aria-label="Toggle Navigation Drawer"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <p className="font-hud text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                  Sales Training OS {user && `// Rep: ${user.username}`}
                </p>
                <h1 className="truncate font-display text-2xl font-black text-white">{heading}</h1>
                <p className="mt-1 hidden text-sm text-[#94A3B8] sm:block">{subheading}</p>
              </div>

              <div className="hidden min-w-[280px] flex-1 justify-center lg:flex">
                <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#94A3B8]">
                  <Search className="h-4 w-4" />
                  <input
                    aria-label="Search"
                    placeholder="Search modules, simulations, or reps"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#64748B]"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
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

                  <button 
                    onClick={logout}
                    title="Logout"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#CBD5E1] transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 shadow-2xl brand-glow-subtle z-50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-hud text-[11px] uppercase tracking-[0.24em] text-[#64748B]">Recent Activity</p>
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
                                    {formatTimeAgo(activity.timestamp)} ago
                                    {activity.score !== undefined && ` • Score: ${activity.score}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-xs text-[#64748B]">
                            No recent activity found.
                          </div>
                        )}
                        <Link 
                          href="/dashboard" 
                          onClick={() => setNotificationsOpen(false)}
                          className="block pt-2 text-center text-[10px] font-hud uppercase tracking-[0.16em] text-[#FF5722] hover:text-[#FFB300]"
                        >
                          View full performance history
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {isDemo && (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between gap-3 text-xs text-amber-400">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>
                    <strong>{t("Safe Demo Mode Active", "Modo de Demostración Seguro Activo")}:</strong>{" "}
                    {t(
                      "Sample enterprise data is being displayed. Real user data remains untouched.",
                      "Se muestran datos de muestra de la empresa. Los datos de usuarios reales no se modifican."
                    )}
                  </span>
                </div>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#121212] h-[100dvh] overflow-y-auto w-full flex flex-col lg:hidden">
          {/* Header Bar matching app shell header height */}
          <div className="flex justify-between items-center h-16 px-4 border-b border-white/5 bg-[#1A1A1A]">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-[#FF5722] mr-2" />
              <span className="font-display font-black text-xl tracking-tight text-white uppercase italic">SEPTIVOLT</span>
            </div>
            <button 
              className="text-slate-400 hover:text-white min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <nav className="p-6 space-y-1 flex-1">
            {/* ── Core Navigation ── */}
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <Zap className="h-5 w-5 text-[#FF5722]" /> Dashboard
            </Link>
            <Link 
              href="/my-training" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <BookOpen className="h-5 w-5 text-[#22D3EE]" /> My Training
            </Link>
            <Link 
              href="/ai-simulator" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <Sparkles className="h-5 w-5 text-[#FFB300]" /> AI Simulator
            </Link>
            <Link 
              href="/certifications" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <Award className="h-5 w-5 text-[#FFD54F]" /> Certifications
            </Link>

            <div className="h-px bg-white/5 w-full my-2" />

            {/* ── Account (all users) ── */}
            <p className="px-4 py-1 font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Account</p>
            <Link 
              href="/settings" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <User className="h-5 w-5 text-[#94A3B8]" /> Profile
            </Link>
            <Link 
              href="/dashboard/settings" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
            >
              <Settings className="h-5 w-5 text-[#FFD54F]" /> Settings
            </Link>

            <div className="h-px bg-white/5 w-full my-2" />

            {/* ── Management (tier-gated) ── */}
            <FeatureGate allowedTiers={["growth", "enterprise"]}>
              <p className="px-4 py-1 font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Management</p>
              <Link 
                href="/analytics" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
              >
                <Search className="h-5 w-5 text-[#22D3EE]" /> Analytics
              </Link>
              <Link 
                href="/analytics/debriefs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-base font-medium text-slate-400 hover:text-white ml-4"
              >
                <History className="h-4 w-4 text-indigo-400" /> AI Coaching Reports
              </Link>
            </FeatureGate>
            <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
              <Link
                href="/leaderboards"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-[#FFB300] hover:text-white"
              >
                <Trophy className="h-5 w-5" /> Team Rankings
              </Link>
            </FeatureGate>
            <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
              <Link
                href="/team-hub"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-slate-300 hover:text-white"
              >
                <Users className="h-5 w-5 text-blue-400" /> Manager Command Center
              </Link>
            </FeatureGate>
            <FeatureGate allowedRoles={["admin"]}>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg font-medium text-red-400 hover:text-white"
              >
                <ShieldAlert className="h-5 w-5" /> Admin Control Center
              </Link>
            </FeatureGate>
          </nav>
        </div>
      )}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { Bell, Search, Sparkles, Trophy, X, Zap } from "lucide-react"
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activities, setActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    setActivities(getRecentActivity())
  }, [])

  return (
    <div className="min-h-screen bg-[#121212] text-white font-body">
      <div className="flex min-h-screen">
        {/* Sidebar for Navigation */}
        <aside className="hidden w-64 border-r border-white/5 bg-[#1A1A1A] lg:block">
          <div className="flex h-16 items-center px-6 border-b border-white/5">
            <Zap className="h-6 w-6 text-[#FF5722] mr-2" />
            <span className="font-display font-black text-xl tracking-tight">SEPTIVOLT</span>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Zap className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/ai-simulator" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
              <Sparkles className="h-4 w-4" /> AI Simulator
            </Link>
            
            <FeatureGate allowedTiers={["growth", "enterprise"]}>
              <div className="pt-4 pb-2 px-4">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">Management</p>
              </div>
              
              <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white">
                <Search className="h-4 w-4" /> Analytics
              </Link>
            </FeatureGate>
            
            <FeatureGate allowedRoles={["admin", "manager"]} allowedTiers={["growth", "enterprise"]}>
              <Link href="/leaderboards" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white text-[#FFB300]">
                <Trophy className="h-4 w-4" /> Team Rankings
              </Link>
            </FeatureGate>
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(18,18,18,0.88)] backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
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
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 shadow-2xl solar-glow-subtle z-50">
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

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { LogOut, Flame, Trophy, BarChart3, Zap } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
    user: any
    tenant: any
    userLevel: string
    xp: number
    streak: number
    onLogout: () => void
}

export function DashboardHeader({ user, tenant, userLevel, xp, streak, onLogout }: DashboardHeaderProps) {
    const maxXp = 1000
    const progress = Math.min((xp / maxXp) * 100, 100)

    return (
        <header className="sticky top-0 z-50 border-b"
            style={{
                background: 'rgba(18,18,18,0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(255,87,34,0.12)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,87,34,0.08)'
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center gap-4">

                    {/* ── Left: Brand Wordmark ───────────────────────────── */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg"
                            style={{ background: 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.3)' }}>
                            <Zap className="w-5 h-5" style={{ color: '#FF5722', filter: 'drop-shadow(0 0 6px #FF5722)' }} />
                        </div>
                        <div>
                            <span className="font-display text-lg font-black text-white tracking-tight">
                                Septi<span style={{ color: '#FF5722', textShadow: '0 0 12px rgba(255,87,34,0.5)' }}>Volt</span>
                            </span>
                            <p className="font-hud text-[9px] leading-none mt-0.5" style={{ color: '#94A3B8', letterSpacing: '0.12em' }}>
                                CADET · {user?.name?.toUpperCase() || 'AGENT'}
                            </p>
                        </div>
                    </div>

                    {/* ── Center: Gamification HUD ──────────────────────── */}
                    <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full"
                        style={{
                            background: 'rgba(18,18,18,0.7)',
                            border: '1px solid rgba(255,87,34,0.12)',
                            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
                        }}>

                        {/* Streak */}
                        <div className="flex items-center gap-2" title="Daily Training Streak">
                            <Flame className={`w-4 h-4 transition-all ${streak > 0 ? 'fill-current drop-shadow-md' : ''}`}
                                style={{ color: streak > 0 ? '#FFB300' : '#475569', filter: streak > 0 ? 'drop-shadow(0 0 6px #FFB300)' : 'none' }} />
                            <div className="flex flex-col leading-none">
                                <span className="font-hud text-[10px]" style={{ color: '#94A3B8', letterSpacing: '0.08em' }}>STREAK</span>
                                <span className="font-hud text-sm font-bold" style={{ color: streak > 0 ? '#FFB300' : '#475569' }}>
                                    {streak}d
                                </span>
                            </div>
                        </div>

                        <div className="w-px h-8" style={{ background: 'rgba(255,87,34,0.12)' }} />

                        {/* XP + Level */}
                        <div className="flex items-center gap-3 min-w-[220px]">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg"
                                style={{ background: 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.2)' }}>
                                <Trophy className="w-3.5 h-3.5" style={{ color: '#FF5722' }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-hud text-[9px] font-bold uppercase tracking-widest" style={{ color: '#FF5722' }}>
                                        {userLevel}
                                    </span>
                                    <span className="font-hud text-[10px]" style={{ color: '#94A3B8' }}>
                                        {xp.toLocaleString()} / {maxXp.toLocaleString()} XP
                                    </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <div className="h-full rounded-full transition-all duration-700 ease-out volt-progress"
                                        style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="w-px h-8" style={{ background: 'rgba(255,87,34,0.12)' }} />

                        {/* 7-Day Progress Dots */}
                        <div className="flex items-center gap-1.5" title="7-Day Accelerator Progress">
                            {Array.from({ length: 7 }, (_, i) => {
                                const dayNum = i + 1
                                // Determine completion based on xp milestones (mock: each day = 142 xp)
                                const earned = xp >= dayNum * 142
                                return (
                                    <div key={i} className="flex flex-col items-center gap-0.5">
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300`}
                                            style={earned
                                                ? { background: '#FFB300', boxShadow: '0 0 8px rgba(255,179,0,0.7)' }
                                                : i === Math.floor(xp / 142)
                                                    ? { background: '#FF5722', boxShadow: '0 0 8px rgba(255,87,34,0.7)', animation: 'voltPulse 2s ease-in-out infinite' }
                                                    : { background: '#1E293B', border: '1px solid rgba(255,87,34,0.2)' }
                                            }
                                        />
                                        <span className="font-hud text-[7px]" style={{ color: '#475569' }}>{dayNum}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Right: Actions ─────────────────────────────────── */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Mobile streak */}
                        <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(255,87,34,0.08)', border: '1px solid rgba(255,87,34,0.15)' }}>
                            <Flame className="w-4 h-4" style={{ color: '#FFB300', filter: 'drop-shadow(0 0 4px #FFB300)' }} />
                            <span className="font-hud text-sm font-bold" style={{ color: '#FFB300' }}>{streak}</span>
                        </div>

                        <Link href="/kpis">
                            <Button variant="outline" size="sm"
                                className="font-display font-semibold text-xs transition-all"
                                style={{
                                    borderColor: 'rgba(255,87,34,0.3)',
                                    color: '#FF5722',
                                    background: 'rgba(255,87,34,0.05)'
                                }}>
                                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                                <span className="hidden sm:inline">KPI Tracker</span>
                            </Button>
                        </Link>

                        <Button variant="ghost" size="sm" onClick={onLogout}
                            className="font-body text-xs transition-all"
                            style={{ color: '#94A3B8' }}>
                            <LogOut className="w-3.5 h-3.5 mr-1.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

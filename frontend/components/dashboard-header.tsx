import { Button } from "@/components/ui/button"
import { LogOut, Flame, Star, Trophy, Sparkles } from "lucide-react"

interface DashboardHeaderProps {
    user: any
    tenant: any
    userLevel: string
    xp: number
    streak: number
    onLogout: () => void
}

export function DashboardHeader({ user, tenant, userLevel, xp, streak, onLogout }: DashboardHeaderProps) {
    const maxXp = 1000 // Mock max XP for level
    const progress = Math.min((xp / maxXp) * 100, 100)

    return (
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Left: Branding & User */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-pulse"></div>
                            <div className="relative p-2 bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl border border-blue-500/30">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white leading-tight font-display tracking-wide">{tenant.name} <span className="text-blue-500">Academy</span></h1>
                            <p className="text-sm text-slate-400">Welcome, Cadet {user.name}</p>
                        </div>
                    </div>

                    {/* Center: Gamification Stats */}
                    <div className="hidden md:flex items-center gap-8 bg-slate-900/50 px-6 py-2 rounded-full border border-white/10 shadow-inner">
                        {/* Streak */}
                        <div className="flex items-center gap-2 group" title="Daily Streak">
                            <Flame className={`w-5 h-5 transition-all ${streak > 0 ? 'text-orange-500 fill-orange-500 group-hover:scale-110 drop-shadow-lg' : 'text-slate-600'}`} />
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{streak} Day Streak</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-white/10"></div>

                        {/* Level & XP */}
                        <div className="flex items-center gap-4 min-w-[240px]">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Trophy className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-bold text-blue-200 uppercase tracking-widest text-[10px]">{userLevel}</span>
                                    <span className="text-blue-400 font-mono">{xp} / {maxXp} XP</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <div className="md:hidden flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-white/10">
                            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                            <span className="text-sm font-bold text-slate-200">{streak}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

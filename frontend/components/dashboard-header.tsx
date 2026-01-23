import { Button } from "@/components/ui/button"
import { LogOut, Flame, Star, Trophy } from "lucide-react"

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
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Left: Branding & User */}
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">{tenant.name} Training</h1>
                            <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
                        </div>
                    </div>

                    {/* Center: Gamification Stats */}
                    <div className="hidden md:flex items-center gap-8 bg-slate-50 px-6 py-2 rounded-full border">
                        {/* Streak */}
                        <div className="flex items-center gap-2" title="Daily Streak">
                            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'}`} />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">{streak} Day Streak</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200"></div>

                        {/* Level & XP */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                                <Trophy className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700">{userLevel}</span>
                                    <span className="text-slate-500">{xp} / {maxXp} XP</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <div className="md:hidden flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-bold">{streak}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-500 hover:text-red-600">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

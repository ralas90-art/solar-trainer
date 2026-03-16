"use client"

import { useEffect, useState } from "react"
import { getApiUrl } from "@/lib/utils"
// Note: We use basic divs instead of Card to have full control over the glass effect
import { Trophy, Flame, Crown, Medal } from "lucide-react"

interface UserStats {
    user_id: string
    total_score: number
    current_streak: number
    highest_streak: number
}

export function LeaderboardUI() {
    const [leaders, setLeaders] = useState<UserStats[]>([])

    useEffect(() => {
        const API_URL = getApiUrl()
        fetch(`${API_URL}/leaderboard`)
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error("Failed to load leaderboard", err))
    }, [])

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        if (index === 1) return <Medal className="w-5 h-5 text-slate-300" />
        if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />
        return <span className="font-mono text-slate-500">#{index + 1}</span>
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-white/10">
            <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 p-4 border-b border-white/5 backdrop-blur-sm">
                <h3 className="flex items-center gap-2 font-bold text-yellow-500 uppercase tracking-widest text-sm">
                    <Trophy className="w-5 h-5" /> Top Performers
                </h3>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-4 py-3 font-medium tracking-wider">Rank</th>
                            <th className="px-4 py-3 font-medium tracking-wider">Cadet</th>
                            <th className="px-4 py-3 text-right font-medium tracking-wider">XP</th>
                            <th className="px-4 py-3 text-right font-medium tracking-wider">Streak</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leaders.map((user, index) => (
                            <tr key={user.user_id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/5 group-hover:border-yellow-500/30 transition-colors">
                                        {getRankIcon(index)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-200 group-hover:text-white transition-colors">{user.user_id}</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-400 group-hover:text-blue-300 text-glow">{user.total_score}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100">
                                        {user.current_streak > 0 && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />}
                                        <span className={user.current_streak > 0 ? "text-orange-400" : "text-slate-600"}>{user.current_streak}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-white/5 text-center text-xs text-slate-500 border-t border-white/5">
                Resets Weekly • Top 3 Earn Bonus XP
            </div>
        </div>
    )
}

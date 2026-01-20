"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Flame } from "lucide-react"

interface UserStats {
    user_id: string
    total_score: number
    current_streak: number
    highest_streak: number
}

export function LeaderboardUI() {
    const [leaders, setLeaders] = useState<UserStats[]>([])

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        fetch(`${API_URL}/leaderboard`)
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error("Failed to load leaderboard", err))
    }, [])

    return (
        <Card className="h-full">
            <CardHeader className="bg-yellow-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6" /> Top Performers
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Rep</th>
                            <th className="px-4 py-3 text-right">Score</th>
                            <th className="px-4 py-3 text-right">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((user, index) => (
                            <tr key={user.user_id} className="border-b hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-500">#{index + 1}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">{user.user_id}</td>
                                <td className="px-4 py-3 text-right font-bold text-yellow-600">{user.total_score}</td>
                                <td className="px-4 py-3 text-right flex justify-end items-center gap-1">
                                    {user.current_streak > 0 && <Flame className="w-3 h-3 text-orange-500" />}
                                    {user.current_streak}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}

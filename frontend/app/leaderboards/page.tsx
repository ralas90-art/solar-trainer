"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { AppShell } from "@/components/platform/app-shell"
import {
  LeaderboardTable,
  UserRankCard,
  ScoreProgressCard,
  WeeklyImprovementCard,
  AchievementSummary,
} from "@/components/platform/leaderboard-components"
import { NotificationPill, WidgetCard } from "@/components/platform/dashboard-widgets"
import { Trophy, Sparkles, Zap, Crown, Loader2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { calculateLevel } from "@/lib/gamification-core"

export default function LeaderboardsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    try {
      setIsLoading(true)
      const data = await api.get<any[]>("/api/v1/leaderboard")
      setLeaderboard(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err)
      setError("Failed to load company standings. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const currentUserData = leaderboard.find((rep) => rep.user_id === user?.id)
  const averageScore = leaderboard.length > 0 
    ? Math.round(leaderboard.reduce((sum, rep) => sum + rep.total_score, 0) / leaderboard.length)
    : 0

  if (isLoading) {
    return (
      <AppShell heading="Leaderboards" subheading="Loading company standings...">
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5722]" />
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell heading="Leaderboards" subheading="Performance Rankings">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4">
          <p className="text-slate-400">{error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="rounded-xl bg-[#FF5722] px-6 py-2 font-bold text-white transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </AppShell>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <AppShell heading="Leaderboards" subheading="Performance Rankings">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
          <Users className="h-12 w-12 text-slate-600" />
          <div>
            <h3 className="text-xl font-bold text-white">No Rankings Yet</h3>
            <p className="text-slate-400 max-w-md mt-2">
              Start completing simulations and training modules to see your team's performance here.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      heading="Leaderboards"
      subheading="Competitive ranking for reps and mastery across training modules and AI simulations."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Quick Context Card */}
        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.14),rgba(18,18,18,0.95)_44%,rgba(255,179,0,0.1))]">
          <NotificationPill icon={Trophy} label="Company Performance Loop" tone="cyan" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <NotificationPill icon={Sparkles} label="Training Modules" tone="slate" />
            <NotificationPill icon={Crown} label="Live AI Sims" tone="slate" />
            <NotificationPill icon={Zap} label="Daily Streaks" tone="slate" />
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400">Current Top Performer</p>
              <h3 className="text-2xl font-black text-white uppercase">{leaderboard[0]?.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Team Size</p>
              <h3 className="text-2xl font-black text-[#22D3EE]">{leaderboard.length} REPS</h3>
            </div>
          </div>
        </WidgetCard>

        {/* Primary Leaderboard Table */}
        <LeaderboardTable
          entries={leaderboard.slice(0, 20).map(entry => ({
            rep: {
              id: entry.user_id,
              name: entry.name,
              level: calculateLevel(entry.total_score),
              currentStreak: entry.current_streak,
              role: entry.role
            },
            score: entry.total_score,
            simulations: entry.simulations_completed
          }))}
          title="Company Rankings"
          subtitle="All-time standings based on simulation performance and module completion."
          scoreLabel="Total Score"
          onRowClick={(userId) => router.push(`/dashboard/reps/${userId}`)}
        />

        {/* Stats Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          <UserRankCard
            rank={currentUserData?.rank || "N/A"}
            total={leaderboard.length}
            score={currentUserData?.total_score || 0}
            simulations={currentUserData?.simulations_completed || 0}
            streak={currentUserData?.current_streak || 0}
          />
          <ScoreProgressCard 
            yourScore={currentUserData?.total_score || 0} 
            averageScore={averageScore} 
          />
          <WeeklyImprovementCard 
            weeklyProgress={currentUserData ? 75 : 0} 
            weeklyDelta={currentUserData ? 5 : 0} 
          />
        </section>

        {/* Achievement / XP Summary for Current User */}
        {currentUserData && (
          <AchievementSummary
            xpTotal={currentUserData.total_score}
            level={calculateLevel(currentUserData.total_score)}
            streak={currentUserData.current_streak}
            badges={["7-Day Accelerator Graduate"]} // Placeholder until Phase 8
          />
        )}

        {/* Action Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => router.push('/my-training')}
            className="flex items-center justify-between p-6 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-[#FF5722]/30 transition-all group"
          >
            <div className="text-left">
              <h4 className="text-white font-bold">Boost Your Score</h4>
              <p className="text-sm text-slate-400">Complete pending training modules</p>
            </div>
            <Zap className="h-6 w-6 text-[#FF5722] group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={() => router.push('/ai-simulator')}
            className="flex items-center justify-between p-6 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-[#22D3EE]/30 transition-all group"
          >
            <div className="text-left">
              <h4 className="text-white font-bold">Practice Simulation</h4>
              <p className="text-sm text-slate-400">Higher difficulty means more XP</p>
            </div>
            <Crown className="h-6 w-6 text-[#22D3EE] group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>
    </AppShell>
  )
}

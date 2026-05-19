"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/platform/app-shell"
import {
  CoachingAndRecommendations,
  FilterPills,
  GamificationStrip,
  PerformanceStatCard,
  ScoreTrendChart,
  SimulationHistoryTable,
  SkillRadarChart,
  SummaryHeader,
  TeamPerformanceTable,
} from "@/components/platform/analytics-components"
import { SectionEyebrow, WidgetCard } from "@/components/platform/dashboard-widgets"
import { AnalyticsSnapshot, ScenarioType, SkillCategory, TimeRange, fetchAnalyticsSnapshot } from "@/lib/analytics-api"
import { Award, BarChart3, Flame, Gauge, History, Target } from "lucide-react"


const timeOptions: Array<{ value: TimeRange; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all-time", label: "All Time" },
]

const scenarioOptions: Array<{ value: ScenarioType; label: string }> = [
  { value: "all", label: "All Scenarios" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

const skillOptions: Array<{ value: SkillCategory; label: string }> = [
  { value: "all", label: "All Skills" },
  { value: "prospecting", label: "Prospecting" },
  { value: "discovery", label: "Discovery" },
  { value: "presentation", label: "Presentation" },
  { value: "objections", label: "Objection Handling" },
  { value: "closing", label: "Closing" },
]

import { useAuth } from "@/context/AuthContext"
import { isDemoModeActive } from "@/lib/demo-mode"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly")
  const [scenarioType, setScenarioType] = useState<ScenarioType>("all")
  const [skillCategory, setSkillCategory] = useState<SkillCategory>("all")
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setIsDemo(isDemoModeActive())
    try {
      localStorage.setItem("septivolt_analytics_visited", "true")
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (!user) return
    
    let mounted = true
    const userId = user.username

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAnalyticsSnapshot(userId, {
          timeRange,
          scenarioType,
          skillCategory,
        })
        if (mounted) setSnapshot(data)
      } catch (err) {
        if (mounted) setError("Analytics feed unavailable. Showing fallback performance signals.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [user, timeRange, scenarioType, skillCategory])

  return (
    <AppShell
      heading="Analytics"
      subheading="Rep performance intelligence for skill growth, coaching priorities, and team deployment readiness."
    >
      <div className="space-y-6">


        {/* ── Debrief History CTA ── */}
        <Link
          href="/analytics/debriefs"
          className="flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-950/20 px-6 py-4 transition-all hover:border-indigo-400/40 hover:bg-indigo-950/30 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <History className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">AI Coaching Reports</p>
              <p className="text-xs text-slate-400">View your full simulation debrief history — scores, tone analysis, and script recommendations.</p>
            </div>
          </div>
          <span className="text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors shrink-0 ml-4">
            View Debriefs →
          </span>
        </Link>

        <SummaryHeader
          title="Rep Performance Analytics Dashboard"
          subtitle="Answer how performance is trending, what skills need work, and which reps are deployment-ready with one operational view."
        />

        <WidgetCard>
          <SectionEyebrow label="Filters" action="Time range + scenario type + skill category" />
          <div className="grid gap-4 lg:grid-cols-3">
            <FilterPills label="Time Range" value={timeRange} options={timeOptions} onChange={setTimeRange} />
            <FilterPills label="Scenario Type" value={scenarioType} options={scenarioOptions} onChange={setScenarioType} />
            <FilterPills label="Skill Category" value={skillCategory} options={skillOptions} onChange={setSkillCategory} />
          </div>
          {loading ? <p className="mt-3 text-sm text-[#94A3B8]">Syncing analytics feed...</p> : null}
          {error ? <p className="mt-3 text-sm text-[#F59E0B]">{error}</p> : null}
        </WidgetCard>

        {snapshot ? (
          <>
            <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-5">
              <PerformanceStatCard
                label="Overall Performance Score"
                value={`${snapshot.overallPerformanceScore}`}
                detail="Composite from skills, simulation outcomes, and trend direction."
                icon={Gauge}
                accent="cyan"
              />
              <PerformanceStatCard
                label="Simulations Completed"
                value={`${snapshot.simulationsCompleted}`}
                detail="Total completed reps in selected scope."
                icon={BarChart3}
                accent="slate"
              />
              <PerformanceStatCard
                label="Average Simulation Score"
                value={`${snapshot.averageSimulationScore}`}
                detail="Average score from recent simulation history."
                icon={Target}
                accent="lime"
              />
              <PerformanceStatCard
                label="Current Training Streak"
                value={`${snapshot.currentTrainingStreak} days`}
                detail="Consecutive training days with activity."
                icon={Flame}
                accent="lime"
              />
              <PerformanceStatCard
                label="Certifications Earned"
                value={`${snapshot.certificationsEarned}`}
                detail="Credential milestones completed."
                icon={Award}
                accent="cyan"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              <SkillRadarChart skills={snapshot.skills} />
              <ScoreTrendChart points={snapshot.scoreTrend} />
            </section>

            <SimulationHistoryTable rows={snapshot.simulationHistory.slice(0, 12)} />

            <CoachingAndRecommendations insights={snapshot.coachingInsights} recommendations={snapshot.recommendations} />

            <TeamPerformanceTable rows={snapshot.teamOverview} />

            <GamificationStrip
              xp={snapshot.xpEarned}
              levelProgress={snapshot.levelProgress}
              streak={snapshot.currentTrainingStreak}
              leaderboardRank={snapshot.leaderboardRank}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  )
}

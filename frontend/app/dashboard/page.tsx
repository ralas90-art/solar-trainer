"use client"

import { AppShell } from "@/components/platform/app-shell"
import {
  LeaderboardListItem,
  ModuleCard,
  NotificationPill,
  ProgressCard,
  ScoreDisplayCard,
  SectionEyebrow,
  SkillProgressRow,
  StatCard,
  WidgetCard,
} from "@/components/platform/dashboard-widgets"
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Flame,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getDashboardStats, DashboardStats } from "@/lib/dashboard-data"

import { api } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { SCENARIO_TO_MODULE } from "@/lib/modules"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      try {
        const data = await api.get<any>(`/api/v1/analytics/snapshot?user_id=${user.username}`)
        
        // Map backend payload to DashboardStats
        const mappedStats: DashboardStats = {
          streak: data.currentTrainingStreak,
          skillScore: data.overallPerformanceScore,
          simWinRate: data.averageSimulationScore,
          attentionFlags: data.coachingInsights.filter((i: any) => i.severity === 'high').length,
          certificationProgress: data.levelProgress,
          completedMilestones: data.simulationsCompleted,
          totalMilestones: 10,
          recentSimulations: data.simulationHistory.slice(0, 3).map((item: any) => ({
            label: item.scenarioName,
            score: item.score,
            subtitle: item.skillsTested.join(", ")
          })),
          skillProgress: Object.entries(data.skills).map(([label, info]: [string, any]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: info.score
          })),
          lastModuleId: SCENARIO_TO_MODULE[data.simulationHistory[0]?.id] || (data.simulationHistory.length > 0 ? "mod_1_1" : "mod_1_1"),
          todayChallengeScenarioId: data.recommendations[0]?.title.includes("Practice") ? "d2d_1" : "discovery_1"
        }
        setStats(mappedStats)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setStats(getDashboardStats())
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (isLoading || !stats) {
    return (
      <AppShell heading="Dashboard" subheading="Loading your performance command center...">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#FF5722] border-t-transparent rounded-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      heading="Dashboard"
      subheading="A daily operating view for training momentum, AI performance, and immediate coaching priorities."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <WidgetCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(255,87,34,0.14),rgba(18,18,18,0.96)_38%,rgba(255,179,0,0.12))]">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,87,34,0.18),transparent_55%)] lg:block" />
            <NotificationPill icon={Sparkles} label="Recommended next action" tone="cyan" />
            <div className="relative mt-5 max-w-2xl">
              <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
                {stats.lastModuleId ? (
                   `Resume ${stats.lastModuleId.replace("mod_", "Module ").replace("_", ".")} drills to maintain your momentum.`
                ) : (
                  "Start your first training drill to build identity and momentum."
                )}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#CBD5E1]">
                You have completed {stats.completedMilestones} of {stats.totalMilestones} core milestones. 
                Complete the next module to unlock more high-level simulations.
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={stats.lastModuleId ? `/my-training/${stats.lastModuleId}` : "/my-training"}
                className="btn-solar inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                {stats.lastModuleId ? "Resume Training" : "Start Training"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <NotificationPill icon={Flame} label={`${stats.streak} day streak active`} tone="lime" />
              <NotificationPill icon={ShieldCheck} label="Certification on track" tone="slate" />
            </div>
          </WidgetCard>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <ProgressCard
              label="Today's AI Challenge"
              value={stats.todayChallengeScenarioId?.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Discovery Drills"}
              progress={stats.certificationProgress}
              detail="Complete this random challenge to bank extra XP and keep your streak alive."
              href={`/ai-simulator?scenario=${stats.todayChallengeScenarioId}`}
            />
            <ProgressCard
              label="Certification Progress"
              value={`${stats.completedMilestones} / ${stats.totalMilestones} milestones`}
              progress={stats.certificationProgress}
              detail="Milestone completion across the core rep path."
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
          <StatCard label="Current Streak" value={`${stats.streak} Days`} change="Active daily training" icon={Flame} accent="lime" />
          <StatCard label="Skill Score" value={stats.skillScore.toString()} change="Based on coaching results" icon={TrendingUp} />
          <StatCard label="Sim Win Rate" value={`${stats.simWinRate}%`} change="Passed (85+) simulations" icon={Radar} />
          <StatCard label="Attention Now" value={`${stats.attentionFlags} Flags`} change="Need review" icon={AlertTriangle} accent="lime" />
        </section>

        <section className="grid gap-6 2xl:grid-cols-2">
          <WidgetCard>
            <SectionEyebrow label="Performance command center" action="Live training telemetry" />
            <div className="grid gap-4 lg:grid-cols-3">
              {stats.recentSimulations.length > 0 ? (
                <>
                  <ScoreDisplayCard
                    label="Recent AI Simulation"
                    score={stats.recentSimulations[0].score}
                    subtitle={stats.recentSimulations[0].subtitle}
                  />
                  <div className="space-y-4 lg:col-span-2">
                    {stats.recentSimulations.slice(1).map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{item.label}</p>
                            <p className="mt-1 text-sm text-[#94A3B8]">{item.subtitle}</p>
                          </div>
                          <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-2 font-hud text-[#FF5722]">
                            {item.score}/100
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="lg:col-span-3 py-12 text-center text-[#94A3B8]">
                  <p>No simulation data recorded yet. Launch the simulator to see your results here.</p>
                </div>
              )}
            </div>
          </WidgetCard>

          <WidgetCard>
            <SectionEyebrow label="Progress by skill category" action="Weekly view" />
            <div className="space-y-5">
              {stats.skillProgress.map((item) => (
                <SkillProgressRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </WidgetCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-1">
          <WidgetCard>
            <SectionEyebrow label="What needs attention now" action="Priority Practice" />
            <div className="grid gap-6 md:grid-cols-2">
              <Link href={`/my-training/${stats.lastModuleId || "mod_1_1"}`} className="block transition-transform hover:scale-[1.01]">
                <div className="h-full rounded-2xl border-[#FFB300]/15 bg-[rgba(255,179,0,0.08)] p-5">
                  <div className="flex items-center gap-2 text-[#FFB300]">
                    <Target className="h-4 w-4" />
                    <span className="font-hud text-[11px] uppercase tracking-[0.16em]">Recommended next module</span>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-white">
                    {stats.lastModuleId === 'mod_1_1' ? 'Vision Casting: Goal Setting' : 'Objection Stack: Price Pressure'}
                  </p>
                  <p className="mt-2 text-sm text-[#CBD5E1]">
                    AI is flagging late value anchoring in your recent sims. One 14-minute drill should close the gap.
                  </p>
                </div>
              </Link>
              <Link href="/ai-simulator" className="block transition-transform hover:scale-[1.01]">
                <div className="h-full rounded-2xl border border-white/5 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-[#FF5722]">
                    <Brain className="h-4 w-4" />
                    <span className="font-hud text-[11px] uppercase tracking-[0.16em]">Badge progress</span>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-white">Closer Circuit Badge</p>
                  <p className="mt-2 text-sm text-[#CBD5E1]">
                    240 XP until next level. Completing today&apos;s challenge and one simulator win clears it.
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="volt-progress h-full w-[76%]" />
                  </div>
                </div>
              </Link>
            </div>
          </WidgetCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <ModuleCard
            title="Resume Training"
            subtitle="Continue your rep path training precisely where you left off."
            progress={stats.certificationProgress}
            badge="Priority"
            href={stats.lastModuleId ? `/my-training/${stats.lastModuleId}` : "/my-training"}
          />
          <ModuleCard
            title="AI Simulator Queue"
            subtitle="Custom simulations are generated based on your weak points."
            progress={stats.simWinRate}
            badge="Live queue"
            href="/ai-simulator"
          />
          <ModuleCard
            title="Certification Path"
            subtitle="View your progress toward becoming a certified Septivolt Closer."
            progress={stats.certificationProgress}
            badge="On track"
            href="/certifications"
          />
        </section>
      </div>
    </AppShell>
  )
}

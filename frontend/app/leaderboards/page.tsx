"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { AppShell } from "@/components/platform/app-shell"
import {
  AchievementSummary,
  LeaderboardRep,
  LeaderboardScope,
  LeaderboardTable,
  ScoreProgressCard,
  SkillCategory,
  SkillLeaderboardCard,
  TeamLeaderboardCard,
  TeamLeaderboardEntry,
  TimeRange,
  UserRankCard,
  WeeklyImprovementCard,
} from "@/components/platform/leaderboard-components"
import { NotificationPill, SectionEyebrow, WidgetCard } from "@/components/platform/dashboard-widgets"
import { Crown, Sparkles, Trophy, Zap } from "lucide-react"
import Link from "next/link"

type SkillKey = Exclude<SkillCategory, "overall">

const timeRangeOptions: Array<{ value: TimeRange; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all-time", label: "All Time" },
]

const scopeOptions: Array<{ value: LeaderboardScope; label: string }> = [
  { value: "global", label: "Global" },
  { value: "company", label: "Company" },
  { value: "team", label: "Team" },
]

const skillOptions: Array<{ value: SkillCategory; label: string }> = [
  { value: "overall", label: "Overall" },
  { value: "prospecting", label: "Prospecting" },
  { value: "discovery", label: "Discovery" },
  { value: "presentation", label: "Presentation" },
  { value: "objections", label: "Objections" },
  { value: "closing", label: "Closing" },
]

const timeMultipliers: Record<TimeRange, number> = {
  daily: 0.2,
  weekly: 1,
  monthly: 3.9,
  "all-time": 11.2,
}

const reps: LeaderboardRep[] = [
  {
    id: "rep-1",
    name: "Mila Rodriguez",
    company: "SeptiVolt Energy",
    team: "West Mavericks",
    score: 4970,
    simulationsCompleted: 142,
    currentStreak: 24,
    badgesEarned: 16,
    xpTotal: 21120,
    level: 16,
    weeklyProgress: 93,
    skillScores: { prospecting: 90, discovery: 92, presentation: 95, objections: 88, closing: 93 },
    skillSimulationCount: { prospecting: 34, discovery: 30, presentation: 26, objections: 24, closing: 28 },
    achievements: ["Discovery Master", "Closing Specialist", "Simulation Grinder", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-2",
    name: "Avery Chen",
    company: "SeptiVolt Energy",
    team: "West Mavericks",
    score: 4820,
    simulationsCompleted: 136,
    currentStreak: 19,
    badgesEarned: 14,
    xpTotal: 19850,
    level: 15,
    weeklyProgress: 88,
    skillScores: { prospecting: 86, discovery: 90, presentation: 92, objections: 85, closing: 91 },
    skillSimulationCount: { prospecting: 31, discovery: 29, presentation: 25, objections: 22, closing: 29 },
    achievements: ["Objection Crusher", "Closing Specialist", "Simulation Grinder", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-3",
    name: "Theo Patel",
    company: "SolarAxis Enterprise",
    team: "Northeast Orbit",
    score: 4680,
    simulationsCompleted: 133,
    currentStreak: 17,
    badgesEarned: 12,
    xpTotal: 19110,
    level: 15,
    weeklyProgress: 86,
    skillScores: { prospecting: 88, discovery: 87, presentation: 90, objections: 84, closing: 89 },
    skillSimulationCount: { prospecting: 32, discovery: 27, presentation: 24, objections: 23, closing: 27 },
    achievements: ["Discovery Master", "Simulation Grinder", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-4",
    name: "Jordan Kim",
    company: "SunGrid Partners",
    team: "South Voltage",
    score: 4510,
    simulationsCompleted: 128,
    currentStreak: 15,
    badgesEarned: 11,
    xpTotal: 18340,
    level: 14,
    weeklyProgress: 81,
    skillScores: { prospecting: 83, discovery: 86, presentation: 89, objections: 82, closing: 88 },
    skillSimulationCount: { prospecting: 30, discovery: 26, presentation: 25, objections: 21, closing: 26 },
    achievements: ["Presentation Pro", "Simulation Grinder"],
  },
  {
    id: "rep-5",
    name: "Riley Brooks",
    company: "SeptiVolt Energy",
    team: "East Current",
    score: 4380,
    simulationsCompleted: 121,
    currentStreak: 13,
    badgesEarned: 10,
    xpTotal: 17610,
    level: 14,
    weeklyProgress: 78,
    skillScores: { prospecting: 84, discovery: 85, presentation: 87, objections: 81, closing: 86 },
    skillSimulationCount: { prospecting: 29, discovery: 24, presentation: 23, objections: 22, closing: 23 },
    achievements: ["Discovery Master", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-6",
    name: "Sofia Alvarez",
    company: "SolarAxis Enterprise",
    team: "Northeast Orbit",
    score: 4310,
    simulationsCompleted: 118,
    currentStreak: 12,
    badgesEarned: 9,
    xpTotal: 17100,
    level: 13,
    weeklyProgress: 75,
    skillScores: { prospecting: 82, discovery: 84, presentation: 86, objections: 80, closing: 85 },
    skillSimulationCount: { prospecting: 27, discovery: 25, presentation: 22, objections: 20, closing: 24 },
    achievements: ["Objection Crusher", "Simulation Grinder"],
  },
  {
    id: "rep-7",
    name: "Cameron Lee",
    company: "SunGrid Partners",
    team: "South Voltage",
    score: 4210,
    simulationsCompleted: 112,
    currentStreak: 11,
    badgesEarned: 9,
    xpTotal: 16520,
    level: 13,
    weeklyProgress: 74,
    skillScores: { prospecting: 81, discovery: 82, presentation: 84, objections: 79, closing: 83 },
    skillSimulationCount: { prospecting: 26, discovery: 22, presentation: 23, objections: 19, closing: 22 },
    achievements: ["Closing Specialist", "Simulation Grinder"],
  },
  {
    id: "rep-8",
    name: "Noah Singh",
    company: "Northline Solar",
    team: "Central Pulse",
    score: 4095,
    simulationsCompleted: 108,
    currentStreak: 10,
    badgesEarned: 8,
    xpTotal: 15990,
    level: 12,
    weeklyProgress: 70,
    skillScores: { prospecting: 80, discovery: 81, presentation: 83, objections: 78, closing: 82 },
    skillSimulationCount: { prospecting: 24, discovery: 23, presentation: 21, objections: 19, closing: 21 },
    achievements: ["Objection Crusher", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-9",
    name: "Liam Carter",
    company: "SeptiVolt Energy",
    team: "East Current",
    score: 3990,
    simulationsCompleted: 103,
    currentStreak: 8,
    badgesEarned: 8,
    xpTotal: 15210,
    level: 12,
    weeklyProgress: 68,
    skillScores: { prospecting: 78, discovery: 80, presentation: 82, objections: 77, closing: 80 },
    skillSimulationCount: { prospecting: 24, discovery: 20, presentation: 20, objections: 18, closing: 21 },
    achievements: ["Simulation Grinder", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-10",
    name: "Emma Foster",
    company: "SolarAxis Enterprise",
    team: "Northeast Orbit",
    score: 3925,
    simulationsCompleted: 98,
    currentStreak: 8,
    badgesEarned: 7,
    xpTotal: 14860,
    level: 11,
    weeklyProgress: 66,
    skillScores: { prospecting: 77, discovery: 79, presentation: 81, objections: 76, closing: 79 },
    skillSimulationCount: { prospecting: 23, discovery: 19, presentation: 20, objections: 17, closing: 19 },
    achievements: ["Discovery Master", "Simulation Grinder"],
  },
  {
    id: "rep-11",
    name: "Kai Turner",
    company: "Northline Solar",
    team: "Central Pulse",
    score: 3860,
    simulationsCompleted: 97,
    currentStreak: 7,
    badgesEarned: 7,
    xpTotal: 14520,
    level: 11,
    weeklyProgress: 64,
    skillScores: { prospecting: 76, discovery: 78, presentation: 80, objections: 75, closing: 78 },
    skillSimulationCount: { prospecting: 22, discovery: 20, presentation: 18, objections: 17, closing: 20 },
    achievements: ["Objection Crusher", "7-Day Accelerator Graduate"],
  },
  {
    id: "rep-12",
    name: "Zoe Morgan",
    company: "SunGrid Partners",
    team: "South Voltage",
    score: 3775,
    simulationsCompleted: 91,
    currentStreak: 6,
    badgesEarned: 6,
    xpTotal: 14090,
    level: 11,
    weeklyProgress: 61,
    skillScores: { prospecting: 74, discovery: 76, presentation: 78, objections: 74, closing: 77 },
    skillSimulationCount: { prospecting: 21, discovery: 18, presentation: 18, objections: 16, closing: 18 },
    achievements: ["Simulation Grinder"],
  },
]

const loggedInUserId = "rep-2"

const computeScore = (rep: LeaderboardRep, timeRange: TimeRange, skill: SkillCategory) =>
  Math.round((skill === "overall" ? rep.score : rep.skillScores[skill]) * timeMultipliers[timeRange])

const computeSimulationCount = (rep: LeaderboardRep, timeRange: TimeRange, skill: SkillCategory) =>
  Math.round((skill === "overall" ? rep.simulationsCompleted : rep.skillSimulationCount[skill]) * timeMultipliers[timeRange])

const getRows = (source: LeaderboardRep[], timeRange: TimeRange, skill: SkillCategory) =>
  source
    .map((rep) => ({
      rep,
      score: computeScore(rep, timeRange, skill),
      simulations: computeSimulationCount(rep, timeRange, skill),
    }))
    .sort((a, b) => b.score - a.score)

const buildTeamEntries = (source: LeaderboardRep[], timeRange: TimeRange, skill: SkillCategory): TeamLeaderboardEntry[] => {
  const grouped = source.reduce<Record<string, LeaderboardRep[]>>((acc, rep) => {
    acc[rep.team] = acc[rep.team] ?? []
    acc[rep.team].push(rep)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([teamName, teamMembers]) => {
      const orderedTeam = getRows(teamMembers, timeRange, skill)
      const averageScore =
        orderedTeam.reduce((sum, entry) => sum + entry.score, 0) / Math.max(1, orderedTeam.length)
      const totalSimulations = orderedTeam.reduce((sum, entry) => sum + entry.simulations, 0)
      return {
        teamName,
        averageScore: Math.round(averageScore),
        totalSimulations,
        topPerformer: orderedTeam[0]?.rep.name ?? "N/A",
      }
    })
    .sort((a, b) => b.averageScore - a.averageScore)
}

const skillSectionOrder: Array<{ label: string; key: SkillKey }> = [
  { label: "Prospecting", key: "prospecting" },
  { label: "Discovery", key: "discovery" },
  { label: "Presentation", key: "presentation" },
  { label: "Objection Handling", key: "objections" },
  { label: "Closing", key: "closing" },
]

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <label className="space-y-2">
      <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors hover:border-[#FF5722]/40 focus:border-[#FF5722]/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#121212] text-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}


export default function LeaderboardsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly")
  const [scope, setScope] = useState<LeaderboardScope>("global")
  const [skill, setSkill] = useState<SkillCategory>("overall")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRep[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await api.get<any[]>("/leaderboard")
        // Map backend UserStats to LeaderboardRep
        const mapped: LeaderboardRep[] = data.map((item: any, idx: number) => ({
          id: item.user_id,
          name: item.user_id, // Default to ID for now, could fetch real names later
          company: "SeptiVolt Energy",
          team: ["West Mavericks", "East Current", "South Voltage", "Northeast Orbit"][idx % 4],
          score: item.total_score,
          simulationsCompleted: Math.floor(item.total_score / 45),
          currentStreak: item.current_streak,
          badgesEarned: Math.floor(item.total_score / 500),
          xpTotal: item.total_score * 4,
          level: Math.floor(item.total_score / 1000) + 1,
          weeklyProgress: 75 + (idx * 2) % 20,
          skillScores: { prospecting: 80, discovery: 82, presentation: 85, objections: 78, closing: 83 },
          skillSimulationCount: { prospecting: 10, discovery: 10, presentation: 10, objections: 10, closing: 10 },
          achievements: ["7-Day Accelerator Graduate"],
        }))
        setLeaderboardData(mapped.length > 0 ? mapped : reps)
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
        setLeaderboardData(reps)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const currentUser = useMemo(() => 
    leaderboardData.find((rep) => rep.id === user?.username) || leaderboardData[0] || reps[0], 
  [leaderboardData, user])

  const scopedReps = useMemo(() => {
    if (scope === "company") {
      return leaderboardData.filter((rep) => rep.company === currentUser.company)
    }
    if (scope === "team") {
      return leaderboardData.filter((rep) => rep.team === currentUser.team)
    }
    return leaderboardData
  }, [leaderboardData, scope, currentUser.company, currentUser.team])

  const rankedRows = useMemo(() => getRows(scopedReps, timeRange, skill), [scopedReps, timeRange, skill])

  const userRank = useMemo(
    () => Math.max(1, rankedRows.findIndex((row) => row.rep.id === currentUser.id) + 1),
    [rankedRows, currentUser.id]
  )

  const userRow = rankedRows[userRank - 1] ?? rankedRows[0]
  const averageScore = Math.round(rankedRows.reduce((sum, row) => sum + row.score, 0) / Math.max(1, rankedRows.length))
  const weeklyDelta = currentUser.weeklyProgress - 72

  const skillCards = useMemo(
    () =>
      skillSectionOrder.map((section) => {
        const topTen = getRows(scopedReps, timeRange, section.key).slice(0, 10)
        return {
          title: section.label,
          rows: topTen.map((entry, index) => ({
            rank: index + 1,
            repName: entry.rep.name,
            score: entry.score,
            simulations: entry.simulations,
          })),
        }
      }),
    [scopedReps, timeRange]
  )

  const teamEntries = useMemo(() => buildTeamEntries(scopedReps, timeRange, skill), [scopedReps, timeRange, skill])

  return (
    <AppShell
      heading="Leaderboards"
      subheading="Competitive ranking for reps, teams, and skill mastery across training modules and AI simulations."
    >
      <div className="space-y-6">
        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.14),rgba(18,18,18,0.95)_44%,rgba(255,179,0,0.1))]">
          <NotificationPill icon={Trophy} label="Competitive performance loop" tone="cyan" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <NotificationPill icon={Sparkles} label="Dashboard" tone="slate" />
            <NotificationPill icon={Zap} label="Training Module" tone="slate" />
            <NotificationPill icon={Crown} label="AI Simulation" tone="slate" />
            <NotificationPill icon={Trophy} label="Score + Coaching" tone="lime" />
            <NotificationPill icon={Crown} label="Leaderboard Reward" tone="cyan" />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <FilterSelect label="Time Range" value={timeRange} onChange={setTimeRange} options={timeRangeOptions} />
            <FilterSelect label="Leaderboard Scope" value={scope} onChange={setScope} options={scopeOptions} />
            <FilterSelect label="Skill Category" value={skill} onChange={setSkill} options={skillOptions} />
          </div>
        </WidgetCard>

        <LeaderboardTable
          entries={rankedRows.slice(0, 10)}
          title="Global Rankings"
          subtitle={`${scopeOptions.find((option) => option.value === scope)?.label} ${timeRangeOptions
            .find((option) => option.value === timeRange)
            ?.label} standings`}
          scoreLabel={skill === "overall" ? "Score" : "Skill Score"}
        />

        <section className="grid gap-6 lg:grid-cols-3">
          <UserRankCard
            rank={userRank}
            total={rankedRows.length}
            score={userRow?.score ?? 0}
            simulations={userRow?.simulations ?? 0}
            streak={currentUser.currentStreak}
          />
          <ScoreProgressCard yourScore={userRow?.score ?? 0} averageScore={averageScore} />
          <WeeklyImprovementCard weeklyProgress={currentUser.weeklyProgress} weeklyDelta={weeklyDelta} />
        </section>

        <section className="space-y-4">
          <SectionEyebrow label="Skill Leaderboards" action="Top 10 reps by category" />
          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {skillCards.map((card) => (
              <SkillLeaderboardCard key={card.title} title={card.title} rows={card.rows} />
            ))}
          </div>
        </section>

        <TeamLeaderboardCard entries={teamEntries} />

        <AchievementSummary
          xpTotal={currentUser.xpTotal}
          level={currentUser.level}
          streak={currentUser.currentStreak}
          badges={currentUser.achievements}
        />

        <WidgetCard>
          <SectionEyebrow label="Next step" action="Credential + analytics loop" />
          <div className="flex flex-wrap gap-3">
            <Link href="/certifications" className="btn-solar inline-flex items-center gap-2 px-5 py-3 text-sm">
              Open Certifications
            </Link>
            <Link href="/analytics" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-[#CBD5E1]">
              Open Analytics
            </Link>
          </div>
        </WidgetCard>
      </div>
    </AppShell>
  )
}

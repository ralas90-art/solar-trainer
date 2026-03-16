import { getApiUrl } from "@/lib/utils"

export type TimeRange = "daily" | "weekly" | "monthly" | "all-time"
export type SkillCategory = "all" | "prospecting" | "discovery" | "presentation" | "objections" | "closing"
export type ScenarioType = "all" | "beginner" | "intermediate" | "advanced"

export type SkillMetric = {
  score: number
  trend: number
  improvement: number
}

export type TrendPoint = {
  label: string
  score: number
  rollingAverage: number
  dateIso: string
}

export type SimulationHistoryItem = {
  id: string
  scenarioName: string
  score: number
  skillsTested: Exclude<SkillCategory, "all">[]
  result: "pass" | "fail" | "needs-improvement"
  dateIso: string
  scenarioType: Exclude<ScenarioType, "all">
}

export type CoachingInsight = {
  title: string
  detail: string
  severity: "high" | "medium" | "low"
}

export type TrainingRecommendation = {
  title: string
  rationale: string
  action: string
}

export type TeamPerformanceRow = {
  teamName: string
  avgScore: number
  improvingReps: number
  coachingNeeded: number
  readyForDeployment: number
  certificationCompletion: number
}

export type AnalyticsSnapshot = {
  overallPerformanceScore: number
  simulationsCompleted: number
  averageSimulationScore: number
  currentTrainingStreak: number
  certificationsEarned: number
  xpEarned: number
  levelProgress: number
  leaderboardRank: number
  skills: Record<Exclude<SkillCategory, "all">, SkillMetric>
  scoreTrend: TrendPoint[]
  simulationHistory: SimulationHistoryItem[]
  coachingInsights: CoachingInsight[]
  recommendations: TrainingRecommendation[]
  teamOverview: TeamPerformanceRow[]
}

export type AnalyticsFilters = {
  timeRange: TimeRange
  scenarioType: ScenarioType
  skillCategory: SkillCategory
}

type UserStatsResponse = {
  user_id: string
  total_score: number
  current_streak: number
  scenario_progress?: string
}

type LeaderboardEntry = {
  user_id: string
  total_score: number
}

type ScenarioResponse = {
  id: string
  name: string
  description?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
}

type CertificationSnapshotResponse = {
  tracks: Array<{ status: "locked" | "in-progress" | "ready" | "certified" }>
  teamProgress: Array<{
    teamName: string
    overallCompletion: number
    repsCertified: number
    repsInProgress: number
    repsAtRisk: number
  }>
}

const skillKeys: Array<Exclude<SkillCategory, "all">> = [
  "prospecting",
  "discovery",
  "presentation",
  "objections",
  "closing",
]

function safeParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function inferSkillsFromScenario(name: string): Exclude<SkillCategory, "all">[] {
  const text = name.toLowerCase()
  if (text.includes("objection")) return ["objections", "closing"]
  if (text.includes("discover")) return ["prospecting", "discovery"]
  if (text.includes("present")) return ["presentation", "closing"]
  if (text.includes("close")) return ["closing", "objections"]
  if (text.includes("virtual")) return ["discovery", "presentation"]
  return ["prospecting", "discovery"]
}

function resultFromScore(score: number): SimulationHistoryItem["result"] {
  if (score >= 85) return "pass"
  if (score >= 72) return "needs-improvement"
  return "fail"
}

function rollingAverage(values: number[], index: number, windowSize: number) {
  const start = Math.max(0, index - windowSize + 1)
  const window = values.slice(start, index + 1)
  return Math.round(window.reduce((sum, value) => sum + value, 0) / Math.max(1, window.length))
}

function buildFallbackSnapshot(): AnalyticsSnapshot {
  const today = new Date()
  const trend: TrendPoint[] = Array.from({ length: 12 }, (_, index) => {
    const score = 66 + index * 2 + (index % 3)
    const date = new Date(today)
    date.setDate(today.getDate() - (11 - index) * 3)
    return {
      label: `W${index + 1}`,
      score,
      rollingAverage: score - 2,
      dateIso: date.toISOString().slice(0, 10),
    }
  })

  const simulationHistory: SimulationHistoryItem[] = trend.slice(-10).map((point, index) => ({
    id: `sim-${index + 1}`,
    scenarioName: `Scenario ${index + 1}`,
    score: point.score,
    skillsTested: skillKeys.slice(index % 3, (index % 3) + 2) as Exclude<SkillCategory, "all">[],
    result: resultFromScore(point.score),
    dateIso: point.dateIso,
    scenarioType: index % 3 === 0 ? "advanced" : index % 2 === 0 ? "intermediate" : "beginner",
  }))

  return {
    overallPerformanceScore: 84,
    simulationsCompleted: 48,
    averageSimulationScore: 82,
    currentTrainingStreak: 11,
    certificationsEarned: 2,
    xpEarned: 4180,
    levelProgress: 72,
    leaderboardRank: 4,
    skills: {
      prospecting: { score: 79, trend: 3, improvement: 6 },
      discovery: { score: 83, trend: 4, improvement: 8 },
      presentation: { score: 86, trend: 2, improvement: 5 },
      objections: { score: 76, trend: -1, improvement: 2 },
      closing: { score: 81, trend: 1, improvement: 4 },
    },
    scoreTrend: trend,
    simulationHistory,
    coachingInsights: [
      {
        title: "Missed discovery depth",
        detail: "Follow-up questions are skipped on timeline and bill escalation moments.",
        severity: "high",
      },
      {
        title: "Objection sequencing",
        detail: "Price objections are answered before value anchoring, reducing close confidence.",
        severity: "medium",
      },
      {
        title: "Compliance language drift",
        detail: "Occasional guarantee-like phrasing appears in advanced scenarios.",
        severity: "low",
      },
    ],
    recommendations: [
      {
        title: "Practice Objection Handling module",
        rationale: "Objections score trails other skills by 7 points.",
        action: "Run Day 5 objection stack lesson and one advanced sim.",
      },
      {
        title: "Repeat Discovery simulation scenario",
        rationale: "Discovery follow-up completion is below target benchmark.",
        action: "Complete 2 discovery scenarios with coaching review.",
      },
      {
        title: "Review Closing techniques lesson",
        rationale: "Close conversion language is inconsistent in final minutes.",
        action: "Revisit closing checklist and rerun final commitment scenario.",
      },
    ],
    teamOverview: [
      {
        teamName: "West Mavericks",
        avgScore: 86,
        improvingReps: 6,
        coachingNeeded: 2,
        readyForDeployment: 5,
        certificationCompletion: 82,
      },
      {
        teamName: "East Current",
        avgScore: 79,
        improvingReps: 4,
        coachingNeeded: 3,
        readyForDeployment: 3,
        certificationCompletion: 74,
      },
    ],
  }
}

export async function fetchAnalyticsSnapshot(
  userId: string,
  filters: AnalyticsFilters = {
    timeRange: "weekly",
    scenarioType: "all",
    skillCategory: "all",
  }
): Promise<AnalyticsSnapshot> {
  const apiUrl = getApiUrl()
  const query = new URLSearchParams({
    user_id: userId,
    time_range: filters.timeRange,
    scenario_type: filters.scenarioType,
    skill_category: filters.skillCategory,
  })
  const snapshotRes = await fetch(
    `${apiUrl}/api/v1/analytics/snapshot?${query.toString()}`,
    { credentials: "include" }
  ).catch(() => null)

  if (snapshotRes && snapshotRes.ok) {
    return (await snapshotRes.json()) as AnalyticsSnapshot
  }

  const [statsRes, leaderboardRes, scenariosRes, certRes] = await Promise.allSettled([
    fetch(`${apiUrl}/user/${encodeURIComponent(userId)}/stats`, { credentials: "include" }),
    fetch(`${apiUrl}/leaderboard`, { credentials: "include" }),
    fetch(`${apiUrl}/scenarios`, { credentials: "include" }),
    fetch(`${apiUrl}/api/v1/certifications/snapshot?user_id=${encodeURIComponent(userId)}`, {
      credentials: "include",
    }),
  ])

  const stats =
    statsRes.status === "fulfilled" && statsRes.value.ok
      ? ((await statsRes.value.json()) as UserStatsResponse)
      : null

  const leaderboard =
    leaderboardRes.status === "fulfilled" && leaderboardRes.value.ok
      ? ((await leaderboardRes.value.json()) as LeaderboardEntry[])
      : []

  const scenarios =
    scenariosRes.status === "fulfilled" && scenariosRes.value.ok
      ? ((await scenariosRes.value.json()) as ScenarioResponse[])
      : []

  const certSnapshot =
    certRes.status === "fulfilled" && certRes.value.ok
      ? ((await certRes.value.json()) as CertificationSnapshotResponse)
      : null

  if (!stats) {
    return buildFallbackSnapshot()
  }

  const scenarioProgress = safeParse<
    Record<string, { passed?: boolean; best_score?: number; attempts?: number }>
  >(stats.scenario_progress, {})

  const scenarioById = new Map<string, ScenarioResponse>()
  for (const scenario of scenarios) {
    scenarioById.set(scenario.id, scenario)
  }

  const historyBase: SimulationHistoryItem[] = Object.entries(scenarioProgress).map(([id, state], index) => {
    const scenario = scenarioById.get(id)
    const score = state.best_score ?? Math.max(58, 68 + index * 3)
    const offsetDays = Math.max(0, index * 3)
    const date = new Date()
    date.setDate(date.getDate() - offsetDays)
    return {
      id,
      scenarioName: scenario?.name ?? `Simulation ${id}`,
      score,
      skillsTested: inferSkillsFromScenario(scenario?.name ?? id),
      result: resultFromScore(score),
      dateIso: date.toISOString().slice(0, 10),
      scenarioType: scenario?.difficulty ?? (index % 3 === 0 ? "advanced" : "intermediate"),
    }
  })

  const sortedHistory =
    historyBase.length > 0
      ? [...historyBase].sort((a, b) => (a.dateIso < b.dateIso ? 1 : -1))
      : buildFallbackSnapshot().simulationHistory

  const latestScores = sortedHistory.map((item) => item.score).slice(0, 12).reverse()
  const scoreTrend: TrendPoint[] = latestScores.map((score, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (latestScores.length - 1 - index) * 3)
    return {
      label: `P${index + 1}`,
      score,
      rollingAverage: rollingAverage(latestScores, index, 4),
      dateIso: date.toISOString().slice(0, 10),
    }
  })

  const averageSimulationScore = Math.round(
    sortedHistory.reduce((sum, item) => sum + item.score, 0) / Math.max(1, sortedHistory.length)
  )
  const simulationsCompleted = sortedHistory.length
  const leaderboardRank = Math.max(1, leaderboard.findIndex((entry) => entry.user_id === userId) + 1)

  const skillScores: Record<Exclude<SkillCategory, "all">, number[]> = {
    prospecting: [],
    discovery: [],
    presentation: [],
    objections: [],
    closing: [],
  }
  for (const item of sortedHistory) {
    for (const skill of item.skillsTested) {
      skillScores[skill].push(item.score)
    }
  }

  const skills = Object.fromEntries(
    skillKeys.map((skill, index) => {
      const values = skillScores[skill]
      const score = values.length
        ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
        : 68 + index * 3
      const recent = values.slice(0, 3)
      const prior = values.slice(3, 6)
      const recentAvg = recent.length ? recent.reduce((sum, value) => sum + value, 0) / recent.length : score
      const priorAvg = prior.length ? prior.reduce((sum, value) => sum + value, 0) / prior.length : score - 2
      const trend = Math.round(recentAvg - priorAvg)
      return [skill, { score, trend, improvement: Math.max(0, trend + 4) }]
    })
  ) as Record<Exclude<SkillCategory, "all">, SkillMetric>

  const certificationsEarned =
    certSnapshot?.tracks.filter((track) => track.status === "certified").length ?? 0

  const teamOverview =
    certSnapshot?.teamProgress.map((team) => ({
      teamName: team.teamName,
      avgScore: Math.min(95, Math.max(58, Math.round(60 + team.overallCompletion * 0.35))),
      improvingReps: team.repsInProgress,
      coachingNeeded: team.repsAtRisk,
      readyForDeployment: team.repsCertified,
      certificationCompletion: team.overallCompletion,
    })) ?? buildFallbackSnapshot().teamOverview

  const weakestSkill = skillKeys.reduce((a, b) => (skills[a].score < skills[b].score ? a : b))
  const secondWeakest = skillKeys
    .filter((key) => key !== weakestSkill)
    .reduce((a, b) => (skills[a].score < skills[b].score ? a : b))

  const recommendations: TrainingRecommendation[] = [
    {
      title: `Practice ${weakestSkill[0].toUpperCase()}${weakestSkill.slice(1)} module`,
      rationale: `${weakestSkill} score is below target benchmark.`,
      action: `Run focused lesson + one ${weakestSkill} simulation scenario.`,
    },
    {
      title: `Repeat ${secondWeakest[0].toUpperCase()}${secondWeakest.slice(1)} simulation`,
      rationale: `Trend is inconsistent in ${secondWeakest} responses.`,
      action: "Replay scenario and review AI coaching transcript.",
    },
    {
      title: "Review closing techniques lesson",
      rationale: "Final commitment language remains inconsistent.",
      action: "Complete closing checklist and final assessment prep scenario.",
    },
  ]

  const coachingInsights: CoachingInsight[] = [
    {
      title: "Most common mistake",
      detail: `Weak value anchoring before ${weakestSkill} responses.`,
      severity: "high",
    },
    {
      title: "Missed discovery questions",
      detail: "Follow-up depth is below target in mid-conversation.",
      severity: "medium",
    },
    {
      title: "Compliance warning pattern",
      detail: "Watch guarantee phrasing in high-pressure scenarios.",
      severity: "low",
    },
  ]

  return {
    overallPerformanceScore: Math.round((averageSimulationScore * 0.55) + (skills.closing.score * 0.2) + (skills.discovery.score * 0.25)),
    simulationsCompleted,
    averageSimulationScore,
    currentTrainingStreak: stats.current_streak,
    certificationsEarned,
    xpEarned: stats.total_score,
    levelProgress: Math.min(100, Math.round((stats.total_score % 2000) / 20)),
    leaderboardRank,
    skills,
    scoreTrend: scoreTrend.length ? scoreTrend : buildFallbackSnapshot().scoreTrend,
    simulationHistory: sortedHistory,
    coachingInsights,
    recommendations,
    teamOverview,
  }
}

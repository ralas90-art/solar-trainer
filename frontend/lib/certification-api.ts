import {
  CertificationStatus,
  CertificationTrack,
  TeamCertificationProgress,
  certificationTracks as seedTracks,
  loggedInCertificationId as seedLoggedInCertificationId,
  teamCertificationProgress as seedTeamProgress,
} from "@/lib/certifications"
import { getApiUrl } from "@/lib/utils"

type UserStatsResponse = {
  user_id: string
  total_score: number
  current_streak: number
  highest_streak: number
  module_progress?: string
  scenario_progress?: string
}

type LeaderboardEntry = {
  user_id: string
  total_score: number
  current_streak: number
  highest_streak: number
}

type KPIAnalyticsResponse = {
  completion_rate?: number
}

export type CertificationSnapshot = {
  tracks: CertificationTrack[]
  teamProgress: TeamCertificationProgress[]
  activeTrackId: string
  userId: string
}

function safeJsonParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function toStatus(progress: number, requiredChecksMet: number, totalChecks: number): CertificationStatus {
  if (progress >= 100) return "certified"
  if (requiredChecksMet === totalChecks - 1 && progress >= 85) return "ready"
  if (progress >= 25) return "in-progress"
  return "locked"
}

function deriveTeamProgressFromLeaderboard(entries: LeaderboardEntry[]): TeamCertificationProgress[] {
  if (!entries.length) return seedTeamProgress

  const teamNames = ["West Mavericks", "East Current", "Northeast Orbit", "South Voltage"]
  const grouped = new Map<string, LeaderboardEntry[]>()
  for (let index = 0; index < entries.length; index += 1) {
    const team = teamNames[index % teamNames.length]
    const bucket = grouped.get(team) ?? []
    bucket.push(entries[index])
    grouped.set(team, bucket)
  }

  return Array.from(grouped.entries()).map(([teamName, reps]) => {
    const certified = reps.filter((rep) => rep.total_score >= 4200).length
    const inProgress = reps.filter((rep) => rep.total_score >= 2200 && rep.total_score < 4200).length
    const atRisk = reps.filter((rep) => rep.total_score < 2200).length
    const overallCompletion = Math.round(
      reps.reduce((sum, rep) => sum + clamp(0, Math.round(rep.total_score / 55), 100), 0) / reps.length
    )
    return {
      teamName,
      repsCertified: certified,
      repsInProgress: inProgress,
      repsAtRisk: atRisk,
      overallCompletion,
      managerSignoffPending: Math.max(0, inProgress - Math.floor(certified / 2)),
    }
  })
}

function deriveTracksFromLive(
  baseTracks: CertificationTrack[],
  stats: UserStatsResponse | null,
  leaderboard: LeaderboardEntry[],
  analytics: KPIAnalyticsResponse | null
): CertificationTrack[] {
  if (!stats) return baseTracks

  const moduleProgress = safeJsonParse<Record<string, Record<string, boolean>>>(stats.module_progress, {})
  const scenarioProgress = safeJsonParse<Record<string, { passed?: boolean; best_score?: number }>>(stats.scenario_progress, {})

  const completedModuleSteps = Object.values(moduleProgress).reduce(
    (sum, moduleState) => sum + Object.values(moduleState).filter(Boolean).length,
    0
  )
  const totalModuleSteps = Math.max(Object.keys(moduleProgress).length * 3, 12)
  const moduleCompletionRate = clamp(0, Math.round((completedModuleSteps / totalModuleSteps) * 100), 100)

  const bestScenarioScore = Object.values(scenarioProgress).reduce(
    (best, scenario) => Math.max(best, scenario.best_score ?? 0),
    0
  )
  const passedScenarios = Object.values(scenarioProgress).filter((scenario) => scenario.passed).length
  const leaderboardRank = Math.max(1, leaderboard.findIndex((entry) => entry.user_id === stats.user_id) + 1)
  const percentileBoost =
    leaderboard.length > 0 ? Math.round((1 - leaderboardRank / Math.max(leaderboard.length, 1)) * 20) : 0
  const scoreSignal = clamp(0, Math.round(stats.total_score / 55), 100)
  const streakSignal = clamp(0, stats.current_streak * 2, 20)
  const analyticsSignal = clamp(0, Math.round((analytics?.completion_rate ?? 70) * 0.2), 20)

  return baseTracks.map((track, index) => {
    const requirementStates = track.requirements.map((requirement) => {
      const lowerLabel = requirement.label.toLowerCase()
      if (lowerLabel.includes("lesson modules")) {
        return { ...requirement, complete: moduleCompletionRate >= 70 - index * 6 }
      }
      if (lowerLabel.includes("simulation")) {
        return {
          ...requirement,
          complete: bestScenarioScore >= track.requiredSimulationScore || scoreSignal >= track.requiredSimulationScore,
        }
      }
      if (lowerLabel.includes("compliance")) {
        return { ...requirement, complete: (analytics?.completion_rate ?? 70) >= 88 - index * 2 }
      }
      if (lowerLabel.includes("final assessment")) {
        return { ...requirement, complete: passedScenarios >= Math.max(1, index) }
      }
      return requirement
    })

    const requirementCompleteCount = requirementStates.filter((item) => item.complete).length
    const progress = clamp(
      5,
      Math.round(
        scoreSignal * 0.4 +
          moduleCompletionRate * 0.35 +
          streakSignal * 0.15 +
          analyticsSignal * 0.1 +
          percentileBoost
      ) - index * 6,
      track.earnedDate ? 100 : 99
    )

    const status = track.earnedDate
      ? "certified"
      : toStatus(progress, requirementCompleteCount, requirementStates.length)

    const assessmentCurrent = bestScenarioScore > 0 ? bestScenarioScore : null
    const assessmentPassed = assessmentCurrent !== null ? assessmentCurrent >= track.assessment.targetScore : null

    return {
      ...track,
      status,
      progress: track.earnedDate ? 100 : progress,
      requirements: requirementStates,
      assessment: {
        ...track.assessment,
        currentScore: assessmentCurrent,
        passed: track.earnedDate ? true : assessmentPassed,
        attemptsUsed: Math.max(track.assessment.attemptsUsed, passedScenarios),
      },
      statusHistory: [
        ...track.statusHistory.slice(0, 2),
        {
          date: new Date().toISOString().slice(0, 10),
          event: "Live metrics sync",
          actor: "Certification Service",
        },
      ],
    }
  })
}

export async function fetchCertificationSnapshot(userId: string): Promise<CertificationSnapshot> {
  const apiUrl = getApiUrl()
  const snapshotRes = await fetch(`${apiUrl}/api/v1/certifications/snapshot?user_id=${encodeURIComponent(userId)}`, {
    credentials: "include",
  }).catch(() => null)

  if (snapshotRes && snapshotRes.ok) {
    const snapshot = (await snapshotRes.json()) as CertificationSnapshot
    return snapshot
  }

  const today = new Date()
  const endDate = today.toISOString().slice(0, 10)
  const startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const [statsRes, leaderboardRes, analyticsRes] = await Promise.allSettled([
    fetch(`${apiUrl}/user/${userId}/stats`, { credentials: "include" }),
    fetch(`${apiUrl}/leaderboard`, { credentials: "include" }),
    fetch(`${apiUrl}/api/v1/kpis/analytics?start_date=${startDate}&end_date=${endDate}&period=weekly`, {
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

  const analytics =
    analyticsRes.status === "fulfilled" && analyticsRes.value.ok
      ? ((await analyticsRes.value.json()) as KPIAnalyticsResponse)
      : null

  const tracks = deriveTracksFromLive(seedTracks, stats, leaderboard, analytics)
  const teamProgress = deriveTeamProgressFromLeaderboard(leaderboard)
  const activeTrackId =
    tracks.find((track) => track.id === seedLoggedInCertificationId)?.id ??
    tracks.find((track) => track.status === "ready")?.id ??
    tracks[0]?.id ??
    seedLoggedInCertificationId

  return {
    tracks,
    teamProgress,
    activeTrackId,
    userId: stats?.user_id ?? userId,
  }
}

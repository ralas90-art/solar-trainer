import { TrainingModuleProgress } from "./training-module-progress"
import { AudioLessonProgress } from "./audio-progress-storage"
import { MODULES, MODULE_SCENARIOS } from "./modules"

export type DashboardStats = {
  streak: number
  skillScore: number
  simWinRate: number
  attentionFlags: number
  certificationProgress: number
  completedMilestones: number
  totalMilestones: number
  recentSimulations: Array<{
    label: string
    score: number
    subtitle: string
  }>
  skillProgress: Array<{
    label: string
    value: number
  }>
  lastModuleId: string | null
  todayChallengeScenarioId: string | null
}

export type RecentActivity = {
  id: string
  type: "module" | "quiz" | "simulation"
  title: string
  timestamp: string
  score?: number
}

const STORAGE_PREFIX_MODULE = "septivolt_training_progress_"
const STORAGE_PREFIX_AUDIO = "septivolt_audio_lesson_"

export function getDashboardStats(): DashboardStats {
  if (typeof window === "undefined") {
    return {
      streak: 18,
      skillScore: 84.6,
      simWinRate: 79,
      attentionFlags: 3,
      certificationProgress: 72,
      completedMilestones: 5,
      totalMilestones: 7,
      recentSimulations: [],
      skillProgress: [],
      lastModuleId: "mod_4_7",
      todayChallengeScenarioId: "lease-vs-buy",
    }
  }

  // 1. Gather all progress
  const moduleProgress: TrainingModuleProgress[] = []
  const audioProgress: AudioLessonProgress[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX_MODULE)) {
      try {
        moduleProgress.push(JSON.parse(localStorage.getItem(key)!) as TrainingModuleProgress)
      } catch (e) {}
    } else if (key?.startsWith(STORAGE_PREFIX_AUDIO)) {
      try {
        audioProgress.push(JSON.parse(localStorage.getItem(key)!) as AudioLessonProgress)
      } catch (e) {}
    }
  }

  // 2. Calculate Streak (Simplified: check consecutive days in updatedAt)
  // For MVP, we'll keep the mock streak if we don't have enough data, 
  // or calculate based on the number of active days.
  const activeDays = new Set(moduleProgress.map(p => p.updatedAt.split("T")[0])).size
  const streak = activeDays > 0 ? activeDays : 18 // Fallback to 18 for demo feel

  // 3. Calculate Skill Score (Average of coaching scores)
  const scores = moduleProgress.filter(p => p.coachingScore !== null).map(p => p.coachingScore!)
  const skillScore = scores.length > 0 
    ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
    : 84.6

  // 4. Calculate Win Rate (Passed simulations / total simulations)
  // Assuming score >= 85 is a "win"
  const simAttempts = moduleProgress.filter(p => p.simulationCompleted)
  const wins = simAttempts.filter(p => (p.coachingScore ?? 0) >= 85).length
  const simWinRate = simAttempts.length > 0
    ? Math.round((wins / simAttempts.length) * 100)
    : 79

  // 5. Milestones
  const completedMilestones = moduleProgress.filter(p => p.moduleCompleted).length
  const totalMilestones = Object.keys(MODULES).length
  const certificationProgress = Math.round((completedMilestones / totalMilestones) * 100)

  // 6. Recent Simulations
  const recentSimulations = moduleProgress
    .filter(p => p.simulationCompleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map(p => ({
      label: MODULES[p.moduleId]?.title || p.moduleId,
      score: p.coachingScore ?? 0,
      subtitle: p.coachingNotes || "Simulation completed successfully."
    }))

  // 7. Last incomplete module
  const sortedByActivity = moduleProgress
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  
  const lastActiveModuleId = sortedByActivity[0]?.moduleId || "mod_1_1"

  // 8. Today's Challenge (Random unlocked scenario)
  const unlockedModuleIds = moduleProgress.filter(p => p.moduleCompleted).map(p => p.moduleId)
  const availableScenarios = unlockedModuleIds.flatMap(id => MODULE_SCENARIOS[id] || [])
  const todayChallengeScenarioId = availableScenarios.length > 0
    ? availableScenarios[Math.floor(Math.random() * availableScenarios.length)]
    : "discovery_basic"

  return {
    streak,
    skillScore,
    simWinRate,
    attentionFlags: scores.filter(s => s < 70).length || 3,
    certificationProgress,
    completedMilestones,
    totalMilestones,
    recentSimulations: recentSimulations.length > 0 ? recentSimulations : [],
    skillProgress: [
      { label: "Prospecting", value: 82 },
      { label: "Discovery", value: 76 },
      { label: "Presentation", value: 88 },
      { label: "Objections", value: 69 },
      { label: "Closing", value: 73 },
    ],
    lastModuleId: lastActiveModuleId,
    todayChallengeScenarioId,
  }
}

export function getRecentActivity(): RecentActivity[] {
  if (typeof window === "undefined") return []

  const moduleProgress: TrainingModuleProgress[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX_MODULE)) {
      try {
        moduleProgress.push(JSON.parse(localStorage.getItem(key)!) as TrainingModuleProgress)
      } catch (e) {}
    }
  }

  return moduleProgress
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(p => ({
      id: p.moduleId,
      type: p.simulationCompleted ? "simulation" : p.quizCompleted ? "quiz" : "module",
      title: MODULES[p.moduleId]?.title || p.moduleId,
      timestamp: p.updatedAt,
      score: p.coachingScore ?? undefined
    }))
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

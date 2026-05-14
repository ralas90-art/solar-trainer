export type ActivityLogEntry = {
  event: 'module_started' | 'module_completed' | 'audio_completed' | 'quiz_completed' | 'simulation_completed' | 'coaching_saved' | 'manual_interaction'
  timestamp: string
  metadata?: Record<string, any>
}

export type TrainingModuleProgress = {
  moduleId: string
  audioCompleted: boolean
  quizCompleted: boolean
  simulationCompleted: boolean
  coachingScore: number | null
  coachingNotes: string
  moduleCompleted: boolean
  startedAt?: string
  completedAt?: string
  updatedAt: string
  lastInteractionAt?: string // Tracks meaningful interaction
  score?: number
  skills?: string[]
  activityLog?: ActivityLogEntry[]
}

import { 
  UserGamification, 
  XP_REWARDS, 
  awardXp, 
  checkStreak,
  loadUserGamification,
  saveUserGamification
} from "./gamification-core"

import { WHITE_LABEL } from "./white-label.config"

const STORAGE_PREFIX = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_training_progress_`
const GAMIFICATION_KEY = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_user_gamification`
const USER_ACTIVITY_KEY = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_user_last_activity`
const IN_PROGRESS_TIMEOUT_MINUTES = 60

function storageKey(moduleId: string) {
  return `${STORAGE_PREFIX}${moduleId}`
}

export function loadTrainingModuleProgress(moduleId: string): TrainingModuleProgress | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(storageKey(moduleId))
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as TrainingModuleProgress
    // Graceful fallback for broken/missing fields
    if (!data.moduleId || !data.updatedAt) return null
    return data
  } catch {
    return null
  }
}

export function saveTrainingModuleProgress(progress: TrainingModuleProgress) {
  if (typeof window === "undefined") return
  
  // Final consistency check before write
  const existing = loadTrainingModuleProgress(progress.moduleId)
  if (existing && existing.lastInteractionAt) {
    const existingTime = new Date(existing.lastInteractionAt).getTime()
    const newTime = new Date(progress.lastInteractionAt || 0).getTime()
    
    // Session Consistency: Prevent overwriting newer progress with older events
    if (newTime < existingTime) {
      console.warn(`[Training Hub] Blocked stale write for ${progress.moduleId}. Local data is newer.`)
      return
    }
  }

  window.localStorage.setItem(storageKey(progress.moduleId), JSON.stringify(progress))
  window.localStorage.setItem(USER_ACTIVITY_KEY, new Date().toISOString())
}

export function getUserLastActivity(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(USER_ACTIVITY_KEY)
}

// Moved to gamification-core.ts

// Moved to gamification-core.ts

// Moved to gamification-core.ts

export function loadAllTrainingModuleProgress(): Record<string, TrainingModuleProgress> {
  const progress: Record<string, TrainingModuleProgress> = {}
  if (typeof window === "undefined") return progress

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const moduleId = key.replace(STORAGE_PREFIX, "")
      const data = loadTrainingModuleProgress(moduleId)
      if (data) progress[moduleId] = data
    }
  }
  return progress
}

import { api } from "./api-client"
import { TrainingModuleView } from "./training-module-view"

/**
 * Normalizes progress updates and prevents duplicate writes.
 * Implements session consistency and activity logging.
 */
export async function updateTrainingModuleProgress(
  moduleId: string,
  patch: Partial<TrainingModuleProgress>,
  event?: ActivityLogEntry['event'],
  userId?: string
): Promise<TrainingModuleProgress> {
  const previous = loadTrainingModuleProgress(moduleId)
  const now = new Date().toISOString()
  
  // Normalization Guard: Only update if state actually changed
  if (previous) {
    const hasChanged = Object.entries(patch).some(([key, value]) => {
      return JSON.stringify(previous[key as keyof TrainingModuleProgress]) !== JSON.stringify(value)
    })
    // If no data change and not forced by an event, skip write
    if (!hasChanged && !event) {
      return previous
    }
  }

  const startedAt = previous?.startedAt || now
  let completedAt = previous?.completedAt
  let finalEvent = event
  if (patch.moduleCompleted && !previous?.moduleCompleted && !finalEvent) {
    completedAt = now
    finalEvent = 'module_completed'
  }

  // Activity Log Update
  const newActivityLog = [...(previous?.activityLog || [])]
  if (finalEvent) {
    newActivityLog.push({
      event: finalEvent,
      timestamp: now,
      metadata: { ...patch }
    })
    // Keep log lean (last 50 events per module)
    if (newActivityLog.length > 50) newActivityLog.shift()
  }

  const next: TrainingModuleProgress = {
    moduleId,
    audioCompleted: previous?.audioCompleted ?? false,
    quizCompleted: previous?.quizCompleted ?? false,
    simulationCompleted: previous?.simulationCompleted ?? false,
    coachingScore: previous?.coachingScore ?? null,
    coachingNotes: previous?.coachingNotes ?? "",
    moduleCompleted: previous?.moduleCompleted ?? false,
    startedAt,
    completedAt,
    updatedAt: now,
    lastInteractionAt: now,
    skills: previous?.skills ?? [],
    activityLog: newActivityLog,
    ...patch,
  }
  
  saveTrainingModuleProgress(next)

  // Phase 2: Gamification Integration
  if (finalEvent) {
    // 1. Award XP based on event type
    if (finalEvent === 'audio_completed') {
      awardXp(`${moduleId}_audio`, XP_REWARDS.LESSON_COMPLETED)
    } else if (finalEvent === 'quiz_completed') {
      awardXp(`${moduleId}_quiz`, XP_REWARDS.QUIZ_COMPLETED)
      // Check for perfect score (assuming 100 or matching total)
      if (patch.score === 100) {
        awardXp(`${moduleId}_quiz_perfect`, XP_REWARDS.PERFECT_QUIZ_BONUS)
      }
    } else if (finalEvent === 'simulation_completed') {
      awardXp(`${moduleId}_simulation`, XP_REWARDS.SIMULATION_COMPLETED)
    }

    // 2. Check/Update Streak for meaningful completions
    // Meaningful = module, quiz, or simulation completed
    if (['module_completed', 'quiz_completed', 'simulation_completed'].includes(finalEvent)) {
       checkStreak()
    }
  }

  if (userId) {
    try {
      await api.post(`/user/${userId}/progress`, {
        module_id: moduleId,
        started_at: next.startedAt,
        completed_at: next.completedAt,
        last_interaction_at: next.lastInteractionAt,
        activity_log: next.activityLog,
        ...patch
      })
    } catch (err) {
      console.error("Failed to sync progress to backend:", err)
    }
  }

  return next
}

/**
 * Recommendation engine with "In-Progress Timeout" logic.
 */
export function getRecommendedModule(
  catalog: TrainingModuleView[],
  progressMap: Record<string, TrainingModuleProgress | null>
) {
  if (!catalog.length) return null

  const now = Date.now()
  const timeoutMs = IN_PROGRESS_TIMEOUT_MINUTES * 60 * 1000

  // 1. Most recently active incomplete module (within timeout)
  const activeIncomplete = catalog
    .filter(m => {
      const p = progressMap[m.id]
      if (!p || p.moduleCompleted || !p.lastInteractionAt) return false
      const lastInteraction = new Date(p.lastInteractionAt).getTime()
      return (now - lastInteraction) < timeoutMs
    })
    .sort((a, b) => {
      const timeA = new Date(progressMap[a.id]?.lastInteractionAt || 0).getTime()
      const timeB = new Date(progressMap[b.id]?.lastInteractionAt || 0).getTime()
      return timeB - timeA
    })
  
  if (activeIncomplete.length > 0) {
    return activeIncomplete[0]
  }

  // 2. First non-timed-out in-progress module
  const inProgress = catalog.find(m => {
    const p = progressMap[m.id]
    return p && !p.moduleCompleted && (p.audioCompleted || p.quizCompleted || p.simulationCompleted)
  })
  if (inProgress) return inProgress

  // 3. First locked-safe incomplete module in sequence
  const firstIncomplete = catalog.find(m => !progressMap[m.id]?.moduleCompleted)
  if (firstIncomplete) return firstIncomplete

  // 4. Default to first module or "Review" flow if all done
  return catalog[0]
}

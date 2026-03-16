export type TrainingModuleProgress = {
  moduleId: string
  audioCompleted: boolean
  quizCompleted: boolean
  simulationCompleted: boolean
  coachingScore: number | null
  coachingNotes: string
  moduleCompleted: boolean
  completedAt?: string
  updatedAt: string
}

const STORAGE_PREFIX = "septivolt_training_progress_"

function storageKey(moduleId: string) {
  return `${STORAGE_PREFIX}${moduleId}`
}

export function loadTrainingModuleProgress(moduleId: string): TrainingModuleProgress | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(storageKey(moduleId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as TrainingModuleProgress
  } catch {
    return null
  }
}

export function saveTrainingModuleProgress(progress: TrainingModuleProgress) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(storageKey(progress.moduleId), JSON.stringify(progress))
}

import { api } from "./api-client"

export async function updateTrainingModuleProgress(
  moduleId: string,
  patch: Partial<TrainingModuleProgress>,
  userId?: string
): Promise<TrainingModuleProgress> {
  const previous = loadTrainingModuleProgress(moduleId)
  const next: TrainingModuleProgress = {
    moduleId,
    audioCompleted: previous?.audioCompleted ?? false,
    quizCompleted: previous?.quizCompleted ?? false,
    simulationCompleted: previous?.simulationCompleted ?? false,
    coachingScore: previous?.coachingScore ?? null,
    coachingNotes: previous?.coachingNotes ?? "",
    moduleCompleted: previous?.moduleCompleted ?? false,
    completedAt: previous?.completedAt,
    updatedAt: new Date().toISOString(),
    ...patch,
  }
  
  // Persist locally for immediate UX
  saveTrainingModuleProgress(next)

  // Sync to backend if we have a userId
  if (userId) {
    try {
      await api.post(`/user/${userId}/progress`, {
        module_id: moduleId,
        ...patch
      })
    } catch (err) {
      console.error("Failed to sync progress to backend:", err)
    }
  }

  return next
}

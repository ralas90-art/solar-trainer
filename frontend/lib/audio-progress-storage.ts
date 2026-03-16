export type AudioLessonProgress = {
  moduleId: string
  lessonStarted: boolean
  lessonCompleted: boolean
  activeSectionId: string
  sectionCompletion: Record<string, boolean>
  resumeTimeSec: number
  updatedAt: string
}

const STORAGE_PREFIX = "septivolt_audio_lesson_"

function keyFor(moduleId: string) {
  return `${STORAGE_PREFIX}${moduleId}`
}

export function loadAudioProgress(moduleId: string): AudioLessonProgress | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(keyFor(moduleId))
    if (!raw) return null
    return JSON.parse(raw) as AudioLessonProgress
  } catch {
    return null
  }
}

export function saveAudioProgress(progress: AudioLessonProgress) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(keyFor(progress.moduleId), JSON.stringify(progress))
}

export function clearAudioProgress(moduleId: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(keyFor(moduleId))
}

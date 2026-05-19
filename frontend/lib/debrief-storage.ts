/**
 * Debrief Storage — MVP localStorage layer.
 *
 * Schema is designed to be migrated to a backend endpoint
 * (POST /user/:id/debriefs, GET /user/:id/debriefs) without
 * changing any consumer call-sites — only swap the storage
 * functions below for fetch() calls.
 */

import { isDemoModeActive, getDemoDebriefs } from "./demo-mode"

export type DebriefRecord = {
  id: string                       // uuid-style timestamp key
  scenarioId: string
  scenarioName: string
  completedAt: string              // ISO-8601
  passed: boolean
  score: number
  feedbackSummary?: string
  toneRating?: string
  toneFeedback?: string
  strengths: string[]
  improvements: string[]
  suggestedScript?: string
  transcript: Array<{ role: string; content: string }>
}

const STORAGE_KEY = "septivolt_simulation_debriefs"
const MAX_DEBRIEFS = 50           // rolling cap to avoid unbounded storage

function readAll(): DebriefRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DebriefRecord[]
  } catch {
    return []
  }
}

function writeAll(records: DebriefRecord[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

/** Prepend a new debrief and cap at MAX_DEBRIEFS (newest first). */
export function saveDebrief(record: Omit<DebriefRecord, "id">): DebriefRecord {
  const full: DebriefRecord = {
    ...record,
    id: `debrief_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  }
  if (isDemoModeActive()) {
    // In demo mode, do not commit new runs to localStorage
    return full
  }
  const existing = readAll()
  const updated = [full, ...existing].slice(0, MAX_DEBRIEFS)
  writeAll(updated)
  return full
}

/** Return all saved debriefs, newest first. */
export function loadDebriefs(): DebriefRecord[] {
  if (isDemoModeActive()) {
    return getDemoDebriefs()
  }
  return readAll()
}

/** Return a single debrief by id, or null. */
export function loadDebriefById(id: string): DebriefRecord | null {
  if (isDemoModeActive()) {
    return getDemoDebriefs().find((d) => d.id === id) ?? null
  }
  return readAll().find((d) => d.id === id) ?? null
}

/** Clear all debriefs (useful for testing / reset). */
export function clearDebriefs() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}


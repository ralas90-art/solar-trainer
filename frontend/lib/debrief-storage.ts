/**
 * Debrief Storage — Phase 6A
 *
 * Strategy:
 *  1. When a `userId` (authenticated username) is provided AND demo mode is OFF,
 *     all reads/writes go to the backend API (persistent, multi-tenant).
 *  2. When demo mode is active OR no userId is available, falls back to
 *     localStorage (safe, isolated, no DB writes).
 *
 * Call-site compatibility:
 *  - `saveDebrief()` is now async and accepts an optional `userId`.
 *  - `loadDebriefs()` is now async and accepts an optional `userId`.
 *  - Synchronous callers that don't await will get a no-op / empty fallback.
 */

import { isDemoModeActive, getDemoDebriefs } from "./demo-mode"
import { getApiUrl } from "./utils"

export type DebriefRecord = {
  id: string                        // uuid-style key
  scenarioId: string
  scenarioName: string
  completedAt: string               // ISO-8601
  passed: boolean
  score: number
  difficulty?: string
  feedbackSummary?: string
  toneRating?: string
  toneFeedback?: string
  strengths: string[]
  improvements: string[]
  suggestedScript?: string
  transcript: Array<{ role: string; content: string }>
}

const STORAGE_KEY = "septivolt_simulation_debriefs"
const MAX_DEBRIEFS = 50   // rolling cap for localStorage fallback

// ─── Internal localStorage helpers ───────────────────────────────────────────

function _readLocal(): DebriefRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DebriefRecord[]
  } catch {
    return []
  }
}

function _writeLocal(records: DebriefRecord[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

// ─── Internal API helpers ─────────────────────────────────────────────────────

async function _apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getApiUrl()
  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${msg}`)
  }
  return res.json() as Promise<T>
}

function _normaliseApiDebrief(raw: any): DebriefRecord {
  return {
    id: raw.id,
    scenarioId: raw.scenario_id ?? raw.scenarioId ?? "unknown",
    scenarioName: raw.scenario_name ?? raw.scenarioName ?? "Unnamed",
    completedAt: raw.completed_at ?? raw.completedAt ?? new Date().toISOString(),
    passed: raw.passed ?? false,
    score: raw.score ?? 0,
    difficulty: raw.difficulty,
    feedbackSummary: raw.feedback_summary ?? raw.feedbackSummary,
    toneRating: raw.tone_rating ?? raw.toneRating,
    toneFeedback: raw.tone_feedback ?? raw.toneFeedback,
    strengths: raw.strengths ?? [],
    improvements: raw.improvements ?? [],
    suggestedScript: raw.suggested_script ?? raw.suggestedScript,
    transcript: raw.transcript ?? [],
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Save a completed simulation debrief.
 *
 * If `userId` is provided and demo mode is off, persists to backend API.
 * Otherwise falls back to localStorage.
 */
export async function saveDebrief(
  record: Omit<DebriefRecord, "id">,
  userId?: string
): Promise<DebriefRecord> {
  // Generate a local id for immediate return
  const localId = `debrief_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const full: DebriefRecord = { ...record, id: localId }

  // Demo Mode: tag but never persist to DB
  if (isDemoModeActive()) {
    return full
  }

  // Backend persistence
  if (userId) {
    try {
      const apiUrl = getApiUrl()
      const payload = {
        scenario_id: record.scenarioId,
        scenario_name: record.scenarioName,
        difficulty: record.difficulty ?? "beginner",
        score: record.score,
        passed: record.passed,
        feedback_summary: record.feedbackSummary,
        tone_rating: record.toneRating,
        tone_feedback: record.toneFeedback,
        strengths: record.strengths,
        improvements: record.improvements,
        suggested_script: record.suggestedScript,
        transcript: (record.transcript ?? []).map((t) => ({
          role: t.role,
          content: t.content,
        })),
      }
      const saved = await _apiFetch<any>(
        `/api/v1/user/${encodeURIComponent(userId)}/debriefs`,
        { method: "POST", body: JSON.stringify(payload) }
      )
      return _normaliseApiDebrief(saved)
    } catch (err) {
      console.warn("[debrief-storage] Backend save failed, falling back to localStorage:", err)
      // Fallback to localStorage on API error
    }
  }

  // localStorage fallback
  const existing = _readLocal()
  const updated = [full, ...existing].slice(0, MAX_DEBRIEFS)
  _writeLocal(updated)
  return full
}

/**
 * Load all debriefs, newest first.
 *
 * If `userId` is provided and demo mode is off, fetches from backend API.
 * Otherwise reads from localStorage.
 */
export async function loadDebriefs(userId?: string): Promise<DebriefRecord[]> {
  if (isDemoModeActive()) {
    return getDemoDebriefs()
  }

  if (userId) {
    try {
      const raw = await _apiFetch<any[]>(
        `/api/v1/user/${encodeURIComponent(userId)}/debriefs`
      )
      return raw.map(_normaliseApiDebrief)
    } catch (err) {
      console.warn("[debrief-storage] Backend load failed, falling back to localStorage:", err)
    }
  }

  return _readLocal()
}

/**
 * Load a single debrief by id.
 */
export async function loadDebriefById(
  id: string,
  userId?: string
): Promise<DebriefRecord | null> {
  if (isDemoModeActive()) {
    return getDemoDebriefs().find((d) => d.id === id) ?? null
  }

  if (userId) {
    try {
      const raw = await _apiFetch<any>(
        `/api/v1/user/${encodeURIComponent(userId)}/debriefs/${encodeURIComponent(id)}`
      )
      return _normaliseApiDebrief(raw)
    } catch {
      // Fall through to localStorage
    }
  }

  return _readLocal().find((d) => d.id === id) ?? null
}

/** Clear localStorage debriefs (useful for testing / reset). Does not affect backend. */
export function clearDebriefs() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

// ─── Sync shims (for legacy callers that don't await) ────────────────────────

/**
 * Synchronous load from localStorage ONLY (demo-mode or unauthenticated fallback).
 * Use `loadDebriefs(userId)` for the full async path.
 */
export function loadDebriefsSync(): DebriefRecord[] {
  if (isDemoModeActive()) return getDemoDebriefs()
  return _readLocal()
}

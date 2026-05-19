/**
 * lib/simulation-progress.ts
 *
 * Unified, source-of-truth helper for determining per-scenario completion status.
 *
 * Priority order (highest trust first):
 *  1. Backend `scenario_progress` — authoritative if present
 *  2. `debrief-storage` (`septivolt_simulation_debriefs`) — saved after every real AI sim
 *  3. `training-module-progress` (`septivolt_training_progress_*`) — module-linked simulations
 *
 * Duplicate-prevention strategy:
 *  - Keyed by `scenarioId` (string). Each source contributes at most one record per id.
 *  - Backend data wins when both sources have data for the same id.
 *
 * Migration path:
 *  - When backend persistence is ready, replace `loadDebriefs()` + localStorage
 *    scanning with a single `GET /user/:id/scenario_progress` call.
 *  - The rest of the consumer API (`getScenarioProgress`, `getCompletedCount`) stays the same.
 */

import { loadDebriefs, DebriefRecord } from "./debrief-storage"

export type ScenarioProgressRecord = {
  scenarioId: string
  passed: boolean
  bestScore: number
  attempts: number
  lastAttemptAt: string | null     // ISO-8601 or null
  /** The source that provided this record */
  source: "backend" | "debrief" | "module"
}

export type ScenarioProgressMap = Record<string, ScenarioProgressRecord>

// ─── Source 1: Backend (passed in from component) ────────────────────────────

function fromBackend(raw: Record<string, any>): ScenarioProgressMap {
  const map: ScenarioProgressMap = {}
  for (const [id, prog] of Object.entries(raw)) {
    if (!id || typeof prog !== "object") continue
    map[id] = {
      scenarioId: id,
      passed: !!prog.passed,
      bestScore: Number(prog.best_score ?? prog.score ?? 0),
      attempts: Number(prog.attempts ?? 1),
      lastAttemptAt: prog.last_attempt_at ?? prog.completedAt ?? null,
      source: "backend",
    }
  }
  return map
}

// ─── Source 2: Debrief localStorage ──────────────────────────────────────────

function fromDebriefs(): ScenarioProgressMap {
  const map: ScenarioProgressMap = {}
  const debriefs = loadDebriefs()

  // Group by scenarioId, keeping the best score across all attempts
  for (const d of debriefs) {
    const id = d.scenarioId
    if (!id || id === "unknown") continue

    const existing = map[id]
    if (!existing) {
      map[id] = {
        scenarioId: id,
        passed: d.passed,
        bestScore: d.score,
        attempts: 1,
        lastAttemptAt: d.completedAt,
        source: "debrief",
      }
    } else {
      // Accumulate: more attempts, keep best score, passed if any run passed
      existing.attempts += 1
      if (d.score > existing.bestScore) existing.bestScore = d.score
      if (d.passed) existing.passed = true
      // Keep the most recent date
      if (d.completedAt && (!existing.lastAttemptAt || d.completedAt > existing.lastAttemptAt)) {
        existing.lastAttemptAt = d.completedAt
      }
    }
  }

  return map
}

// ─── Source 3: Module-linked training progress ───────────────────────────────

const MODULE_PREFIX = "septivolt_training_progress_"

function fromModuleProgress(): ScenarioProgressMap {
  const map: ScenarioProgressMap = {}
  if (typeof window === "undefined") return map

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(MODULE_PREFIX)) continue

    try {
      const raw = JSON.parse(localStorage.getItem(key)!)
      if (!raw?.simulationCompleted) continue

      // Module progress is keyed by moduleId, not scenarioId.
      // We use the moduleId as a proxy scenarioId for progress tracking.
      const id = `module:${raw.moduleId}`
      const existing = map[id]
      const score = Number(raw.coachingScore ?? 0)

      if (!existing) {
        map[id] = {
          scenarioId: id,
          passed: score >= 70,
          bestScore: score,
          attempts: 1,
          lastAttemptAt: raw.updatedAt ?? null,
          source: "module",
        }
      } else {
        existing.attempts += 1
        if (score > existing.bestScore) existing.bestScore = score
        if (score >= 70) existing.passed = true
        if (raw.updatedAt && (!existing.lastAttemptAt || raw.updatedAt > existing.lastAttemptAt)) {
          existing.lastAttemptAt = raw.updatedAt
        }
      }
    } catch {
      // malformed entry — skip
    }
  }

  return map
}

// ─── Merge function (backend wins on conflict) ────────────────────────────────

/**
 * Build a merged ScenarioProgressMap from all available sources.
 *
 * @param backendRaw  Raw `scenario_progress` object from the backend API (may be empty / {})
 */
export function buildScenarioProgressMap(
  backendRaw: Record<string, any> = {}
): ScenarioProgressMap {
  const backend = fromBackend(backendRaw)
  const debrief = fromDebriefs()
  const module = fromModuleProgress()

  // Lower-priority sources first, higher-priority overwrite
  return { ...module, ...debrief, ...backend }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns the progress record for one scenario, or null.
 */
export function getScenarioProgress(
  map: ScenarioProgressMap,
  scenarioId: string
): ScenarioProgressRecord | null {
  return map[scenarioId] ?? null
}

/**
 * Returns a simplified status string for UI rendering.
 */
export function getScenarioStatus(
  map: ScenarioProgressMap,
  scenarioId: string
): "completed" | "attempted" | "available" {
  const rec = map[scenarioId]
  if (!rec) return "available"
  if (rec.passed) return "completed"
  return "attempted"
}

/**
 * Count distinct passed scenarios (no double-counting).
 */
export function getCompletedCount(map: ScenarioProgressMap): number {
  return Object.values(map).filter((r) => r.passed).length
}

/**
 * Count distinct attempted (but not yet passed) scenarios.
 */
export function getAttemptedCount(map: ScenarioProgressMap): number {
  return Object.values(map).filter((r) => !r.passed && r.attempts > 0).length
}

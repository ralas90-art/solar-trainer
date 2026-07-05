/**
 * SeptiVolt Sales OS — Assignment Curriculum Registry
 * =====================================================
 * Lightweight mapping from VerticalId → assignable curriculum options.
 * Used by Team Hub to populate the curriculum assignment dropdown
 * filtered by the company's enabled/visible verticals.
 *
 * Sub-Phase 1D: Foundation for vertical-aware assignment.
 * Solar keeps its existing production IDs.
 * All preview verticals get a single `_foundation_preview` ID.
 */

import type { VerticalId, CategoryId } from "@/lib/verticals"
import { VERTICALS, CATEGORIES } from "@/lib/verticals"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssignableCurriculum {
  /** Unique curriculum ID sent to the backend */
  id: string
  /** Human-readable name shown in the dropdown */
  name: string
  /** The vertical this curriculum belongs to */
  verticalId: VerticalId
  /** Whether this is a preview/unreleased curriculum */
  isPreview: boolean
}

export interface CurriculumOptionGroup {
  /** Category display name */
  categoryName: string
  /** Category ID */
  categoryId: CategoryId
  /** Assignable curriculums within this category */
  options: AssignableCurriculum[]
}

// ─── Curriculum Assignment Registry ───────────────────────────────────────────
// Maps each VerticalId to its assignable curriculum options.
// Solar retains the two production-ready IDs that already exist in the system.
// All other verticals get a single foundation preview entry.

const ASSIGNMENT_CURRICULUM_MAP: Record<VerticalId, AssignableCurriculum[]> = {
  core_sales: [
    { id: "core_sales_foundation_preview", name: "Core Sales Foundation", verticalId: "core_sales", isPreview: true },
  ],
  solar: [
    { id: "solar_fundamentals_v1", name: "Solar Fundamentals RAMPER v1", verticalId: "solar", isPreview: false },
    { id: "solar_advanced_v2", name: "Advanced Solar Closer Master v2", verticalId: "solar", isPreview: false },
  ],
  retail_energy: [
    { id: "retail_energy_foundation_preview", name: "Retail Energy Foundation", verticalId: "retail_energy", isPreview: true },
  ],
  hvac: [
    { id: "hvac_foundation_preview", name: "HVAC Foundation", verticalId: "hvac", isPreview: true },
  ],
  smart_thermostats: [
    { id: "smart_thermostats_foundation_preview", name: "Smart Thermostats Foundation", verticalId: "smart_thermostats", isPreview: true },
  ],
  smart_home_security: [
    { id: "smart_home_security_foundation_preview", name: "Smart Home Security Foundation", verticalId: "smart_home_security", isPreview: true },
  ],
  roofing: [
    { id: "roofing_foundation_preview", name: "Roofing Foundation", verticalId: "roofing", isPreview: true },
  ],
  windows: [
    { id: "windows_foundation_preview", name: "Windows Foundation", verticalId: "windows", isPreview: true },
  ],
  water_purification: [
    { id: "water_purification_foundation_preview", name: "Water Purification Foundation", verticalId: "water_purification", isPreview: true },
  ],
  stucco: [
    { id: "stucco_foundation_preview", name: "Stucco Foundation", verticalId: "stucco", isPreview: true },
  ],
  adu: [
    { id: "adu_foundation_preview", name: "ADU Foundation", verticalId: "adu", isPreview: true },
  ],
  fiber_optics: [
    { id: "fiber_optics_foundation_preview", name: "Fiber Optic Internet Foundation", verticalId: "fiber_optics", isPreview: true },
  ],
}

// ─── All valid curriculum IDs (for validation) ────────────────────────────────

export const ALL_VALID_CURRICULUM_IDS: Set<string> = new Set(
  Object.values(ASSIGNMENT_CURRICULUM_MAP).flatMap(arr => arr.map(c => c.id))
)

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a flat list of assignable curriculums for the given visible verticals.
 *
 * @param visibleVerticals - The verticals visible to the current user
 *   (from `useCompanyVerticals().visibleVerticals`)
 * @returns Flat array of assignable curriculums, filtered to visible verticals only
 */
export function getAssignableCurriculums(
  visibleVerticals: VerticalId[]
): AssignableCurriculum[] {
  const visibleSet = new Set(visibleVerticals)
  return Object.entries(ASSIGNMENT_CURRICULUM_MAP)
    .filter(([vid]) => visibleSet.has(vid as VerticalId))
    .flatMap(([, options]) => options)
}

/**
 * Get assignable curriculums grouped by category for rendering
 * in `<optgroup>` structures.
 *
 * @param visibleVerticals - The verticals visible to the current user
 * @returns Array of CurriculumOptionGroup, ordered by category registry order.
 *          Empty categories are omitted.
 */
export function getAssignableCurriculumsGrouped(
  visibleVerticals: VerticalId[]
): CurriculumOptionGroup[] {
  const visibleSet = new Set(visibleVerticals)
  const groups: CurriculumOptionGroup[] = []

  for (const [catId, catDef] of Object.entries(CATEGORIES)) {
    const options: AssignableCurriculum[] = []

    for (const vid of catDef.verticals) {
      if (!visibleSet.has(vid)) continue
      const curriculums = ASSIGNMENT_CURRICULUM_MAP[vid]
      if (curriculums) {
        options.push(...curriculums)
      }
    }

    if (options.length > 0) {
      groups.push({
        categoryName: catDef.name,
        categoryId: catId as CategoryId,
        options,
      })
    }
  }

  return groups
}

/**
 * Check if a curriculum ID is in the valid registry.
 */
export function isValidCurriculumId(id: string): boolean {
  return ALL_VALID_CURRICULUM_IDS.has(id)
}

/**
 * Get the curriculum definition by ID.
 */
export function getCurriculumById(id: string): AssignableCurriculum | null {
  for (const options of Object.values(ASSIGNMENT_CURRICULUM_MAP)) {
    const found = options.find(c => c.id === id)
    if (found) return found
  }
  return null
}

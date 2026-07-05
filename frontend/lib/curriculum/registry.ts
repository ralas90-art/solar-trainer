/**
 * SeptiVolt Sales OS — Curriculum Registry
 * ==========================================
 * Central resolver that aggregates all vertical curriculums into a unified API.
 * Solar remains canonical in `@/lib/modules` — this registry wraps it alongside
 * all new vertical shells.
 *
 * Sub-Phase 1A: This registry exists in code for internal use and testing.
 * It does not expose preview verticals in the production UI.
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"
import { MODULES, DAY_MODULES, MODULE_SCENARIOS, SCENARIO_TO_MODULE } from "@/lib/modules"
import type { VerticalId } from "@/lib/verticals"
import { VERTICALS, getVerticalByModuleId, isPreviewVertical } from "@/lib/verticals"

// ─── Import all curriculum shells ─────────────────────────────────────────────

import { CORE_SALES_MODULES, CORE_SALES_DAY_MODULES, CORE_SALES_MODULE_SCENARIOS } from "./core_sales"
import { ENERGY_MODULES, ENERGY_DAY_MODULES, ENERGY_MODULE_SCENARIOS } from "./energy"
import { HVAC_MODULES, HVAC_DAY_MODULES, HVAC_MODULE_SCENARIOS } from "./hvac"
import { SMART_THERMOSTATS_MODULES, SMART_THERMOSTATS_DAY_MODULES, SMART_THERMOSTATS_MODULE_SCENARIOS } from "./smart_thermostats"
import { SMART_HOME_SECURITY_MODULES, SMART_HOME_SECURITY_DAY_MODULES, SMART_HOME_SECURITY_MODULE_SCENARIOS } from "./smart_home_security"
import { ROOFING_MODULES, ROOFING_DAY_MODULES, ROOFING_MODULE_SCENARIOS } from "./roofing"
import { WINDOWS_MODULES, WINDOWS_DAY_MODULES, WINDOWS_MODULE_SCENARIOS } from "./windows"
import { WATER_PURIFICATION_MODULES, WATER_PURIFICATION_DAY_MODULES, WATER_PURIFICATION_MODULE_SCENARIOS } from "./water_purification"
import { STUCCO_MODULES, STUCCO_DAY_MODULES, STUCCO_MODULE_SCENARIOS } from "./stucco"
import { ADU_MODULES, ADU_DAY_MODULES, ADU_MODULE_SCENARIOS } from "./adu"
import { FIBER_OPTICS_MODULES, FIBER_OPTICS_DAY_MODULES, FIBER_OPTICS_MODULE_SCENARIOS } from "./fiber_optics"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VerticalCurriculum {
  verticalId: VerticalId
  modules: Record<string, ModuleContent>
  dayModules: DayInfo[]
  moduleScenarios: Record<string, string[]>
}

// ─── Per-Vertical Curriculum Map ──────────────────────────────────────────────

const CURRICULUM_MAP: Record<VerticalId, VerticalCurriculum> = {
  solar: {
    verticalId: "solar",
    modules: MODULES,
    dayModules: DAY_MODULES,
    moduleScenarios: MODULE_SCENARIOS,
  },
  core_sales: {
    verticalId: "core_sales",
    modules: CORE_SALES_MODULES,
    dayModules: CORE_SALES_DAY_MODULES,
    moduleScenarios: CORE_SALES_MODULE_SCENARIOS,
  },
  retail_energy: {
    verticalId: "retail_energy",
    modules: ENERGY_MODULES,
    dayModules: ENERGY_DAY_MODULES,
    moduleScenarios: ENERGY_MODULE_SCENARIOS,
  },
  hvac: {
    verticalId: "hvac",
    modules: HVAC_MODULES,
    dayModules: HVAC_DAY_MODULES,
    moduleScenarios: HVAC_MODULE_SCENARIOS,
  },
  smart_thermostats: {
    verticalId: "smart_thermostats",
    modules: SMART_THERMOSTATS_MODULES,
    dayModules: SMART_THERMOSTATS_DAY_MODULES,
    moduleScenarios: SMART_THERMOSTATS_MODULE_SCENARIOS,
  },
  smart_home_security: {
    verticalId: "smart_home_security",
    modules: SMART_HOME_SECURITY_MODULES,
    dayModules: SMART_HOME_SECURITY_DAY_MODULES,
    moduleScenarios: SMART_HOME_SECURITY_MODULE_SCENARIOS,
  },
  roofing: {
    verticalId: "roofing",
    modules: ROOFING_MODULES,
    dayModules: ROOFING_DAY_MODULES,
    moduleScenarios: ROOFING_MODULE_SCENARIOS,
  },
  windows: {
    verticalId: "windows",
    modules: WINDOWS_MODULES,
    dayModules: WINDOWS_DAY_MODULES,
    moduleScenarios: WINDOWS_MODULE_SCENARIOS,
  },
  water_purification: {
    verticalId: "water_purification",
    modules: WATER_PURIFICATION_MODULES,
    dayModules: WATER_PURIFICATION_DAY_MODULES,
    moduleScenarios: WATER_PURIFICATION_MODULE_SCENARIOS,
  },
  stucco: {
    verticalId: "stucco",
    modules: STUCCO_MODULES,
    dayModules: STUCCO_DAY_MODULES,
    moduleScenarios: STUCCO_MODULE_SCENARIOS,
  },
  adu: {
    verticalId: "adu",
    modules: ADU_MODULES,
    dayModules: ADU_DAY_MODULES,
    moduleScenarios: ADU_MODULE_SCENARIOS,
  },
  fiber_optics: {
    verticalId: "fiber_optics",
    modules: FIBER_OPTICS_MODULES,
    dayModules: FIBER_OPTICS_DAY_MODULES,
    moduleScenarios: FIBER_OPTICS_MODULE_SCENARIOS,
  },
}

// ─── Unified Module Index ─────────────────────────────────────────────────────
// Flattened index of ALL modules across ALL verticals for route resolution.

const ALL_MODULES_INDEX: Record<string, ModuleContent> = {}
const ALL_MODULE_SCENARIOS_INDEX: Record<string, string[]> = {}

for (const curriculum of Object.values(CURRICULUM_MAP)) {
  Object.assign(ALL_MODULES_INDEX, curriculum.modules)
  Object.assign(ALL_MODULE_SCENARIOS_INDEX, curriculum.moduleScenarios)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Get the curriculum for a specific vertical */
export function getCurriculumByVertical(verticalId: VerticalId): VerticalCurriculum | null {
  return CURRICULUM_MAP[verticalId] ?? null
}

/** Get all registered curriculums */
export function getAllCurriculums(): VerticalCurriculum[] {
  return Object.values(CURRICULUM_MAP)
}

/** Get only production-ready curriculums (non-preview) */
export function getProductionCurriculums(): VerticalCurriculum[] {
  return Object.values(CURRICULUM_MAP).filter(
    (c) => !isPreviewVertical(c.verticalId)
  )
}

/**
 * Resolve a module by ID across ALL verticals.
 * This is the key function for route resolution — it finds the module
 * regardless of which vertical it belongs to.
 */
export function resolveModuleById(moduleId: string): ModuleContent | null {
  return ALL_MODULES_INDEX[moduleId] ?? null
}

/**
 * Resolve module + vertical metadata for a given module ID.
 * Returns both the module content and its vertical context.
 */
export function resolveModuleWithContext(moduleId: string): {
  module: ModuleContent
  verticalId: VerticalId
  isPreview: boolean
} | null {
  const module = ALL_MODULES_INDEX[moduleId]
  if (!module) return null

  const vertical = getVerticalByModuleId(moduleId)
  if (!vertical) return null

  return {
    module,
    verticalId: vertical.id,
    isPreview: vertical.isPreview,
  }
}

/** Get scenario mappings for a module ID from any vertical */
export function resolveModuleScenarios(moduleId: string): string[] {
  return ALL_MODULE_SCENARIOS_INDEX[moduleId] ?? []
}

/**
 * Get the curriculums that should be visible for a company
 * based on their enabled_verticals list.
 *
 * For Sub-Phase 1A: This is available for internal use but the UI
 * only shows Solar for production companies.
 */
export function getCurriculumsForCompany(
  enabledVerticals: VerticalId[]
): VerticalCurriculum[] {
  return enabledVerticals
    .map((id) => CURRICULUM_MAP[id])
    .filter(Boolean) as VerticalCurriculum[]
}

/** Get all module IDs across all verticals */
export function getAllModuleIds(): string[] {
  return Object.keys(ALL_MODULES_INDEX)
}

/** Check if a module ID exists in any registered curriculum */
export function isRegisteredModuleId(moduleId: string): boolean {
  return moduleId in ALL_MODULES_INDEX
}

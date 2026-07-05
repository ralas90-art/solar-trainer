/**
 * SeptiVolt Sales OS — Vertical & Category Registry
 * ===================================================
 * Central registry for all training verticals and their category taxonomy.
 * Solar remains canonical in `modules.ts` — this file only registers metadata
 * and provides helper functions for multi-vertical resolution.
 *
 * Sub-Phase 1A: Registry exists in code but is not exposed in production UI.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type VerticalId =
  | "core_sales"
  | "solar"
  | "retail_energy"
  | "hvac"
  | "smart_thermostats"
  | "smart_home_security"
  | "roofing"
  | "windows"
  | "water_purification"
  | "stucco"
  | "adu"
  | "fiber_optics"

export type CategoryId =
  | "core"
  | "energy_smart_home"
  | "home_improvement"
  | "telecom"

export interface VerticalDefinition {
  id: VerticalId
  name: string
  nameEs: string
  categoryId: CategoryId
  modulePrefix: string
  /** If true, this vertical is fully production-ready with curriculum content */
  isProduction: boolean
  /** If true, this vertical exists in code but is not yet exposed to normal companies */
  isPreview: boolean
  description: string
}

export interface CategoryDefinition {
  id: CategoryId
  name: string
  nameEs: string
  verticals: VerticalId[]
}

// ─── Module Prefix → Vertical Mapping ─────────────────────────────────────────

export const MODULE_PREFIX_MAP: Record<string, VerticalId> = {
  "mod_":     "solar",
  "core_":    "core_sales",
  "energy_":  "retail_energy",
  "hvac_":    "hvac",
  "thermo_":  "smart_thermostats",
  "sec_":     "smart_home_security",
  "roof_":    "roofing",
  "win_":     "windows",
  "water_":   "water_purification",
  "stucco_":  "stucco",
  "adu_":     "adu",
  "fiber_":   "fiber_optics",
}

// ─── Category Registry ────────────────────────────────────────────────────────

export const CATEGORIES: Record<CategoryId, CategoryDefinition> = {
  core: {
    id: "core",
    name: "Core",
    nameEs: "Fundamentos",
    verticals: ["core_sales"],
  },
  energy_smart_home: {
    id: "energy_smart_home",
    name: "Energy & Smart Home",
    nameEs: "Energía y Hogar Inteligente",
    verticals: ["solar", "retail_energy", "hvac", "smart_thermostats", "smart_home_security"],
  },
  home_improvement: {
    id: "home_improvement",
    name: "Home Improvement",
    nameEs: "Mejoras del Hogar",
    verticals: ["roofing", "windows", "water_purification", "stucco", "adu"],
  },
  telecom: {
    id: "telecom",
    name: "Telecom",
    nameEs: "Telecomunicaciones",
    verticals: ["fiber_optics"],
  },
}

// ─── Vertical Registry ────────────────────────────────────────────────────────

export const VERTICALS: Record<VerticalId, VerticalDefinition> = {
  core_sales: {
    id: "core_sales",
    name: "Core Sales Foundation",
    nameEs: "Fundamentos de Ventas",
    categoryId: "core",
    modulePrefix: "core_",
    isProduction: false,
    isPreview: true,
    description: "Universal sales methodology, communication frameworks, and professional development applicable across all verticals.",
  },
  solar: {
    id: "solar",
    name: "Solar",
    nameEs: "Solar",
    categoryId: "energy_smart_home",
    modulePrefix: "mod_",
    isProduction: true,
    isPreview: false,
    description: "Residential solar sales training — the flagship SeptiVolt curriculum covering prospecting through field certification.",
  },
  retail_energy: {
    id: "retail_energy",
    name: "Retail Energy / Electric Provider Switching",
    nameEs: "Energía al por menor / Cambio de proveedor eléctrico",
    categoryId: "energy_smart_home",
    modulePrefix: "energy_",
    isProduction: false,
    isPreview: true,
    description: "Deregulated energy market sales — helping homeowners switch providers to save on electricity rates.",
  },
  hvac: {
    id: "hvac",
    name: "HVAC",
    nameEs: "HVAC / Climatización",
    categoryId: "energy_smart_home",
    modulePrefix: "hvac_",
    isProduction: false,
    isPreview: true,
    description: "Heating, ventilation, and air conditioning sales — comfort-based selling for residential HVAC systems.",
  },
  smart_thermostats: {
    id: "smart_thermostats",
    name: "Smart Thermostats & Energy Management",
    nameEs: "Termostatos Inteligentes y Gestión Energética",
    categoryId: "energy_smart_home",
    modulePrefix: "thermo_",
    isProduction: false,
    isPreview: true,
    description: "Smart thermostat and energy management device sales — efficiency-focused selling for connected home products.",
  },
  smart_home_security: {
    id: "smart_home_security",
    name: "Smart Home Security / Alarm Systems",
    nameEs: "Seguridad Inteligente del Hogar / Sistemas de Alarma",
    categoryId: "energy_smart_home",
    modulePrefix: "sec_",
    isProduction: false,
    isPreview: true,
    description: "Home security and alarm system sales — protection-focused selling for residential security packages.",
  },
  roofing: {
    id: "roofing",
    name: "Roofing",
    nameEs: "Techos",
    categoryId: "home_improvement",
    modulePrefix: "roof_",
    isProduction: false,
    isPreview: true,
    description: "Residential roofing sales — storm restoration, re-roofing, and insurance claim navigation.",
  },
  windows: {
    id: "windows",
    name: "Windows",
    nameEs: "Ventanas",
    categoryId: "home_improvement",
    modulePrefix: "win_",
    isProduction: false,
    isPreview: true,
    description: "Window replacement sales — energy efficiency, curb appeal, and comfort-focused selling.",
  },
  water_purification: {
    id: "water_purification",
    name: "Water Purification",
    nameEs: "Purificación de Agua",
    categoryId: "home_improvement",
    modulePrefix: "water_",
    isProduction: false,
    isPreview: true,
    description: "Whole-home water purification system sales — health and quality-focused selling for filtration and softener systems.",
  },
  stucco: {
    id: "stucco",
    name: "Stucco",
    nameEs: "Estuco",
    categoryId: "home_improvement",
    modulePrefix: "stucco_",
    isProduction: false,
    isPreview: true,
    description: "Stucco repair and installation sales — exterior protection, curb appeal, and structural integrity selling.",
  },
  adu: {
    id: "adu",
    name: "ADUs (Accessory Dwelling Units)",
    nameEs: "Unidades de Vivienda Accesoria (ADU)",
    categoryId: "home_improvement",
    modulePrefix: "adu_",
    isProduction: false,
    isPreview: true,
    description: "ADU construction sales — rental income, multigenerational living, and property value enhancement.",
  },
  fiber_optics: {
    id: "fiber_optics",
    name: "Fiber Optic Internet",
    nameEs: "Internet de Fibra Óptica",
    categoryId: "telecom",
    modulePrefix: "fiber_",
    isProduction: false,
    isPreview: true,
    description: "Fiber optic internet sales — speed, reliability, and value-focused selling for residential broadband.",
  },
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Resolve which vertical a module belongs to based on its ID prefix */
export function getVerticalByModuleId(moduleId: string): VerticalDefinition | null {
  // Sort prefixes by length descending so longer prefixes match first
  // e.g., "stucco_" should match before "s" if there were overlapping prefixes
  const sortedPrefixes = Object.keys(MODULE_PREFIX_MAP).sort(
    (a, b) => b.length - a.length
  )

  for (const prefix of sortedPrefixes) {
    if (moduleId.startsWith(prefix)) {
      return VERTICALS[MODULE_PREFIX_MAP[prefix]]
    }
  }
  return null
}

/** Get the category definition for a given vertical */
export function getCategoryByVerticalId(verticalId: VerticalId): CategoryDefinition | null {
  const vertical = VERTICALS[verticalId]
  if (!vertical) return null
  return CATEGORIES[vertical.categoryId] ?? null
}

/** Get all verticals in a given category */
export function getVerticalsByCategory(categoryId: CategoryId): VerticalDefinition[] {
  const category = CATEGORIES[categoryId]
  if (!category) return []
  return category.verticals.map((id) => VERTICALS[id]).filter(Boolean)
}

/** Parse and return enabled verticals for a company, falling back to ["solar"] */
export function getEnabledVerticals(company: { enabled_verticals?: string | string[] }): VerticalId[] {
  const raw = company.enabled_verticals
  if (!raw) return ["solar"]

  if (Array.isArray(raw)) return raw as VerticalId[]

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as VerticalId[]
  } catch {
    // Malformed JSON — safe fallback
  }
  return ["solar"]
}

/** Check if a specific vertical is enabled for a company */
export function isVerticalEnabledForCompany(
  verticalId: VerticalId,
  company: { enabled_verticals?: string | string[] }
): boolean {
  return getEnabledVerticals(company).includes(verticalId)
}

/** Check if a vertical is still in preview (not production-ready) */
export function isPreviewVertical(verticalId: VerticalId): boolean {
  return VERTICALS[verticalId]?.isPreview ?? true
}

/** Get all verticals that are in production (not preview) */
export function getProductionVerticals(): VerticalDefinition[] {
  return Object.values(VERTICALS).filter((v) => v.isProduction)
}

/** Get the full category tree structure */
export function getCategoryTree(): Array<CategoryDefinition & { verticalDetails: VerticalDefinition[] }> {
  return Object.values(CATEGORIES).map((cat) => ({
    ...cat,
    verticalDetails: cat.verticals.map((id) => VERTICALS[id]),
  }))
}

/** Get all registered vertical IDs */
export function getAllVerticalIds(): VerticalId[] {
  return Object.keys(VERTICALS) as VerticalId[]
}

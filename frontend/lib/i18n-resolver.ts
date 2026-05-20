import { MODULES } from "./modules"
import { MODULES_ES, type ModuleContentES } from "./modules.es"

/**
 * Resolves the module content for a given module ID and requested language.
 * Uses pre-generated Spanish content if available, falling back to English as defined
 * in the static generation layer.
 *
 * @param modId The module ID (e.g. 'mod_1_1')
 * @param language The requested language ('en' | 'es')
 * @returns The resolved module content with metadata
 */
export function resolveModuleContent(modId: string, language: "en" | "es" | string): ModuleContentES {
  // If Spanish is requested, try to resolve from MODULES_ES
  if (language === "es") {
    const esModule = MODULES_ES[modId]
    if (esModule) {
      return esModule
    }
  }

  // Fallback to English
  const enModule = MODULES[modId]
  if (!enModule) {
    throw new Error(`Module content for ID "${modId}" not found in curriculum.`)
  }

  return {
    ...enModule,
    _meta: {
      requestedLanguage: language,
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["all"],
    },
  }
}

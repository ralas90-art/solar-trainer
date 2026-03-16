// Workbook Response Storage — localStorage wrapper
// Keys: workbook_{moduleId}_{promptId}

const STORAGE_PREFIX = "workbook_"

export function saveResponse(moduleId: string, promptId: string, value: string | string[] | number): void {
    if (typeof window === "undefined") return
    const key = `${STORAGE_PREFIX}${moduleId}_${promptId}`
    localStorage.setItem(key, JSON.stringify(value))
}

export function getResponse(moduleId: string, promptId: string): string | string[] | number | null {
    if (typeof window === "undefined") return null
    const key = `${STORAGE_PREFIX}${moduleId}_${promptId}`
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

// Get all responses for modules belonging to a specific day
export function getDayResponses(dayNumber: number): Record<string, Record<string, string | string[] | number>> {
    if (typeof window === "undefined") return {}
    const prefix = `${STORAGE_PREFIX}mod_${dayNumber}_`
    const results: Record<string, Record<string, string | string[] | number>> = {}

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key || !key.startsWith(prefix)) continue

        // key format: workbook_mod_X_Y_wb_X_Y_Z
        const withoutPrefix = key.slice(STORAGE_PREFIX.length)
        // Find the module ID (mod_X_Y) and prompt ID (everything after)
        const match = withoutPrefix.match(/^(mod_\d+_\d+)_(.+)$/)
        if (!match) continue

        const [, moduleId, promptId] = match
        if (!results[moduleId]) results[moduleId] = {}

        const raw = localStorage.getItem(key)
        if (raw) {
            try {
                results[moduleId][promptId] = JSON.parse(raw)
            } catch {
                // skip corrupted
            }
        }
    }

    return results
}

export function clearDay(dayNumber: number): void {
    if (typeof window === "undefined") return
    const prefix = `${STORAGE_PREFIX}mod_${dayNumber}_`
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key)
        }
    }

    keysToRemove.forEach(k => localStorage.removeItem(k))
}

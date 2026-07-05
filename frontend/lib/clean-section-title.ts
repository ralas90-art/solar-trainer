/**
 * Strips authored "Section N:" / "Sección N:" prefixes from curriculum section
 * titles so UI components can apply their own sequential numbering without
 * producing doubles like "SECTION 4 — Section 1: The Anatomy of a Utility Bill".
 *
 * Single source of truth — import this everywhere section titles render.
 * Do NOT duplicate this regex in components.
 */
export function cleanSectionTitle(title: string): string {
  return title.replace(/^(Secci[oó]n|Section)\s+\d+\s*[:.]\s*/i, "")
}

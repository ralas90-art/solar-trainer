/**
 * SeptiVolt Sales OS — Vertical Access Control
 * ==============================================
 * Determines whether a user/company can view or access a specific vertical
 * or module based on their enabled_verticals, role, and preview status.
 *
 * Sub-Phase 1B: Central access-control layer. All vertical visibility checks
 * should go through this file.
 */

import type { VerticalId } from "@/lib/verticals"
import { getVerticalByModuleId, VERTICALS } from "@/lib/verticals"
import type { BypassUser } from "@/lib/auth-bypass"

// ─── Known Demo Company IDs ──────────────────────────────────────────────────
// These companies may see preview verticals even if not explicitly enabled.
// Uses the same test company IDs that are seeded in migrate_db.py.

const DEMO_COMPANY_IDS = new Set([
  "cresca_test",
  "rival_corp_test",
])

// ─── Roles That Can Preview Unreleased Verticals ──────────────────────────────
// Only super_admin gets unconditional preview access.
// Generic admin / dealer_admin do NOT bypass — they only see verticals
// explicitly in their company's enabled_verticals.
// demo_admin may preview only if they also belong to a demo company.

const PREVIEW_BYPASS_ROLES = new Set([
  "super_admin",
])

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VerticalAccessContext {
  /** User info from AuthContext */
  user: BypassUser | null | undefined
  /** Company's enabled verticals (parsed from API or defaulted to ["solar"]) */
  enabledVerticals: VerticalId[]
}

export type VerticalAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "not_enabled" | "preview_only" | "unknown_vertical" | "no_user" }

// ─── Core Access Functions ────────────────────────────────────────────────────

/**
 * Check whether the current user can preview unreleased verticals.
 *
 * Preview access is granted ONLY when:
 * 1. User role is `super_admin` (unconditional).
 * 2. User belongs to an approved demo/test company.
 * 3. User is `demo_admin` AND belongs to an approved demo/test company.
 *
 * Generic `admin`, `dealer_admin`, `manager`, etc. do NOT get preview access.
 * They only see verticals explicitly in their company's enabled_verticals.
 */
export function canPreviewVerticals(user: BypassUser | null | undefined): boolean {
  if (!user) return false

  // 1. super_admin — unconditional preview access
  if (user.role && PREVIEW_BYPASS_ROLES.has(user.role)) return true

  // 2. Demo company — any user in an approved demo/test company can preview
  const isDemoCompany = !!(user.companyId && DEMO_COMPANY_IDS.has(user.companyId))
  if (isDemoCompany) return true

  // 3. demo_admin username — only if also in a demo company (already covered above)
  //    If they're NOT in a demo company, they don't get preview access.

  return false
}

/**
 * Check whether a specific vertical is accessible to the user.
 *
 * Access rules:
 * 1. If the vertical is in the company's enabled_verticals → ALLOWED
 * 2. If the vertical is a preview vertical and the user can preview → ALLOWED
 * 3. If the vertical is a preview vertical and the user cannot preview → BLOCKED
 * 4. If the vertical is not in enabled_verticals and not preview → BLOCKED
 */
export function checkVerticalAccess(
  verticalId: VerticalId,
  ctx: VerticalAccessContext
): VerticalAccessResult {
  const vertical = VERTICALS[verticalId]
  if (!vertical) return { allowed: false, reason: "unknown_vertical" }

  // If the vertical is explicitly enabled for this company, always allow
  if (ctx.enabledVerticals.includes(verticalId)) {
    return { allowed: true }
  }

  // If the vertical is a preview and the user has preview bypass
  if (vertical.isPreview && canPreviewVerticals(ctx.user)) {
    return { allowed: true }
  }

  // If the vertical is a preview but user cannot preview
  if (vertical.isPreview) {
    return { allowed: false, reason: "preview_only" }
  }

  // Vertical is production but not in company's enabled list
  return { allowed: false, reason: "not_enabled" }
}

/**
 * Check whether a specific module (by ID) is accessible.
 * Resolves the module's vertical from its prefix and delegates to checkVerticalAccess.
 */
export function checkModuleAccess(
  moduleId: string,
  ctx: VerticalAccessContext
): VerticalAccessResult {
  if (!ctx.user) return { allowed: false, reason: "no_user" }

  const vertical = getVerticalByModuleId(moduleId)
  if (!vertical) return { allowed: false, reason: "unknown_vertical" }

  return checkVerticalAccess(vertical.id, ctx)
}

/**
 * Get all vertical IDs that are visible to the user.
 * Includes enabled verticals + preview verticals if the user has preview access.
 */
export function getVisibleVerticals(ctx: VerticalAccessContext): VerticalId[] {
  const hasPreviewAccess = canPreviewVerticals(ctx.user)

  const visible = new Set<VerticalId>(ctx.enabledVerticals)

  if (hasPreviewAccess) {
    // Add all preview verticals
    for (const [id, def] of Object.entries(VERTICALS)) {
      if (def.isPreview) {
        visible.add(id as VerticalId)
      }
    }
  }

  return Array.from(visible)
}

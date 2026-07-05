/**
 * SeptiVolt Sales OS — useCompanyVerticals Hook
 * ================================================
 * Fetches enabled_verticals from the company API and provides
 * access-control context for vertical visibility.
 *
 * Sub-Phase 1B: Used by the training page and module detail page
 * to determine which verticals the current company has access to.
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import { getApiUrl } from "@/lib/utils"
import type { VerticalId } from "@/lib/verticals"
import type { VerticalAccessContext } from "@/lib/vertical-access"
import { getVisibleVerticals, canPreviewVerticals } from "@/lib/vertical-access"

interface CompanyVerticalsState {
  /** Verticals enabled for this company via backend */
  enabledVerticals: VerticalId[]
  /** All verticals visible to this user (enabled + preview if authorized) */
  visibleVerticals: VerticalId[]
  /** Whether this user can preview unreleased verticals */
  hasPreviewAccess: boolean
  /** Access context object for passing to access-check functions */
  accessContext: VerticalAccessContext
  /** Loading state while fetching company data */
  loading: boolean
  /** Error message if the fetch failed */
  error: string | null
}

/**
 * Fetches the company's enabled_verticals from the API and returns
 * a complete access context for use by the UI and route guards.
 *
 * Falls back to ["solar"] if:
 * - No user is logged in
 * - No companyId is available
 * - The API call fails
 */
export function useCompanyVerticals(): CompanyVerticalsState {
  const { user } = useAuth()
  const [enabledVerticals, setEnabledVerticals] = useState<VerticalId[]>(["solar"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.companyId) {
      setEnabledVerticals(["solar"])
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchCompany = async () => {
      try {
        const apiUrl = getApiUrl()
        const res = await fetch(`${apiUrl}/api/v1/companies/${encodeURIComponent(user.companyId)}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.username || "",
          },
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error(`Company API returned ${res.status}`)
        }

        const data = await res.json()
        if (!cancelled) {
          const verticals = Array.isArray(data.enabled_verticals)
            ? data.enabled_verticals as VerticalId[]
            : ["solar" as VerticalId]
          setEnabledVerticals(verticals)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useCompanyVerticals] Failed to fetch company data, defaulting to solar:", err)
          setEnabledVerticals(["solar"])
          setError(err instanceof Error ? err.message : "Failed to fetch company data")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCompany()
    return () => { cancelled = true }
  }, [user?.companyId, user?.username])

  const accessContext = useMemo<VerticalAccessContext>(() => ({
    user,
    enabledVerticals,
  }), [user, enabledVerticals])

  const hasPreviewAccess = useMemo(() => canPreviewVerticals(user), [user])

  const visibleVerticals = useMemo(
    () => getVisibleVerticals(accessContext),
    [accessContext]
  )

  return {
    enabledVerticals,
    visibleVerticals,
    hasPreviewAccess,
    accessContext,
    loading,
    error,
  }
}

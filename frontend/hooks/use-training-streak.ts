"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { isDemoModeActive } from "@/lib/demo-mode"
import { fetchAnalyticsSnapshot } from "@/lib/analytics-api"
import { getDashboardStats } from "@/lib/dashboard-data"

/**
 * Custom hook to fetch and resolve the unified training streak for the logged-in user.
 * Prefer backend analytics snapshot / currentTrainingStreak when available.
 * Use safe localStorage fallback values only when backend data is missing.
 * Demo mode returns a single shared streak value of 12.
 */
export function useTrainingStreak() {
  const { user } = useAuth()
  const [streak, setStreak] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let active = true

    async function loadStreak() {
      // Demo Mode check
      if (isDemoModeActive()) {
        if (active) {
          setStreak(12)
          setLoading(false)
        }
        return
      }

      const username = user?.username
      if (!username) {
        if (active) {
          const localStats = getDashboardStats()
          setStreak(
            typeof localStats.streak === "number" && Number.isFinite(localStats.streak) && localStats.streak >= 0
              ? localStats.streak
              : 0
          )
          setLoading(false)
        }
        return
      }

      try {
        const snapshot = await fetchAnalyticsSnapshot(username)
        if (active) {
          const val = snapshot?.currentTrainingStreak
          if (typeof val === "number" && Number.isFinite(val) && val >= 0) {
            setStreak(val)
          } else {
            const localStats = getDashboardStats()
            setStreak(
              typeof localStats.streak === "number" && Number.isFinite(localStats.streak) && localStats.streak >= 0
                ? localStats.streak
                : 0
            )
          }
        }
      } catch (err) {
        if (active) {
          const localStats = getDashboardStats()
          setStreak(
            typeof localStats.streak === "number" && Number.isFinite(localStats.streak) && localStats.streak >= 0
              ? localStats.streak
              : 0
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadStreak()

    return () => {
      active = false
    }
  }, [user?.username])

  return { streak, loading }
}

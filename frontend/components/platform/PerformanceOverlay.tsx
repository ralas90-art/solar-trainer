"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Activity, Zap, Cpu, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"

export function PerformanceOverlay() {
  const { user } = useAuth()
  const [isEnabled, setIsEnabled] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [prewarmLatency, setPrewarmLatency] = useState<string | null>(null)
  const [lastApi, setLastApi] = useState<{ endpoint: string; duration: number; error?: boolean } | null>(null)
  const [pageLoadTime, setPageLoadTime] = useState<string | null>(null)
  const [hydrationTime, setHydrationTime] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Check for septivolt_perf_debug query param or localStorage
    const params = new URLSearchParams(window.location.search)
    const urlDebug = params.get("septivolt_perf_debug")
    
    if (urlDebug === "true") {
      localStorage.setItem("septivolt_perf_debug", "true")
      setIsEnabled(true)
    } else if (urlDebug === "false") {
      localStorage.removeItem("septivolt_perf_debug")
      setIsEnabled(false)
    } else {
      setIsEnabled(localStorage.getItem("septivolt_perf_debug") === "true")
    }

    // 2. Read prewarm latency from sessionStorage
    const savedPrewarm = sessionStorage.getItem("septivolt_prewarm_latency")
    if (savedPrewarm) {
      setPrewarmLatency(savedPrewarm)
    }

    // 3. Page load performance metrics
    const navigationEntries = performance.getEntriesByType("navigation")
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming
      const loadTime = navEntry.loadEventEnd || navEntry.domContentLoadedEventEnd || navEntry.duration
      if (loadTime > 0) {
        setPageLoadTime(loadTime.toFixed(1))
      }
    }

    // 4. Hydration / Mount time
    const mountTime = performance.now()
    setHydrationTime(mountTime.toFixed(1))

    // 5. Listen to prewarm latency events
    const handlePrewarm = (e: Event) => {
      const customEvent = e as CustomEvent
      setPrewarmLatency(customEvent.detail.duration.toFixed(1))
    }

    // 6. Listen to API latency events
    const handleApi = (e: Event) => {
      const customEvent = e as CustomEvent
      setLastApi({
        endpoint: customEvent.detail.endpoint,
        duration: customEvent.detail.duration,
        error: customEvent.detail.error,
      })
    }

    window.addEventListener("septivolt_prewarm_latency", handlePrewarm)
    window.addEventListener("septivolt_api_latency", handleApi)

    return () => {
      window.removeEventListener("septivolt_prewarm_latency", handlePrewarm)
      window.removeEventListener("septivolt_api_latency", handleApi)
    }
  }, [])

  // Guard: Only render for admin/manager roles AND if debug flag is enabled
  const hasAccess = user?.role === "admin" || user?.role === "manager"
  if (!hasAccess || !isEnabled) return null

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#1A1A1A]/90 px-3 py-1.5 text-[10px] font-hud uppercase tracking-widest text-[#FF5722] backdrop-blur-md transition-all hover:bg-[#FF5722]/10"
      >
        <Activity className="h-3.5 w-3.5 animate-pulse text-[#FF5722]" />
        <span>PERF ACTIVE</span>
        <ChevronUp className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-72 rounded-2xl border border-white/10 bg-[#121212]/90 p-4 shadow-2xl backdrop-blur-md transition-all">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5 text-white font-hud text-[11px] uppercase tracking-wider font-bold">
          <Activity className="h-4 w-4 text-[#FF5722] animate-pulse" />
          <span>SeptiVolt Telemetry</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="rounded p-0.5 hover:bg-white/5 text-[#94A3B8] hover:text-white"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2.5 text-xs text-[#94A3B8]">
        {/* Pre-warm Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#FFB300]" />
            <span>Pre-warm Ping</span>
          </span>
          <span className="font-mono text-white">
            {prewarmLatency ? `${prewarmLatency} ms` : "Skipped/Warm"}
          </span>
        </div>

        {/* Hydration / Mount Time */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Client Hydration</span>
          </span>
          <span className="font-mono text-white">
            {hydrationTime ? `${hydrationTime} ms` : "Calculating..."}
          </span>
        </div>

        {/* Page Load Time */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-green-400" />
            <span>Browser Load</span>
          </span>
          <span className="font-mono text-white">
            {pageLoadTime ? `${pageLoadTime} ms` : "Calculating..."}
          </span>
        </div>

        {/* Last API Request Info */}
        <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-[#FF5722]" />
              <span>Last API Latency</span>
            </span>
            {lastApi ? (
              <span className={`font-mono ${lastApi.error ? 'text-red-400' : 'text-[#FF5722]'}`}>
                {lastApi.duration.toFixed(1)} ms
              </span>
            ) : (
              <span className="font-mono text-[#64748B]">None</span>
            )}
          </div>
          {lastApi && (
            <div className="bg-white/5 rounded p-1.5 mt-1 font-mono text-[9px] text-[#64748B] truncate" title={lastApi.endpoint}>
              {lastApi.endpoint}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

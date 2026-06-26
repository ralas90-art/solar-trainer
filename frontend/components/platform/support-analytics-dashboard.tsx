"use client"

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,
  MessageSquare,
  Globe,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Eye,
  Lightbulb,
  Loader2,
  HelpCircle,
  PlayCircle,
  Search,
  Filter,
  RefreshCw,
  RotateCw,
  X,
} from "lucide-react"

// ── Data Types ──

type SummaryData = {
  total_interactions: number
  quick_faq_count: number
  ai_custom_count: number
  english_count: number
  spanish_count: number
  helpful_count: number
  not_helpful_count: number
  unrated_count: number
  fallback_count: number
  helpful_rate: number
  context_area_breakdown: Record<string, number>
  top_question_previews: { preview: string; count: number; locale: string }[]
  recent_not_helpful: {
    id: number
    question_preview: string
    locale: string
    context_area: string
    created_at: string
  }[]
}

type TrendPoint = {
  date: string
  total: number
  faq: number
  custom: number
  en: number
  es: number
  helpful: number
  not_helpful: number
  fallback: number
}

type QuestionRecord = {
  id: number
  user_id: string
  role: string
  question_preview: string
  question_type: string
  locale: string
  helpful: boolean | null
  fallback_used: boolean
  context_area: string
  created_at: string
}

type ActionStatus = "new" | "accepted" | "dismissed" | "needs_review" | "converted_to_faq" | "converted_to_walkthrough" | "converted_to_manual" | "refired"

type Recommendation = {
  id: string
  priority: "high" | "medium" | "low"
  type: string
  context_area: string
  signal_source: string
  signal_sources: string[]
  title: string
  explanation: string
  suggested_action: string
  confidence: string
  affected_locale: string
  supporting_data: Record<string, number | string>
  action_status: ActionStatus
  action_id: number | null
  action_notes: string | null
}

type QueueItem = {
  id: number
  recommendation_id: string
  status: string
  context_area: string
  priority: "high" | "medium" | "low"
  signal_sources: string[]
  snapshot_title: string
  snapshot_explanation: string
  snapshot_suggested_action: string
  snapshot_supporting_data: Record<string, number | string>
  acted_by: string
  acted_at: string
  notes: string | null
  suggested_next_step: string
}

type TrackerItem = {
  id: number
  recommendation_action_id: number
  draft_pack_path: string | null
  source_status: string | null
  status: string
  priority: "high" | "medium" | "low"
  context_area: string
  snapshot_title: string
  snapshot_suggested_action: string
  assigned_to: string | null
  assigned_by: string | null
  assigned_at: string | null
  implementation_notes: string | null
  notebooklm_updated_at: string | null
  verified_by: string | null
  verified_at: string | null
  suggested_next_step: string
  created_at: string
  updated_at: string | null
  closed_at: string | null
}

// ── Inline Components ──

function PercentBar({
  value,
  max,
  color,
  label,
}: {
  value: number
  max: number
  color: string
  label: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  children,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
  bgColor: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={`h-8 w-8 rounded-lg ${bgColor} flex items-center justify-center`}
        >
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold font-mono text-white">{value}</p>
      {children}
    </div>
  )
}

const AREA_COLORS: Record<string, string> = {
  simulator: "bg-cyan-400",
  training: "bg-[#FF5722]",
  dashboard: "bg-amber-400",
  settings: "bg-purple-400",
  certifications: "bg-emerald-400",
  kpis: "bg-blue-400",
  general: "bg-slate-400",
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

// ── Main Dashboard Component ──

export function SupportAnalyticsDashboard() {
  const { user } = useAuth()

  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [locale, setLocale] = useState<"all" | "en" | "es">("all")
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [trends, setTrends] = useState<TrendPoint[] | null>(null)
  const [questions, setQuestions] = useState<QuestionRecord[] | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDismissed, setShowDismissed] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notesInput, setNotesInput] = useState<Record<string, string>>({})
  const [convertOpen, setConvertOpen] = useState<string | null>(null)
  const [reviewQueue, setReviewQueue] = useState<QueueItem[] | null>(null)
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>("all")
  const [queueContextFilter, setQueueContextFilter] = useState<string>("all")
  const [cliCopied, setCliCopied] = useState(false)
  const [trackerItems, setTrackerItems] = useState<TrackerItem[] | null>(null)
  const [trackerStatusFilter, setTrackerStatusFilter] = useState<string>("all")
  const [trackerLoading, setTrackerLoading] = useState<string | null>(null)
  const [assignInput, setAssignInput] = useState<Record<number, string>>({})
  const [trackerNotesInput, setTrackerNotesInput] = useState<Record<number, string>>({})

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const params = new URLSearchParams({ date_range: dateRange, locale })
      const headers: Record<string, string> = {
        Authorization: user?.token ? `Bearer ${user.token}` : "",
        "X-User-Id": user?.username || "",
      }

      const [summaryRes, trendsRes, questionsRes, recsRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/support/analytics/summary?${params}`, { headers }),
        fetch(`${apiUrl}/api/v1/support/analytics/trends?${params}`, { headers }),
        fetch(
          `${apiUrl}/api/v1/support/analytics/questions?${params}&page=1&page_size=20&sort=newest`,
          { headers }
        ),
        fetch(`${apiUrl}/api/v1/support/analytics/recommendations?${params}&show_dismissed=${showDismissed}`, { headers }),
      ])

      if (!summaryRes.ok || !trendsRes.ok || !questionsRes.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const [summaryData, trendsData, questionsData] = await Promise.all([
        summaryRes.json(),
        trendsRes.json(),
        questionsRes.json(),
      ])

      setSummary(summaryData)
      setTrends(trendsData.trends || trendsData)
      setQuestions(questionsData.questions || questionsData)

      // Recommendations fetch is non-blocking (may fail independently)
      if (recsRes.ok) {
        const recsData = await recsRes.json()
        setRecommendations(recsData.recommendations || [])
      } else {
        setRecommendations([])
      }

      // Queue fetch is also non-blocking
      try {
        const queueRes = await fetch(`${apiUrl}/api/v1/support/analytics/curriculum-review-queue?${params}`, { headers })
        if (queueRes.ok) {
          const queueData = await queueRes.json()
          setReviewQueue(queueData.queue || [])
        } else {
          setReviewQueue([])
        }
      } catch {
        setReviewQueue([])
      }

      // Tracker fetch is also non-blocking
      try {
        const trackerRes = await fetch(`${apiUrl}/api/v1/support/implementation-tracker?page_size=100`, { headers })
        if (trackerRes.ok) {
          const trackerData = await trackerRes.json()
          setTrackerItems(trackerData.items || [])
        } else {
          setTrackerItems([])
        }
      } catch {
        setTrackerItems([])
      }
    } catch (err: any) {
      console.error("Support analytics fetch error:", err)
      setError(err.message || "An error occurred while fetching analytics data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, locale, user?.username, showDismissed])

  const handleAction = async (rec: Recommendation, status: string, notes?: string) => {
    if (!user) return
    setActionLoading(rec.id)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const headers: Record<string, string> = {
        Authorization: user.token ? `Bearer ${user.token}` : "",
        "X-User-Id": user.username || "",
        "Content-Type": "application/json",
      }
      const body = {
        recommendation_id: rec.id,
        status,
        context_area: rec.context_area,
        priority: rec.priority,
        signal_sources: rec.signal_sources,
        snapshot_title: rec.title,
        snapshot_explanation: rec.explanation,
        snapshot_suggested_action: rec.suggested_action,
        snapshot_supporting_data: rec.supporting_data,
        notes: notes || notesInput[rec.id] || undefined,
      }

      if (rec.action_id) {
        await fetch(`${apiUrl}/api/v1/support/analytics/recommendation-actions/${rec.action_id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status, notes: notes || notesInput[rec.id] || undefined }),
        })
      } else {
        await fetch(`${apiUrl}/api/v1/support/analytics/recommendation-actions`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        })
      }

      // Clear notes and refresh
      setNotesInput(prev => ({ ...prev, [rec.id]: "" }))
      setConvertOpen(null)
      fetchData()
    } catch (err) {
      console.error("Action error:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
    accepted: { label: "Accepted", color: "text-emerald-400", bg: "bg-emerald-500/15" },
    needs_review: { label: "In Review", color: "text-amber-400", bg: "bg-amber-500/15" },
    dismissed: { label: "Dismissed", color: "text-slate-400", bg: "bg-slate-500/15" },
    converted_to_faq: { label: "Converted to FAQ", color: "text-blue-400", bg: "bg-blue-500/15" },
    converted_to_walkthrough: { label: "Converted to Walkthrough", color: "text-blue-400", bg: "bg-blue-500/15" },
    converted_to_manual: { label: "Converted to Manual", color: "text-blue-400", bg: "bg-blue-500/15" },
    refired: { label: "Refired", color: "text-red-400", bg: "bg-red-500/15" },
  }

  const TRACKER_BADGES: Record<string, { label: string; color: string; bg: string }> = {
    draft_created: { label: "Draft Created", color: "text-slate-400", bg: "bg-slate-500/15" },
    assigned: { label: "Assigned", color: "text-blue-400", bg: "bg-blue-500/15" },
    reviewed: { label: "Reviewed", color: "text-cyan-400", bg: "bg-cyan-500/15" },
    implemented: { label: "Implemented", color: "text-emerald-400", bg: "bg-emerald-500/15" },
    notebook_updated: { label: "NB Updated", color: "text-purple-400", bg: "bg-purple-500/15" },
    verified: { label: "Verified", color: "text-green-400", bg: "bg-green-500/15" },
    closed: { label: "Closed", color: "text-slate-500", bg: "bg-slate-600/15" },
    blocked: { label: "Blocked", color: "text-red-400", bg: "bg-red-500/15" },
    needs_revision: { label: "Needs Revision", color: "text-amber-400", bg: "bg-amber-500/15" },
    deferred: { label: "Deferred", color: "text-slate-400", bg: "bg-slate-500/15" },
  }

  const handleStartTracking = async (item: QueueItem) => {
    if (!user) return
    setTrackerLoading(String(item.id))
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const headers: Record<string, string> = {
        Authorization: user.token ? `Bearer ${user.token}` : "",
        "X-User-Id": user.username || "",
        "Content-Type": "application/json",
      }
      await fetch(`${apiUrl}/api/v1/support/implementation-tracker`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          recommendation_action_id: item.id,
          source_status: item.status,
          priority: item.priority,
          context_area: item.context_area,
          snapshot_title: item.snapshot_title,
          snapshot_suggested_action: item.snapshot_suggested_action,
        }),
      })
      fetchData()
    } catch (err) {
      console.error("Start tracking error:", err)
    } finally {
      setTrackerLoading(null)
    }
  }

  const handleTrackerPatch = async (itemId: number, patch: Record<string, string | undefined>) => {
    if (!user) return
    setTrackerLoading(String(itemId))
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const headers: Record<string, string> = {
        Authorization: user.token ? `Bearer ${user.token}` : "",
        "X-User-Id": user.username || "",
        "Content-Type": "application/json",
      }
      await fetch(`${apiUrl}/api/v1/support/implementation-tracker/${itemId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(patch),
      })
      setAssignInput(prev => ({ ...prev, [itemId]: "" }))
      setTrackerNotesInput(prev => ({ ...prev, [itemId]: "" }))
      fetchData()
    } catch (err) {
      console.error("Tracker patch error:", err)
    } finally {
      setTrackerLoading(null)
    }
  }

  // ── Loading State ──
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-white/5 animate-pulse" />
        </div>
        {/* Skeleton filter bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-16 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
        {/* Skeleton metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/5" />
                <div className="h-3 w-20 rounded bg-white/5" />
              </div>
              <div className="h-7 w-16 rounded bg-white/5" />
              <div className="h-1.5 w-full rounded-full bg-white/5" />
            </div>
          ))}
        </div>
        {/* Skeleton context + tables */}
        <div className="h-40 rounded-2xl bg-[#1A1A1A] border border-white/5 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 rounded-2xl bg-[#1A1A1A] border border-white/5 animate-pulse" />
          <div className="h-64 rounded-2xl bg-[#1A1A1A] border border-white/5 animate-pulse" />
        </div>
      </div>
    )
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-sm text-red-400 text-center max-w-md">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Empty State ──
  if (!summary || summary.total_interactions === 0) {
    return (
      <div className="space-y-6">
        {/* Filter Bar */}
        <FilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          locale={locale}
          setLocale={setLocale}
          onRefresh={fetchData}
        />
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-12 flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-[#64748B]" />
          </div>
          <p className="text-sm text-[#94A3B8] text-center max-w-md">
            No support interactions recorded yet. Data will appear here as trainees
            use the AI Coach.
          </p>
        </div>
      </div>
    )
  }

  // ── Computed Values ──
  const totalRated = summary.helpful_count + summary.not_helpful_count
  const fallbackRate =
    summary.total_interactions > 0
      ? Math.round((summary.fallback_count / summary.total_interactions) * 100)
      : 0

  const areaEntries = Object.entries(summary.context_area_breakdown).sort(
    ([, a], [, b]) => b - a
  )
  const maxAreaCount = areaEntries.length > 0 ? areaEntries[0][1] : 1

  const trendMax =
    trends && trends.length > 0
      ? Math.max(...trends.map((t) => t.total), 1)
      : 1

  // ── Render ──
  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#FF5722]" />
            Support Analytics
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            AI Coach usage, feedback quality &amp; trainee support patterns
          </p>
        </div>
        <button
          onClick={fetchData}
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#FF5722]/30 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        dateRange={dateRange}
        setDateRange={setDateRange}
        locale={locale}
        setLocale={setLocale}
        onRefresh={fetchData}
      />

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Interactions */}
        <MetricCard
          icon={MessageSquare}
          label="Total Interactions"
          value={summary.total_interactions.toLocaleString()}
          color="text-[#FF5722]"
          bgColor="bg-[#FF5722]/10"
        >
          <div className="flex gap-3 text-[10px] text-slate-500">
            <span>
              FAQ:{" "}
              <span className="text-slate-300 font-mono">
                {summary.quick_faq_count}
              </span>
            </span>
            <span>
              AI:{" "}
              <span className="text-slate-300 font-mono">
                {summary.ai_custom_count}
              </span>
            </span>
          </div>
        </MetricCard>

        {/* FAQ vs AI Custom */}
        <MetricCard
          icon={HelpCircle}
          label="FAQ vs AI Custom"
          value={`${summary.quick_faq_count} / ${summary.ai_custom_count}`}
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
        >
          <PercentBar
            value={summary.quick_faq_count}
            max={summary.total_interactions}
            color="bg-cyan-400"
            label="Quick FAQ"
          />
          <PercentBar
            value={summary.ai_custom_count}
            max={summary.total_interactions}
            color="bg-cyan-600"
            label="AI Custom"
          />
        </MetricCard>

        {/* EN vs ES */}
        <MetricCard
          icon={Globe}
          label="EN vs ES"
          value={`${summary.english_count} / ${summary.spanish_count}`}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        >
          <PercentBar
            value={summary.english_count}
            max={summary.total_interactions}
            color="bg-amber-400"
            label="English"
          />
          <PercentBar
            value={summary.spanish_count}
            max={summary.total_interactions}
            color="bg-amber-600"
            label="Spanish"
          />
        </MetricCard>

        {/* Helpful Rate */}
        <MetricCard
          icon={ThumbsUp}
          label="Helpful Rate"
          value={`${summary.helpful_rate}%`}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        >
          <PercentBar
            value={summary.helpful_count}
            max={totalRated}
            color="bg-emerald-400"
            label={`${summary.helpful_count} helpful`}
          />
          <div className="text-[10px] text-slate-500">
            {summary.not_helpful_count} not helpful · {summary.unrated_count}{" "}
            unrated
          </div>
        </MetricCard>

        {/* Fallback Rate */}
        <MetricCard
          icon={AlertTriangle}
          label="AI Fallback Rate"
          value={`${fallbackRate}%`}
          color="text-red-400"
          bgColor="bg-red-500/10"
        >
          <PercentBar
            value={summary.fallback_count}
            max={summary.total_interactions}
            color="bg-red-400"
            label={`${summary.fallback_count} fallbacks`}
          />
        </MetricCard>
      </div>

      {/* ── Context Area Breakdown ── */}
      {areaEntries.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
          <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#FF5722]" />
            Context Area Breakdown
          </h3>
          <div className="space-y-3">
            {areaEntries.map(([area, count]) => {
              const barColor = AREA_COLORS[area] || "bg-slate-400"
              const pct = Math.round((count / maxAreaCount) * 100)
              return (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 capitalize">{area}</span>
                    <span className="text-slate-400 font-mono">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Two-column: Top Questions + Recent Not-Helpful ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Questions Table */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
          <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-[#FF5722]" /> Top Support Questions
          </h3>
          <div className="space-y-2">
            {summary.top_question_previews.length > 0 ? (
              summary.top_question_previews.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span className="text-sm text-slate-300 truncate max-w-[70%]">
                    {q.preview}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-hud uppercase text-slate-500">
                      {q.locale}
                    </span>
                    <span className="text-xs font-mono text-[#FF5722] font-bold">
                      {q.count}×
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748B] py-4 text-center">
                No questions recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Not-Helpful Questions */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
          <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
            <ThumbsDown className="h-4 w-4 text-red-400" /> Recent Not-Helpful
            Responses
          </h3>
          <div className="space-y-2">
            {summary.recent_not_helpful.length > 0 ? (
              summary.recent_not_helpful.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-500/[0.02] border border-red-500/10"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <span className="text-sm text-slate-300 truncate block">
                      {q.question_preview}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-hud uppercase text-slate-500">
                        {q.locale}
                      </span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {q.context_area}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {formatRelativeTime(q.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748B] py-4 text-center">
                No not-helpful ratings yet — great sign!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Trend Visualization ── */}
      {trends && trends.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5">
          <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#FF5722]" /> Interaction Trends
          </h3>
          <div className="flex items-end gap-1 h-40 overflow-x-auto pb-6 relative">
            {trends.map((point, i) => {
              const heightPct = Math.max((point.total / trendMax) * 100, 2)
              const dateLabel = new Date(point.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
              return (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 min-w-[24px] max-w-[48px] group"
                >
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white font-mono whitespace-nowrap z-10 pointer-events-none">
                      {point.total}
                    </div>
                    <div
                      className="w-full max-w-[32px] rounded-t-md bg-[#FF5722] hover:bg-[#FF7A47] transition-colors cursor-default"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-600 mt-1 whitespace-nowrap">
                    {dateLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Curriculum Recommendations ── */}
      {recommendations && (() => {
        const visibleRecs = recommendations.filter(r => {
          if (r.action_status === "dismissed" && !showDismissed) return false
          return true
        })
        const highRecs = visibleRecs.filter(r => r.priority === "high")
        const medRecs = visibleRecs.filter(r => r.priority === "medium")
        const lowRecs = visibleRecs.filter(r => r.priority === "low")

        const RecCard = ({ rec, borderColor, textColor, bgColor }: {
          rec: Recommendation
          borderColor: string
          textColor: string
          bgColor: string
        }) => {
          const badge = STATUS_BADGES[rec.action_status]
          const isDismissed = rec.action_status === "dismissed"
          const isActed = rec.action_status !== "new" && rec.action_status !== "refired"
          const isLoading = actionLoading === rec.id

          return (
            <div
              className={`rounded-xl border ${borderColor} ${bgColor} p-4 space-y-2 transition-opacity ${isDismissed ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-hud text-[10px] uppercase tracking-[0.2em] ${textColor}`}>
                  {rec.type.replace(/_/g, " ")}
                </span>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color} ${badge.bg}`}>
                      {badge.label}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500">
                    {rec.confidence} confidence
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-white">{rec.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{rec.explanation}</p>
              <div className="flex items-start gap-2 pt-1">
                <ArrowRight className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-400">{rec.suggested_action}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[9px] font-hud uppercase tracking-wider text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
                  {rec.context_area}
                </span>
                {rec.signal_sources.map((s, i) => (
                  <span key={i} className="text-[9px] font-hud uppercase tracking-wider text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
                <span className="text-[9px] font-hud uppercase tracking-wider text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
                  {rec.affected_locale}
                </span>
              </div>

              {/* Action notes display */}
              {rec.action_notes && (
                <p className="text-[10px] text-slate-500 italic border-t border-white/5 pt-2 mt-2">
                  Note: {rec.action_notes}
                </p>
              )}

              {/* Action buttons */}
              <div className="border-t border-white/5 pt-3 mt-2 space-y-2">
                {/* Notes input */}
                <input
                  type="text"
                  placeholder="Add a note (optional)..."
                  value={notesInput[rec.id] || ""}
                  onChange={(e) => setNotesInput(prev => ({ ...prev, [rec.id]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF5722]/30"
                />

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAction(rec, "accepted")}
                    disabled={isLoading || rec.action_status === "accepted"}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-30 transition-all"
                  >
                    <Check className="h-3 w-3" /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(rec, "needs_review")}
                    disabled={isLoading || rec.action_status === "needs_review"}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                  >
                    <Eye className="h-3 w-3" /> Review
                  </button>
                  <button
                    onClick={() => handleAction(rec, "dismissed")}
                    disabled={isLoading || rec.action_status === "dismissed"}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 disabled:opacity-30 transition-all"
                  >
                    <X className="h-3 w-3" /> Dismiss
                  </button>

                  {/* Convert dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setConvertOpen(convertOpen === rec.id ? null : rec.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-30 transition-all"
                    >
                      Convert <ChevronDown className="h-3 w-3" />
                    </button>
                    {convertOpen === rec.id && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                        {[
                          { status: "converted_to_faq", label: "Convert to FAQ" },
                          { status: "converted_to_walkthrough", label: "Convert to Walkthrough" },
                          { status: "converted_to_manual", label: "Convert to Manual" },
                        ].map((opt) => (
                          <button
                            key={opt.status}
                            onClick={() => handleAction(rec, opt.status)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }

        const PrioritySection = ({ label, recs, borderColor, textColor, bgColor, dotColor }: {
          label: string
          recs: Recommendation[]
          borderColor: string
          textColor: string
          bgColor: string
          dotColor: string
        }) => {
          if (recs.length === 0) return null
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                <p className={`font-hud text-[10px] uppercase tracking-[0.2em] ${textColor}`}>
                  {label} ({recs.length})
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {recs.map((rec) => (
                  <RecCard
                    key={rec.id}
                    rec={rec}
                    borderColor={borderColor}
                    textColor={textColor}
                    bgColor={bgColor}
                  />
                ))}
              </div>
            </div>
          )
        }

        return (
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" /> Curriculum Recommendations
              </h3>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDismissed}
                  onChange={(e) => setShowDismissed(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-[#FF5722] focus:ring-[#FF5722]/30"
                />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Show dismissed</span>
              </label>
            </div>

            {visibleRecs.length === 0 ? (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  No curriculum recommendations at this time.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  The system needs more support interaction data to identify improvement patterns.
                </p>
              </div>
            ) : (
              <>
                <PrioritySection
                  label="High Priority"
                  recs={highRecs}
                  borderColor="border-red-500/30"
                  textColor="text-red-400"
                  bgColor="bg-red-500/[0.03]"
                  dotColor="bg-red-400"
                />
                <PrioritySection
                  label="Medium Priority"
                  recs={medRecs}
                  borderColor="border-amber-500/30"
                  textColor="text-amber-400"
                  bgColor="bg-amber-500/[0.03]"
                  dotColor="bg-amber-400"
                />
                <PrioritySection
                  label="Low Priority"
                  recs={lowRecs}
                  borderColor="border-emerald-500/30"
                  textColor="text-emerald-400"
                  bgColor="bg-emerald-500/[0.03]"
                  dotColor="bg-emerald-400"
                />
              </>
            )}
          </div>
        )
      })()}

      {/* ── Curriculum Review Queue ── */}
      {reviewQueue && (() => {
        // Client-side filters
        let filtered = reviewQueue
        if (queueStatusFilter !== "all") {
          filtered = filtered.filter(q => q.status === queueStatusFilter)
        }
        if (queueContextFilter !== "all") {
          filtered = filtered.filter(q => q.context_area === queueContextFilter)
        }

        const highQ = filtered.filter(q => q.priority === "high")
        const medQ = filtered.filter(q => q.priority === "medium")
        const lowQ = filtered.filter(q => q.priority === "low")

        const QueueCard = ({ item }: { item: QueueItem }) => {
          const badge = STATUS_BADGES[item.status as keyof typeof STATUS_BADGES]
          const priorityColors = {
            high: { border: "border-red-500/30", bg: "bg-red-500/[0.03]" },
            medium: { border: "border-amber-500/30", bg: "bg-amber-500/[0.03]" },
            low: { border: "border-emerald-500/30", bg: "bg-emerald-500/[0.03]" },
          }
          const colors = priorityColors[item.priority] || priorityColors.medium

          return (
            <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {item.context_area}
                </span>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color} ${badge.bg}`}>
                      {badge.label}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-slate-600">{item.priority}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-white">{item.snapshot_title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.snapshot_explanation}</p>
              <div className="flex items-start gap-2 pt-1">
                <ArrowRight className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-400">{item.suggested_next_step}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {item.signal_sources.map((s, i) => (
                  <span key={i} className="text-[9px] font-hud uppercase tracking-wider text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
              {item.notes && (
                <p className="text-[10px] text-slate-500 italic border-t border-white/5 pt-2 mt-2">
                  Note: {item.notes}
                </p>
              )}
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                <span className="text-[9px] text-slate-600">
                  {item.acted_by} · {item.acted_at ? item.acted_at.slice(0, 10) : "N/A"}
                </span>
                {item.status === "needs_review" && (
                  <button
                    onClick={() => {
                      const rec: Recommendation = {
                        id: item.recommendation_id,
                        priority: item.priority,
                        type: "",
                        context_area: item.context_area,
                        signal_source: item.signal_sources[0] || "",
                        signal_sources: item.signal_sources,
                        title: item.snapshot_title,
                        explanation: item.snapshot_explanation,
                        suggested_action: item.snapshot_suggested_action,
                        confidence: "",
                        affected_locale: "",
                        supporting_data: item.snapshot_supporting_data,
                        action_status: "needs_review",
                        action_id: item.id,
                        action_notes: item.notes,
                      }
                      handleAction(rec, "accepted")
                    }}
                    disabled={actionLoading === item.recommendation_id}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-30 transition-all"
                  >
                    <Check className="h-3 w-3" /> Accept After Review
                  </button>
                )}
                {["converted_to_faq", "converted_to_walkthrough", "converted_to_manual", "accepted"].includes(item.status) && (
                  <button
                    onClick={() => handleStartTracking(item)}
                    disabled={trackerLoading === String(item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-30 transition-all"
                  >
                    <PlayCircle className="h-3 w-3" /> Start Tracking
                  </button>
                )}
              </div>
            </div>
          )
        }

        const QueuePriorityGroup = ({ label, items, dotColor, textColor }: {
          label: string
          items: QueueItem[]
          dotColor: string
          textColor: string
        }) => {
          if (items.length === 0) return null
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                <p className={`font-hud text-[10px] uppercase tracking-[0.2em] ${textColor}`}>
                  {label} ({items.length})
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map(item => <QueueCard key={item.id} item={item} />)}
              </div>
            </div>
          )
        }

        const statusFilters = [
          { value: "all", label: "All" },
          { value: "accepted", label: "Accepted" },
          { value: "needs_review", label: "Review" },
          { value: "converted_to_faq", label: "FAQ" },
          { value: "converted_to_walkthrough", label: "Walk" },
          { value: "converted_to_manual", label: "Manual" },
        ]

        const contextAreas = ["all", ...Array.from(new Set(reviewQueue.map(q => q.context_area)))]

        return (
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-400" /> Curriculum Review Queue
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">{filtered.length} items</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                {statusFilters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setQueueStatusFilter(f.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      queueStatusFilter === f.value
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-white/5 text-slate-500 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                {contextAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => setQueueContextFilter(area)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      queueContextFilter === area
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-white/5 text-slate-500 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-6">
                <ClipboardList className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No items in the review queue.</p>
                <p className="text-xs text-slate-600 mt-1">Accept or convert recommendations to populate this queue.</p>
              </div>
            ) : (
              <>
                <QueuePriorityGroup label="High Priority" items={highQ} dotColor="bg-red-400" textColor="text-red-400" />
                <QueuePriorityGroup label="Medium Priority" items={medQ} dotColor="bg-amber-400" textColor="text-amber-400" />
                <QueuePriorityGroup label="Low Priority" items={lowQ} dotColor="bg-emerald-400" textColor="text-emerald-400" />
              </>
            )}

            {/* CLI Command */}
            <div className="border-t border-white/5 pt-4 mt-4">
              <p className="text-[10px] font-hud uppercase tracking-[0.2em] text-slate-500 mb-2">Generate Draft Pack</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300">
                  cd backend && python -m reports.curriculum_draft_pack --date-range {dateRange}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`cd backend && python -m reports.curriculum_draft_pack --date-range ${dateRange}`)
                    setCliCopied(true)
                    setTimeout(() => setCliCopied(false), 2000)
                  }}
                  className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all"
                >
                  {cliCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Implementation Tracker ── */}
      {trackerItems && (() => {
        let filtered = trackerItems
        if (trackerStatusFilter !== "all") {
          filtered = filtered.filter(t => t.status === trackerStatusFilter)
        }

        const statusFilters = [
          { value: "all", label: "All" },
          { value: "draft_created", label: "Created" },
          { value: "assigned", label: "Assigned" },
          { value: "reviewed", label: "Reviewed" },
          { value: "implemented", label: "Done" },
          { value: "notebook_updated", label: "NB" },
          { value: "verified", label: "Verified" },
          { value: "closed", label: "Closed" },
          { value: "blocked", label: "Blocked" },
        ]

        const progressiveAction = (status: string): { label: string; nextStatus: string } | null => {
          const map: Record<string, { label: string; nextStatus: string }> = {
            draft_created: { label: "Assign", nextStatus: "assigned" },
            assigned: { label: "Mark Reviewed", nextStatus: "reviewed" },
            reviewed: { label: "Mark Implemented", nextStatus: "implemented" },
            implemented: { label: "Mark NB Updated", nextStatus: "notebook_updated" },
            notebook_updated: { label: "Mark Verified", nextStatus: "verified" },
            verified: { label: "Close", nextStatus: "closed" },
          }
          return map[status] || null
        }

        const TrackerCard = ({ item }: { item: TrackerItem }) => {
          const badge = TRACKER_BADGES[item.status]
          const isLoading = trackerLoading === String(item.id)
          const nextAction = progressiveAction(item.status)
          const isClosed = item.status === "closed"
          const priorityColors = {
            high: { border: "border-red-500/30", bg: "bg-red-500/[0.03]" },
            medium: { border: "border-amber-500/30", bg: "bg-amber-500/[0.03]" },
            low: { border: "border-emerald-500/30", bg: "bg-emerald-500/[0.03]" },
          }
          const colors = priorityColors[item.priority] || priorityColors.medium

          return (
            <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 space-y-2 ${isClosed ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {item.context_area}{item.source_status ? ` · ${item.source_status.replace(/_/g, " ")}` : ""}
                </span>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color} ${badge.bg}`}>
                      {badge.label}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-slate-600">{item.priority}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-white">{item.snapshot_title}</p>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-400">{item.suggested_next_step}</p>
              </div>

              {/* Assignment */}
              {item.assigned_to && (
                <p className="text-[10px] text-slate-500">
                  Assigned to: <span className="text-white font-bold">{item.assigned_to}</span>
                  {item.assigned_by ? ` by ${item.assigned_by}` : ""}
                  {item.assigned_at ? ` · ${item.assigned_at.slice(0, 10)}` : ""}
                </p>
              )}

              {/* Timestamps */}
              {item.notebooklm_updated_at && (
                <p className="text-[10px] text-purple-400">NB updated: {item.notebooklm_updated_at.slice(0, 10)}</p>
              )}
              {item.verified_by && (
                <p className="text-[10px] text-green-400">Verified by {item.verified_by} · {item.verified_at?.slice(0, 10)}</p>
              )}
              {item.closed_at && (
                <p className="text-[10px] text-slate-500">Closed: {item.closed_at.slice(0, 10)}</p>
              )}

              {/* Implementation notes */}
              {item.implementation_notes && (
                <p className="text-[10px] text-slate-500 italic border-t border-white/5 pt-2 mt-2">
                  Notes: {item.implementation_notes}
                </p>
              )}

              {/* Actions */}
              {!isClosed && (
                <div className="border-t border-white/5 pt-3 mt-2 space-y-2">
                  {/* Assign input for draft_created */}
                  {item.status === "draft_created" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Assign to (username)..."
                        value={assignInput[item.id] || ""}
                        onChange={(e) => setAssignInput(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30"
                      />
                      <button
                        onClick={() => handleTrackerPatch(item.id, { assigned_to: assignInput[item.id] })}
                        disabled={isLoading || !assignInput[item.id]}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-30 transition-all"
                      >
                        Assign
                      </button>
                    </div>
                  )}

                  {/* Notes input */}
                  <input
                    type="text"
                    placeholder="Add implementation notes..."
                    value={trackerNotesInput[item.id] || ""}
                    onChange={(e) => setTrackerNotesInput(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && trackerNotesInput[item.id]) {
                        handleTrackerPatch(item.id, { implementation_notes: trackerNotesInput[item.id] })
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF5722]/30"
                  />

                  {/* Progressive + universal buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {nextAction && item.status !== "draft_created" && (
                      <button
                        onClick={() => handleTrackerPatch(item.id, { status: nextAction.nextStatus })}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-30 transition-all"
                      >
                        <Check className="h-3 w-3" /> {nextAction.label}
                      </button>
                    )}
                    <button
                      onClick={() => handleTrackerPatch(item.id, { status: "blocked" })}
                      disabled={isLoading || item.status === "blocked"}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-30 transition-all"
                    >
                      <X className="h-3 w-3" /> Block
                    </button>
                    <button
                      onClick={() => handleTrackerPatch(item.id, { status: "needs_revision" })}
                      disabled={isLoading || item.status === "needs_revision"}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                    >
                      <RotateCw className="h-3 w-3" /> Revise
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        }

        return (
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-purple-400" /> Implementation Tracker
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">{filtered.length} items</span>
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setTrackerStatusFilter(f.value)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    trackerStatusFilter === f.value
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      : "bg-white/5 text-slate-500 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-6">
                <RotateCw className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No implementation items yet.</p>
                <p className="text-xs text-slate-600 mt-1">Create tracker items from the Review Queue above.</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map(item => <TrackerCard key={item.id} item={item} />)}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

// ── Filter Bar Sub-component ──

function FilterBar({
  dateRange,
  setDateRange,
  locale,
  setLocale,
  onRefresh,
}: {
  dateRange: "7d" | "30d" | "90d" | "all"
  setDateRange: (v: "7d" | "30d" | "90d" | "all") => void
  locale: "all" | "en" | "es"
  setLocale: (v: "all" | "en" | "es") => void
  onRefresh: () => void
}) {
  const dateOptions: { value: "7d" | "30d" | "90d" | "all"; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" },
  ]

  const localeOptions: { value: "all" | "en" | "es"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "en", label: "EN" },
    { value: "es", label: "ES" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Pills */}
      <div className="flex items-center gap-1.5">
        {dateOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDateRange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              dateRange === opt.value
                ? "bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-5 w-px bg-white/10" />

      {/* Locale Pills */}
      <div className="flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5 text-slate-500 mr-0.5" />
        {localeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLocale(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              locale === opt.value
                ? "bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

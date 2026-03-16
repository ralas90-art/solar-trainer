import { cn } from "@/lib/utils"
import { AnalyticsSnapshot, CoachingInsight, SimulationHistoryItem, TeamPerformanceRow, TrainingRecommendation } from "@/lib/analytics-api"
import { NotificationPill, SectionEyebrow, WidgetCard } from "./dashboard-widgets"
import { AlertTriangle, ArrowUpRight, Award, CheckCircle2, Flame, LucideIcon, TrendingUp, Trophy, XCircle } from "lucide-react"

export function PerformanceStatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "cyan",
}: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  accent?: "cyan" | "lime" | "slate"
}) {
  const accentClass = {
    cyan: "border-[#FF5722]/20 bg-[#FF5722]/10 text-[#FF5722]",
    lime: "border-[#FFB300]/20 bg-[rgba(255,179,0,0.1)] text-[#FFB300] amber-glow",
    slate: "border-white/10 bg-white/5 text-[#94A3B8]",
  }

  return (
    <WidgetCard className="min-h-[160px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-hud text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">{label}</p>
          <p className="mt-3 font-display text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm text-[#CBD5E1]">{detail}</p>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl border", accentClass[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </WidgetCard>
  )
}

export function SkillRadarChart({
  skills,
}: {
  skills: AnalyticsSnapshot["skills"]
}) {
  const points = Object.entries(skills)
  const size = 260
  const center = size / 2
  const radius = 88
  const polygonPoints = points
    .map(([_, metric], index) => {
      const angle = (-Math.PI / 2) + (index * (Math.PI * 2)) / points.length
      const r = (metric.score / 100) * radius
      const x = center + Math.cos(angle) * r
      const y = center + Math.sin(angle) * r
      return `${x},${y}`
    })
    .join(" ")

  return (
    <WidgetCard>
      <SectionEyebrow label="Skill Performance Breakdown" action="Proficiency + trend + improvement" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="mx-auto w-[260px]">
          <svg viewBox={`0 0 ${size} ${size}`} className="h-[260px] w-[260px]">
            {[20, 40, 60, 80, 100].map((ring) => (
              <circle
                key={ring}
                cx={center}
                cy={center}
                r={(ring / 100) * radius}
                fill="none"
                stroke="rgba(148,163,184,0.14)"
                strokeWidth={1}
              />
            ))}
            {points.map(([_, __], index) => {
              const angle = (-Math.PI / 2) + (index * (Math.PI * 2)) / points.length
              const x = center + Math.cos(angle) * radius
              const y = center + Math.sin(angle) * radius
              return <line key={index} x1={center} y1={center} x2={x} y2={y} stroke="rgba(148,163,184,0.2)" />
            })}
            <polygon points={polygonPoints} fill="rgba(255,87,34,0.18)" stroke="#FF5722" strokeWidth={2} />
          </svg>
        </div>
        <div className="space-y-2">
          {points.map(([name, metric]) => (
            <div key={name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div>
                <p className="text-sm text-white">{name[0].toUpperCase() + name.slice(1)}</p>
                <p className="font-hud text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">
                  Improvement {metric.improvement}%
                </p>
              </div>
              <span className="font-hud text-sm text-[#FF5722]">{metric.score}</span>
              <span className={cn("inline-flex items-center gap-1 font-hud text-xs", metric.trend >= 0 ? "text-[#FFB300]" : "text-[#F97316]")}>
                <ArrowUpRight className={cn("h-3.5 w-3.5", metric.trend < 0 ? "rotate-90" : "")} />
                {metric.trend >= 0 ? "+" : ""}
                {metric.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  )
}

export function ScoreTrendChart({
  points,
}: {
  points: AnalyticsSnapshot["scoreTrend"]
}) {
  const width = 860
  const height = 250
  const padding = 28
  const maxY = 100
  const minY = 50
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const xStep = points.length > 1 ? chartWidth / (points.length - 1) : chartWidth
  const pointCoords = points.map((point, index) => {
    const x = padding + index * xStep
    const y = padding + ((maxY - point.score) / (maxY - minY)) * chartHeight
    const rollingY = padding + ((maxY - point.rollingAverage) / (maxY - minY)) * chartHeight
    return { x, y, rollingY, point }
  })
  const line = pointCoords.map((coord) => `${coord.x},${coord.y}`).join(" ")
  const rollingLine = pointCoords.map((coord) => `${coord.x},${coord.rollingY}`).join(" ")
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`

  return (
    <WidgetCard>
      <SectionEyebrow label="Score Progress Over Time" action="Simulation score + weekly trend + rolling average" />
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[780px] w-full">
          {[60, 70, 80, 90, 100].map((mark) => {
            const y = padding + ((maxY - mark) / (maxY - minY)) * chartHeight
            return (
              <g key={mark}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(148,163,184,0.18)" />
                <text x={6} y={y + 4} fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
                  {mark}
                </text>
              </g>
            )
          })}
          <polygon points={area} fill="rgba(255,87,34,0.1)" />
          <polyline points={rollingLine} fill="none" stroke="rgba(255,179,0,0.85)" strokeWidth={2} strokeDasharray="5 4" />
          <polyline points={line} fill="none" stroke="#FF5722" strokeWidth={3} />
          {pointCoords.map((coord) => (
            <g key={coord.point.label}>
              <circle cx={coord.x} cy={coord.y} r={4} fill="#FF5722" />
              <text x={coord.x - 8} y={height - 8} fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
                {coord.point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </WidgetCard>
  )
}

export function SimulationHistoryTable({
  rows,
}: {
  rows: SimulationHistoryItem[]
}) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label="Simulation History" action="Recent outcomes and skill coverage" />
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="min-w-[920px] w-full">
          <thead>
            <tr className="border-y border-white/5 bg-white/[0.03] text-left font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
              <th className="px-3 py-3 sm:px-4">Scenario Name</th>
              <th className="px-3 py-3 text-right sm:px-4">Score</th>
              <th className="px-3 py-3 sm:px-4">Skills Tested</th>
              <th className="px-3 py-3 sm:px-4">Result</th>
              <th className="px-3 py-3 text-right sm:px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 text-sm text-[#CBD5E1] hover:bg-white/5">
                <td className="px-3 py-3 text-white sm:px-4">{row.scenarioName}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FF5722] sm:px-4">{row.score}</td>
                <td className="px-3 py-3 sm:px-4">
                  <div className="flex flex-wrap gap-1">
                    {row.skillsTested.map((skill) => (
                      <span key={`${row.id}-${skill}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-hud text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  {row.result === "pass" ? (
                    <span className="inline-flex items-center gap-1 text-[#FFB300]"><CheckCircle2 className="h-3.5 w-3.5" />Pass</span>
                  ) : row.result === "fail" ? (
                    <span className="inline-flex items-center gap-1 text-[#F97316]"><XCircle className="h-3.5 w-3.5" />Fail</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#94A3B8]"><AlertTriangle className="h-3.5 w-3.5" />Needs Improvement</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-hud text-[#94A3B8] sm:px-4">{row.dateIso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

export function CoachingInsightCard({ insight }: { insight: CoachingInsight }) {
  const toneClass = {
    high: "border-[#F97316]/25 bg-[rgba(249,115,22,0.1)] text-[#FDBA74]",
    medium: "border-[#FF5722]/20 bg-[rgba(255,87,34,0.08)] text-[#FFD54F]",
    low: "border-[#FFB300]/20 bg-[rgba(255,179,0,0.08)] text-[#FFE6B3]",
  }

  return (
    <div className={cn("rounded-2xl border p-4", toneClass[insight.severity])}>
      <p className="font-display text-lg font-bold text-white">{insight.title}</p>
      <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">{insight.detail}</p>
    </div>
  )
}

export function TrainingRecommendationCard({ recommendation }: { recommendation: TrainingRecommendation }) {
  return (
    <div className="rounded-2xl border border-[#FF5722]/20 bg-[rgba(255,87,34,0.08)] p-4">
      <p className="font-display text-lg font-bold text-white">{recommendation.title}</p>
      <p className="mt-2 text-sm text-[#CBD5E1]">{recommendation.rationale}</p>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#FFD54F]">
        {recommendation.action}
      </p>
    </div>
  )
}

export function TeamPerformanceTable({ rows }: { rows: TeamPerformanceRow[] }) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label="Manager View" action="Enterprise team performance overview" />
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="min-w-[880px] w-full">
          <thead>
            <tr className="border-y border-white/5 bg-white/[0.03] text-left font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
              <th className="px-3 py-3 sm:px-4">Team</th>
              <th className="px-3 py-3 text-right sm:px-4">Avg Score</th>
              <th className="px-3 py-3 text-right sm:px-4">Improving Reps</th>
              <th className="px-3 py-3 text-right sm:px-4">Needs Coaching</th>
              <th className="px-3 py-3 text-right sm:px-4">Field Ready</th>
              <th className="px-3 py-3 text-right sm:px-4">Certification Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teamName} className="border-b border-white/5 text-sm text-[#CBD5E1] hover:bg-white/5">
                <td className="px-3 py-3 font-medium text-white sm:px-4">{row.teamName}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FF5722] sm:px-4">{row.avgScore}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FFB300] sm:px-4">{row.improvingReps}</td>
                <td className="px-3 py-3 text-right font-hud text-[#F97316] sm:px-4">{row.coachingNeeded}</td>
                <td className="px-3 py-3 text-right font-hud text-white sm:px-4">{row.readyForDeployment}</td>
                <td className="px-3 py-3 text-right font-hud text-[#94A3B8] sm:px-4">{row.certificationCompletion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

export function GamificationStrip({
  xp,
  levelProgress,
  streak,
  leaderboardRank,
}: {
  xp: number
  levelProgress: number
  streak: number
  leaderboardRank: number
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Gamification Indicators" action="Motivation + momentum" />
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">XP Earned</p>
          <p className="mt-1 font-hud text-2xl text-[#FF5722]">{xp.toLocaleString("en-US")}</p>
        </div>
        <div className="rounded-xl border border-[#FFB300]/20 bg-[rgba(255,179,0,0.08)] p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Level Progress</p>
          <p className="mt-1 font-hud text-2xl text-white">{levelProgress}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Training Streak</p>
          <p className="mt-1 inline-flex items-center gap-2 font-hud text-2xl text-white"><Flame className="h-5 w-5 text-[#FFB300]" />{streak}d</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Leaderboard Rank</p>
          <p className="mt-1 inline-flex items-center gap-2 font-hud text-2xl text-white"><Trophy className="h-5 w-5 text-[#FF5722]" />#{leaderboardRank}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${levelProgress}%` }} />
      </div>
    </WidgetCard>
  )
}

export function FilterPills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-hud text-[10px] uppercase tracking-[0.12em] transition-colors",
              value === option.value
                ? "border-[#FF5722]/45 bg-[#FF5722]/12 text-[#D9FBFF]"
                : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CoachingAndRecommendations({
  insights,
  recommendations,
}: {
  insights: CoachingInsight[]
  recommendations: TrainingRecommendation[]
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <WidgetCard>
        <SectionEyebrow label="Coaching Insights" action="AI pattern detection" />
        <div className="space-y-3">
          {insights.map((insight) => (
            <CoachingInsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </WidgetCard>
      <WidgetCard>
        <SectionEyebrow label="Training Recommendations" action="Practice next" />
        <div className="space-y-3">
          {recommendations.map((recommendation) => (
            <TrainingRecommendationCard key={recommendation.title} recommendation={recommendation} />
          ))}
        </div>
      </WidgetCard>
    </section>
  )
}

export function SummaryHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_45%,rgba(255,179,0,0.08))]">
      <NotificationPill icon={TrendingUp} label="Rep Performance Intelligence" tone="cyan" />
      <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-[#CBD5E1]">{subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <NotificationPill icon={Award} label="Training Modules" tone="slate" />
        <NotificationPill icon={CheckCircle2} label="AI Simulations" tone="slate" />
        <NotificationPill icon={Trophy} label="Leaderboards" tone="slate" />
        <NotificationPill icon={AlertTriangle} label="Coaching Priority Flags" tone="lime" />
      </div>
    </WidgetCard>
  )
}

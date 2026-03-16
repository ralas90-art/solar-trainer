import { cn } from "@/lib/utils"
import { NotificationPill, SectionEyebrow, WidgetCard } from "./dashboard-widgets"
import { Crown, Flame, LucideIcon, Medal, Trophy, TrendingUp } from "lucide-react"

export type TimeRange = "daily" | "weekly" | "monthly" | "all-time"
export type LeaderboardScope = "global" | "company" | "team"
export type SkillCategory =
  | "overall"
  | "prospecting"
  | "discovery"
  | "presentation"
  | "objections"
  | "closing"

export type LeaderboardRep = {
  id: string
  name: string
  company: string
  team: string
  score: number
  simulationsCompleted: number
  currentStreak: number
  badgesEarned: number
  xpTotal: number
  level: number
  weeklyProgress: number
  skillScores: Record<Exclude<SkillCategory, "overall">, number>
  skillSimulationCount: Record<Exclude<SkillCategory, "overall">, number>
  achievements: string[]
}

export type TeamLeaderboardEntry = {
  teamName: string
  averageScore: number
  totalSimulations: number
  topPerformer: string
}

const formatNumber = (value: number) => value.toLocaleString("en-US")

const rankStyles: Record<number, string> = {
  1: "border-[#FFB300]/50 bg-[linear-gradient(135deg,rgba(255,179,0,0.26),rgba(255,87,34,0.18))] text-[#F5FFD2] shadow-[0_0_24px_rgba(255,179,0,0.35)]",
  2: "border-[#FF5722]/35 bg-[rgba(255,87,34,0.16)] text-[#D9FBFF] shadow-[0_0_20px_rgba(255,87,34,0.25)]",
  3: "border-[#94A3B8]/35 bg-[rgba(148,163,184,0.18)] text-[#E2E8F0]",
}

export function RankBadge({ rank }: { rank: number }) {
  const Icon = rank === 1 ? Crown : rank <= 3 ? Medal : null

  return (
    <span
      className={cn(
        "inline-flex min-w-11 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 font-hud text-sm",
        rankStyles[rank] ?? "border-white/10 bg-white/5 text-[#CBD5E1]"
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      #{rank}
    </span>
  )
}

export function LeaderboardRow({
  rank,
  rep,
  score,
  simulations,
  highlightTop,
}: {
  rank: number
  rep: LeaderboardRep
  score: number
  simulations: number
  highlightTop?: boolean
}) {
  return (
    <tr
      className={cn(
        "border-b border-white/5 text-sm text-[#CBD5E1] transition-colors hover:bg-white/5",
        highlightTop ? "bg-[linear-gradient(90deg,rgba(255,87,34,0.08),rgba(255,179,0,0.05))]" : ""
      )}
    >
      <td className="px-3 py-3 sm:px-4">
        <RankBadge rank={rank} />
      </td>
      <td className="px-3 py-3 sm:px-4">
        <p className="font-medium text-white">{rep.name}</p>
      </td>
      <td className="px-3 py-3 sm:px-4">
        <p className="text-[#94A3B8]">{rep.company}</p>
        <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#64748B]">{rep.team}</p>
      </td>
      <td className="px-3 py-3 text-right font-hud text-[#FF5722] sm:px-4">{formatNumber(score)}</td>
      <td className="px-3 py-3 text-right font-hud text-[#E2E8F0] sm:px-4">{formatNumber(simulations)}</td>
      <td className="px-3 py-3 text-right sm:px-4">
        <span className="inline-flex items-center gap-1 text-[#FFB300]">
          <Flame className="h-3.5 w-3.5" />
          <span className="font-hud">{rep.currentStreak}d</span>
        </span>
      </td>
      <td className="px-3 py-3 text-right sm:px-4">
        <span className="badge-amber">{rep.badgesEarned}</span>
      </td>
    </tr>
  )
}

export function LeaderboardTable({
  entries,
  title,
  subtitle,
  scoreLabel,
}: {
  entries: Array<{ rep: LeaderboardRep; score: number; simulations: number }>
  title: string
  subtitle: string
  scoreLabel: string
}) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label={title} action={subtitle} />
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="min-w-[980px] w-full">
          <thead>
            <tr className="border-y border-white/5 bg-white/[0.03] text-left font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
              <th className="px-3 py-3 sm:px-4">Rank</th>
              <th className="px-3 py-3 sm:px-4">User Name</th>
              <th className="px-3 py-3 sm:px-4">Company / Team</th>
              <th className="px-3 py-3 text-right sm:px-4">{scoreLabel}</th>
              <th className="px-3 py-3 text-right sm:px-4">Simulations Completed</th>
              <th className="px-3 py-3 text-right sm:px-4">Current Streak</th>
              <th className="px-3 py-3 text-right sm:px-4">Badges Earned</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <LeaderboardRow
                key={entry.rep.id}
                rank={index + 1}
                rep={entry.rep}
                score={entry.score}
                simulations={entry.simulations}
                highlightTop={index < 3}
              />
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

export function UserRankCard({
  rank,
  total,
  score,
  simulations,
  streak,
}: {
  rank: number
  total: number
  score: number
  simulations: number
  streak: number
}) {
  const percentile = Math.max(1, Math.round((1 - rank / total) * 100))

  return (
    <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_48%,rgba(255,179,0,0.1))]">
      <SectionEyebrow label="Personal Performance" action="Your live rank" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-hud text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">Your Rank</p>
          <p className="mt-2 font-display text-4xl font-black text-white">#{rank}</p>
          <p className="mt-2 text-sm text-[#CBD5E1]">Top {percentile}% this period</p>
        </div>
        <div className="space-y-2 text-sm text-[#CBD5E1]">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span>Your Score</span>
            <span className="font-hud text-[#FF5722]">{formatNumber(score)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span>Simulations</span>
            <span className="font-hud text-white">{formatNumber(simulations)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#FFB300]/20 bg-[rgba(255,179,0,0.08)] px-3 py-2">
            <span>Current Streak</span>
            <span className="font-hud text-[#FFB300]">{streak} days</span>
          </div>
        </div>
      </div>
    </WidgetCard>
  )
}

export function ScoreProgressCard({
  yourScore,
  averageScore,
}: {
  yourScore: number
  averageScore: number
}) {
  const ratio = Math.max(0, Math.min(100, Math.round((yourScore / averageScore) * 100)))
  const delta = yourScore - averageScore

  return (
    <WidgetCard>
      <SectionEyebrow label="Score Progress" action="Relative to leaderboard average" />
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-3xl font-black text-white">{ratio}%</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-hud text-xs uppercase tracking-[0.16em]",
            delta >= 0 ? "text-[#FFB300]" : "text-[#94A3B8]"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {delta >= 0 ? "+" : ""}
          {Math.round(delta)}
        </span>
      </div>
      <p className="mt-2 text-sm text-[#94A3B8]">
        Your score: <span className="font-hud text-[#FF5722]">{formatNumber(yourScore)}</span> | Average:{" "}
        <span className="font-hud text-white">{formatNumber(averageScore)}</span>
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${ratio}%` }} />
      </div>
    </WidgetCard>
  )
}

export function WeeklyImprovementCard({
  weeklyProgress,
  weeklyDelta,
}: {
  weeklyProgress: number
  weeklyDelta: number
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Weekly Improvement" action="Momentum tracking" />
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-black text-white">{weeklyProgress}%</p>
          <p className="mt-2 text-sm text-[#94A3B8]">Represents growth vs last week&apos;s simulator average.</p>
        </div>
        <NotificationPill icon={TrendingUp} label={`${weeklyDelta >= 0 ? "+" : ""}${weeklyDelta}% WoW`} tone="lime" />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${Math.min(100, Math.max(0, weeklyProgress))}%` }} />
      </div>
    </WidgetCard>
  )
}

export function SkillLeaderboardCard({
  title,
  rows,
}: {
  title: string
  rows: Array<{ rank: number; repName: string; score: number; simulations: number }>
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label={title} action="Top 10 reps" />
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={`${title}-${row.rank}-${row.repName}`}
            className={cn(
              "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl border px-3 py-2 text-sm",
              row.rank <= 3
                ? "border-[#FF5722]/20 bg-[rgba(255,87,34,0.08)]"
                : "border-white/5 bg-white/5"
            )}
          >
            <RankBadge rank={row.rank} />
            <span className="truncate text-white">{row.repName}</span>
            <span className="font-hud text-[#FF5722]">{row.score}</span>
            <span className="font-hud text-[#94A3B8]">{row.simulations}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

export function TeamLeaderboardCard({
  entries,
}: {
  entries: TeamLeaderboardEntry[]
}) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label="Team Leaderboards" action="Enterprise performance view" />
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="min-w-[760px] w-full">
          <thead>
            <tr className="border-y border-white/5 bg-white/[0.03] text-left font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
              <th className="px-3 py-3 sm:px-4">Rank</th>
              <th className="px-3 py-3 sm:px-4">Team Name</th>
              <th className="px-3 py-3 text-right sm:px-4">Average Score</th>
              <th className="px-3 py-3 text-right sm:px-4">Total Simulations</th>
              <th className="px-3 py-3 text-right sm:px-4">Top Performer</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((team, index) => (
              <tr key={team.teamName} className="border-b border-white/5 text-sm text-[#CBD5E1] hover:bg-white/5">
                <td className="px-3 py-3 sm:px-4">
                  <RankBadge rank={index + 1} />
                </td>
                <td className="px-3 py-3 font-medium text-white sm:px-4">{team.teamName}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FF5722] sm:px-4">{formatNumber(team.averageScore)}</td>
                <td className="px-3 py-3 text-right font-hud text-white sm:px-4">{formatNumber(team.totalSimulations)}</td>
                <td className="px-3 py-3 text-right text-[#FFB300] sm:px-4">{team.topPerformer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

export function AchievementChip({
  label,
  icon: Icon,
  tone = "cyan",
}: {
  label: string
  icon: LucideIcon
  tone?: "cyan" | "lime" | "slate"
}) {
  const toneClass = {
    cyan: "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#C6FCFF]",
    lime: "border-[#FFB300]/30 bg-[#FFB300]/10 text-[#EEFFC5]",
    slate: "border-white/10 bg-white/5 text-[#CBD5E1]",
  }

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5", toneClass[tone])}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-hud text-[11px] uppercase tracking-[0.14em]">{label}</span>
    </div>
  )
}

export function AchievementSummary({
  xpTotal,
  level,
  streak,
  badges,
}: {
  xpTotal: number
  level: number
  streak: number
  badges: string[]
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Gamification" action="Achievements and rewards" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">XP Total</p>
          <p className="mt-2 font-hud text-2xl text-[#FF5722]">{formatNumber(xpTotal)}</p>
        </div>
        <div className="rounded-xl border border-[#FFB300]/20 bg-[rgba(255,179,0,0.09)] p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">Level</p>
          <p className="mt-2 font-hud text-2xl text-[#FFB300]">L{level}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">Simulation Streak</p>
          <p className="mt-2 inline-flex items-center gap-2 font-hud text-2xl text-white">
            <Flame className="h-5 w-5 text-[#FFB300]" />
            {streak} days
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <AchievementChip
            key={badge}
            label={badge}
            icon={index % 2 === 0 ? Trophy : Medal}
            tone={index % 3 === 0 ? "lime" : index % 2 === 0 ? "cyan" : "slate"}
          />
        ))}
      </div>
    </WidgetCard>
  )
}

import { cn } from "@/lib/utils"
import { ArrowUpRight, LucideIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

type BaseCardProps = {
  className?: string
  children: ReactNode
}

export function WidgetCard({ className, children }: BaseCardProps) {
  return (
    <section
      className={cn(
        "glass-circuit hud-border relative overflow-hidden rounded-[22px] p-5 sm:p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/50 to-transparent" />
      {children}
    </section>
  )
}

export function SectionEyebrow({
  label,
  action,
}: {
  label: string
  action?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <span className="font-hud text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">
        {label}
      </span>
      {action ? (
        <span className="font-hud text-[11px] uppercase tracking-[0.18em] text-[#FF5722]">
          {action}
        </span>
      ) : null}
    </div>
  )
}

export function NotificationPill({
  icon: Icon,
  label,
  tone = "cyan",
}: {
  icon?: LucideIcon
  label: string
  tone?: "cyan" | "lime" | "slate"
}) {
  const toneClasses = {
    cyan: "border-[#FF5722]/25 bg-[#FF5722]/10 text-[#FFD54F]",
    lime: "border-[#FFB300]/25 bg-[#FFB300]/10 text-[#FFE6B3]",
    slate: "border-white/10 bg-white/5 text-[#CBD5E1]",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-hud text-[11px] uppercase tracking-[0.16em]",
        toneClasses[tone]
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </span>
  )
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent = "cyan",
}: {
  label: string
  value: string
  change: string
  icon: LucideIcon
  accent?: "cyan" | "lime"
}) {
  return (
    <WidgetCard className="min-h-[154px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-hud text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
            {label}
          </p>
          <p className="mt-4 font-display text-3xl font-black text-white">{value}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#CBD5E1]">
            <ArrowUpRight
              className={cn(
                "h-4 w-4",
                accent === "lime" ? "text-[#FFB300]" : "text-[#FF5722]"
              )}
            />
            <span>{change}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border",
            accent === "lime"
              ? "border-[#FFB300]/20 bg-[#FFB300]/10 text-[#FFB300] amber-glow"
              : "border-[#FF5722]/20 bg-[#FF5722]/10 text-[#FF5722] solar-glow"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </WidgetCard>
  )
}

export function ProgressCard({
  label,
  value,
  progress,
  detail,
  href,
}: {
  label: string
  value: string
  progress: number
  detail: string
  href?: string
}) {
  const content = (
    <>
      <SectionEyebrow label={label} />
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm text-[#94A3B8]">{detail}</p>
        </div>
        <span className="font-hud text-xs uppercase tracking-[0.18em] text-[#FFB300]">
          {progress}%
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${progress}%` }} />
      </div>
    </>
  )

  return (
    <WidgetCard>
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </WidgetCard>
  )
}

export function ScoreDisplayCard({
  label,
  score,
  subtitle,
}: {
  label: string
  score: number
  subtitle: string
}) {
  return (
    <WidgetCard className="bg-[linear-gradient(180deg,rgba(255,87,34,0.08),rgba(18,18,18,0.9))]">
      <SectionEyebrow label={label} action="AI scored" />
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-hud text-4xl font-bold text-[#FF5722] text-glow">
            {score}
            <span className="ml-1 text-base text-[#94A3B8]">/100</span>
          </div>
          <p className="mt-2 text-sm text-[#CBD5E1]">{subtitle}</p>
        </div>
        <div className="h-16 w-16 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 p-2">
          <div className="flex h-full items-center justify-center rounded-full border border-[#FF5722]/20 font-hud text-sm text-white">
            +42 XP
          </div>
        </div>
      </div>
    </WidgetCard>
  )
}

export function ModuleCard({
  title,
  subtitle,
  progress,
  badge,
  href,
}: {
  title: string
  subtitle: string
  progress: number
  badge: string
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <NotificationPill label={badge} tone="lime" />
        <span className="font-hud text-xs text-[#94A3B8]">{progress}% complete</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{subtitle}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${progress}%` }} />
      </div>
    </>
  )

  return (
    <WidgetCard className="transition-transform duration-200 hover:-translate-y-1">
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </WidgetCard>
  )
}

export function LeaderboardListItem({
  rank,
  name,
  score,
  streak,
}: {
  rank: string
  name: string
  score: string
  streak: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 font-hud text-sm text-[#FF5722]">
          {rank}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="font-hud text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">
            {streak}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-hud text-base text-[#FFB300]">{score}</p>
        <p className="text-xs text-[#94A3B8]">weekly XP</p>
      </div>
    </div>
  )
}

export function SkillProgressRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-[#CBD5E1]">{label}</span>
        <span className="font-hud text-xs text-[#94A3B8]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

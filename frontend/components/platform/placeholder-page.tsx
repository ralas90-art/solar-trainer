import { AppShell } from "@/components/platform/app-shell"
import {
  NotificationPill,
  SectionEyebrow,
  StatCard,
  WidgetCard,
} from "@/components/platform/dashboard-widgets"
import { ArrowRight, LucideIcon, Sparkles, Target, Zap } from "lucide-react"
import Link from "next/link"

export function PlatformPlaceholderPage({
  heading,
  subheading,
  badge,
  badgeTone = "cyan",
  primaryAction,
  stats,
  focusPoints,
}: {
  heading: string
  subheading: string
  badge: string
  badgeTone?: "cyan" | "lime" | "slate"
  primaryAction: {
    label: string
    href: string
  }
  stats: Array<{
    label: string
    value: string
    change: string
    icon: LucideIcon
    accent?: "cyan" | "lime"
  }>
  focusPoints: Array<{
    title: string
    body: string
  }>
}) {
  return (
    <AppShell heading={heading} subheading={subheading}>
      <div className="space-y-6">
        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_45%,rgba(255,179,0,0.1))]">
          <NotificationPill icon={Zap} label={badge} tone={badgeTone} />
          <h2 className="mt-5 font-display text-3xl font-black text-white sm:text-4xl">
            Initial shell is live for this section.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#CBD5E1]">
            This page now inherits the SeptiVolt platform shell, utility bar, and reusable dashboard card system so
            deeper workflows can plug in without another layout pass.
          </p>
          <Link href={primaryAction.href} className="btn-solar mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm">
            {primaryAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </WidgetCard>

        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              accent={stat.accent}
            />
          ))}
        </section>

        <WidgetCard>
          <SectionEyebrow label="Focus areas" action="Next build phase" />
          <div className="grid gap-4 lg:grid-cols-3">
            {focusPoints.map((point) => (
              <div key={point.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-[#FF5722]">
                  <Target className="h-4 w-4" />
                  <span className="font-medium text-white">{point.title}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{point.body}</p>
              </div>
            ))}
          </div>
        </WidgetCard>

        <WidgetCard>
          <SectionEyebrow label="Status" />
          <div className="flex flex-wrap gap-3">
            <NotificationPill icon={Sparkles} label="Shared shell enabled" tone="cyan" />
            <NotificationPill icon={Zap} label="Reusable widgets enabled" tone="lime" />
            <NotificationPill label="Ready for feature integration" tone="slate" />
          </div>
        </WidgetCard>
      </div>
    </AppShell>
  )
}

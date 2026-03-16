import { cn } from "@/lib/utils"
import { CertificationStatus, CertificationTrack, RequirementItem, TeamCertificationProgress } from "@/lib/certifications"
import { NotificationPill, SectionEyebrow, WidgetCard } from "./dashboard-widgets"
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock3,
  Download,
  Flame,
  Lock,
  LucideIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react"
import Link from "next/link"

const statusConfig: Record<
  CertificationStatus,
  { label: string; tone: "cyan" | "lime" | "slate"; icon: LucideIcon; cardClass: string }
> = {
  locked: {
    label: "Locked",
    tone: "slate",
    icon: Lock,
    cardClass: "border-white/10 bg-white/5",
  },
  "in-progress": {
    label: "In Progress",
    tone: "cyan",
    icon: Clock3,
    cardClass: "border-[#FF5722]/20 bg-[rgba(255,87,34,0.08)]",
  },
  ready: {
    label: "Ready for Assessment",
    tone: "lime",
    icon: ShieldCheck,
    cardClass: "border-[#FFB300]/25 bg-[rgba(255,179,0,0.08)]",
  },
  certified: {
    label: "Certified",
    tone: "lime",
    icon: Award,
    cardClass: "border-[#FFB300]/35 bg-[linear-gradient(140deg,rgba(255,87,34,0.14),rgba(255,179,0,0.12))]",
  },
}

export function CertificationBadge({
  title,
  status,
  earnedDate,
}: {
  title: string
  status: CertificationStatus
  earnedDate: string | null
}) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("rounded-2xl border p-4", config.cardClass)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#121212]/50">
          <Icon className="h-5 w-5 text-[#FF5722]" />
        </div>
        <NotificationPill label={config.label} tone={config.tone} />
      </div>
      <p className="mt-3 font-display text-base font-bold text-white">{title}</p>
      <p className="mt-1 font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">
        {earnedDate ? `Earned ${earnedDate}` : "Not yet earned"}
      </p>
    </div>
  )
}

export function CertificationOverviewCard({
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
    lime: "border-[#FFB300]/20 bg-[#FFB300]/10 text-[#FFB300]",
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

export function RequirementChecklist({ items }: { items: RequirementItem[] }) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Requirements Checklist" action="Assessment gating" />
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm",
              item.complete ? "border-[#FFB300]/25 bg-[rgba(255,179,0,0.08)]" : "border-white/10 bg-white/5"
            )}
          >
            {item.complete ? (
              <CheckCircle2 className="h-4 w-4 text-[#FFB300]" />
            ) : (
              <CircleDashed className="h-4 w-4 text-[#94A3B8]" />
            )}
            <span className={item.complete ? "text-white" : "text-[#CBD5E1]"}>{item.label}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

export function AssessmentStatusCard({
  track,
  detailed = false,
}: {
  track: CertificationTrack
  detailed?: boolean
}) {
  const ready = track.status === "ready" || track.status === "certified"
  const passed = track.assessment.passed === true
  const failed = track.assessment.passed === false
  const statusLabel = passed ? "Pass" : failed ? "Fail" : "Pending"

  return (
    <WidgetCard className={cn(ready ? "bg-[linear-gradient(140deg,rgba(255,87,34,0.1),rgba(255,179,0,0.08))]" : "")}>
      <SectionEyebrow label="Certification Assessment" action={track.assessment.name} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Skills Tested</p>
          <p className="mt-2 text-sm text-white">{track.assessment.skillsTested.join(", ")}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Target Score</p>
          <p className="mt-2 font-hud text-xl text-[#FF5722]">{track.assessment.targetScore}+</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Result</p>
          <p
            className={cn(
              "mt-2 font-hud text-xl",
              passed ? "text-[#FFB300]" : failed ? "text-[#F97316]" : "text-[#94A3B8]"
            )}
          >
            {statusLabel}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Attempts</p>
          <p className="mt-2 font-hud text-xl text-white">
            {track.assessment.attemptsUsed} / {track.assessment.maxAttempts}
          </p>
        </div>
      </div>
      {detailed && !passed ? (
        <button
          type="button"
          className="btn-solar mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          Retry Assessment
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </WidgetCard>
  )
}

export function CertificationTrackCard({ track }: { track: CertificationTrack }) {
  const status = statusConfig[track.status]
  const completedRequirements = track.requirements.filter((item) => item.complete).length

  return (
    <WidgetCard className={cn(track.status === "certified" ? "solar-glow" : "")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white">{track.title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#94A3B8]">{track.description}</p>
        </div>
        <NotificationPill label={status.label} tone={status.tone} />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${track.progress}%` }} />
      </div>
      <p className="mt-2 font-hud text-xs uppercase tracking-[0.14em] text-[#94A3B8]">
        {track.progress}% complete • {completedRequirements}/{track.requirements.length} requirements met
      </p>

      <div className="mt-4 grid gap-2 text-sm text-[#CBD5E1]">
        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          Required modules: <span className="text-white">{track.requiredModules.length}</span>
        </p>
        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          Required simulation score: <span className="font-hud text-[#FF5722]">{track.requiredSimulationScore}+</span>
        </p>
        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          Unlock criteria: <span className="text-white">{track.unlockCriteria}</span>
        </p>
      </div>

      <Link
        href={`/certifications/${track.id}`}
        className="mt-4 inline-flex items-center gap-2 text-sm text-[#FF5722] hover:text-[#FFD54F]"
      >
        Open Certification Detail
        <ChevronRight className="h-4 w-4" />
      </Link>
    </WidgetCard>
  )
}

export function CertificatePreviewCard({
  track,
  downloadHref,
}: {
  track: CertificationTrack
  downloadHref?: string
}) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label="Credential" action="Downloadable certificate" />
      <div className="rounded-2xl border border-[#FF5722]/25 bg-[linear-gradient(140deg,rgba(255,87,34,0.14),rgba(255,179,0,0.1))] p-4">
        <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">Certificate Preview</p>
        <p className="mt-2 font-display text-xl font-bold text-white">{track.title}</p>
        <p className="mt-1 text-sm text-[#CBD5E1]">Issued by SeptiVolt Training Authority</p>
        <div className="mt-4 grid gap-2 text-sm">
          <p className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[#E2E8F0]">
            Date Earned: <span className="font-hud text-white">{track.earnedDate ?? "Pending"}</span>
          </p>
          <p className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[#E2E8F0]">
            Credential ID: <span className="font-hud text-white">{track.credentialId ?? "Awaiting issuance"}</span>
          </p>
        </div>
      </div>
      {track.earnedDate && downloadHref ? (
        <a
          href={downloadHref}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#FF5722]/35 bg-[#FF5722]/10 px-4 py-2 text-sm text-[#D9FBFF] transition-colors hover:bg-[#FF5722]/20"
        >
          <Download className="h-4 w-4" />
          Download Certificate
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#64748B]"
        >
          <Download className="h-4 w-4" />
          Download Certificate
        </button>
      )}
    </WidgetCard>
  )
}

export function TeamCertificationTable({ rows }: { rows: TeamCertificationProgress[] }) {
  return (
    <WidgetCard className="overflow-hidden">
      <SectionEyebrow label="Team Certification Progress" action="Enterprise manager view" />
      <div className="-mx-5 overflow-x-auto sm:-mx-6">
        <table className="min-w-[840px] w-full">
          <thead>
            <tr className="border-y border-white/5 bg-white/[0.03] text-left font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">
              <th className="px-3 py-3 sm:px-4">Team</th>
              <th className="px-3 py-3 text-right sm:px-4">Reps Certified</th>
              <th className="px-3 py-3 text-right sm:px-4">In Progress</th>
              <th className="px-3 py-3 text-right sm:px-4">At Risk</th>
              <th className="px-3 py-3 text-right sm:px-4">Completion</th>
              <th className="px-3 py-3 text-right sm:px-4">Manager Sign-off</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teamName} className="border-b border-white/5 text-sm text-[#CBD5E1] hover:bg-white/5">
                <td className="px-3 py-3 font-medium text-white sm:px-4">{row.teamName}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FFB300] sm:px-4">{row.repsCertified}</td>
                <td className="px-3 py-3 text-right font-hud text-[#FF5722] sm:px-4">{row.repsInProgress}</td>
                <td className="px-3 py-3 text-right font-hud text-[#F97316] sm:px-4">{row.repsAtRisk}</td>
                <td className="px-3 py-3 text-right font-hud text-white sm:px-4">{row.overallCompletion}%</td>
                <td className="px-3 py-3 text-right font-hud text-[#94A3B8] sm:px-4">{row.managerSignoffPending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

export function NextStepPanel({
  nextStep,
  missingRequirements,
  recommendedModule,
}: {
  nextStep: string
  missingRequirements: string[]
  recommendedModule: string
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Next Steps" action="Certification readiness" />
      <div className="rounded-2xl border border-[#FFB300]/20 bg-[rgba(255,179,0,0.08)] p-4">
        <div className="flex items-center gap-2 text-[#FFB300]">
          <Target className="h-4 w-4" />
          <p className="font-hud text-[11px] uppercase tracking-[0.16em]">Priority action</p>
        </div>
        <p className="mt-2 text-sm text-white">{nextStep}</p>
      </div>
      <div className="mt-4 space-y-2">
        {missingRequirements.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#CBD5E1]">
            <AlertTriangle className="h-4 w-4 text-[#F97316]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-2">
        <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Recommended training module</p>
        <p className="mt-1 text-sm text-[#D9FBFF]">{recommendedModule}</p>
      </div>
    </WidgetCard>
  )
}

export function CertificationGamification({
  certificationXp,
  streakDays,
  levelProgress,
  milestoneLabel,
}: {
  certificationXp: number
  streakDays: number
  levelProgress: number
  milestoneLabel: string
}) {
  return (
    <WidgetCard>
      <SectionEyebrow label="Gamification Progression" action="Milestones + XP" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Certification XP</p>
          <p className="mt-2 font-hud text-2xl text-[#FF5722]">{certificationXp}</p>
        </div>
        <div className="rounded-xl border border-[#FFB300]/20 bg-[rgba(255,179,0,0.08)] p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Completion Streak</p>
          <p className="mt-2 inline-flex items-center gap-2 font-hud text-2xl text-white">
            <Flame className="h-5 w-5 text-[#FFB300]" />
            {streakDays}d
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Level Progress</p>
          <p className="mt-2 font-hud text-2xl text-white">{levelProgress}%</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="volt-progress h-full" style={{ width: `${levelProgress}%` }} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NotificationPill icon={Sparkles} label="25% complete" tone="slate" />
        <NotificationPill icon={Trophy} label="50% complete" tone="slate" />
        <NotificationPill icon={ShieldCheck} label="Ready for final assessment" tone="lime" />
        <NotificationPill icon={Award} label={milestoneLabel} tone="cyan" />
      </div>
    </WidgetCard>
  )
}

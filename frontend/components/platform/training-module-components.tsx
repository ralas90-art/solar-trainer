"use client"

import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Lightbulb,
  PlayCircle,
  Trophy,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export function TrainingModuleHeader({
  title, // Passed in but hidden from main view, preserved for structure
  description,
  estimatedTime,
  moduleTag,
  audioComplete = false,
  workbookComplete = false,
  quizComplete = false,
  simulationComplete = false,
}: {
  title: string
  description: string
  estimatedTime: string
  moduleTag: string
  audioComplete?: boolean
  workbookComplete?: boolean
  quizComplete?: boolean
  simulationComplete?: boolean
}) {
  return (
    <section className="glass-circuit hud-border relative overflow-hidden rounded-[22px] p-5 sm:p-6 pb-2">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,87,34,0.28)_0%,transparent_65%)]" />
      
      <Link 
        href="/dashboard" 
        className="mb-4 inline-flex items-center gap-2 text-xs font-hud uppercase tracking-[0.12em] text-[#94A3B8] transition-colors hover:text-[#FF5722] relative z-20"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row justify-between gap-5 relative z-10">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-solar">{moduleTag}</span>
            <span className="badge-amber">Simulation Prep</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#CBD5E1] sm:text-base">{description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-3 py-2 font-hud text-[#FF5722]">
              Est. {estimatedTime}
            </div>
            <div className="rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/10 px-3 py-2 font-hud text-[#FFE6B3]">
              +180 XP
            </div>
          </div>
        </div>

        {/* Training Protocol Guide */}
        <div className="w-full lg:flex-1 bg-[rgba(255,87,34,0.05)] rounded-xl border border-[#FF5722]/10 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
             <PlayCircle className="h-4 w-4 text-[#FF5722]" />
             <p className="font-hud text-[11px] uppercase tracking-[0.12em] text-[#FFD54F]">Training Protocol</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "1", label: "Play Audio", detail: "Listen to the breakdown" },
              { step: "2", label: "Study Slides", detail: "Follow the visual flow" },
              { step: "3", label: "Workbook", detail: "Internalize the concepts" },
              { step: "4", label: "Roleplay", detail: "Test skills in simulator" }
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="font-hud text-[10px] text-[#FF5722] mt-0.5">{step.step}.</span>
                <div>
                  <p className="text-xs font-bold text-white leading-none">{step.label}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimized Module Requirements Box */}
        <div className="w-full lg:w-56 shrink-0 bg-[rgba(18,18,18,0.7)] rounded-xl border border-white/10 p-4 mb-4">
          <p className="font-hud text-[11px] uppercase tracking-[0.12em] text-[#94A3B8] mb-3">Requirements</p>
          <ul className="space-y-2.5">
            {[
              { label: "Audio", complete: audioComplete },
              { label: "Workbook", complete: workbookComplete },
              { label: "Quiz", complete: quizComplete },
              { label: "Roleplay", complete: simulationComplete }
            ].map((req, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${req.complete ? 'border-[#FFB300] bg-[#FFB300]/10' : 'border-white/10'}`}>
                  {req.complete && <CheckCircle2 className="h-3 w-3 text-[#FFB300]" />}
                </div>
                <span className={`text-[11px] ${req.complete ? 'text-white' : 'text-[#94A3B8]'}`}>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function LessonCard({
  title,
  content,
  bullets,
  expandableDetails,
}: {
  title: string
  content: string
  bullets?: string[]
  expandableDetails?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="glass-circuit hud-border rounded-[20px] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        {expandableDetails ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-hud uppercase tracking-[0.12em] text-[#94A3B8] transition-colors hover:text-white"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
          >
            {open ? "Hide explanation" : "Expand explanation"}
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-7 text-[#CBD5E1]">{content}</p>
      {bullets?.length ? (
        <ul className="mt-4 space-y-2">
          {bullets.map((item) => (
            <li key={item} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-[#CBD5E1]">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {open && expandableDetails ? (
        <div className="mt-4 rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/10 p-3 text-sm leading-6 text-[#D9F9FF]">
          {expandableDetails}
        </div>
      ) : null}
    </section>
  )
}

export function ScriptExampleCard({
  title,
  script,
  objection,
  response,
  scenario,
}: {
  title: string
  script: string[]
  objection: string
  response: string
  scenario: string
}) {
  return (
    <section className="glass-circuit hud-border rounded-[20px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        <span className="badge-solar">Script Example</span>
      </div>
      <div className="mt-4 space-y-2">
        {script.map((line, index) => (
          <p key={line} className="text-sm leading-7 text-[#CBD5E1]">
            <span className="mr-2 font-hud text-xs text-[#FF5722]">L{index + 1}</span>
            {line}
          </p>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-[#FFB300]/20 bg-[#FFB300]/10 p-3">
        <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#FFE6B3]">Highlighted Objection Response</p>
        <p className="mt-2 text-sm text-white">
          <span className="text-[#FFE6B3]">Objection:</span> {objection}
        </p>
        <p className="mt-2 text-sm text-[#FFE6B3]">
          <span className="text-[#FFE6B3]">Response:</span> {response}
        </p>
      </div>
      <p className="mt-4 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-[#94A3B8]">
        Scenario example: {scenario}
      </p>
    </section>
  )
}

export function FieldTipCard({
  tone,
  title,
  note,
}: {
  tone: "pro" | "mistake" | "field"
  title: string
  note: string
}) {
  const config = {
    pro: {
      container: "border-[#FF5722]/20 bg-[#FF5722]/10",
      text: "text-[#FFD54F]",
      icon: Lightbulb,
      label: "Pro Tip",
    },
    mistake: {
      container: "border-[#F97316]/20 bg-[#F97316]/10",
      text: "text-[#FDBA74]",
      icon: AlertTriangle,
      label: "Common Mistake",
    },
    field: {
      container: "border-[#FFB300]/20 bg-[#FFB300]/10",
      text: "text-[#FFE6B3]",
      icon: BookOpen,
      label: "Field Note",
    },
  }[tone]

  const Icon = config.icon

  return (
    <div className={cn("rounded-2xl border p-4", config.container)}>
      <div className={cn("flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.16em]", config.text)}>
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
      <p className="mt-3 font-display text-lg font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">{note}</p>
    </div>
  )
}

export function KnowledgeCheckCard({
  question,
  options,
  correctIndex,
  feedback,
}: {
  question: string
  options: string[]
  correctIndex: number
  feedback: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const isCorrect = selected === correctIndex

  const feedbackTone = useMemo(() => {
    if (selected === null) return ""
    return isCorrect
      ? "border-[#FFB300]/20 bg-[#FFB300]/10 text-[#FFE6B3]"
      : "border-[#F97316]/20 bg-[#F97316]/10 text-[#FECACA]"
  }, [selected, isCorrect])

  return (
    <section className="glass-circuit hud-border rounded-[20px] p-5">
      <div className="flex items-center gap-2 text-[#FF5722]">
        <BookOpenCheck className="h-4 w-4" />
        <p className="font-hud text-[11px] uppercase tracking-[0.16em]">Knowledge Check</p>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-white">{question}</h3>
      <div className="mt-4 space-y-2">
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={cn(
              "w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
              selected === index
                ? "border-[#FF5722]/35 bg-[#FF5722]/10 text-white"
                : "border-white/10 bg-white/5 text-[#CBD5E1] hover:border-[#FF5722]/20"
            )}
            onClick={() => setSelected(index)}
          >
            <span className="mr-2 font-hud text-xs text-[#FF5722]">{index + 1}.</span>
            {option}
          </button>
        ))}
      </div>
      {selected !== null ? (
        <div className={cn("mt-4 rounded-xl border px-3 py-2 text-sm leading-6", feedbackTone)}>
          {isCorrect ? `Correct - ${feedback}` : "Not quite - focus on diagnosing motivation before solution framing."}
        </div>
      ) : null}
    </section>
  )
}

export function ModuleProgressCard({
  progress,
  completionStatus,
  xpEarned,
  totalXp,
  streakDays,
  skillCategories,
}: {
  progress: number
  completionStatus: string
  xpEarned: number
  totalXp: number
  streakDays: number
  skillCategories: Array<{ label: string; value: number }>
}) {
  const complete = progress >= 100

  return (
    <aside className="glass-circuit hud-border sticky top-24 rounded-[20px] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-white">Module Progress</h3>
        {complete ? (
          <CheckCircle2 className="h-5 w-5 text-[#FFB300]" />
        ) : (
          <span className="font-hud text-xs text-[#94A3B8]">{progress}%</span>
        )}
      </div>

      <p className="mt-2 text-sm text-[#CBD5E1]">{completionStatus}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#FF5722,#FFB300)] shadow-[0_0_10px_rgba(255,87,34,0.45)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-[#FF5722]/15 bg-[#FF5722]/10 px-3 py-2">
          <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#FFD54F]">XP Earned</p>
          <p className="mt-1 font-hud text-base text-white">
            {xpEarned} / {totalXp}
          </p>
        </div>
        <div className="rounded-xl border border-[#FFB300]/15 bg-[#FFB300]/10 px-3 py-2">
          <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#FFE6B3]">Training Streak</p>
          <p className="mt-1 flex items-center gap-2 font-hud text-base text-white">
            <Flame className="h-4 w-4 text-[#FFB300]" />
            {streakDays} days
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <p className="font-hud text-[11px] uppercase tracking-[0.14em] text-[#94A3B8]">Level Progress</p>
          <p className="mt-1 flex items-center gap-2 font-hud text-base text-white">
            <Trophy className="h-4 w-4 text-[#FF5722]" />
            Closer L12
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="font-hud text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">Skill Category</p>
        {skillCategories.map((skill) => (
          <div key={skill.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#CBD5E1]">{skill.label}</span>
              <span className="font-hud text-[#94A3B8]">{skill.value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#FF5722,#FFB300)]"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2">
        <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#CBD5E1]">
          Dashboard Progress Sync
        </Link>
        <Link href="/leaderboards" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#CBD5E1]">
          Leaderboard Metrics
        </Link>
      </div>
    </aside>
  )
}

export function StartSimulationButton({
  scenarioName,
  skillsTested,
  targetScore,
  href,
}: {
  scenarioName: string
  skillsTested: string[]
  targetScore: string
  href?: string
}) {
  return (
    <section className="glass-circuit hud-border rounded-[20px] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[#FFB300]">
        <Zap className="h-4 w-4" />
        <span className="font-hud text-[11px] uppercase tracking-[0.16em]">Transition to Simulation</span>
      </div>

      <h3 className="mt-3 font-display text-2xl font-black text-white">Ready for Live Practice</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[11px] uppercase tracking-[0.12em] text-[#94A3B8]">Scenario Name</p>
          <p className="mt-1 text-sm text-white">{scenarioName}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[11px] uppercase tracking-[0.12em] text-[#94A3B8]">Skills Being Tested</p>
          <p className="mt-1 text-sm text-white">{skillsTested.join(", ")}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="font-hud text-[11px] uppercase tracking-[0.12em] text-[#94A3B8]">Target Score</p>
          <p className="mt-1 text-sm text-white">{targetScore}</p>
        </div>
      </div>

      <Link href={href ?? "/ai-simulator"} className="btn-solar mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm">
        Start Simulation
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/platform/app-shell"
import { loadDebriefs, DebriefRecord } from "@/lib/debrief-storage"
import { isDemoModeActive } from "@/lib/demo-mode"
import { useAuth } from "@/context/AuthContext"
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  History,
  ArrowLeft,
  Calendar,
  Target,
} from "lucide-react"

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function ScoreBadge({ score, passed }: { score: number; passed: boolean }) {
  const color = passed
    ? "bg-green-900/40 border-green-500/40 text-green-300"
    : score >= 60
    ? "bg-yellow-900/40 border-yellow-500/40 text-yellow-300"
    : "bg-red-900/30 border-red-500/30 text-red-400"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${color}`}
    >
      {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {score}/100 · {passed ? "PASSED" : "NEEDS WORK"}
    </span>
  )
}

// ─── Expanded Debrief Card ────────────────────────────────────────────────────

function DebriefCard({ debrief }: { debrief: DebriefRecord }) {
  const [expanded, setExpanded] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showScript, setShowScript] = useState(false)

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        debrief.passed
          ? "border-green-500/20 bg-green-950/10"
          : "border-slate-700/60 bg-slate-900/40"
      }`}
    >
      {/* ── Summary Row ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              debrief.passed ? "bg-green-500/15 text-green-400" : "bg-slate-800 text-slate-400"
            }`}
          >
            {debrief.passed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{debrief.scenarioName}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                {formatDate(debrief.completedAt)}
              </span>
              <ScoreBadge score={debrief.score} passed={debrief.passed} />
            </div>
          </div>
        </div>
        <div className="ml-4 shrink-0 text-slate-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* ── Expanded Content ── */}
      {expanded && (
        <div className="border-t border-white/5 px-5 pb-6 pt-4 space-y-5">

          {/* Tone */}
          {debrief.toneRating && (
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/25 px-3 py-1.5 rounded-full text-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-200 font-medium">Tone:</span>
                <span className="text-white font-bold">{debrief.toneRating}</span>
              </div>
              {debrief.toneFeedback && (
                <p className="text-slate-400 text-sm italic">{debrief.toneFeedback}</p>
              )}
            </div>
          )}

          {/* Coach's Summary */}
          {debrief.feedbackSummary && (
            <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Coach's Summary
              </p>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{debrief.feedbackSummary}"
              </p>
            </div>
          )}

          {/* Strengths + Improvements */}
          <div className="grid sm:grid-cols-2 gap-4">
            {debrief.strengths.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> What You Did Well
                </p>
                <ul className="space-y-1.5">
                  {debrief.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {debrief.improvements.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Areas to Improve
                </p>
                <ul className="space-y-1.5">
                  {debrief.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <XCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggested Script */}
          {debrief.suggestedScript && (
            <div>
              <button
                onClick={() => setShowScript((v) => !v)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggested Script
                </span>
                {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showScript && (
                <div className="bg-slate-950 rounded-xl border border-slate-700 p-4 mt-2">
                  <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {debrief.suggestedScript}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transcript */}
          {debrief.transcript.length > 0 && (
            <div>
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-slate-400 hover:text-slate-300 transition-colors"
              >
                <span>📝 Full Transcript ({debrief.transcript.length} messages)</span>
                {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showTranscript && (
                <div className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
                  {debrief.transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-sm ${
                        msg.role === "You"
                          ? "bg-indigo-900/30 ml-8 border border-indigo-500/20"
                          : "bg-slate-800/60 mr-8 border border-white/5"
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-400 mb-1">{msg.role}</p>
                      <p className="text-slate-200">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DebriefHistoryPage() {
  const { user } = useAuth()
  const [debriefs, setDebriefs] = useState<DebriefRecord[]>([])
  const [mounted, setMounted] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const demo = isDemoModeActive()
    setIsDemo(demo)
    loadDebriefs(user?.username).then((records) => {
      setDebriefs(records)
      setMounted(true)
    }).catch(() => {
      setDebriefs([])
      setMounted(true)
    })
  }, [user?.username])

  const passedCount = debriefs.filter((d) => d.passed).length
  const avgScore =
    debriefs.length > 0
      ? Math.round(debriefs.reduce((sum, d) => sum + d.score, 0) / debriefs.length)
      : 0

  return (
    <AppShell
      heading="AI Coaching Reports"
      subheading="Your full simulation debrief history — coaching breakdowns, tone analysis, and script recommendations."
    >
      <div className="space-y-6 max-w-3xl">


        {/* Back to Analytics */}
        <Link
          href="/analytics"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analytics
        </Link>

        {/* Stats Strip */}
        {mounted && debriefs.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Debriefs", value: debriefs.length, icon: History },
              { label: "Pass Rate", value: `${Math.round((passedCount / debriefs.length) * 100)}%`, icon: Target },
              { label: "Avg Score", value: `${avgScore}/100`, icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center"
              >
                <Icon className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Debrief List */}
        {!mounted ? null : debriefs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 py-20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
              <History className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-300">No debriefs yet</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs">
                Complete a simulation to generate your first AI coaching report. It will appear here automatically.
              </p>
            </div>
            <Link
              href="/ai-simulator"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Launch AI Simulator
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {debriefs.map((debrief) => (
              <DebriefCard key={debrief.id} debrief={debrief} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

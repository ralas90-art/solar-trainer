"use client"

import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/platform/app-shell"
import {
  AssessmentStatusCard,
  CertificatePreviewCard,
  CertificationBadge,
  RequirementChecklist,
} from "@/components/platform/certification-components"
import { SectionEyebrow, WidgetCard } from "@/components/platform/dashboard-widgets"
import { CertificationSnapshot, fetchCertificationSnapshot } from "@/lib/certification-api"
import { certificationTracks as seedTracks, teamCertificationProgress as seedTeamProgress } from "@/lib/certifications"
import { getApiUrl } from "@/lib/utils"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

function getActiveUserId() {
  if (typeof window === "undefined") return "trainee"
  const byKey = window.localStorage.getItem("septivolt_user_id")
  if (byKey) return byKey
  const storedUser = window.localStorage.getItem("septivolt_user")
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser) as { id?: string; username?: string }
      return parsed.id ?? parsed.username ?? "trainee"
    } catch {
      return "trainee"
    }
  }
  return "trainee"
}

const initialSnapshot: CertificationSnapshot = {
  tracks: seedTracks,
  teamProgress: seedTeamProgress,
  activeTrackId: seedTracks[0]?.id ?? "",
  userId: "trainee",
}

const statusLabel = {
  locked: "Locked",
  "in-progress": "In Progress",
  ready: "Ready for Assessment",
  certified: "Certified",
}

export default function CertificationDetailPage() {
  const params = useParams<{ certificationId: string }>()
  const certificationId = params?.certificationId
  const [snapshot, setSnapshot] = useState<CertificationSnapshot>(initialSnapshot)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    const userId = getActiveUserId()
    let mounted = true
    const load = async () => {
      setLoading(true)
      setSyncError(null)
      try {
        const liveSnapshot = await fetchCertificationSnapshot(userId)
        if (mounted) setSnapshot(liveSnapshot)
      } catch {
        if (mounted) setSyncError("Live metrics unavailable. Showing local certification data.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const track = useMemo(
    () => snapshot.tracks.find((item) => item.id === certificationId) ?? null,
    [snapshot.tracks, certificationId]
  )

  if (!track) {
    return (
      <AppShell heading="Certification Not Found" subheading="The requested certification detail route is unavailable.">
        <div className="space-y-4">
          <p className="text-sm text-[#CBD5E1]">No certification matched id: {certificationId}</p>
          <Link href="/certifications" className="inline-flex items-center gap-2 text-sm text-[#FF5722]">
            <ArrowLeft className="h-4 w-4" />
            Back to Certifications
          </Link>
        </div>
      </AppShell>
    )
  }

  const apiUrl = getApiUrl()

  return (
    <AppShell
      heading={track.title}
      subheading="Detailed qualification requirements, assessment readiness, and credential lifecycle."
    >
      <div className="space-y-6">
        <Link href="/certifications" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#FF5722]">
          <ArrowLeft className="h-4 w-4" />
          Back to Certifications
        </Link>
        {loading ? <p className="text-sm text-[#94A3B8]">Syncing live certification metrics...</p> : null}
        {syncError ? <p className="text-sm text-[#F59E0B]">{syncError}</p> : null}

        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_45%,rgba(255,179,0,0.1))]">
          <CertificationBadge title={track.title} status={track.status} earnedDate={track.earnedDate} />
          <h2 className="mt-4 font-display text-3xl font-black text-white">{track.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#CBD5E1]">{track.description}</p>
          <div className="mt-4 rounded-2xl border border-[#FF5722]/20 bg-[#FF5722]/10 p-4">
            <div className="flex items-center gap-2 text-[#FF5722]">
              <Sparkles className="h-4 w-4" />
              <p className="font-hud text-[11px] uppercase tracking-[0.16em]">Why it matters</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#D9FBFF]">{track.whyItMatters}</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Status</p>
              <p className="mt-1 text-sm text-white">{statusLabel[track.status]}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Progress</p>
              <p className="mt-1 font-hud text-sm text-[#FF5722]">{track.progress}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Unlock Criteria</p>
              <p className="mt-1 text-sm text-white">{track.unlockCriteria}</p>
            </div>
          </div>
        </WidgetCard>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <RequirementChecklist items={track.requirements} />

            <WidgetCard>
              <SectionEyebrow label="Modules Required" action="Training module dependency" />
              <div className="space-y-2">
                {track.requiredModules.map((moduleName) => (
                  <div key={moduleName} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#CBD5E1]">
                    {moduleName}
                  </div>
                ))}
              </div>
            </WidgetCard>

            <WidgetCard>
              <SectionEyebrow label="Simulation Score Requirement" action="AI simulator gate" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Target simulation score</p>
                  <p className="mt-2 font-hud text-2xl text-[#FF5722]">{track.requiredSimulationScore}+</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Current assessment score</p>
                  <p className="mt-2 font-hud text-2xl text-white">
                    {track.assessment.currentScore ?? "Not attempted"}
                  </p>
                </div>
              </div>
            </WidgetCard>

            <AssessmentStatusCard track={track} detailed />
          </div>

          <div className="space-y-6">
            <WidgetCard>
              <SectionEyebrow label="Status History" action="Audit trail" />
              <div className="space-y-3">
                {track.statusHistory.map((item) => (
                  <div key={`${item.date}-${item.event}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="font-hud text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">{item.date}</p>
                    <p className="mt-1 text-sm text-white">{item.event}</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">{item.actor}</p>
                  </div>
                ))}
              </div>
            </WidgetCard>

            <CertificatePreviewCard
              track={track}
              downloadHref={`${apiUrl}/certificate/${encodeURIComponent(snapshot.userId)}`}
            />
          </div>
        </section>
      </div>
    </AppShell>
  )
}

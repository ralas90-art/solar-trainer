"use client"

import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/platform/app-shell"
import {
  CertificatePreviewCard,
  CertificationBadge,
  CertificationGamification,
  CertificationOverviewCard,
  CertificationTrackCard,
  NextStepPanel,
  TeamCertificationTable,
} from "@/components/platform/certification-components"
import { NotificationPill, SectionEyebrow, WidgetCard } from "@/components/platform/dashboard-widgets"
import { CertificationSnapshot, fetchCertificationSnapshot } from "@/lib/certification-api"
import { certificationTracks as seedTracks, teamCertificationProgress as seedTeamProgress } from "@/lib/certifications"
import { useAuth } from "@/context/AuthContext"
import { Award, CheckCircle2, Clock3, ShieldCheck } from "lucide-react"

const initialSnapshot: CertificationSnapshot = {
  tracks: seedTracks,
  teamProgress: seedTeamProgress,
  activeTrackId: seedTracks[0]?.id ?? "",
  userId: "trainee",
}

export default function CertificationsPage() {
  const { user } = useAuth()
  const [snapshot, setSnapshot] = useState<CertificationSnapshot>(initialSnapshot)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const userId = user.username
    let mounted = true

    const load = async () => {
      setLoading(true)
      setSyncError(null)
      try {
        const liveSnapshot = await fetchCertificationSnapshot(userId)
        if (mounted) setSnapshot(liveSnapshot)
      } catch {
        if (mounted) setSyncError("Live metrics unavailable. Showing latest local certification data.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [user])

  const earned = useMemo(() => snapshot.tracks.filter((track) => track.status === "certified"), [snapshot.tracks])
  const inProgress = useMemo(
    () => snapshot.tracks.filter((track) => track.status === "in-progress"),
    [snapshot.tracks]
  )
  const ready = useMemo(() => snapshot.tracks.filter((track) => track.status === "ready"), [snapshot.tracks])
  const currentTrack = useMemo(
    () => snapshot.tracks.find((track) => track.id === snapshot.activeTrackId) ?? snapshot.tracks[0],
    [snapshot.tracks, snapshot.activeTrackId]
  )
  const overallCompletion = useMemo(
    () => Math.round(snapshot.tracks.reduce((sum, track) => sum + track.progress, 0) / Math.max(snapshot.tracks.length, 1)),
    [snapshot.tracks]
  )

  const nextTarget = ready[0]?.title ?? currentTrack?.title ?? "Certification path"
  const missingRequirements = currentTrack?.requirements.filter((item) => !item.complete).map((item) => item.label).slice(0, 3) ?? []
  const certificationXp = snapshot.tracks.reduce((sum, track) => sum + track.xpValue, 0)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  return (
    <AppShell
      heading="Certifications"
      subheading="Professional qualification system connecting training completion, simulation performance, and credentialed readiness."
    >
      <div className="space-y-6">
        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_45%,rgba(255,179,0,0.1))]">
          <NotificationPill icon={Award} label={loading ? "Syncing live certification metrics" : "Qualification system"} tone="cyan" />
          <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl">Certification Progress Command Center</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#CBD5E1]">
            Dashboard to Training Module to AI Simulation to Score + Coaching to Leaderboard to Certification Progress.
            Every milestone here reflects performance and readiness standards.
          </p>
          {syncError ? <p className="mt-3 text-sm text-[#F59E0B]">{syncError}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {snapshot.tracks.map((track) => (
              <CertificationBadge key={track.id} title={track.title} status={track.status} earnedDate={track.earnedDate} />
            ))}
          </div>
        </WidgetCard>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <CertificationOverviewCard
            label="Certifications Earned"
            value={String(earned.length)}
            detail="Professional credentials issued and available for export."
            icon={CheckCircle2}
            accent="lime"
          />
          <CertificationOverviewCard
            label="In Progress"
            value={String(inProgress.length)}
            detail="Tracks currently advancing through lesson and simulation prerequisites."
            icon={Clock3}
            accent="cyan"
          />
          <CertificationOverviewCard
            label="Next Target"
            value={nextTarget}
            detail="Highest-priority credential for immediate advancement."
            icon={ShieldCheck}
            accent="slate"
          />
          <CertificationOverviewCard
            label="Overall Completion"
            value={`${overallCompletion}%`}
            detail="Aggregated completion across all certification tracks."
            icon={Award}
            accent="cyan"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <WidgetCard>
              <SectionEyebrow label="Certification Tracks" action="Core SeptiVolt credential paths" />
              <div className="grid gap-6 lg:grid-cols-2">
                {snapshot.tracks.map((track) => (
                  <CertificationTrackCard key={track.id} track={track} />
                ))}
              </div>
            </WidgetCard>
          </div>
          <div className="space-y-6">
            <NextStepPanel
              nextStep={
                currentTrack?.assessment.currentScore && currentTrack.assessment.currentScore < currentTrack.assessment.targetScore
                  ? `Improve ${currentTrack.assessment.name} to ${currentTrack.assessment.targetScore}+`
                  : "Complete Day 5 simulation with score 80+ and finish Objection Handling module."
              }
              missingRequirements={missingRequirements}
              recommendedModule={currentTrack?.requiredModules[0] ?? "Day 5 Closing Confidence: Price Pressure Stack"}
            />
            <CertificationGamification
              certificationXp={certificationXp}
              streakDays={Math.max(1, currentTrack?.assessment.attemptsUsed ?? 1)}
              levelProgress={overallCompletion}
              milestoneLabel={ready.length > 0 ? "Ready for final assessment" : "Certified milestone unlocked"}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow label="Downloadable Credentials" action="Completed certifications only" />
          <div className="grid gap-6 lg:grid-cols-2">
            {earned.map((track) => (
              <CertificatePreviewCard
                key={track.id}
                track={track}
                downloadHref={`${apiUrl}/certificate/${encodeURIComponent(user?.username || "trainee")}`}
              />
            ))}
          </div>
        </section>

        <TeamCertificationTable rows={snapshot.teamProgress} />
      </div>
    </AppShell>
  )
}

"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/platform/app-shell"
import { NotificationPill, SectionEyebrow, WidgetCard } from "@/components/platform/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calendar,
  DoorOpen,
  Phone,
  Repeat2,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { KPIEntryForm } from "@/components/kpi-entry-form"
import { KPIAnalytics } from "@/components/kpi-analytics"
import { KPIManager } from "@/components/kpi-manager"
import { GoalSettingWizard } from "@/components/goal-setting-wizard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface KPIDefinition {
  id: string
  label: string
  description: string | null
  target_value: number | null
  target_weekly?: number | null
  target_monthly?: number | null
  target_quarterly?: number | null
  display_order: number
  is_active: boolean
}

interface KPIEntry {
  id: string
  kpi_definition_id: string
  kpi_label: string
  date: string
  value: number
  target: number | null
  notes: string | null
}

export default function KPITrackerPage() {
  const [kpiDefinitions, setKpiDefinitions] = useState<KPIDefinition[]>([])
  const [todayEntries, setTodayEntries] = useState<KPIEntry[]>([])
  const [showManager, setShowManager] = useState(false)
  const [showGoalWizard, setShowGoalWizard] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKPIDefinitions()
    loadTodayEntries()
  }, [])

  const loadKPIDefinitions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/kpis/definitions`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setKpiDefinitions(data)

        if (data.length > 0) {
          const hasGoals = data.some((k: KPIDefinition) => k.target_weekly && k.target_weekly > 0)
          if (!hasGoals) {
            setShowGoalWizard(true)
          }
        }
      }
    } catch (error) {
      console.error("Error loading KPI definitions:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(`${API_URL}/api/v1/kpis/entries?start_date=${today}&end_date=${today}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTodayEntries(data)
      }
    } catch (error) {
      console.error("Error loading today entries:", error)
    }
  }

  const handleKPIsUpdated = () => {
    loadKPIDefinitions()
  }

  const handleEntrySaved = () => {
    loadTodayEntries()
    loadKPIDefinitions()
  }

  const handleGoalsCompleted = () => {
    loadKPIDefinitions()
    setShowGoalWizard(false)
  }

  const handleApplyTemplate = async (template: string) => {
    setLoading(true)
    try {
      let kpis: Array<{ label: string; target_value: number; display_order: number }> = []

      if (template === "door-to-door") {
        kpis = [
          { label: "Knocks", target_value: 100, display_order: 0 },
          { label: "Conversations", target_value: 50, display_order: 1 },
          { label: "Appointments Set", target_value: 15, display_order: 2 },
          { label: "Closes", target_value: 5, display_order: 3 },
        ]
      } else if (template === "virtual-sales") {
        kpis = [
          { label: "Calls Made", target_value: 80, display_order: 0 },
          { label: "Connects", target_value: 40, display_order: 1 },
          { label: "Appointments Booked", target_value: 12, display_order: 2 },
          { label: "Deals Closed", target_value: 4, display_order: 3 },
        ]
      } else if (template === "hybrid") {
        kpis = [
          { label: "Knocks", target_value: 60, display_order: 0 },
          { label: "Calls Made", target_value: 40, display_order: 1 },
          { label: "Total Conversations", target_value: 60, display_order: 2 },
          { label: "Appointments", target_value: 15, display_order: 3 },
          { label: "Closes", target_value: 5, display_order: 4 },
        ]
      }

      for (const kpi of kpis) {
        await fetch(`${API_URL}/api/v1/kpis/definitions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kpi),
        })
      }

      await loadKPIDefinitions()
    } catch (error) {
      console.error("Failed to apply template", error)
    } finally {
      setLoading(false)
    }
  }

  const shellHeading = "Analytics"
  const shellSubheading =
    "Operational KPI tracking for rep activity, conversion pacing, and team-level coaching visibility."

  if (showManager) {
    return (
      <AppShell heading={shellHeading} subheading={shellSubheading}>
        <KPIManager
          kpiDefinitions={kpiDefinitions}
          onClose={() => setShowManager(false)}
          onKPIsUpdated={handleKPIsUpdated}
        />
      </AppShell>
    )
  }

  return (
    <AppShell heading={shellHeading} subheading={shellSubheading}>
      <GoalSettingWizard
        open={showGoalWizard}
        onOpenChange={setShowGoalWizard}
        kpiDefinitions={kpiDefinitions}
        onComplete={handleGoalsCompleted}
      />

      <div className="space-y-6">
        <WidgetCard className="bg-[linear-gradient(135deg,rgba(255,87,34,0.12),rgba(18,18,18,0.94)_45%,rgba(255,179,0,0.08))]">
          <NotificationPill icon={Sparkles} label="KPI command center" tone="cyan" />
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">KPI Tracker</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#CBD5E1]">
                Track activity, goal pacing, and conversion pressure inside the same operating system as training,
                simulation, and team coaching.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowGoalWizard(true)}
                variant="outline"
                className="border-[#FFB300]/30 bg-[rgba(255,179,0,0.08)] text-[#FFE6B3] hover:bg-[rgba(255,179,0,0.14)] hover:text-[#FFF3D6]"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Set Goals
              </Button>
              <Button
                onClick={() => setShowManager(true)}
                variant="outline"
                className="border-[#FF5722]/30 bg-[rgba(255,87,34,0.08)] text-[#FFD54F] hover:bg-[rgba(255,87,34,0.14)] hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage KPIs
              </Button>
            </div>
          </div>
        </WidgetCard>

        <div className="grid gap-6 lg:grid-cols-3">
          <WidgetCard>
            <SectionEyebrow label="Today" />
            <p className="font-display text-3xl font-black text-white">{todayEntries.length}</p>
            <p className="mt-2 text-sm text-[#94A3B8]">Entries logged today across active KPI definitions.</p>
          </WidgetCard>
          <WidgetCard>
            <SectionEyebrow label="Definitions" />
            <p className="font-display text-3xl font-black text-white">{kpiDefinitions.length}</p>
            <p className="mt-2 text-sm text-[#94A3B8]">Live metrics configured for the current workflow.</p>
          </WidgetCard>
          <WidgetCard>
            <SectionEyebrow label="Status" />
            <p className="font-display text-3xl font-black text-white">{loading ? "Syncing" : "Ready"}</p>
            <p className="mt-2 text-sm text-[#94A3B8]">Definitions, goals, and analytics are available in this workspace.</p>
          </WidgetCard>
        </div>

        {kpiDefinitions.length === 0 ? (
          <div className="space-y-6">
            <WidgetCard>
              <SectionEyebrow label="Choose a template" action="Starter setup" />
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#FF5722]/20 bg-[rgba(255,87,34,0.08)]">
                  <TrendingUp className="h-8 w-8 text-[#FF5722]" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">Choose Your KPI Template</h3>
                <p className="mx-auto mt-3 max-w-2xl text-base text-[#94A3B8]">
                  Start with a motion-specific template, then refine goals and reporting once the team is live.
                </p>
              </div>
            </WidgetCard>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-[rgba(24,24,24,0.7)] text-white shadow-none transition-all hover:border-[#FFB300]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DoorOpen className="h-5 w-5 text-[#FFB300]" />
                    Door-to-Door
                  </CardTitle>
                  <CardDescription className="text-slate-400">Perfect for field reps and appointment setters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Knocks</span>
                      <span className="text-slate-500">Goal: 100/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Conversations</span>
                      <span className="text-slate-500">Goal: 50/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Appointments Set</span>
                      <span className="text-slate-500">Goal: 15/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Closes</span>
                      <span className="text-slate-500">Goal: 5/day</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApplyTemplate("door-to-door")}
                    className="w-full bg-[rgba(255,179,0,0.14)] text-[#FFF3D6] hover:bg-[rgba(255,179,0,0.24)]"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[rgba(24,24,24,0.7)] text-white shadow-none transition-all hover:border-[#FF5722]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Phone className="h-5 w-5 text-[#FF5722]" />
                    Virtual Sales
                  </CardTitle>
                  <CardDescription className="text-slate-400">For remote closers and SDR teams.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Calls Made</span>
                      <span className="text-slate-500">Goal: 80/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Connects</span>
                      <span className="text-slate-500">Goal: 40/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Appointments Booked</span>
                      <span className="text-slate-500">Goal: 12/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Deals Closed</span>
                      <span className="text-slate-500">Goal: 4/day</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApplyTemplate("virtual-sales")}
                    className="w-full bg-[rgba(255,87,34,0.14)] text-[#FFEDD6] hover:bg-[rgba(255,87,34,0.22)]"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[rgba(24,24,24,0.7)] text-white shadow-none transition-all hover:border-[#94A3B8]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Repeat2 className="h-5 w-5 text-[#94A3B8]" />
                    Hybrid
                  </CardTitle>
                  <CardDescription className="text-slate-400">Mix door knocking, dialing, and follow-up.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Knocks</span>
                      <span className="text-slate-500">Goal: 60/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Calls Made</span>
                      <span className="text-slate-500">Goal: 40/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Total Conversations</span>
                      <span className="text-slate-500">Goal: 60/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Appointments</span>
                      <span className="text-slate-500">Goal: 15/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Closes</span>
                      <span className="text-slate-500">Goal: 5/day</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApplyTemplate("hybrid")}
                    className="w-full bg-[rgba(148,163,184,0.16)] text-white hover:bg-[rgba(148,163,184,0.24)]"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="mb-3 text-slate-500">Or start from scratch</p>
              <Button
                onClick={() => setShowManager(true)}
                className="border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              >
                Create Custom KPIs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <KPIEntryForm
                kpiDefinitions={kpiDefinitions}
                todayEntries={todayEntries}
                onEntrySaved={handleEntrySaved}
              />
            </div>

            <div>
              <Card className="border-white/10 bg-[rgba(24,24,24,0.7)] shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5 text-[#FFB300]" />
                    Today&apos;s Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kpiDefinitions
                      .filter((kpi, index, self) => index === self.findIndex((t) => t.label === kpi.label))
                      .map((kpi) => {
                        const entry = todayEntries.find((e) => e.kpi_definition_id === kpi.id)
                        const value = entry?.value || 0
                        const target = kpi.target_value || 0
                        const percentage = target > 0 ? Math.min((value / target) * 100, 100) : 0

                        return (
                          <div key={kpi.id}>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="font-medium text-slate-300">{kpi.label}</span>
                              <span className="text-slate-500">
                                {value} / {target}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-800">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  percentage >= 100
                                    ? "bg-[linear-gradient(90deg,#FF5722,#FFB300)]"
                                    : percentage >= 75
                                      ? "bg-[#FF5722]"
                                      : percentage >= 50
                                        ? "bg-[#FFB300]"
                                        : "bg-[#475569]"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <KPIAnalytics kpiDefinitions={kpiDefinitions} />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

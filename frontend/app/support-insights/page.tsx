"use client"

import { FeatureGate } from "@/components/auth/FeatureGate"
import { AppShell } from "@/components/platform/app-shell"
import { SupportAnalyticsDashboard } from "@/components/platform/support-analytics-dashboard"

export default function SupportInsightsPage() {
  return (
    <FeatureGate allowedRoles={["admin", "manager", "super_admin", "dealer_admin", "branch_manager", "trainer"]}>
      <AppShell heading="Support Insights" subheading="Trainee support usage, feedback quality & AI coaching analytics">
        <SupportAnalyticsDashboard />
      </AppShell>
    </FeatureGate>
  )
}

import { PlatformPlaceholderPage } from "@/components/platform/placeholder-page"
import { MessagesSquare, Users, Workflow } from "lucide-react"

export default function TeamHubPage() {
  return (
    <PlatformPlaceholderPage
      heading="Team Hub"
      subheading="Manager coordination, team coaching, and shared execution rituals for high-performing sales orgs."
      badge="Manager workspace"
      badgeTone="lime"
      primaryAction={{ label: "Return to dashboard", href: "/dashboard" }}
      stats={[
        { label: "Active Reps", value: "24", change: "4 need intervention today", icon: Users },
        { label: "Coach Notes", value: "17", change: "5 unread", icon: MessagesSquare },
        { label: "Team Workflows", value: "8", change: "2 automations added", icon: Workflow, accent: "lime" },
      ]}
      focusPoints={[
        {
          title: "Manager huddles",
          body: "Daily standups, challenge assignments, and coaching queues can live here with clear operational visibility.",
        },
        {
          title: "Rep oversight",
          body: "Focus flags, certification blockers, and simulator review requests can reuse the existing status-card patterns.",
        },
        {
          title: "Enterprise collaboration",
          body: "Shared best practices, region comparisons, and enablement announcements can fit the shell without more layout churn.",
        },
      ]}
    />
  )
}

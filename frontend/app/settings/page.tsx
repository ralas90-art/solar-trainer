import { PlatformPlaceholderPage } from "@/components/platform/placeholder-page"
import { Bell, Lock, SlidersHorizontal } from "lucide-react"

export default function SettingsPage() {
  return (
    <PlatformPlaceholderPage
      heading="Settings"
      subheading="Profile controls, notifications, permissions, and workspace configuration for SeptiVolt operators."
      badge="Workspace controls"
      primaryAction={{ label: "Back to dashboard", href: "/dashboard" }}
      stats={[
        { label: "Notification Rules", value: "9", change: "2 simulator alerts active", icon: Bell },
        { label: "Permission Sets", value: "4", change: "Manager + rep scopes", icon: Lock, accent: "lime" },
        { label: "Workspace Presets", value: "3", change: "Enterprise defaults ready", icon: SlidersHorizontal },
      ]}
      focusPoints={[
        {
          title: "User preferences",
          body: "This route can hold timezone, language, theme, and notification settings while preserving the shell.",
        },
        {
          title: "Role controls",
          body: "Manager, admin, and enterprise permission controls can drop into the same card system without redesign.",
        },
        {
          title: "Brand-safe configuration",
          body: "The Electric High Voltage visual system remains intact while workspace-level settings expand underneath it.",
        },
      ]}
    />
  )
}

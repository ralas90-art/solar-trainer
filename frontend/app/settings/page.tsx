import { PlatformPlaceholderPage } from "@/components/platform/placeholder-page"
import { WHITE_LABEL } from "@/lib/white-label.config"

export default function SettingsPage() {
  return (
    <PlatformPlaceholderPage
      heading="Settings"
      subheading={`Profile controls, notifications, permissions, and workspace configuration for ${WHITE_LABEL.companyName} operators.`}
      badge="Workspace controls"
      primaryAction={{ label: "Go to Company Settings", href: "/settings/company" }}
      stats={[
        { label: "Notification Rules", value: "9", change: "2 simulator alerts active", iconKey: "bell" },
        { label: "Permission Sets", value: "4", change: "Manager + rep scopes", iconKey: "lock", accent: "lime" },
        { label: "Workspace Presets", value: "3", change: "Enterprise defaults ready", iconKey: "sliders" },
      ]}
      focusPoints={[
        {
          title: "White-Label Customization",
          body: "Manage your company's CRM, Proposal Tools, and Branding colors seamlessly inside Company Settings.",
        },
        {
          title: "Role controls",
          body: "Manager, admin, and enterprise permission controls can drop into the same card system without redesign.",
        },
        {
          title: "User preferences",
          body: "This route will hold timezone, language, theme, and notification settings while preserving the shell.",
        },
      ]}
    />
  )
}

import {
  Activity,
  Award,
  BarChart3,
  Bot,
  Gauge,
  Home,
  Settings,
  Target,
  Trophy,
  Users,
} from "lucide-react"

export type PlatformNavItem = {
  href: string
  label: string
  icon: typeof Home
  badge?: string
}

export const platformNavItems: PlatformNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/my-training", label: "My Training", icon: Gauge },
  { href: "/ai-simulator", label: "AI Simulator", icon: Bot, badge: "Live" },
  { href: "/kpis", label: "KPI Tracker", icon: Target, badge: "New" },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/certifications", label: "Certifications", icon: Award },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/team-hub", label: "Team Hub", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
]

export const utilityHighlights = [
  {
    label: "Daily Streak",
    value: "18 days",
    icon: Activity,
  },
  {
    label: "Current Level",
    value: "Closer L12",
    icon: Trophy,
  },
]

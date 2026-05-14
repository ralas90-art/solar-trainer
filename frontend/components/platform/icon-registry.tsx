"use client"

import { 
  Bell, 
  Lock, 
  SlidersHorizontal, 
  Zap, 
  Sparkles, 
  Target, 
  Trophy, 
  Crown, 
  Users, 
  LucideIcon,
  HelpCircle
} from "lucide-react"

export const ICON_MAP: Record<string, LucideIcon> = {
  bell: Bell,
  lock: Lock,
  sliders: SlidersHorizontal,
  zap: Zap,
  sparkles: Sparkles,
  target: Target,
  trophy: Trophy,
  crown: Crown,
  users: Users,
}

export function DynamicIcon({ 
  iconKey, 
  className 
}: { 
  iconKey?: string, 
  className?: string 
}) {
  if (!iconKey) return null
  
  const Icon = ICON_MAP[iconKey as keyof typeof ICON_MAP] || HelpCircle
  return <Icon className={className} />
}

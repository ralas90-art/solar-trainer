"use client"

import React from "react"
import { useAuth, UserRole, PlanTier } from "@/context/AuthContext"

interface FeatureGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  allowedRoles?: UserRole[]
  allowedTiers?: PlanTier[]
}

export function FeatureGate({ 
  children, 
  fallback = null, 
  allowedRoles, 
  allowedTiers 
}: FeatureGateProps) {
  const { user } = useAuth()

  if (!user) return <>{fallback}</>

  const isRoleAllowed = !allowedRoles || allowedRoles.includes(user.role)
  const isTierAllowed = !allowedTiers || allowedTiers.includes(user.planTier)

  if (isRoleAllowed && isTierAllowed) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

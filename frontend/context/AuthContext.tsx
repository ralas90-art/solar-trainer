"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "manager" | "sales_rep"
export type PlanTier = "starter" | "growth" | "enterprise"

interface User {
  username: string
  role: UserRole
  planTier: PlanTier
  companyId: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem("septivolt_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("septivolt_user")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("septivolt_user", JSON.stringify(userData))
    router.push("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("septivolt_user")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

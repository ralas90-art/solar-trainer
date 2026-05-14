"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WHITE_LABEL } from "@/lib/white-label.config"

const getStorageKey = (key: string) => `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_${key}`

export type UserRole = "admin" | "manager" | "sales_rep"
export type PlanTier = "starter" | "growth" | "enterprise"

interface User {
  id: string
  email: string
  role: UserRole
  companyId: string
  planTier: PlanTier
  token?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem(getStorageKey("user"))
    const token = localStorage.getItem(getStorageKey("token"))
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser({ ...parsedUser, token })
      } catch (e) {
        localStorage.removeItem(getStorageKey("user"))
        localStorage.removeItem(getStorageKey("token"))
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    const userToSave = { ...userData }
    delete userToSave.token // Don't save token inside the user object in localStorage if redundant
    
    setUser({ ...userData, token })
    localStorage.setItem(getStorageKey("user"), JSON.stringify(userToSave))
    localStorage.setItem(getStorageKey("token"), token)
    router.push("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(getStorageKey("user"))
    localStorage.removeItem(getStorageKey("token"))
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

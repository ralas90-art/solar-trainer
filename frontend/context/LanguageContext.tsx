"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from "./AuthContext"
import { Language, getLanguagePreference, setLanguagePreference } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isSpanish: boolean
  loading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [language, setLanguageState] = useState<Language>("en")
  const [loading, setLoading] = useState(true)
  const isLoadedRef = useRef(false)

  // 1. Initial mount: load preference from localStorage or browser
  useEffect(() => {
    const initialLang = getLanguagePreference()
    setLanguageState(initialLang)
    setLoading(false)
  }, [])

  // 2. Fetch language preference from backend on login
  useEffect(() => {
    if (!user?.username) {
      isLoadedRef.current = false
      return
    }

    // Prevent re-fetching if we already successfully synced for this user session
    if (isLoadedRef.current) return

    const fetchBackendPreference = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(user.username)}/onboarding`,
          { credentials: "include" }
        )
        if (res.ok) {
          const data = await res.json()
          if (data?.tasks && typeof data.tasks.language === "string") {
            const backendLang = data.tasks.language as Language
            if (backendLang === "en" || backendLang === "es") {
              setLanguageState(backendLang)
              setLanguagePreference(backendLang)
              isLoadedRef.current = true
            }
          }
        }
      } catch (err) {
        console.error("[LanguageContext] Failed to fetch backend language preference:", err)
      }
    };

    fetchBackendPreference()
  }, [user?.username])

  // 3. Setter function to update state, localStorage, and backend
  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang)
    setLanguagePreference(newLang)

    // Trigger storage event manually so other tabs/hooks notice
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "septivolt_language",
          newValue: newLang,
        })
      )
    } catch (e) {}

    // Sync to backend if authenticated
    if (user?.username) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(user.username)}/language`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-User-Id": user.username,
            },
            body: JSON.stringify({ language: newLang }),
            credentials: "include",
          }
        )
      } catch (err) {
        console.error("[LanguageContext] Failed to sync language preference to backend:", err)
      }
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isSpanish: language === "es",
        loading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

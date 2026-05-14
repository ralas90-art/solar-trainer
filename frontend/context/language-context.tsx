"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { WHITE_LABEL } from "@/lib/white-label.config"

const STORAGE_KEY = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_locale`

type Locale = "en" | "es"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, translations: Record<Locale, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale
    if (savedLocale === "en" || savedLocale === "es") {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  // Simple helper to pick the right translation from a provided map
  const t = (key: string, translations: Record<Locale, string>) => {
    return translations[locale] || translations["en"] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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

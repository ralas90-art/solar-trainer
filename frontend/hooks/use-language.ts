"use client"

import { useState, useEffect } from "react"
import { getLanguagePreference, setLanguagePreference, Language } from "@/lib/i18n"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Read language preference on client mount
    setLanguage(getLanguagePreference())

    // Sync language state if it changes in other tabs or windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "septivolt_language") {
        const value = e.newValue as Language
        if (value === "en" || value === "es") {
          setLanguage(value)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang)
    setLanguagePreference(newLang)
  };

  return {
    language,
    setLanguage: changeLanguage,
    isSpanish: language === "es"
  }
}

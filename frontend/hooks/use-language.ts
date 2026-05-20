"use client"

import { useLanguage as useGlobalLanguage } from "@/context/LanguageContext"
import { Language } from "@/lib/i18n"

export function useLanguage() {
  const { language, setLanguage, isSpanish } = useGlobalLanguage()

  return {
    language,
    setLanguage,
    isSpanish,
  }
}

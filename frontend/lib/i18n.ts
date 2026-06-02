import { en } from "./translations/en";
import { es } from "./translations/es";

export type Language = 'en' | 'es';

const translations = { en, es };

/**
 * Helper to display readable fallback labels for missing translations or raw path strings.
 */
export function safeDisplayLabel(translatedValue: string, rawKey: string): string {
  if (!translatedValue || translatedValue.includes("FUNNEL.") || translatedValue.includes("funnel.")) {
    const lastSegment = rawKey.includes('.') ? rawKey.split('.').pop() || rawKey : rawKey;
    return lastSegment
      .replace(/_/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  return translatedValue;
}

/**
 * Resolve a translation key for a given language.
 * Supports nested keys via dot notation (e.g. 'funnel.title').
 * Supports variable replacement via object (e.g. { name: 'John' }).
 */
export function t(key: string, lang: Language = 'en', variables?: Record<string, string>): string {
  const keys = key.split('.');
  let result: any = translations[lang];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Fallback to English if key missing in Spanish
      if (lang === 'es') {
        return t(key, 'en', variables);
      }
      return safeDisplayLabel("", key);
    }
  }

  if (typeof result !== 'string') {
    return safeDisplayLabel("", key);
  }

  // Replace variables
  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      result = result.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
    });
  }

  return safeDisplayLabel(result, key);
}

/**
 * Persist language preference to localStorage.
 */
export function setLanguagePreference(lang: Language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('septivolt_language', lang);
}

/**
 * Get language preference from localStorage or navigator.
 */
export function getLanguagePreference(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('septivolt_language') as Language;
  if (stored === 'en' || stored === 'es') return stored;
  
  // Detect from browser
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
}

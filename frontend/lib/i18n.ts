import { en } from "./translations/en";
import { es } from "./translations/es";

export type Language = 'en' | 'es';

const translations = { en, es };

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
      // Defensive fallback: format the last segment of the key cleanly
      const lastSegment = keys[keys.length - 1] || key;
      return lastSegment
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  if (typeof result !== 'string') {
    const lastSegment = keys[keys.length - 1] || key;
    return lastSegment
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Replace variables
  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      result = result.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
    });
  }

  return result;
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

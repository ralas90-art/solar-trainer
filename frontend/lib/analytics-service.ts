/**
 * SeptiVolt Analytics & Persistence Service
 * 
 * Centralized utility for:
 * - UTM Attribution Tracking
 * - Funnel Event Logging
 * - LocalStorage Progress Persistence
 */

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  device_type?: string;
  browser?: string;
}

export interface FunnelState {
  currentStep: number;
  answers: Record<string, string>;
  startTime: number;
  lastUpdated: number;
}

const STORAGE_KEYS = {
  ATTRIBUTION: 'septivolt_attribution',
  FUNNEL_STATE: 'septivolt_funnel_progress',
  SUBMISSION_LOCK: 'septivolt_submitted'
};

/**
 * Capture and persist UTM parameters and referrer information.
 */
export function captureAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const existing = getAttribution();

  const current: AttributionData = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname,
    device_type: getDeviceType(),
    browser: getBrowserInfo()
  };

  // Merge with existing but prioritize current if UTMs are present
  const merged = { ...existing, ...Object.fromEntries(Object.entries(current).filter(([_, v]) => v !== undefined)) };
  
  localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(merged));
  return merged;
}

export function getAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Persist funnel progress to localStorage.
 */
export function saveFunnelProgress(state: Partial<FunnelState>) {
  if (typeof window === 'undefined') return;
  const existing = loadFunnelProgress() || { currentStep: 0, answers: {}, startTime: Date.now(), lastUpdated: Date.now() };
  const updated = { ...existing, ...state, lastUpdated: Date.now() };
  localStorage.setItem(STORAGE_KEYS.FUNNEL_STATE, JSON.stringify(updated));
}

export function loadFunnelProgress(): FunnelState | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.FUNNEL_STATE);
  return stored ? JSON.parse(stored) : null;
}

export function clearFunnelProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.FUNNEL_STATE);
}

/**
 * Submission Lock to prevent duplicates.
 */
export function setSubmissionLock(email: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SUBMISSION_LOCK, JSON.stringify({ email, timestamp: Date.now() }));
}

export function isAlreadySubmitted(email: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSION_LOCK);
  if (!stored) return false;
  const lock = JSON.parse(stored);
  return lock.email === email && (Date.now() - lock.timestamp < 1000 * 60 * 60 * 24); // 24h lock
}

/**
 * Event Tracking (Console only for now, extensible to GA4/Mixpanel later).
 */
export function trackEvent(name: string, properties: Record<string, any> = {}) {
  const lang = typeof window !== 'undefined' ? localStorage.getItem('septivolt_lang_preference') || 'en' : 'en';
  
  const metadata = {
    ...properties,
    ...getAttribution(),
    language: lang,
    timestamp: new Date().toISOString()
  };
  
  // Logic for external analytics can be injected here
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${name}:`, metadata);
  }
}

// --- Internal Helpers ---

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
  return "desktop";
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chrome/")) return "chrome";
  if (ua.includes("Safari/")) return "safari";
  return "other";
}

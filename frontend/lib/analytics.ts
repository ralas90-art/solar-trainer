/**
 * Analytics Utility for Training Hub
 * Prepares tracking hooks for Phase 2 insights.
 */
import { WHITE_LABEL } from "@/lib/white-label.config"

type TrainingEvent = 
  | 'module_started'
  | 'module_completed'
  | 'module_resumed'
  | 'filter_used'
  | 'search_used'
  | 'language_switched'

interface EventMetadata {
  moduleId?: string
  moduleTitle?: string
  day?: string
  filterType?: string
  filterValue?: string
  searchQuery?: string
  locale?: string
  score?: number
  durationSeconds?: number
}

export function trackEvent(event: TrainingEvent, metadata: EventMetadata = {}) {
  // Get existing analytics from localStorage or initialize
  const analyticsKey = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_analytics_log`
  
  const timestamp = new Date().toISOString()
  const eventLog = {
    event,
    timestamp,
    ...metadata
  }

  // Log to console for development verification
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, eventLog)
  }

  // Simple persistence for local analysis (can be synced to backend later)
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(window.localStorage.getItem(analyticsKey) || "[]")
      // Keep last 100 events locally to avoid storage bloat
      const updated = [eventLog, ...existing].slice(0, 100)
      window.localStorage.setItem(analyticsKey, JSON.stringify(updated))
    } catch (err) {
      console.error("Failed to persist analytics event:", err)
    }
  }

  // Placeholder for external tracking providers (e.g., Mixpanel, PostHog, GA4)
  // if (window.mixpanel) window.mixpanel.track(event, eventLog);
}

export function useAnalytics() {
  return {
    trackModuleStarted: (moduleId: string, moduleTitle: string) => 
      trackEvent('module_started', { moduleId, moduleTitle }),
    
    trackModuleCompleted: (moduleId: string, moduleTitle: string, score?: number) => 
      trackEvent('module_completed', { moduleId, moduleTitle, score }),
    
    trackModuleResumed: (moduleId: string, moduleTitle: string) => 
      trackEvent('module_resumed', { moduleId, moduleTitle }),
    
    trackFilterUsed: (filterType: string, filterValue: string) => 
      trackEvent('filter_used', { filterType, filterValue }),
    
    trackSearchUsed: (searchQuery: string) => 
      trackEvent('search_used', { searchQuery }),
      
    trackLanguageSwitched: (locale: string) =>
      trackEvent('language_switched', { locale })
  }
}

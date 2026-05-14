import { WHITE_LABEL } from "./white-label.config"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Persistence Safety: Block all write operations in demo mode
  if (WHITE_LABEL.isDemoMode) {
    const method = options.method?.toUpperCase() || "GET"
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      console.warn(`[Demo Mode] Blocked ${method} request to ${endpoint}`)
      throw new Error("Demo Mode: Persistence Blocked. No changes will be saved to ensure demo stability.")
    }
  }

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const storageKey = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_token`
  const token = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `API error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
}

// --- White-Label Customization Endpoints ---

export async function getCompanySettings() {
  return api.get<any>("/api/v1/company/profile")
}

export async function updateCompanySettings(payload: any) {
  return api.put<any>("/api/v1/company/profile", payload)
}

export async function renderPreview(content_payload: any, company_overrides?: any) {
  return api.post<any>("/api/v1/preview/render", {
    content_payload,
    company_overrides
  })
}

// --- AI Usage & Analytics Endpoints ---

export async function getAIUsageSummary() {
  return api.get<any>("/api/v1/company/ai-usage/summary")
}

// --- Billing Endpoints ---

export async function getBillingStatus() {
  return api.get<any>("/api/v1/billing/status")
}

export async function createCheckoutSession(tier: string) {
  return api.post<any>("/api/v1/billing/create-checkout-session", { tier })
}

export async function createPortalSession() {
  return api.post<any>("/api/v1/billing/create-portal-session", {})
}

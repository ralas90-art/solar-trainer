/**
 * api-client.ts
 * Centralized fetch wrapper for communicating with the FastAPI backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const start = performance.now()
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const duration = performance.now() - start
    if (typeof window !== "undefined") {
      (window as any).__last_api_latency = duration;
      window.dispatchEvent(new CustomEvent("septivolt_api_latency", { detail: { endpoint, duration } }))
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      let errorMessage = errorData.detail;
      if (typeof errorMessage === 'object') {
          errorMessage = JSON.stringify(errorMessage);
      }
      throw new Error(errorMessage || `API error: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  } catch (error) {
    const duration = performance.now() - start
    if (typeof window !== "undefined") {
      (window as any).__last_api_latency = duration;
      window.dispatchEvent(new CustomEvent("septivolt_api_latency", { detail: { endpoint, duration, error: true } }))
    }
    throw error
  }
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

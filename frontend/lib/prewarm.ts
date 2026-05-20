/**
 * prewarm.ts
 * Eagerly wakes up the backend Render instance.
 * Completely non-blocking and respects throttling constraints.
 */

export function prewarmBackend() {
  if (typeof window === "undefined") return;
  
  const now = Date.now();
  const lastPrewarmSession = sessionStorage.getItem("septivolt_last_prewarm");
  
  // Rule 1: Skip if already pre-warmed in this browser session
  if (lastPrewarmSession) return;
  
  // Rule 2: Skip if pre-warmed on another tab within the last 3 minutes
  const lastPrewarmLocal = localStorage.getItem("septivolt_last_prewarm_time");
  if (lastPrewarmLocal && now - parseInt(lastPrewarmLocal, 10) < 180000) {
    return;
  }

  // Update timestamps
  sessionStorage.setItem("septivolt_last_prewarm", "true");
  localStorage.setItem("septivolt_last_prewarm_time", now.toString());

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  console.log("[PREWARM] Initiating non-blocking backend wake-up...");
  
  const start = performance.now();
  // Fire-and-forget fetch to avoid blocking render thread
  fetch(`${baseUrl}/api/v1/health`, { 
    mode: "cors",
    credentials: "omit"
  })
    .then((res) => {
      const duration = performance.now() - start;
      if (typeof window !== "undefined") {
        (window as any).__prewarm_latency = duration;
        sessionStorage.setItem("septivolt_prewarm_latency", duration.toFixed(1));
        window.dispatchEvent(new CustomEvent("septivolt_prewarm_latency", { detail: { duration } }));
      }
      if (res.ok) {
        console.log("[PREWARM] Backend wake-up ping completed successfully. Latency:", duration.toFixed(1), "ms");
      } else {
        console.warn("[PREWARM] Backend wake-up ping returned non-2xx status.");
      }
    })
    .catch((err) => {
      const duration = performance.now() - start;
      if (typeof window !== "undefined") {
        (window as any).__prewarm_latency = duration;
        sessionStorage.setItem("septivolt_prewarm_latency", duration.toFixed(1));
        window.dispatchEvent(new CustomEvent("septivolt_prewarm_latency", { detail: { duration } }));
      }
      console.warn("[PREWARM] Backend wake-up ping failed (probably offline/cold startup):", err);
    });
}

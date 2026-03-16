"use client"

import { SimulatorHub } from "@/components/simulator-hub"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { AppShell } from "@/components/platform/app-shell"
import { Loader2 } from "lucide-react"

function SimulatorPageWrapper() {
  const router = useRouter()
  const [userId, setUserId] = useState("trainee")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(window.localStorage.getItem("septivolt_user_id") ?? "trainee")
    }
  }, [])

  return (
    <SimulatorHub 
      tenant={{ id: "default_tenant" }}
      stateCode="CA"
      onBack={() => router.push("/dashboard")}
    />
  )
}

export default function AiSimulatorPage() {
  return (
    <Suspense
      fallback={
        <AppShell heading="AI Simulator" subheading="Loading simulator...">
          <section className="glass-circuit hud-border rounded-[22px] p-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FF5722]" />
            <p className="mt-3 text-sm text-[#CBD5E1]">Preparing simulator interface...</p>
          </section>
        </AppShell>
      }
    >
      <SimulatorPageWrapper />
    </Suspense>
  )
}

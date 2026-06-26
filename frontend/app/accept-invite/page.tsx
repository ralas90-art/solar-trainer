"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { User, Lock, Mail, ShieldCheck, Zap, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

function OnboardingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  
  const token = searchParams.get("token") || ""
  
  const [isValidating, setIsValidating] = useState(true)
  const [inviteData, setInviteData] = useState<any>(null)
  const [error, setError] = useState("")
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Validate Token on mount
  useEffect(() => {
    if (!token) {
      setError("No onboarding token provided. Please verify your invitation link.")
      setIsValidating(false)
      return
    }

    api.post<any>("/api/v1/invitations/validate", { token })
      .then((data) => {
        setInviteData(data)
        // Pre-fill username with email prefix as suggestion
        if (data.email) {
          setUsername(data.email.split("@")[0])
        }
      })
      .catch((err: any) => {
        setError(err.message || "Invitation link is invalid or has expired.")
      })
      .finally(() => {
        setIsValidating(false)
      })
  }, [token])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setError("")
    setIsSubmitting(true)

    try {
      const response = await api.post<any>("/api/v1/invitations/accept", {
        token,
        username: username.trim(),
        password: password || undefined
      })

      if (response.status === "ok") {
        // Complete login and redirect
        login({
          username: response.username,
          role: response.role,
          planTier: response.plan_tier,
          companyId: response.company_id,
          temporary_password_required: response.temporary_password_required,
          token: response.token
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding registration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading indicator while checking token hash
  if (isValidating) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-[#00F2FF] animate-spin mx-auto mb-4" />
        <p className="font-hud text-xs uppercase tracking-[0.2em] text-[#64748B]">Verifying Access Token...</p>
      </div>
    )
  }

  // Error state for invalid/expired tokens
  if (error && !inviteData) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-black tracking-tight text-white">Verification Failed</h1>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">{error}</p>
        <div className="pt-4">
          <Link href="/login" className="btn-solar-outline px-6 py-3 text-xs inline-flex items-center gap-2">
            Back to Login Portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl brand-glow-subtle max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F2FF]/10 border border-[#00F2FF]/20 text-[#00F2FF] mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-black tracking-tight text-white">Accept Invitation</h2>
        <p className="text-xs text-slate-400 mt-1">
          You've been invited to join <span className="text-white font-semibold">{inviteData?.company_name}</span> as a <span className="text-[#00F2FF] font-semibold">{inviteData?.role.replace("_", " ").toUpperCase()}</span>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Read-Only Details */}
        <div className="space-y-3 bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-hud uppercase tracking-wider">Email</span>
            <span className="text-white font-mono">{inviteData?.email}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
            <span className="text-slate-500 font-hud uppercase tracking-wider">Name</span>
            <span className="text-white">{inviteData?.first_name} {inviteData?.last_name}</span>
          </div>
        </div>

        {/* Step 2 inputs */}
        <div className="space-y-2">
          <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Set Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jdoe"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Set Password (Optional)</label>
            <span className="text-[10px] text-slate-500">Allows direct logins</span>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !username.trim()}
          className="w-full bg-[#00F2FF] hover:bg-[#00D8E6] disabled:opacity-50 text-[#0B1120] font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#00F2FF]/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Configuring Account...</span>
            </>
          ) : (
            <>COMPLETE ONBOARDING <Zap className="h-4 w-4" /></>
          )}
        </button>
      </form>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black tracking-tight flex items-center justify-center gap-2">
            SEPTIVOLT <span style={{ color: "#ADFF00" }}>OS</span>
          </h1>
          <p className="text-[#94A3B8] mt-1 text-sm">Enterprise Onboarding Terminal</p>
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-[#00F2FF] animate-spin mx-auto mb-4" />
            <p className="font-hud text-xs uppercase tracking-[0.2em] text-[#64748B]">Loading...</p>
          </div>
        }>
          <OnboardingForm />
        </Suspense>

        <p className="mt-8 text-center text-[#475569] text-[10px] font-hud uppercase tracking-widest">
          Secure Tunnel // Global Solar Training Network
        </p>
      </div>
    </div>
  )
}

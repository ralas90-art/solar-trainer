"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getApiUrl } from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  ExternalLink,
  Printer,
  Award,
  Building2,
  GitBranch,
  CalendarDays,
  Eye,
  Loader2,
  ArrowLeft,
  Zap,
} from "lucide-react"

interface VerificationResult {
  isValid: boolean
  status: string
  statusLabel: string
  certificationName: string
  recipientDisplayName: string
  companyName: string
  branchName: string | null
  verificationId: string
  verificationHash: string
  issuedAt: string | null
  expiresAt: string | null
  approvedAt: string | null
  verificationViews: number
  verifiedAt: string
  badgeUrl: string | null
}

function formatDate(iso: string | null): string {
  if (!iso) return "N/A"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function StatusBadge({ status, isValid }: { status: string; isValid: boolean }) {
  if (status === "ACTIVE" && isValid) {
    return (
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-sm tracking-wide">
        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
        Valid & Active
      </div>
    )
  }
  if (status === "EXPIRED") {
    return (
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-sm tracking-wide">
        <Clock className="w-4.5 h-4.5 text-amber-400" />
        Expired
      </div>
    )
  }
  if (status === "REVOKED") {
    return (
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-red-500/15 border border-red-400/30 text-red-300 font-bold text-sm tracking-wide">
        <XCircle className="w-4.5 h-4.5 text-red-400" />
        Revoked
      </div>
    )
  }
  if (status === "PENDING_APPROVAL") {
    return (
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-bold text-sm tracking-wide">
        <AlertTriangle className="w-4.5 h-4.5 text-blue-400" />
        Pending Approval
      </div>
    )
  }
  return null
}

function StatusGlowRing({ isValid, status }: { isValid: boolean; status: string }) {
  if (isValid) {
    return (
      <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-8">
        {/* Outer animated glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-emerald-400/10" />
        <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 shadow-[0_0_40px_rgba(52,211,153,0.4)]">
          <ShieldCheck className="w-12 h-12 text-emerald-400" />
        </div>
      </div>
    )
  }
  if (status === "REVOKED") {
    return (
      <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-2 rounded-full bg-red-400/10" />
        <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-400/60 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
          <ShieldX className="w-12 h-12 text-red-400" />
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-2 rounded-full bg-amber-400/10" />
      <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
        <Clock className="w-12 h-12 text-amber-400" />
      </div>
    </div>
  )
}

export default function VerifyCredentialPage() {
  const params = useParams<{ hash: string }>()
  const hash = params?.hash

  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hash) return
    const apiUrl = getApiUrl()
    setLoading(true)
    fetch(`${apiUrl}/api/v1/certifications/verify/${hash}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.detail || "Credential not found or verification link invalid.")
        }
        return res.json()
      })
      .then((data: VerificationResult) => {
        setResult(data)
        setError(null)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [hash])

  const borderGlow = result?.isValid
    ? "border-emerald-400/25 shadow-[0_0_80px_rgba(52,211,153,0.08)]"
    : result?.status === "REVOKED"
    ? "border-red-400/25 shadow-[0_0_80px_rgba(239,68,68,0.08)]"
    : "border-amber-400/25 shadow-[0_0_80px_rgba(251,191,36,0.08)]"

  return (
    <>
      {/* ── Print styles ─────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-frame { 
            border: 3px solid #1e293b !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }
          .print-frame * { color: #000 !important; }
          .print-title { color: #F97316 !important; font-size: 2rem !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#09090b] flex flex-col">
        {/* ── Top Bar ─────────────────────────────────────────── */}
        <header className="no-print flex items-center justify-between px-6 py-4 border-b border-white/5">
          <Link href="https://www.septivolt.com" className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/30">
              <Zap className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="font-bold text-sm tracking-wide">SeptiVolt</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            Credential Verification Portal
          </div>
        </header>

        {/* ── Main Content ─────────────────────────────────────── */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          {loading && (
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-[#F97316]" />
              <p className="text-sm">Verifying credential...</p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full max-w-lg text-center space-y-6">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-400/30 mx-auto shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                <ShieldX className="w-12 h-12 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white mb-2">Credential Not Found</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Common reasons</p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Verification link has been tampered with</li>
                  <li>• Credential was revoked by the issuing organization</li>
                  <li>• Verification ID does not exist in the SeptiVolt system</li>
                </ul>
              </div>
              <Link href="https://www.septivolt.com" className="inline-flex items-center gap-2 text-sm text-[#F97316] hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Return to SeptiVolt
              </Link>
            </div>
          )}

          {!loading && result && (
            <div className={`w-full max-w-2xl rounded-3xl border bg-[#111114] backdrop-blur-xl p-8 md:p-10 print-frame ${borderGlow}`}>
              {/* Status Ring */}
              <StatusGlowRing isValid={result.isValid} status={result.status} />

              {/* Certification Name */}
              <div className="text-center mb-8">
                <StatusBadge status={result.status} isValid={result.isValid} />
                <h1 className="mt-5 text-3xl md:text-4xl font-black text-white leading-tight print-title">
                  {result.certificationName}
                </h1>
                <p className="mt-2 text-slate-400 text-sm">
                  SeptiVolt Professional Credential — Verified {formatDate(result.verifiedAt)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Recipient</span>
                  </div>
                  <p className="text-white font-bold text-sm">{result.recipientDisplayName}</p>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Organization</span>
                  </div>
                  <p className="text-white font-bold text-sm">{result.companyName}</p>
                </div>

                {result.branchName && (
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Branch</span>
                    </div>
                    <p className="text-white font-bold text-sm">{result.branchName}</p>
                  </div>
                )}

                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Issued</span>
                  </div>
                  <p className="text-white font-bold text-sm">{formatDate(result.issuedAt)}</p>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Expires</span>
                  </div>
                  <p className={`font-bold text-sm ${result.expiresAt ? "text-white" : "text-emerald-300"}`}>
                    {result.expiresAt ? formatDate(result.expiresAt) : "Never"}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
                  </div>
                  <p className="text-white font-bold text-sm">{result.verificationViews.toLocaleString()} time{result.verificationViews !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Verification ID */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Verification ID</p>
                <p className="font-mono text-xs text-slate-300 break-all">{result.verificationHash}</p>
              </div>

              {/* Status Message Banner */}
              {result.isValid ? (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/20 px-5 py-4 flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-bold text-sm">This credential is authentic and valid</p>
                    <p className="text-emerald-300/70 text-xs mt-1 leading-relaxed">
                      This certification was issued by SeptiVolt and is currently active. The credential holder has successfully completed the required training, simulation assessments, and manager approval.
                    </p>
                  </div>
                </div>
              ) : result.status === "REVOKED" ? (
                <div className="rounded-2xl bg-red-500/10 border border-red-400/20 px-5 py-4 flex items-start gap-3 mb-6">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-bold text-sm">This credential has been revoked</p>
                    <p className="text-red-300/70 text-xs mt-1 leading-relaxed">
                      This certification is no longer valid. It was revoked by the issuing organization. Please contact the issuer for more information.
                    </p>
                  </div>
                </div>
              ) : result.status === "EXPIRED" ? (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-400/20 px-5 py-4 flex items-start gap-3 mb-6">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-300 font-bold text-sm">This credential has expired</p>
                    <p className="text-amber-300/70 text-xs mt-1 leading-relaxed">
                      This certification has passed its expiration date. The credential holder may need to renew their certification through SeptiVolt.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-blue-500/10 border border-blue-400/20 px-5 py-4 flex items-start gap-3 mb-6">
                  <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-300 font-bold text-sm">Pending manager approval</p>
                    <p className="text-blue-300/70 text-xs mt-1 leading-relaxed">
                      This certification has been earned but is pending final sign-off from the organization's manager or admin.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="no-print flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-slate-300"
                >
                  <Printer className="w-4 h-4" />
                  Save / Print
                </button>
                <Link
                  href={`https://www.septivolt.com/certifications`}
                  target="_blank"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#F97316]/10 hover:bg-[#F97316]/20 border border-[#F97316]/30 rounded-xl transition-all text-[#F97316]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn about SeptiVolt
                </Link>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-slate-600">
                  Powered by{" "}
                  <span className="text-[#F97316] font-semibold">SeptiVolt</span>{" "}
                  — AI-Powered Solar Sales Training Platform
                </p>
                <p className="text-xs text-slate-700 mt-1">
                  This verification is tamper-resistant and cryptographically signed.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

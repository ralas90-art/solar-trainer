"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { ShieldCheck, ArrowRight, Zap, Mail, User as UserIcon, Lock } from "lucide-react"
import Link from "next/link"
import { WHITE_LABEL } from "@/lib/white-label.config"

export default function OnboardingPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [inviteData, setInviteData] = useState<any>(null)
    const [fullName, setFullName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (token) {
            validateInvite()
        }
    }, [token])

    const validateInvite = async () => {
        try {
            const data = await api.get<any>(`/api/v1/invites/${token}`)
            setInviteData(data)
        } catch (err: any) {
            setError(err.message || "Invalid or expired invitation link.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsSubmitting(true)
        try {
            await api.post("/api/v1/invites/accept", {
                token,
                password,
                full_name: fullName
            })
            router.push("/login?msg=Account created! Please login.")
        } catch (err: any) {
            setError(err.message || "Failed to complete onboarding.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Zap className="h-12 w-12 text-[#FF5722] animate-pulse" />
                    <p className="font-hud uppercase tracking-widest text-sm">Synchronizing invitation data...</p>
                </div>
            </div>
        )
    }

    if (error && !inviteData) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-black text-white">LINK EXPIRED OR INVALID</h1>
                    <p className="text-[#94A3B8]">{error}</p>
                    <Link href="/login" className="inline-block text-[#FF5722] font-bold hover:underline">
                        Return to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md my-8">
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] mb-4">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                        WELCOME TO <span className="text-[#FF5722]">{inviteData?.company_name?.toUpperCase() || WHITE_LABEL.companyName.toUpperCase()}</span>
                    </h1>
                    <p className="text-[#94A3B8] mt-2">Complete your profile to join the team</p>
                </div>

                <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5722] opacity-50"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Assigned Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                                <input
                                    type="email"
                                    value={inviteData?.email}
                                    disabled
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-[#475569] cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your Full Name"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Set Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    required
                                    minLength={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-type password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#FF5722] hover:bg-[#FF7043] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#FF5722]/20 flex items-center justify-center gap-2 group"
                        >
                            {isSubmitting ? "Finalizing Account..." : (
                                <>
                                    ACTIVATE ACCOUNT
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-[#475569] text-[10px] font-hud uppercase tracking-widest">
                    Personnel Onboarding // {inviteData?.company_name || WHITE_LABEL.companyName} Secure Node
                </p>
            </div>
        </div>
    )
}

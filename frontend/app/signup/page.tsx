"use client"

import { useState, Suspense } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api-client"
import { Crown, Lock, User as UserIcon, Zap } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SignupForm() {
    const { login } = useAuth()
    const searchParams = useSearchParams()
    const initialTier = (searchParams.get("tier") as any) || "starter"
    const initialRepCount = parseInt(searchParams.get("reps") || "10")

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<"admin" | "manager" | "sales_rep">("sales_rep")
    const [tier, setTier] = useState<"starter" | "growth" | "enterprise">(initialTier)
    const [repCount, setRepCount] = useState(initialRepCount)
    const [companyId, setCompanyId] = useState("septivolt")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            const response = await api.post<any>("/signup", {
                username,
                password,
                role,
                plan_tier: tier,
                company_id: companyId
            })
            if (response.status === "created") {
                // Now create Stripe Checkout Session
                try {
                    const checkoutResponse = await api.post<{ url: string }>("/billing/create-checkout-session", {
                        company_id: response.company_id,
                        tier: tier,
                        rep_count: repCount
                    })
                    
                    if (checkoutResponse.url) {
                        // Success! Save user context but wait for payment to redirect to dashboard
                        login({
                            username: response.username,
                            role: response.role,
                            planTier: tier as any,
                            companyId: response.company_id
                        })
                        // Redirect to Stripe
                        window.location.href = checkoutResponse.url
                        return // Prevent the default dashboard redirection in AuthContext if any
                    }
                } catch (checkoutErr: any) {
                    console.error("Stripe session creation failed", checkoutErr)
                    // Fallback: log them in anyway if stripe fails in dev
                    login({
                        username: response.username,
                        role: response.role,
                        planTier: tier as any,
                        companyId: response.company_id
                    })
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to create account. Username might already exist.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md my-8">
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] mb-4">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                        SEPTIVOLT <span className="text-[#FF5722]">OS</span>
                    </h1>
                    <p className="text-[#94A3B8] mt-2">Create your training account</p>
                </div>

                <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl solar-glow-subtle">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Username</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="choose_username"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Initial Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as any)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                >
                                    <option value="sales_rep" className="bg-[#1A1A1A]">Sales Rep</option>
                                    <option value="manager" className="bg-[#1A1A1A]">Manager</option>
                                    <option value="admin" className="bg-[#1A1A1A]">Admin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Plan Tier</label>
                                <select
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value as any)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                >
                                    <option value="starter" className="bg-[#1A1A1A]">Starter</option>
                                    <option value="growth" className="bg-[#1A1A1A]">Growth</option>
                                    <option value="enterprise" className="bg-[#1A1A1A]">Enterprise</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Company ID</label>
                            <input
                                type="text"
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                placeholder="septivolt"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
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
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF5722] hover:bg-[#FF7043] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#FF5722]/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Creating Account..." : (
                                <>
                                    CREATE ACCOUNT
                                    <Crown className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[#64748B] text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#FF5722] hover:text-[#FF7043] font-semibold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-[#475569] text-[10px] font-hud uppercase tracking-widest">
                    Self-Service Enrollment // Global Solar Training Network
                </p>
            </div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center">Loading...</div>}>
            <SignupForm />
        </Suspense>
    )
}

"use client"

import { useState, Suspense } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api-client"
import { Crown, Lock, User as UserIcon, Zap, Mail, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { WHITE_LABEL } from "@/lib/white-label.config"

function SignupForm() {
    const { login } = useAuth()
    const searchParams = useSearchParams()
    const initialTier = (searchParams.get("tier") as any) || "starter"
    const initialRepCount = parseInt(searchParams.get("reps") || "10")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [tier, setTier] = useState<"starter" | "growth" | "enterprise">(initialTier)
    const [repCount, setRepCount] = useState(initialRepCount)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const company_id = companyName.toLowerCase().replace(/\s+/g, '_') || "new_org"
            
            const response = await api.post<any>("/signup", {
                email,
                password,
                full_name: fullName,
                company_id: company_id,
                role: "manager"
            })
            
            if (response.status === "created") {
                // If it's a paid flow, go to checkout
                // For now, we'll try to create a checkout session
                try {
                    const checkoutResponse = await api.post<{ url: string }>("/billing/create-checkout-session", {
                        company_id: response.company_id,
                        tier: tier,
                        rep_count: repCount
                    })
                    
                    if (checkoutResponse.url) {
                        window.location.href = checkoutResponse.url
                    } else {
                        // fallback to login/dashboard if no URL (e.g. free tier if implemented)
                        window.location.href = "/login?msg=Account created. Please login."
                    }
                } catch (billingErr) {
                    // Fallback to login if billing fails or not configured
                    console.error("Billing error:", billingErr)
                    window.location.href = "/login?msg=Account created. Please login."
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to create account. Please check your details.")
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
                        {WHITE_LABEL.companyName.toUpperCase()} <span className="text-[#FF5722]">OS</span>
                    </h1>
                    <p className="text-[#94A3B8] mt-2">Create your training account</p>
                </div>

                <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] to-[#F59E0B] opacity-50"></div>
                    
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B] ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B] ml-1">Professional Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@organization.com"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B] ml-1">Secure Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B] ml-1">Organization Name</label>
                                <div className="relative">
                                    <Crown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder={`${WHITE_LABEL.industry} Corp LLC`}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#F97316]/5 border border-[#F97316]/10 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316]">Selected Tier</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{tier}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316]">Estimated Reps</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{repCount} Users</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary h-16 rounded-2xl transition-all shadow-xl shadow-[#F97316]/20 flex items-center justify-center gap-3 border-none group"
                            >
                                {isLoading ? "Initializing Checkout..." : (
                                    <>
                                        <span className="font-display font-black text-lg italic uppercase tracking-tighter">Proceed to Secure Checkout</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

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
                    Self-Service Enrollment // Global Training Network
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

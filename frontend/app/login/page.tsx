"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api-client"
import { Crown, Lock, Mail, User as UserIcon, Zap, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

type View = "login" | "forgot" | "forgot-success"

export default function LoginPage() {
    const { login } = useAuth()
    const [view, setView] = useState<View>("login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [resetEmail, setResetEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await api.post<any>("/login", {
                username,
                password,
            })
            if (response.status === "ok") {
                login({
                    username: response.username,
                    role: response.role,
                    planTier: response.plan_tier,
                    companyId: response.company_id
                })
            }
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await api.post<any>("/forgot-password", { email: resetEmail })
            setView("forgot-success")
        } catch (err: any) {
            // Always show success to prevent email enumeration
            setView("forgot-success")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* FORGOT PASSWORD SUCCESS */}
                {view === "forgot-success" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 mb-4">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h1 className="font-display text-3xl font-black tracking-tight">Check Your Email</h1>
                            <p className="text-[#94A3B8] mt-2 text-sm">
                                If an account exists for <span className="text-white font-semibold">{resetEmail}</span>, you'll receive a reset link shortly.
                            </p>
                        </div>
                        <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl text-center">
                            <p className="text-slate-400 text-sm mb-6">Didn't receive it? Check your spam folder or try again.</p>
                            <button
                                onClick={() => { setView("forgot"); setResetEmail(""); }}
                                className="text-[#FF5722] hover:text-[#FF7043] font-semibold text-sm"
                            >
                                Try a different email
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <button onClick={() => setView("login")} className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mx-auto transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Back to Login
                            </button>
                        </div>
                    </>
                )}

                {/* FORGOT PASSWORD FORM */}
                {view === "forgot" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] mb-4">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h1 className="font-display text-3xl font-black tracking-tight">Reset Password</h1>
                            <p className="text-[#94A3B8] mt-2">Enter your email and we'll send a reset link.</p>
                        </div>
                        <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl">
                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                                )}
                                <div className="space-y-2">
                                    <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#FF5722] hover:bg-[#FF7043] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#FF5722]/20"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <button onClick={() => { setView("login"); setError(""); }} className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mx-auto transition-colors">
                                    <ArrowLeft className="w-3 h-3" /> Back to Login
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* LOGIN FORM */}
                {view === "login" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] mb-4">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h1 className="font-display text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                                SEPTIVOLT <span className="text-[#FF5722]">OS</span>
                            </h1>
                            <p className="text-[#94A3B8] mt-2">Login to your training command center</p>
                        </div>

                        <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 shadow-2xl brand-glow-subtle">
                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                                )}

                                <div className="space-y-2">
                                    <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Username</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="your_username"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="font-hud text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => { setView("forgot"); setError(""); }}
                                            className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF5722] hover:text-[#FF7043] transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
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

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#FF5722] hover:bg-[#FF7043] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#FF5722]/20 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Authenticating..." : (
                                        <>ENTER SYSTEM<Crown className="h-4 w-4" /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-[#64748B] text-sm">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="text-[#FF5722] hover:text-[#FF7043] font-semibold">
                                        Request Access
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-[#475569] text-[10px] font-hud uppercase tracking-widest">
                            Authorized Personnel Only // Global Solar Training Network
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

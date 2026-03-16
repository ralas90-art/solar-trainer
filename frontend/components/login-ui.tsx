"use client"

import { useState } from "react"
import { getApiUrl } from "@/lib/utils"
import { Loader2, Zap, Lock, User, MapPin, ChevronRight } from "lucide-react"

export function AuthForm({ onLogin }: { onLogin: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [selectedState, setSelectedState] = useState("CA")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!username || !password) { setError("Please enter username and password"); return }
        setError("")
        setIsLoading(true)
        const endpoint = isLogin ? "/login" : "/signup"
        const API_URL = getApiUrl().replace(/\/+$/, "")
        const requestUrl = `${API_URL}${endpoint}`
        try {
            const controller = new AbortController()
            const timeout = window.setTimeout(() => controller.abort(), 12000)
            const res = await fetch(requestUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                signal: controller.signal,
            })
            window.clearTimeout(timeout)

            const raw = await res.text()
            let data: any = null
            try {
                data = raw ? JSON.parse(raw) : null
            } catch {
                data = null
            }

            if (!res.ok) {
                const detail = data?.detail || data?.message || raw || "Authentication failed"
                throw new Error(`Auth request failed (${res.status}): ${detail}`)
            }

            if (!data?.username) {
                throw new Error("Auth response missing username. Verify backend /login and /signup response shape.")
            }

            onLogin({
                id: data.username, name: data.username, username: data.username,
                tenant: { id: "1", name: "SeptiVolt", allowed_states: [selectedState, "CA", "NY"], brand_color: "bg-cyan-500" }
            })
        } catch (err: any) {
            const isAbort = err?.name === "AbortError"
            if (isAbort) {
                setError(`Auth request timed out. Backend may be unavailable at ${requestUrl}.`)
            } else if (err instanceof TypeError) {
                setError(
                    `Cannot reach auth server at ${API_URL}. Set NEXT_PUBLIC_API_URL and ensure backend is running (e.g. http://localhost:8000).`
                )
            } else {
                setError(err.message || "Authentication error")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass = `
        w-full bg-[#121212] border border-[rgba(255,87,34,0.2)] rounded-lg px-4 py-3 pl-10
        text-white placeholder-[#94A3B8] font-body text-sm
        focus:outline-none focus:border-[#FF5722] focus:shadow-[0_0_12px_rgba(255,87,34,0.25)]
        transition-all duration-200
    `

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
            style={{ background: '#121212' }}>

            {/* Background layers */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Circuit grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23FF5722' stroke-width='0.5' fill='none'%3E%3Crect width='60' height='60'/%3E%3Cline x1='30' y1='0' x2='30' y2='60'/%3E%3Cline x1='0' y1='30' x2='60' y2='30'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                {/* Volt cyan radial glow top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(255,87,34,0.07) 0%, transparent 70%)' }} />
                {/* Hyper lime radial glow bottom right */}
                <div className="absolute bottom-0 right-0 w-[400px] h-[300px]"
                    style={{ background: 'radial-gradient(ellipse at bottom right, rgba(255,179,0,0.05) 0%, transparent 70%)' }} />
            </div>

            {/* 7-dot day indicators — decorative */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < 3 ? 'bg-[#FF5722] shadow-[0_0_8px_rgba(255,87,34,0.8)]' : 'bg-[#1E293B] border border-[rgba(255,87,34,0.2)]'}`} />
                ))}
            </div>

            {/* Main login card */}
            <div className="relative w-full max-w-md mx-4">
                {/* Card outer glow */}
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-20"
                    style={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.3), rgba(255,179,0,0.1))' }} />

                <div className="relative glass-circuit rounded-2xl p-8 hud-border">

                    {/* Logo / Wordmark */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 relative"
                            style={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.15), rgba(255,87,34,0.05))', border: '1px solid rgba(255,87,34,0.3)' }}>
                            <div className="absolute inset-0 rounded-xl animate-solar-pulse" />
                            <Zap className="w-7 h-7 relative z-10" style={{ color: '#FF5722', filter: 'drop-shadow(0 0 8px #FF5722)' }} />
                        </div>
                        <h1 className="font-display text-3xl font-black tracking-tight text-white">
                            Septi<span style={{ color: '#FF5722', textShadow: '0 0 20px rgba(255,87,34,0.6)' }}>Volt</span>
                        </h1>
                        <p className="font-hud text-xs mt-1" style={{ color: '#94A3B8', letterSpacing: '0.15em' }}>
                            ELITE SOLAR SALES TRAINING
                        </p>
                    </div>

                    {/* Tab Switch */}
                    <div className="flex rounded-lg mb-6 p-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,87,34,0.1)' }}>
                        {['Sign In', 'Sign Up'].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => { setIsLogin(i === 0); setError("") }}
                                className={`flex-1 py-2 rounded-md text-sm font-display font-semibold transition-all duration-200 ${isLogin === (i === 0)
                                        ? 'text-[#121212] shadow-md'
                                        : 'text-[#94A3B8] hover:text-white'
                                    }`}
                                style={isLogin === (i === 0) ? {
                                    background: 'linear-gradient(135deg, #FF5722, #00c8d4)',
                                    boxShadow: '0 0 16px rgba(255,87,34,0.4)'
                                } : {}}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-4 w-4" style={{ color: '#94A3B8' }} />
                            <input
                                id="username"
                                placeholder="Username"
                                className={inputClass}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4" style={{ color: '#94A3B8' }} />
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className={inputClass}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        {!isLogin && (
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-4 w-4" style={{ color: '#94A3B8' }} />
                                <select
                                    id="state"
                                    className={inputClass}
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="CA">California (NEM 3.0)</option>
                                    <option value="NY">New York (Tax Credits)</option>
                                    <option value="TX">Texas (Deregulated)</option>
                                    <option value="FL">Florida (Net Metering)</option>
                                </select>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 text-sm rounded-lg text-center font-body"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-solar w-full py-3 flex items-center justify-center gap-2 font-display font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <>
                                    {isLogin ? 'Access Training' : 'Create Account'}
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center font-hud text-xs" style={{ color: '#94A3B8', letterSpacing: '0.08em' }}>
                        © 2025 SeptiVolt · 7-Day Solar Sales Accelerator
                    </p>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        const redirect = setTimeout(() => {
            router.push("/dashboard")
        }, 5000)

        return () => {
            clearInterval(timer)
            clearTimeout(redirect)
        }
    }, [router])

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 border border-green-500/20 text-green-500 mb-8 solar-glow-subtle" style={{ "--glow-color": "rgba(34, 197, 94, 0.2)" } as any}>
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <h1 className="font-display text-4xl font-black tracking-tight mb-4 uppercase">
                    Payment <span className="text-green-500">Confirmed</span>
                </h1>
                
                <p className="text-[#94A3B8] mb-8 text-lg">
                    Welcome to the Septivolt Training Network. Your account access has been provisioned.
                </p>

                <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 mb-8 text-left">
                    <div className="flex items-center gap-3 text-sm text-[#64748B] mb-2 font-hud uppercase tracking-widest">
                        <Zap className="h-4 w-4 text-[#FF5722]" /> Order Details
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[#94A3B8]">Session ID</span>
                        <span className="text-xs font-mono text-white truncate max-w-[150px]">{sessionId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-[#94A3B8]">Status</span>
                        <span className="text-green-500 font-bold uppercase text-xs">Active</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link 
                        href="/dashboard"
                        className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#FF5722] hover:bg-[#FF7043] text-white font-bold transition-all shadow-lg shadow-[#FF5722]/20"
                    >
                        ENTER DASHBOARD
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    
                    <p className="text-[#475569] text-xs font-hud uppercase tracking-widest mt-6">
                        Redirecting in {countdown} seconds...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}

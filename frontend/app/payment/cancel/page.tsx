"use client"

import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 mb-8 solar-glow-subtle" style={{ "--glow-color": "rgba(239, 68, 68, 0.2)" } as any}>
                    <XCircle className="h-10 w-10" />
                </div>
                
                <h1 className="font-display text-4xl font-black tracking-tight mb-4 uppercase">
                    Payment <span className="text-red-500">Cancelled</span>
                </h1>
                
                <p className="text-[#94A3B8] mb-12 text-lg">
                    The payment process was not completed. Your account is still pending activation.
                </p>

                <div className="space-y-4">
                    <Link 
                        href="/pricing"
                        className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#FF5722] hover:bg-[#FF7043] text-white font-bold transition-all shadow-lg shadow-[#FF5722]/20"
                    >
                        <RefreshCw className="h-4 w-4" />
                        RETRY PAYMENT
                    </Link>
                    
                    <Link 
                        href="/"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white transition-all border border-white/5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        BACK TO HOME
                    </Link>
                </div>
                
                <p className="mt-12 text-[#475569] text-[10px] font-hud uppercase tracking-[0.2em]">
                    Septivolt Secure Billing // Transaction Termination
                </p>
            </div>
        </div>
    )
}

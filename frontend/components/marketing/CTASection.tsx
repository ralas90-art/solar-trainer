"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[#FF5722]/5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5722]/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 mb-8">
                    <Zap className="w-3 h-3 text-[#F97316]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316] font-display">AI Sales Readiness</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display italic uppercase">
                    Ready to Stop Burning Leads?
                </h2>
                <p className="text-xl text-slate-400 mb-4 max-w-2xl mx-auto">
                    Join the top solar teams using AI simulation to certify their reps and close more deals.
                </p>
                <p className="text-sm text-slate-500 mb-10 font-body">
                    Answer 8 quick questions and SeptiVolt will build your team&apos;s custom training roadmap — free.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/solar-sales-training-assessment?source=cta_section&type=general" className="w-full sm:w-auto">
                        <Button size="lg" className="btn-primary w-full sm:w-auto h-14 px-10 text-lg rounded-full flex items-center justify-center gap-2">
                            Start AI Readiness Assessment
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/pricing" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-white/20 text-white bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center">
                            View Pricing <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
                <p className="mt-6 text-sm text-slate-500">
                    Takes about 2 minutes · Free · No credit card required
                </p>
            </div>
        </section>
    )
}

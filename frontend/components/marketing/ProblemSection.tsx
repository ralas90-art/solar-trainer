"use client"

import { AlertTriangle, UserX, EyeOff, FileQuestion, HelpCircle, Clock, BarChart } from "lucide-react"

export function ProblemSection() {
    const problems = [
        {
            icon: UserX,
            title: "Reps Quit Before Selling",
            desc: "Without realistic roleplay, new recruits freeze on the doors and quit before writing their first contract."
        },
        {
            icon: EyeOff,
            title: "Managers are Blind",
            desc: "Managers don't know who is actually ready to represent the company until they start burning expensive leads."
        },
        {
            icon: AlertTriangle,
            title: "Inconsistent Training",
            desc: "Sales standards vary from office to office. New reps copy outdated scripts from older reps."
        },
        {
            icon: FileQuestion,
            title: "Scripts are Scattered",
            desc: "Door-knock scripts, phone scripts, and objection sheets are scattered in Slack channels, notes, and local PDFs."
        },
        {
            icon: Clock,
            title: "Manager Time Drain",
            desc: "Your top closers and sales managers waste valuable sales hours hand-holding recruits instead of closing deals."
        },
        {
            icon: BarChart,
            title: "Zero Readiness Tracking",
            desc: "No metrics or certification system exists to verify if a rep understands the local utility rate structures."
        }
    ]

    return (
        <section id="problem" className="py-24 px-6 lg:px-20 bg-slate-950/40 border-t border-white/5 relative overflow-hidden">
            {/* Soft ambient warning glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-black uppercase tracking-widest font-display mb-4">
                        The Solar Industry Reality
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic font-display mb-4 leading-none">
                        Most Solar Teams Don’t Have a Training Problem. <br/>
                        <span className="text-[#F97316]">They Have a Readiness Problem.</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light font-body leading-relaxed text-base">
                        Giving reps access to a library of videos isn't enough. Without muscle memory, real-time critique, and structured metrics, sales readiness remains unverified.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {problems.map((prob, idx) => {
                        const Icon = prob.icon
                        return (
                            <div key={idx} className="glass-card bg-[#121212]/50 border border-white/5 p-8 rounded-2xl hover:border-red-500/30 transition-all duration-300">
                                <div className="flex gap-4 items-start">
                                    <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="font-display font-black uppercase text-sm tracking-wide text-white">
                                            {prob.title}
                                        </h3>
                                        <p className="text-slate-400 font-body text-xs leading-relaxed font-light">
                                            {prob.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA Block */}
                <div className="mt-16 text-center">
                    <a
                        href="/solar-sales-training-assessment?source=problem&type=general"
                        className="inline-flex items-center gap-3 px-8 py-4 border border-[#F97316]/40 bg-[#F97316]/5 hover:bg-[#F97316]/10 hover:border-[#F97316]/70 transition-all text-white font-display font-black uppercase tracking-widest text-xs"
                    >
                        Start AI Readiness Assessment
                        <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                    <p className="mt-4 text-slate-600 text-xs font-body">Takes about 2 minutes · No credit card required</p>
                </div>

            </div>
        </section>
    )
}

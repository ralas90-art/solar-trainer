"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Zap, Award, MapPin } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[var(--brand-primary-dim)] blur-[120px] rounded-full -z-10 opacity-20" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--brand-primary-dim)] border border-[var(--brand-primary)]/20 mb-10">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        High-Performance Training
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-white mb-8 max-w-5xl mx-auto italic font-display">
                    The 7-Day Path to <br />
                    <span className="text-[var(--brand-primary)]">Solar Mastery.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light font-body">
                    Restructured for <span className="text-white font-bold underline decoration-[var(--brand-accent)]/30 underline-offset-4">Maximum Speed-to-Revenue.</span> <br className="hidden md:block" />
                    Transform from a salesperson into a Solar Consultant in one week.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-6 justify-center">
                    <Link href="/solar-sales-training-assessment">
                        <Button size="lg" className="btn-primary h-16 px-10 text-xl flex items-center gap-3 border-none group">
                            Take Free Audit
                            <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/curriculum-preview">
                        <Button size="lg" variant="outline" className="btn-outline-solar h-16 px-10 text-xl flex items-center gap-3">
                            View Curriculum
                        </Button>
                    </Link>
                </div>

                {/* Trust Section — replaced placeholder logos with real proof */}
                <div className="mt-24 pt-10 border-t border-white/5">
                    {/* Proof Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-black text-[var(--brand-primary)] metrics-font">7 Days</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">To First Deal</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-black text-[var(--brand-primary)] metrics-font">50+</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Roleplay Scenarios</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-black text-[var(--brand-primary)] metrics-font">40%</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Close Rate Lift</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-black text-[var(--brand-primary)] metrics-font">24h</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rep Onboarding</span>
                        </div>
                    </div>

                    {/* Category Badges */}
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Built for Solar Teams That Close</p>
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {["D2D Sales Teams", "EPC Operators", "Multi-State Orgs", "Sales Managers", "Bilingual Reps"].map((label) => (
                            <span key={label} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Founder Credibility Block */}
                    <div className="max-w-2xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--brand-primary)]" />
                        <div className="flex items-start gap-5 pl-4">
                            <div className="h-12 w-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6 text-[var(--brand-primary)]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--brand-primary)] mb-2">Built by Real Solar Leaders</p>
                                <p className="text-white font-bold text-sm mb-1">10+ Years in Solar Sales & Operations</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Multi-state solar operations, D2D team management, battery sales, and rep training from the ground up.
                                    SeptiVolt was built from the field — not a boardroom.
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                                        <MapPin className="w-3 h-3" /> Multi-State Operations
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                                        <Users className="w-3 h-3" /> Rep Training Expert
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client"

import { CheckCircle2, UserCheck, ShieldAlert, Sparkles, Building2 } from "lucide-react"
import Link from "next/link"

export function AudienceSplit() {
    const segments = [
        {
            role: "Partner & Internal Reps",
            badge: "Direct Recruiting",
            icon: UserCheck,
            color: "text-[#F59E0B]",
            headline: "Free Foundation Onboarding",
            copy: "New partner reps receive free onboarding access to build their foundation before advanced AI voice training is unlocked.",
            benefits: [
                "Core Solar Sales Modules",
                "Onboarding checklist validation",
                "Full approved rep script library",
                "Text/TTS basic AI roleplay simulation"
            ],
            cta: "Request Partner Rep Access",
            ctaHref: "/solar-sales-training-assessment?source=audience_split&type=partner_rep",
            ctaStyle: "secondary"
        },
        {
            role: "Individual Solar Reps",
            badge: "Self-Improvement",
            icon: Sparkles,
            color: "text-[#F97316]",
            headline: "Build Unshakeable Confidence",
            copy: "Master your scripts, build confidence under pressure, and practice real homeowner objections before walking into live appointments.",
            benefits: [
                "Objection handling database",
                "Learn & practice proven sales frameworks",
                "Upgrade path to real-time voice AI",
                "Personalized AI critiques & metrics"
            ],
            cta: "Start Rep Assessment",
            ctaHref: "/solar-sales-training-assessment?source=audience_split&type=rep_basic",
            ctaStyle: "primary"
        },
        {
            role: "Small & Medium Solar Teams",
            badge: "Sales Offices",
            icon: ShieldAlert,
            color: "text-[#FF5722]",
            headline: "Standardize Your Sales Process",
            copy: "Onboard reps faster, ensure consistent process adoption, and gain complete manager visibility into who is ready to represent your company.",
            benefits: [
                "Manager launch dashboard",
                "Automatic coaching & attention flags",
                "Structured script workflows",
                "Team progress tracking & leaderboard"
            ],
            cta: "Start Team Readiness Assessment",
            ctaHref: "/solar-sales-training-assessment?source=audience_split&type=team_growth",
            ctaStyle: "primary"
        },
        {
            role: "Enterprise Dealers & EPCs",
            badge: "Multi-State Orgs",
            icon: Building2,
            color: "text-amber-500",
            headline: "Custom Enterprise AI Deployments",
            copy: "Stand up a secure, multi-tenant company workspace running custom scripts, white-label options, and localized training contexts.",
            benefits: [
                "Bespoke company AI training context",
                "Role-based access & tenant isolation",
                "CRM Integrations (GoHighLevel/custom webhooks)",
                "Bilingual training & priority support"
            ],
            cta: "Request Enterprise Readiness Review",
            ctaHref: "/solar-sales-training-assessment?source=audience_split&type=enterprise",
            ctaStyle: "secondary"
        }
    ]

    return (
        <section id="use-cases" className="py-24 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F59E0B]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 mb-4 border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B] text-[10px] font-black uppercase tracking-widest rounded-full font-display">
                        Platform Audiences
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic font-display mb-4">
                        Tailored for Every <span className="text-[#F97316]">Solar Closer</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed font-body">
                        Whether you are a solo rep perfecting your pitch or an enterprise EPC standardizing a multi-state sales force.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {segments.map((segment, index) => {
                        const Icon = segment.icon
                        return (
                            <div key={index} className="glass-card bg-slate-950/40 border border-white/10 p-8 md:p-10 rounded-[2rem] flex flex-col justify-between hover:border-[#F97316]/30 transition-all duration-300">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${segment.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-slate-200 font-bold font-display text-sm tracking-wide">{segment.role}</span>
                                        </div>
                                        <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full font-display font-bold uppercase tracking-wider text-slate-400">
                                            {segment.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white font-display uppercase italic mb-4">{segment.headline}</h3>
                                    <p className="text-slate-400 text-sm font-body leading-relaxed mb-8">{segment.copy}</p>
                                </div>

                                <div>
                                    <ul className="space-y-3.5 border-t border-white/5 pt-6 mb-8">
                                        {segment.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                                                <span className="text-slate-300 text-sm font-body">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={segment.ctaHref} className="block w-full">
                                        <button className={`w-full py-4 font-display text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${
                                            segment.ctaStyle === "primary"
                                                ? "btn-primary h-auto translate-y-0"
                                                : "border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#F97316]/40 text-white"
                                        }`}>
                                            {segment.cta}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

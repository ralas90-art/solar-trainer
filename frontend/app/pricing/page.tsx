"use client"

import { useState } from "react"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { Check, Zap, ArrowRight, ShieldCheck, TrendingUp, Sparkles, UserCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PricingPage() {
    const [repCount, setRepCount] = useState(10)

    const tiers = [
        {
            name: "Starter",
            tagline: "Essential AI training for emerging solar teams focused on fundamental closing.",
            platformFee: 499,
            repFee: 39,
            corner: "hud-corner-tl",
            features: [
                "Core Simulation Engine",
                "Standard Objection Library",
                "Performance Dashboards",
                "Full solar sales curriculum",
                "Narrated lessons",
                "Interactive workbooks",
                "Rep progress tracking"
            ],
            cta: "Initialize Setup",
            href: "/signup?tier=starter"
        },
        {
            name: "Growth",
            recommended: true,
            tagline: "Full AI deployment with advanced voice synthesis for aggressive market expansion.",
            platformFee: 999,
            repFee: 59,
            corner: "hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br",
            features: [
                "Everything in Starter, plus:",
                "Voice AI (200 mins/mo)",
                "Advanced PPA/Lease Logic",
                "Market-Specific Scripts",
                "Priority AI Rendering",
                "Leaderboards & Gamification",
                "Manager Analytics"
            ],
            cta: "Activate Growth Mode",
            href: "/signup?tier=growth"
        },
        {
            name: "Enterprise",
            tagline: "Private cloud infrastructure for EPCs and multi-state solar organizations.",
            platformFee: "Custom",
            repFee: "Custom",
            corner: "hud-corner-tr",
            features: [
                "Everything in Growth, plus:",
                "White-label Interface",
                "Strategic Executive Support",
                "Custom API Integrations",
                "Custom Scenarios",
                "Dedicated Account Manager",
                "Advanced Team Permissions"
            ],
            cta: "Contact Strategy Team",
            href: "/enterprise"
        }
    ]

    const calculateTotal = (tier: any) => {
        if (typeof tier.platformFee === "string") return "Custom"
        return tier.platformFee + (repCount * tier.repFee)
    }

    return (
        <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[#F97316]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F59E0B]/5 blur-[120px] rounded-full" />
            </div>

            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
                {/* Header */}
                <div className="text-center mb-24 relative">
                    <div className="inline-block px-4 py-1 mb-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B] text-[10px] font-black uppercase tracking-widest rounded-full font-display">
                        Solar-Powered Training Systems
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter mb-6 uppercase italic">
                        Premium <span className="text-[#F97316]">Plans</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed font-body">
                        Scalable AI infrastructure designed to convert sales representatives into $25k/mo elite consultants through rigorous simulation.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {tiers.map((tier) => (
                        <div 
                            key={tier.name}
                            className={cn(
                                "glass-card hud-border p-10 flex flex-col h-full group transition-all duration-500",
                                tier.corner,
                                tier.recommended 
                                    ? "ring-2 ring-[#F97316]/30 scale-105 z-10 bg-gradient-to-b from-[#F97316]/[0.05] to-transparent" 
                                    : "hover:bg-white/[0.05]"
                            )}
                        >
                            {tier.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F97316] text-[#121212] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 shadow-[0_0_15px_rgba(249,115,22,0.4)] font-display">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={cn(
                                    "font-display text-xs font-black uppercase tracking-[0.3em] mb-4",
                                    tier.recommended ? "text-[#F97316]" : "text-slate-500"
                                )}>
                                    {tier.name}
                                </h3>
                                <div className="flex flex-col gap-1 mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl metrics-font font-bold text-white tracking-tighter italic">
                                            {typeof tier.platformFee === 'number' ? `$${tier.platformFee}` : tier.platformFee}
                                        </span>
                                        {typeof tier.platformFee === 'number' && (
                                            <span className="text-[10px] metrics-font uppercase text-slate-500 tracking-widest">Platform Fee</span>
                                        )}
                                    </div>
                                    {typeof tier.repFee === 'number' && (
                                        <div className="text-[#F59E0B] metrics-font font-bold text-lg">
                                            + ${tier.repFee}<span className="text-xs font-normal text-slate-400">/rep</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed font-light font-body">{tier.tagline}</p>
                            </div>

                            <ul className="space-y-4 mb-10 text-sm flex-1 font-body">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className={cn(
                                        "flex items-center gap-3",
                                        feature.includes("Everything in") || feature.includes("Voice AI") ? "text-white font-bold" : "text-slate-300"
                                    )}>
                                        {feature.includes("Voice AI") ? (
                                            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                                        ) : (
                                            <Check className="w-3 h-3 text-[#F97316]" />
                                        )}
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href={tier.href} className="w-full">
                                <button className={cn(
                                    "w-full py-4 transition-all font-display text-[10px] font-black uppercase tracking-widest",
                                    tier.recommended 
                                        ? "btn-solar h-auto" 
                                        : "border border-white/10 hover:border-[#F97316]/50 hover:bg-[#F97316]/5"
                                )}>
                                    {tier.cta}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
                <section className="glass-card p-12 lg:p-20 overflow-hidden relative hud-border hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F97316]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-[9px] font-black uppercase tracking-[0.3em] mb-6 font-display">
                                Data Projection 2.0
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tighter uppercase mb-8 italic">
                                Projected <br/>Earnings <span className="text-[#F97316]">Impact</span>
                            </h2>
                            <p className="text-slate-400 mb-10 font-body font-light leading-relaxed max-w-lg">
                                Our platform doesn't just train; it rewires the sales process. Reps utilizing SeptiVolt simulations consistently bridge the gap between amateur performance and mastery.
                            </p>
                            <div className="space-y-6">
                                <div className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-display">Standard Rep Output</span>
                                        <span className="metrics-font text-xl text-slate-300">$4,500/mo</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-700 w-1/4"></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316] font-display">SeptiVolt Mastery Path</span>
                                        <span className="metrics-font text-2xl font-bold text-[#F97316]">$15k - $25k/mo</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] w-[85%] shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { val: "312%", label: "Close Rate Lift", corner: "hud-corner-tl" },
                                { val: "48h", label: "Ramp Velocity", corner: "hud-corner-tr", color: "text-[#F59E0B]" },
                                { val: "94%", label: "Retention Rate", corner: "hud-corner-bl", color: "text-[#F97316]" },
                                { val: "12x", label: "Avg First Year ROI", corner: "hud-corner-br" }
                            ].map((stat, i) => (
                                <div key={i} className={cn(
                                    "glass-card bg-white/[0.02] p-8 border border-white/5 text-center hud-border",
                                    stat.corner
                                )}>
                                    <div className={cn("text-4xl metrics-font font-bold mb-2", stat.color || "text-white")}>{stat.val}</div>
                                    <div className="text-[9px] font-display font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <div className="mt-32 text-center">
                    <div className="max-w-3xl mx-auto glass-card p-16 hud-border hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
                        <h2 className="text-3xl lg:text-4xl font-black font-display tracking-tight uppercase italic mb-8">Ready for <span className="text-[#F97316]">Solar Dawn?</span></h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="btn-solar px-10 py-5 text-xs rounded-sm h-auto translate-y-0">
                                Initiate Organization Training
                            </button>
                            <button className="px-10 py-5 text-xs border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-display font-black uppercase tracking-widest text-white">
                                Request Live Demo
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

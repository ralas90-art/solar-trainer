"use client"

import { useState } from "react"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { 
  Check, 
  X, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Users, 
  Building2, 
  Settings2, 
  DollarSign, 
  HelpCircle,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PricingPage() {
    // Calculator States
    const [calcRepCount, setCalcRepCount] = useState(8)
    const [calcTier, setCalcTier] = useState<"pilot" | "growth">("growth")
    
    // FAQ State
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const toggleFaq = (idx: number) => {
        setOpenFaq(openFaq === idx ? null : idx)
    }

    const tiers = [
        {
            name: "Internal Onboarding",
            badge: "Partner Access",
            tagline: "Free onboarding foundation for Rob's direct reps & Erick Sanchez's recruits.",
            setupFee: 0,
            monthlyFee: "Free",
            seatText: "For approved partner reps",
            corner: "hud-corner-tl",
            cta: "Request Partner Access",
            href: "/solar-sales-training-assessment?source=pricing&type=partner_rep",
            features: [
                "Core sales training modules",
                "Onboarding checklist validation",
                "Quizzes & progress tracking",
                "Approved rep script library",
                "Limited text/TTS AI roleplay",
                "Voice AI Upgrade Path"
            ],
            disclaimer: "Voice AI is unlocked by production milestones or available as an upgrade. Usage limits apply."
        },
        {
            name: "Rep Basic",
            badge: "Individual Rep",
            tagline: "For individual solar reps who want structured training and basic AI practice.",
            setupFee: 0,
            monthlyFee: 29,
            seatText: "Single user license",
            corner: "hud-corner-tr",
            cta: "Start Rep Basic Assessment",
            href: "/solar-sales-training-assessment?source=pricing&type=rep_basic",
            features: [
                "Core training modules",
                "Interactive quizzes",
                "Approved script library",
                "Text/TTS AI simulations",
                "Basic progress tracking",
                "Objection practice"
            ],
            disclaimer: "Includes basic text/TTS simulation. Live voice AI is not included."
        },
        {
            name: "Rep Voice Pro",
            badge: "Individual Pro",
            tagline: "For reps who want live voice AI roleplay and deep situational sales practice.",
            setupFee: 0,
            monthlyFee: 79,
            seatText: "Single user license",
            corner: "hud-corner-bl",
            cta: "See If Rep Voice Pro Is Right for Me",
            href: "/solar-sales-training-assessment?source=pricing&type=rep_voice_pro",
            features: [
                "Everything in Rep Basic",
                "Live Voice AI roleplay sessions",
                "Advanced objection drills",
                "Personalized AI critiques & debriefs",
                "Saved simulation history & metrics",
                "Spanish roleplay paths (where available)"
            ],
            disclaimer: "Includes a monthly voice simulation allowance. Additional usage may be limited or billed separately."
        },
        {
            name: "Founding Dealer Pilot",
            badge: "90-Day Pilot",
            tagline: "For early solar teams that want to test SeptiVolt with a small pilot group.",
            setupFee: 1500,
            monthlyFee: 297,
            seatText: "Includes 5 seats ($39/mo per additional seat)",
            corner: "hud-corner-br",
            cta: "Apply for Dealer Pilot",
            href: "/solar-sales-training-assessment?source=pricing&type=dealer_pilot",
            features: [
                "Company workspace & setup wizard",
                "Company profile & context builder",
                "Custom sales asset generation",
                "AI roleplay simulations",
                "Manager launch dashboard",
                "Onboarding checklist validation",
                "Approved company script library",
                "Basic onboarding support"
            ],
            disclaimer: "Limited to a 90-day pilot term. Live voice AI subject to shared company limits."
        },
        {
            name: "Team Growth",
            badge: "Most Popular",
            recommended: true,
            tagline: "For active solar sales teams needing onboarding, custom scripts, and manager visibility.",
            setupFee: 3000,
            monthlyFee: 497,
            seatText: "Includes 10 seats ($49/mo per additional seat)",
            corner: "hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br",
            cta: "Start Team Readiness Assessment",
            href: "/solar-sales-training-assessment?source=pricing&type=team_growth",
            features: [
                "Everything in Founding Dealer Pilot",
                "Team creation & roster management",
                "Launch readiness score validation",
                "Manager launch dashboard",
                "Coaching & attention flags",
                "AI-generated door/call scripts",
                "CRM/webhook integration foundation",
                "Personalized simulation debriefs",
                "Approved sales asset workflow"
            ],
            disclaimer: "Voice AI usage may be subject to monthly limits depending on plan."
        },
        {
            name: "Enterprise Dealer / EPC",
            badge: "Scale Consistency",
            tagline: "For solar developers, EPCs, installers, and larger multi-office organizations.",
            setupFee: 7500,
            monthlyFee: 1500,
            seatText: "Custom seat scaling & bulk rates",
            corner: "hud-corner-br",
            cta: "Request Enterprise Fit Review",
            href: "/solar-sales-training-assessment?source=pricing&type=enterprise",
            features: [
                "Everything in Team Growth",
                "White-label readiness",
                "Company-specific AI training context",
                "CRM/Integration hub & webhooks",
                "Custom onboarding & success manager",
                "Custom scripts & objection libraries",
                "Manager & admin permission matrix",
                "Multi-team department deployment",
                "Bilingual training & Spanish roleplay",
                "Launch support & SLA guarantee"
            ],
            disclaimer: "SLA-backed voice simulation allowance. Customized billing contracts available."
        }
    ]

    // Calculations for dynamic seat calculator
    const calculateCalculatorPrice = () => {
        if (calcTier === "pilot") {
            const extraReps = Math.max(0, calcRepCount - 5)
            const monthlyTotal = 297 + (extraReps * 39)
            return {
                setup: 1500,
                monthly: monthlyTotal,
                included: 5,
                extraFee: 39,
                totalInitial: 1500 + monthlyTotal
            }
        } else {
            const extraReps = Math.max(0, calcRepCount - 10)
            const monthlyTotal = 497 + (extraReps * 49)
            return {
                setup: 3000,
                monthly: monthlyTotal,
                included: 10,
                extraFee: 49,
                totalInitial: 3000 + monthlyTotal
            }
        }
    }

    const calcResult = calculateCalculatorPrice()

    // Comparison matrix configurations
    const comparisonFeatures = [
        { name: "Training modules", basic: true, pro: true, pilot: true, growth: true, enterprise: true },
        { name: "Quizzes & tracking", basic: true, pro: true, pilot: true, growth: true, enterprise: true },
        { name: "Text/TTS AI simulations", basic: true, pro: true, pilot: true, growth: true, enterprise: true },
        { name: "Live voice AI simulations", basic: false, pro: "150m/mo", pilot: "Shared Pool", growth: "Expanded Pool", enterprise: "Custom SLA" },
        { name: "Personalized debriefs", basic: false, pro: true, pilot: true, growth: true, enterprise: true },
        { name: "Company workspace", basic: false, pro: false, pilot: true, growth: true, enterprise: true },
        { name: "Company intelligence profile", basic: false, pro: false, pilot: true, growth: true, enterprise: true },
        { name: "AI-generated sales assets", basic: false, pro: false, pilot: "Basic", growth: true, enterprise: "Custom Models" },
        { name: "Approved script library", basic: "Read Only", pro: "Read Only", pilot: true, growth: true, enterprise: true },
        { name: "Manager dashboard", basic: false, pro: false, pilot: true, growth: true, enterprise: true },
        { name: "Team management", basic: false, pro: false, pilot: false, growth: true, enterprise: true },
        { name: "Launch readiness score", basic: false, pro: false, pilot: false, growth: true, enterprise: true },
        { name: "CRM/integration hub", basic: false, pro: false, pilot: false, growth: "Foundation", enterprise: "Full Hub & APIs" },
        { name: "White-label readiness", basic: false, pro: false, pilot: false, growth: false, enterprise: true },
        { name: "Priority support", basic: false, pro: false, pilot: false, growth: "Standard", enterprise: "24/7 Dedicated" },
    ]

    return (
        <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
            {/* Background Gradient Blurs */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[#F97316]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F59E0B]/5 blur-[120px] rounded-full" />
            </div>

            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
                
                {/* SECTION 1 — HERO */}
                <div className="text-center mb-24 relative">
                    <div className="inline-block px-4 py-1.5 mb-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.2em] rounded-full font-display">
                        Sales Readiness Enablement
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black font-display tracking-tighter mb-6 uppercase italic leading-none">
                        Pricing Built for Reps, <br/>
                        <span className="text-[#F97316]">Teams, & Solar Dealers</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed font-body">
                        Start with individual rep training or launch a full AI-powered sales readiness system for your team. 
                        SeptiVolt combines onboarding, AI roleplay, custom scripts, manager visibility, and company-specific training.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <a href="/solar-sales-training-assessment?source=pricing_hero&type=rep_basic" className="px-8 py-4 bg-white/5 border border-white/10 hover:border-[#F97316]/50 hover:bg-[#F97316]/5 text-xs font-black uppercase tracking-widest font-display transition-all">
                            Start as a Rep
                        </a>
                        <Link href="/solar-sales-training-assessment?source=pricing_hero&type=team_growth" className="btn-primary px-8 py-4 text-xs h-auto uppercase tracking-widest font-display">
                            Book Team Demo
                        </Link>
                    </div>
                </div>

                {/* SECTION 2 — PRICING CARDS */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-widest font-display text-white italic mb-2">Select Your Platform Track</h2>
                        <div className="h-0.5 w-16 bg-[#F97316] mx-auto"></div>
                    </div>

                    <div id="individual-plans" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {tiers.map((tier) => (
                            <div 
                                key={tier.name}
                                className={cn(
                                    "glass-card bg-slate-950/20 hud-border p-8 flex flex-col justify-between h-full group relative transition-all duration-500",
                                    tier.corner,
                                    tier.recommended 
                                        ? "ring-2 ring-[#F97316]/40 bg-gradient-to-b from-[#F97316]/[0.05] to-transparent shadow-[0_0_30px_rgba(249,115,22,0.15)]" 
                                        : "hover:bg-white/[0.03] hover:border-white/20"
                                )}
                            >
                                {tier.recommended && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F97316] text-[#121212] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1 shadow-[0_0_15px_rgba(249,115,22,0.4)] font-display">
                                        {tier.badge}
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-display font-black text-lg uppercase tracking-wider text-white italic">
                                            {tier.name}
                                        </h3>
                                        {!tier.recommended && (
                                            <span className="text-[9px] font-display uppercase tracking-widest text-[#F59E0B] border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-2.5 py-0.5 rounded-full font-black">
                                                {tier.badge}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-slate-400 font-body font-light leading-relaxed mb-6 min-h-[40px]">
                                        {tier.tagline}
                                    </p>

                                    {/* Pricing display */}
                                    <div className="border-y border-white/5 py-4 mb-6">
                                        {tier.setupFee > 0 && (
                                            <div className="text-[10px] font-display text-slate-500 uppercase tracking-widest mb-1">
                                                Setup Fee: <span className="text-slate-300 font-bold">${tier.setupFee} (One-Time)</span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl metrics-font font-black text-white italic">
                                                {typeof tier.monthlyFee === "number" ? `$${tier.monthlyFee}` : tier.monthlyFee}
                                            </span>
                                            {typeof tier.monthlyFee === "number" && (
                                                <span className="text-xs font-body text-slate-400">/mo</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] font-display text-[#F59E0B] uppercase tracking-wider mt-1.5 font-bold">
                                            {tier.seatText}
                                        </div>
                                    </div>

                                    {/* Features check list */}
                                    <ul className="space-y-3.5 mb-8 text-xs font-body">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5">
                                                <Check className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                                                <span className="text-slate-300 leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <Link href={tier.href} className="w-full">
                                        <button className={cn(
                                            "w-full py-4 transition-all font-display text-[10px] font-black uppercase tracking-widest rounded-sm",
                                            tier.recommended 
                                                ? "btn-primary h-auto translate-y-0 shadow-lg shadow-[#F97316]/20" 
                                                : "border border-white/10 hover:border-[#F97316]/50 hover:bg-[#F97316]/5 hover:text-white"
                                        )}>
                                            {tier.cta}
                                        </button>
                                    </Link>
                                    <p className="text-[9px] text-slate-500 font-body mt-4 leading-normal text-center italic">
                                        * {tier.disclaimer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 3 — WHY SETUP FEE? */}
                <section className="glass-card bg-slate-950/10 p-10 lg:p-16 border border-white/5 rounded-[2.5rem] mb-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F97316]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-block px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-[9px] font-black uppercase tracking-[0.3em] font-display">
                                Systems Implementation
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black font-display tracking-tighter uppercase italic leading-none text-white">
                                Why Is There an <br/>
                                <span className="text-[#F59E0B]">Implementation Setup Fee?</span>
                            </h2>
                            <p className="text-slate-400 font-body font-light leading-relaxed text-base">
                                You are not paying for generic online course logins. You are launching a company-specific solar sales readiness system.
                                The one-time implementation fee covers the intensive customization and configuration needed to mold SeptiVolt around your actual operations.
                            </p>
                            <blockquote className="border-l-2 border-[#F97316] pl-4 text-sm text-slate-300 italic font-body">
                                "The onboarding system is customized directly to your market regulations, utility rate sheets, and local sales scripts from day one."
                            </blockquote>
                        </div>
                        
                        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "Company Profile", desc: "Configuration of solar territories, utility rate sheets, and local target buyer rules." },
                                { title: "Sales Process Map", desc: "Mapping training paths directly to your internal sales process stages (setter, closer, EPC)." },
                                { title: "Custom Scripts", desc: "Generation and layout of door-knock and phone scripts approved by your team." },
                                { title: "Manager Control", desc: "Setting custom manager notifications, roles, and CRM webhook pipelines." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-xs font-black uppercase tracking-wider text-[#F97316] mb-1 font-display">{item.title}</div>
                                    <p className="text-[11px] text-slate-400 leading-normal font-body font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 4 — SEAT-BASED SCALING & CALCULATOR */}
                <section className="mb-32">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-[9px] font-black uppercase tracking-[0.2em] font-display rounded-full mb-4">
                            Scale As You Grow
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tighter uppercase italic text-white">
                            Seat-Based Scaling Calculator
                        </h2>
                        <p className="text-slate-400 font-body text-sm font-light mt-2 max-w-xl mx-auto">
                            Select a team track and adjust the representative count below to calculate exact implementation fees and monthly platform totals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Control panel */}
                        <div className="lg:col-span-7 glass-card bg-slate-950/20 border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between">
                            <div>
                                <div className="flex gap-4 mb-8">
                                    <button 
                                        onClick={() => { setCalcTier("pilot"); setCalcRepCount(5) }}
                                        className={cn(
                                            "flex-1 py-4 border rounded-xl font-display text-xs font-black uppercase tracking-widest transition-all",
                                            calcTier === "pilot"
                                                ? "border-[#F97316] bg-[#F97316]/10 text-white"
                                                : "border-white/5 bg-white/5 text-slate-400 hover:border-white/10"
                                        )}
                                    >
                                        Dealer Pilot (5 seats incl.)
                                    </button>
                                    <button 
                                        onClick={() => { setCalcTier("growth"); setCalcRepCount(10) }}
                                        className={cn(
                                            "flex-1 py-4 border rounded-xl font-display text-xs font-black uppercase tracking-widest transition-all",
                                            calcTier === "growth"
                                                ? "border-[#F97316] bg-[#F97316]/10 text-white"
                                                : "border-white/5 bg-white/5 text-slate-400 hover:border-white/10"
                                        )}
                                    >
                                        Team Growth (10 seats incl.)
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-display font-black uppercase tracking-widest text-slate-300">
                                            Number of Active Reps
                                        </label>
                                        <span className="metrics-font font-black text-2xl text-[#F97316]">
                                            {calcRepCount} Seats
                                        </span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={calcTier === "pilot" ? 1 : 5}
                                        max={50}
                                        value={calcRepCount}
                                        onChange={(e) => setCalcRepCount(parseInt(e.target.value))}
                                        className="w-full accent-[#F97316] bg-white/5 h-2 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] font-display text-slate-500 font-bold uppercase tracking-wider">
                                        <span>Min: {calcTier === "pilot" ? "1" : "5"}</span>
                                        <span>Max: 50 seats</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 text-xs text-slate-400 font-body leading-relaxed space-y-2">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#F97316] shrink-0" />
                                    <span>Plan includes {calcResult.included} representatives at no extra charge.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#F97316] shrink-0" />
                                    <span>Additional active seats are billed at <strong>${calcResult.extraFee}/mo</strong> each.</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculations output */}
                        <div className="lg:col-span-5 glass-card bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-[2rem] flex flex-col justify-between">
                            <div className="space-y-6">
                                <h3 className="font-display font-black uppercase text-xs tracking-widest text-[#F59E0B]">Price Summary</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-body">
                                        <span className="text-slate-400">Implementation Setup Fee</span>
                                        <span className="font-bold text-white">${calcResult.setup}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-body">
                                        <span className="text-slate-400">Monthly Platform Rate</span>
                                        <span className="font-bold text-white">${calcResult.monthly} <span className="text-xs text-slate-400">/mo</span></span>
                                    </div>
                                    {calcRepCount > calcResult.included && (
                                        <div className="text-[10px] font-body text-[#F97316] text-right italic">
                                            Includes +{calcRepCount - calcResult.included} extra seats (${calcResult.extraFee}/ea)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 space-y-6 mt-8">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-display font-black text-xs uppercase tracking-widest text-slate-400">Initial Charge</span>
                                    <span className="metrics-font font-black text-3xl text-white">${calcResult.totalInitial}</span>
                                </div>
                            <Link href={`/solar-sales-training-assessment?source=pricing_calculator&type=${calcTier === "pilot" ? "dealer_pilot" : "team_growth"}&reps=${calcRepCount}`}>
                                <button className="w-full btn-primary h-14 text-xs font-display font-black uppercase tracking-widest translate-y-0">
                                    Start Team Readiness Assessment
                                </button>
                            </Link>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 5 — COMPARE FEATURES TABLE */}
                <section className="mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black font-display uppercase tracking-tight italic text-white">Compare Plan Details</h2>
                        <p className="text-slate-400 text-sm font-light mt-1">Review full technical features and limits line-by-line.</p>
                    </div>

                    <div className="overflow-x-auto glass-card bg-slate-950/20 border border-white/5 rounded-[2rem]">
                        <table className="w-full border-collapse text-left text-xs font-body">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="p-6 font-display font-black text-slate-400 uppercase tracking-widest">Capabilities</th>
                                    <th className="p-6 font-display font-black text-slate-300 uppercase tracking-wider text-center">Rep Basic</th>
                                    <th className="p-6 font-display font-black text-[#F97316] uppercase tracking-wider text-center">Voice Pro</th>
                                    <th className="p-6 font-display font-black text-slate-300 uppercase tracking-wider text-center">Dealer Pilot</th>
                                    <th className="p-6 font-display font-black text-[#F59E0B] uppercase tracking-wider text-center">Team Growth</th>
                                    <th className="p-6 font-display font-black text-slate-300 uppercase tracking-wider text-center">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((feat, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6 font-semibold text-slate-200">{feat.name}</td>
                                        
                                        {/* Basic */}
                                        <td className="p-6 text-center text-slate-400">
                                            {typeof feat.basic === "boolean" ? (
                                                feat.basic ? <Check className="w-4 h-4 text-[#F97316] mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                                            ) : (
                                                <span className="font-bold">{feat.basic}</span>
                                            )}
                                        </td>

                                        {/* Voice Pro */}
                                        <td className="p-6 text-center text-slate-200">
                                            {typeof feat.pro === "boolean" ? (
                                                feat.pro ? <Check className="w-4 h-4 text-[#F97316] mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                                            ) : (
                                                <span className="font-bold text-[#F97316]">{feat.pro}</span>
                                            )}
                                        </td>

                                        {/* Pilot */}
                                        <td className="p-6 text-center text-slate-300">
                                            {typeof feat.pilot === "boolean" ? (
                                                feat.pilot ? <Check className="w-4 h-4 text-[#F97316] mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                                            ) : (
                                                <span className="font-bold">{feat.pilot}</span>
                                            )}
                                        </td>

                                        {/* Growth */}
                                        <td className="p-6 text-center text-white bg-[#F97316]/5">
                                            {typeof feat.growth === "boolean" ? (
                                                feat.growth ? <Check className="w-4 h-4 text-[#F59E0B] mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                                            ) : (
                                                <span className="font-bold text-[#F59E0B]">{feat.growth}</span>
                                            )}
                                        </td>

                                        {/* Enterprise */}
                                        <td className="p-6 text-center text-slate-200">
                                            {typeof feat.enterprise === "boolean" ? (
                                                feat.enterprise ? <Check className="w-4 h-4 text-[#F97316] mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                                            ) : (
                                                <span className="font-bold text-[#F59E0B]">{feat.enterprise}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION 6 — ROI FRAMING */}
                <section className="max-w-4xl mx-auto glass-card bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-12 text-center relative overflow-hidden rounded-[2rem] mb-32">
                    <div className="absolute inset-0 bg-[#F97316]/5 pointer-events-none" />
                    <h3 className="text-2xl font-black text-white mb-4 font-display italic uppercase">The Math of Sales Readiness</h3>
                    <p className="text-slate-400 mb-8 font-body leading-relaxed max-w-2xl mx-auto text-sm">
                        If SeptiVolt helps just one representative book more utility savings consultations, handle tough objections more confidently, 
                        or close just one additional contract, the platform pays for itself. 
                    </p>
                    <p className="text-xs text-slate-500 font-body">
                        Our platform is systematically designed to help teams improve ramp time, sales confidence, objection handling, and manager visibility.
                    </p>
                </section>

                {/* SECTION 7 — FAQ ACCORDION */}
                <section className="max-w-4xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black font-display uppercase tracking-tight italic text-white">Frequently Asked Questions</h2>
                        <div className="h-0.5 w-12 bg-[#F97316] mx-auto mt-2"></div>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Is SeptiVolt just a training course?",
                                a: "No. SeptiVolt is a comprehensive sales readiness system that combines interactive training modules, AI simulations (text and live voice), company-specific scripts, onboarding checklists, and manager coaching tools."
                            },
                            {
                                q: "Can individual reps use it?",
                                a: "Yes. Individual reps looking to level up their objection handling and confidence before closing live appointments can enroll directly in Rep Basic or Rep Voice Pro plans."
                            },
                            {
                                q: "Can my solar company customize it?",
                                a: "Yes. Our Pilot, Growth, and Enterprise plans feature Company Intelligence Profiles. This allows you to supply custom local training context, custom target objections, and generate scripts customized specifically to your company’s sales process."
                            },
                            {
                                q: "Do you support live voice AI?",
                                a: "Yes. High-fidelity Live Voice AI simulations are available on the Rep Voice Pro tier and all team plans. Custom enterprise packages support customized usage limits and dedicated server rendering allocations."
                            },
                            {
                                q: "Can we connect our CRM?",
                                a: "Yes. SeptiVolt features a CRM and integration foundation with native GoHighLevel support and custom webhook options on team tiers, allowing automatic onboarding triggers and syncs."
                            },
                            {
                                q: "Is there a setup fee?",
                                a: "Yes, for company pilot, team, and enterprise tiers. The setup fee covers configuring your private workspace, company profile customization, asset library setup, script generations, and strategic launching support."
                            },
                            {
                                q: "Can reps under partner teams get free onboarding access?",
                                a: "Yes. New partner reps under Rob or Erick Sanchez's direct teams may receive free limited onboarding access to build their core foundation before advanced AI voice features are unlocked."
                            },
                            {
                                q: "Do you support Spanish?",
                                a: "Yes. SeptiVolt supports bilingual solar enablement, offering custom Spanish pitches, objections, and Spanish AI roleplay scenarios where configured."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="glass-card bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleFaq(i)}
                                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02]"
                                >
                                    <span className="font-display font-black uppercase text-sm text-slate-200 tracking-wide">{faq.q}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", openFaq === i ? "rotate-180 text-[#F97316]" : "")} />
                                </button>
                                
                                <div className={cn(
                                    "transition-all duration-500 overflow-hidden",
                                    openFaq === i ? "max-h-[300px] border-t border-white/5" : "max-h-0"
                                )}>
                                    <div className="p-6 text-sm text-slate-400 leading-relaxed font-body">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}

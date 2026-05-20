"use client"

import { 
  Sparkles, 
  FileText, 
  BarChart3, 
  Settings2, 
  BookOpen, 
  Link2, 
  Globe, 
  UserCheck, 
  CheckCircle2 
} from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
    const features = [
        {
            icon: Sparkles,
            title: "AI Roleplay Simulations",
            description: "Practice homeowner conversations via text, high-speed TTS, or live voice AI. Receive personalized critiques and debriefs mapped to actual solar buyer scenarios.",
            color: "text-[#F97316]",
            bg: "bg-[#F97316]/5 border-[#F97316]/20"
        },
        {
            icon: FileText,
            title: "Company-Specific Scripts",
            description: "Go beyond generic pitch training. Input your company profile, territories, and local objections to automatically generate and audit custom scripts.",
            color: "text-[#F59E0B]",
            bg: "bg-[#F59E0B]/5 border-[#F59E0B]/20"
        },
        {
            icon: BarChart3,
            title: "Manager Coaching Dashboard",
            description: "Get immediate visibility into team readiness. Track onboarding progress, view automated coaching flags, and monitor launch readiness scores before reps hit the field.",
            color: "text-amber-500",
            bg: "bg-amber-500/5 border-amber-500/20"
        },
        {
            icon: Settings2,
            title: "Enterprise Setup Wizard",
            description: "Configure multi-tenant team workspaces, assign custom roles (admin, manager, sales_rep), set up localized training contexts, and control tenant isolation.",
            color: "text-[#FF5722]",
            bg: "bg-[#FF5722]/5 border-[#FF5722]/20"
        },
        {
            icon: BookOpen,
            title: "Approved Script Library",
            description: "Equip your reps with verified sales assets. Create door-knock, cold-call, and close scripts with a robust draft/edit/approve/archive lifecycle workflow.",
            color: "text-orange-500",
            bg: "bg-orange-500/5 border-orange-500/20"
        },
        {
            icon: Link2,
            title: "CRM & Integration Hub",
            description: "Sync training checkpoints directly with your pipeline. Supports GoHighLevel workflows, automated onboarding triggers, and custom webhooks for instant synchronization.",
            color: "text-yellow-500",
            bg: "bg-yellow-500/5 border-yellow-500/20"
        },
        {
            icon: Globe,
            title: "Bilingual Training Support",
            description: "Ensure consistency across all reps. Seamlessly switch between English and Spanish paths with localized scripts, quizzes, and voice roleplays.",
            color: "text-orange-400",
            bg: "bg-orange-400/5 border-orange-400/20"
        }
    ]

    return (
        <section id="features" className="py-24 px-6 lg:px-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-to-r from-[#F97316]/5 to-[#F59E0B]/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-block py-1.5 px-4 rounded-full border border-[#F97316]/30 bg-[#F97316]/5 text-[#F97316] text-[10px] font-black uppercase tracking-widest mb-4 font-display">
                        System Capabilities
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic font-display mb-4">
                        One System to Train, Practice, <br/>
                        <span className="text-[#F97316]">Coach, and Launch Solar Reps</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light font-body leading-relaxed text-base">
                        SeptiVolt combines interactive training modules, live AI roleplay, custom company script repositories, and manager coaching tools into a single sales readiness engine.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <div key={idx} className={`glass-card p-8 border rounded-[2rem] hover:bg-white/[0.03] transition-all flex flex-col justify-between ${feature.bg}`}>
                                <div className="space-y-4">
                                    <div className={`h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${feature.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display font-black uppercase text-lg text-white italic tracking-wide">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 font-body text-sm leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                    {/* Partner Recruiting Section */}
                    <div className="glass-card p-8 border border-white/5 bg-[#121212] hover:bg-white/[0.01] transition-all flex flex-col justify-between md:col-span-2 lg:col-span-3 hud-border hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 w-full">
                            <div className="space-y-3 max-w-2xl">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <span className="font-display font-black uppercase text-[10px] tracking-widest text-[#F59E0B]">
                                        For Partner Teams and Internal Reps
                                    </span>
                                </div>
                                <h3 className="font-display font-black uppercase text-xl text-white italic">
                                    Direct Onboarding Platform Integration
                                </h3>
                                <p className="text-slate-400 font-body text-xs md:text-sm leading-relaxed font-light">
                                    Approved partner reps receive free limited onboarding access to complete modules, review scripts, 
                                    and practice basic AI simulations before unlocking advanced voice AI milestones.
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-3">
                                <Link href="/solar-sales-training-assessment?source=partner_card&type=partner_rep">
                                    <button className="px-8 py-3.5 border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-display font-black uppercase tracking-widest text-white transition-all rounded-sm">
                                        Request Partner Access
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General CTA Block */}
                <div className="mt-8 text-center">
                    <Link href="/solar-sales-training-assessment?source=features&type=general">
                        <button className="inline-flex items-center gap-3 px-8 py-4 btn-primary h-auto translate-y-0 text-xs font-display font-black uppercase tracking-widest">
                            Start AI Readiness Assessment
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </Link>
                    <p className="mt-3 text-slate-600 text-xs font-body">Takes about 2 minutes · Free · No credit card required</p>
                </div>

            </div>
        </section>
    )
}

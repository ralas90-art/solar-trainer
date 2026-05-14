"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
    Zap,
    CheckCircle2,
    Target,
    Users,
    TrendingUp,
    Shield,
    Calendar,
    ArrowRight,
    Star,
    Award,
    Play
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WHITE_LABEL } from "@/lib/white-label.config";

const CURRICULUM_DAYS = [
    {
        day: "1",
        title: "The Foundation",
        subtitle: "Mindset, Physics & Operations",
        objective: "Transform from a 'Salesperson' into a 'Consultant'.",
        topics: [
            "The 4 Stages of Competence & Avoiding 'The Dip'",
            "Physics of Value: Generation, Conversion & ROI",
            "Decoding the Contract: Key terms and Tiers",
            "Market Anatomy & Competitive Landscape"
        ]
    },
    {
        day: "2",
        title: "The Hunt",
        subtitle: "Prospecting & Territory Management",
        objective: `Master the science of finding qualified clients.`,
        topics: [
            "Cloverleaf Strategy: Building influence around existing clients",
            "The 'Breadcrumb' Strategy: Outreach that sparks curiosity",
            "Body Language & The Trust Zone (The 6-foot Rule)",
            "The 'Anti-Sales' Opening Hook (Sounding like a neighbor)"
        ]
    },
    {
        day: "3",
        title: "Connection",
        subtitle: "Discovery & Psychology",
        objective: "Stop selling and start becoming a 'Trusted Advisor'.",
        topics: [
            "Personality Types (BOLT System): Bull, Owl, Lamb, Tiger",
            "FBI Negotiation Tactics: Mirroring & Labeling Empathy",
            "The 'Columbo' Method of lowering prospect defenses",
            "Question Architecture: Open-ended drills to find the PAIN"
        ]
    },
    {
        day: "4",
        title: "Presentation",
        subtitle: "The Solution & The Math",
        objective: "Present the solution so clearly that price becomes irrelevant.",
        topics: [
            "Investment Autopsy: Dissecting hidden costs",
            "The Value Stack: Inflation Hedge, Equity, and Control",
            "Financial Math: The 'Cost of Doing Nothing' Projection",
            "Managing Expectations & Product Delivery"
        ]
    },
    {
        day: "5",
        title: "Closing",
        subtitle: "Objections & Decisions",
        objective: `Guide the client to a decision that benefits them.`,
        topics: [
            "Objection Judo: The 'Porcupine' Technique",
            "Feel-Felt-Found: De-escalating price and spousal anxiety",
            "The Assumptive Choice Close (Tuesday vs Wednesday)",
            "Ben Franklin Close: Pros vs. Cons Decision Matrix"
        ]
    },
    {
        day: "6",
        title: "Mastery",
        subtitle: "Referrals & Automation",
        objective: `Master the science of scaling your book of business.`,
        topics: [
            "The Moment of Happiness ask (Post-sale request)",
            "Orphan Client Strategy: Helping abandoned prospects",
            "Referral Tree Scripts: 'Who Do You Know?' vs 'The Hero Script'",
            "Creating Advocates: Social proof and Review systems"
        ]
    },
    {
        day: "7",
        title: "Certification",
        subtitle: "Live Simulation & Exam",
        objective: "Final validation of field-readiness.",
        topics: [
            "Integrated Full-Cycle Pitch Exam",
            "Stress-Test Simulation: Technical & Emotional curveballs",
            "Final Script Evaluation & Tiered Certification",
            "Graduation: Access to High-Ticket Lead Tiers"
        ]
    }
];

export default function CurriculumPreview() {
    return (
        <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#F97316]/5 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F59E0B]/5 blur-[120px] rounded-full opacity-30" />
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                {/* Header */}
                <div className="text-center mb-24 relative animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-block px-4 py-1 mb-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B] text-[10px] font-black uppercase tracking-widest rounded-full font-display">
                        The Blueprint of a 7-Figure {WHITE_LABEL.industry} Career
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black font-display tracking-tighter mb-8 uppercase italic leading-tight">
                        Accelerator <span className="text-[#F97316]">Curriculum</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                        A rigorous 7-day architecture designed to transform recruits into elite {WHITE_LABEL.industry} Consultants 
                        through AI-simulated field training.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/pricing">
                            <Button size="lg" className="btn-primary px-8 h-14 text-sm rounded-xl group">
                                Start Training Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Showcase Section */}
                <div className="mb-32 relative group animate-in zoom-in-95 duration-700 delay-300">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <Card className="glass-card bg-[#1A1A1A] border-white/5 overflow-hidden relative hud-border hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F97316]/50 to-transparent"></div>
                        <div className="p-4 bg-[#121212] border-b border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-[#F59E0B]/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 font-display">
                                // PLATFORM_ENVIRONMENT: {WHITE_LABEL.companyName.toUpperCase()}_SIMULATOR_2.0
                            </div>
                            <div className="w-10"></div>
                        </div>
                        <CardContent className="p-0 relative aspect-[16/9]">
                            <Image 
                                src="/platform_mockup_showcase.png" 
                                alt={`${WHITE_LABEL.companyName} Platform Showcase`}
                                fill
                                className="object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-1000"
                                priority
                            />
                            {/* Overlay effects */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-40"></div>
                            
                            {/* Floating "Live" Indicator */}
                            <div className="absolute top-8 right-8 flex items-center gap-2 bg-[#F97316] text-[#121212] px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.4)] animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                Live Simulation Active
                            </div>
                        </CardContent>
                    </Card>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, label: "AI Voice Synthesis", desc: "Interactive roleplays with realistic prospect personas." },
                            { icon: Target, label: "Workbook Integration", desc: "Real-time data entry and technical qualification drills." },
                            { icon: Award, label: "Performance Scoring", desc: "Instant feedback on your objection handling and tone." }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/5">
                                <div className="p-3 rounded-xl bg-[#F97316]/10 text-[#F97316]">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">{feature.label}</h4>
                                    <p className="text-xs text-slate-500 font-light leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Timeline Curriculum */}
                <div className="relative mb-32">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#F97316]/50 via-white/5 to-transparent hidden md:block" />
                    
                    <div className="space-y-24">
                        {CURRICULUM_DAYS.map((item, idx) => (
                            <div key={item.day} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content */}
                                <div className="flex-1 w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className={`flex items-center gap-4 ${idx % 2 !== 0 ? 'md:justify-end' : ''}`}>
                                        <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 py-1 px-4 text-xs font-bold font-display uppercase italic">
                                            Day {item.day}
                                        </Badge>
                                    </div>
                                    <div className={idx % 2 !== 0 ? 'md:text-right' : ''}>
                                        <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-2 font-display">{item.title}</h3>
                                        <p className="text-[#F59E0B] font-hud text-[10px] uppercase tracking-[0.3em] font-black mb-6">{item.subtitle}</p>
                                        <p className="text-slate-400 font-light mb-8 max-w-md mx-auto md:mx-0">
                                            <span className="text-[#F97316] font-bold italic mr-2">MISSION:</span>
                                            {item.objective}
                                        </p>
                                        <ul className={`space-y-4 ${idx % 2 !== 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                                            {item.topics.map((topic, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-body group">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-[#F97316]/30 group-hover:bg-[#F97316] transition-colors ${idx % 2 !== 0 ? 'order-2' : ''}`} />
                                                    <span className="font-light">{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Divider Icon */}
                                <div className="relative z-10 shrink-0 hidden md:block">
                                    <div className="w-16 h-16 rounded-full bg-[#121212] border-2 border-[#F97316]/30 flex items-center justify-center text-[#F97316] shadow-[0_0_30px_rgba(249,115,22,0.15)] group hover:scale-110 transition-transform">
                                        <div className="text-xl metrics-font font-black">{item.day}</div>
                                    </div>
                                </div>

                                {/* Placeholder/Visual */}
                                <div className="flex-1 w-full flex items-center justify-center">
                                    <div className="w-full aspect-video rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group hover:border-[#F97316]/20 transition-all overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Play className="w-12 h-12 text-white/10 group-hover:text-[#F97316]/30 transition-all group-hover:scale-110" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#F97316]/20 w-1/3 group-hover:w-full transition-all duration-1000"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <section className="glass-card p-16 lg:p-24 text-center relative overflow-hidden hud-border hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-[#F97316]/10 via-transparent to-transparent -z-10" />
                    <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter uppercase italic mb-8">
                        Ready for <span className="text-[#F97316]">Certified Mastery?</span>
                    </h2>
                    <p className="text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Don't let your reps practice on live leads. Let them achieve mastery here first. 
                        Join hundreds of organizations transforming their sales floor today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/pricing">
                            <Button size="lg" className="btn-primary h-16 px-10 text-lg rounded-xl">
                                Initialize Training Path
                            </Button>
                        </Link>
                        <Link href="/enterprise">
                            <Button size="lg" className="btn-outline-solar h-16 px-10 text-lg rounded-xl">
                                Request Enterprise Demo
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Solar-Powered background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#F97316]/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 mb-10">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F97316]">
                        High-Performance Training
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-white mb-8 max-w-5xl mx-auto italic font-display">
                    The 7-Day Path to <br />
                    <span className="text-[#F97316]">Solar Mastery.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light font-body">
                    Restructured for <span className="text-white font-bold underline decoration-[#F59E0B]/30 underline-offset-4">Maximum Speed-to-Revenue.</span> <br className="hidden md:block" />
                    Transform from a salesperson into a Solar Consultant in one week.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-6 justify-center">
                    <Button 
                        size="lg" 
                        className="btn-solar h-16 px-10 text-xl flex items-center gap-3 border-none group"
                    >
                        Join the Mastery 
                        <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-16 px-10 text-xl border-white/10 text-white bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 font-display font-bold uppercase tracking-widest"
                    >
                        View Curriculum
                    </Button>
                </div>

                {/* Trust Section */}
                <div className="mt-24 pt-10 border-t border-white/5">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Trusted by 500+ Solar Organizations Worldwide</p>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
                        {/* Static placeholders for logos */}
                        <div className="h-6 w-32 bg-white/20 rounded-sm" />
                        <div className="h-6 w-32 bg-white/20 rounded-sm" />
                        <div className="h-6 w-32 bg-white/20 rounded-sm" />
                        <div className="h-6 w-32 bg-white/20 rounded-sm" />
                    </div>
                </div>
            </div>
        </section>
    )
}

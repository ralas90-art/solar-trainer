"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, PlayCircle } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    AI Coaching for Real Sales Conversations
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    Train Sales Reps <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Before They Talk to Customers
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    An AI-powered sales training platform that lets reps practice realistic conversations,
                    get scored, and prove readiness — <span className="text-white font-medium">before live leads.</span>
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full shadow-lg shadow-blue-900/20">
                        Request a Demo <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800 hover:text-white rounded-full">
                        <PlayCircle className="mr-2 w-5 h-5" /> See How It Works
                    </Button>
                </div>

                {/* Social Proof / Trust Placeholder */}
                <div className="mt-16 pt-8 border-t border-white/5">
                    <p className="text-slate-500 text-sm font-medium mb-4 uppercase tracking-widest">Trusted by Forward-Thinking Solar Teams</p>
                    <div className="flex justify-center gap-8 grayscale opacity-50">
                        {/* Placeholders for logos */}
                        <div className="h-8 w-24 bg-white/10 rounded" />
                        <div className="h-8 w-24 bg-white/10 rounded" />
                        <div className="h-8 w-24 bg-white/10 rounded" />
                        <div className="h-8 w-24 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        </section>
    )
}

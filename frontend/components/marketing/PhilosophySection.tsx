"use client"

import { WHITE_LABEL } from "@/lib/white-label.config"

export function PhilosophySection() {
    return (
        <section className="px-6 lg:px-20 py-20 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                    <div className="flex-1">
                        <p className="text-[#FF5722] font-black uppercase tracking-[0.3em] text-sm mb-6">
                            The {WHITE_LABEL.industry} Training Crisis
                        </p>
                        <blockquote className="text-3xl lg:text-5xl font-black text-white leading-tight font-display italic">
                            &quot;You are not just selling a product. You are <span className="text-[#F59E0B]">solving complex problems</span> and protecting clients from market volatility.&quot;
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    )
}

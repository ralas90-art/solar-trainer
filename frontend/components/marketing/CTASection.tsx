"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { WHITE_LABEL } from "@/lib/white-label.config"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[#FF5722]/5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5722]/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-black font-display tracking-tighter uppercase mb-6 italic">
                    Ready for <span className="text-[#F97316]">{WHITE_LABEL.companyName}?</span>
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    Join the top {WHITE_LABEL.industry.toLowerCase()} teams using AI simulation to certify their reps and close more deals.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/solar-sales-training-assessment">
                        <Button size="lg" className="btn-primary h-14 px-10 text-lg rounded-full">
                            Take Free Audit
                        </Button>
                    </Link>
                    <Link href="/enterprise">
                        <Button size="lg" className="btn-outline-solar h-14 px-10 text-lg rounded-full">
                            Enterprise Demo <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
                <p className="mt-6 text-sm text-slate-500">
                    No credit card required for pilot • SOC2 Compliant • Enterprise Ready
                </p>
            </div>
        </section>
    )
}

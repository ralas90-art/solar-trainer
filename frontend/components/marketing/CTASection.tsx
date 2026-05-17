"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[#FF5722]/5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5722]/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Stop Burning Leads?
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    Join the top solar teams using AI simulation to certify their reps and close more deals.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/enterprise" className="w-full sm:w-auto">
                        <Button size="lg" className="btn-solar w-full sm:w-auto h-14 px-10 text-lg rounded-full">
                            Get a Demo
                        </Button>
                    </Link>
                    <Link href="/pricing" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-white/20 text-white bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center">
                            View Pricing <ArrowRight className="ml-2 w-5 h-5" />
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

"use client"

import { CheckCircle2 } from "lucide-react"

export function AudienceSplit() {
    const segments = [
        {
            role: "Sales Managers",
            headline: "Stop Guessing Who is Ready",
            benefits: [
                "Automated roleplay assessments",
                "Performance analytics & leaderboards",
                "Consistent training across all locations",
                "Reduce ramp time by 50%"
            ]
        },
        {
            role: "Enterprise & Private Equity",
            headline: "Scale Consistency",
            benefits: [
                "White-label options available",
                "SOC2 Compliant Architecture",
                "API integrations with your CRM",
                "Custom scenario building"
            ]
        }
    ]

    return (
        <section id="use-cases" className="py-24 bg-slate-900/30 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Growth Teams</h2>
                    <p className="text-slate-400">Whether you run a team of 5 or 500, we scale with you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {segments.map((segment, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-10 rounded-3xl">
                            <div className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-4">{segment.role}</div>
                            <h3 className="text-2xl font-bold text-white mb-8">{segment.headline}</h3>
                            <ul className="space-y-4">
                                {segment.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

"use client"

import { MessageSquare, Target, Users, ShieldCheck } from "lucide-react"

export function ValuePropGrid() {
    const features = [
        {
            icon: MessageSquare,
            title: "Practice, Not Videos",
            description: "Reps train through real conversations instead of passive content. Active learning leads to 4x better retention."
        },
        {
            icon: Target,
            title: "Industry-Specific Scenarios",
            description: "Objections, language, and deal logic tailored to your sales environment. From 'Not Interested' to 'Price Shopper'."
        },
        {
            icon: Users,
            title: "Manager Visibility",
            description: "See who’s practicing, who’s improving, and who’s ready. Eliminate the guesswork in performance reviews."
        },
        {
            icon: ShieldCheck,
            title: "Readiness Enforcement",
            description: "Tie training performance to certification and lead access. Only certified reps get access to expensive leads."
        }
    ]

    return (
        <section id="product" className="py-24 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why Top Teams Choose SalesPro
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Traditional LMS platforms are passive. We built a flight simulator for your sales process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-950 border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

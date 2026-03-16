"use client"

export function ConversationFramework() {
    const steps = [
        { id: "01", title: "Pattern Interrupt", desc: "Shattering the 'salesman' stereotype within the first 15 seconds." },
        { id: "02", title: "Rapport", desc: "Building genuine human connection through active listening." },
        { id: "03", title: "Curiosity Question", desc: "Uncovering the 'why' behind the homeowner's interest." },
        { id: "04", title: "Problem Awareness", desc: "Highlighting the rising costs and instability of local utilities." },
        { id: "05", title: "Utility Bill Discovery", desc: "The technical deep-dive into consumption data and tax benefits." },
        { id: "06", title: "Qualification", desc: "Ensuring the home and the homeowner are a perfect fit for solar." },
        { id: "07", title: "Appointment", desc: "Securing the sit and moving toward energy independence.", highlight: true },
    ]

    return (
        <section className="px-6 lg:px-20 py-32 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display italic uppercase">
                        The Solar Conversation Framework
                    </h2>
                    <p className="text-slate-400 text-xl max-w-2xl font-body">
                        Our proprietary 7-step sequence designed for consultative excellence and peak conversion rates.
                    </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {steps.slice(0, 4).map((step) => (
                            <div key={step.id} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-[#F97316]/50 transition-all cursor-default">
                                <div className="metrics-font text-3xl font-black text-[#F97316]/40 group-hover:text-[#F97316] transition-colors">{step.id}</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-slate-500 text-sm font-body">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {steps.slice(4).map((step) => (
                            <div key={step.id} className={`flex items-center gap-6 p-6 rounded-2xl border transition-all cursor-default ${
                                step.highlight 
                                ? "bg-[#F97316] border-[#F97316] shadow-xl shadow-[#F97316]/20" 
                                : "bg-white/5 border-white/10 hover:border-[#F97316]/50 group"
                            }`}>
                                <div className={`metrics-font text-3xl font-black ${
                                    step.highlight ? "text-black" : "text-[#F97316]/40 group-hover:text-[#F97316]"
                                } transition-colors`}>{step.id}</div>
                                <div>
                                    <h3 className={`text-xl font-bold font-display uppercase tracking-tight ${step.highlight ? "text-black" : "text-white"}`}>{step.title}</h3>
                                    <p className={`text-sm font-body ${step.highlight ? "text-black/80 font-medium" : "text-slate-500"}`}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

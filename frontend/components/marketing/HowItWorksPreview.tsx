"use client"

export function HowItWorksPreview() {
    const steps = [
        {
            step: "01",
            title: "Select a Scenario",
            description: "Choose from our library of real-world objections (e.g., 'It costs too much', 'I need to think about it')."
        },
        {
            step: "02",
            title: "Roleplay with AI",
            description: "Speak naturally. our AI plays the role of the homeowner, reacting to your tone and arguments in real-time."
        },
        {
            step: "03",
            title: "Get Instant Feedback",
            description: "Receive a detailed scorecard analyzing your empathy, clarity, and objection handling techniques."
        },
        {
            step: "04",
            title: "Certify & Scale",
            description: "Pass the exams to unlock new leads. Managers track progress across the entire team."
        }
    ]

    return (
        <section id="how-it-works" className="py-24 bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* text Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            From Rookie to Pro in <span className="text-blue-400">Record Time</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-12">
                            Our simulation loop builds muscle memory faster than any video course. It's safe practice for high-stakes conversations.
                        </p>

                        <div className="space-y-8">
                            {steps.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 font-mono text-blue-400 font-bold">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold text-lg mb-1">{item.title}</h4>
                                        <p className="text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual/UI Mockup Placeholder */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
                            {/* Simulated UI Window */}
                            <div className="bg-slate-950 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                                {/* Placeholder for actual screenshot or component */}
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full" />
                                    </div>
                                    <p className="text-slate-500 font-mono text-sm">AI Simulator Active...</p>
                                    <div className="mt-8 space-y-2">
                                        <div className="h-2 bg-slate-800 rounded w-48 mx-auto" />
                                        <div className="h-2 bg-slate-800 rounded w-32 mx-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

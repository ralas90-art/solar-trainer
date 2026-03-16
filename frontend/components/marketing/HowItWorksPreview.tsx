"use client"

import { Headphones, Target, PlayCircle, BarChart3, TrendingUp, Sparkles, UserCheck } from "lucide-react"

export function HowItWorksPreview() {
    return (
        <section id="process" className="py-24 px-6 lg:px-20 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#F97316]/5 blur-[120px] rounded-full -z-10" />
            
            <div className="max-w-7xl mx-auto text-center mb-24">
                <span className="inline-block py-1 px-4 rounded-full border border-[#F97316]/30 bg-[#F97316]/5 text-[#F97316] text-xs font-bold uppercase tracking-widest mb-6 font-display">
                    Speed-to-Revenue Model
                </span>
                <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8 text-white font-display uppercase italic">
                    The 7-Day <span className="text-[#F97316]">Mastery Process</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-body font-light">
                    Transform rookie recruits into &quot;Solar Closers&quot; in one week. Our AI-driven simulator builds muscle memory using the 
                    <span className="text-white font-semibold italic"> Solar Conversation Framework</span>—from the first knock to the final appointment.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
                    {[
                        { val: "24h", label: "Onboarding" },
                        { val: "50+", label: "AI Roleplays" },
                        { val: "7 Days", label: "To First Deal" },
                        { val: "40%", label: "Lift in Close" }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-[#F97316]/30 transition-all">
                            <div className="text-[#F97316] text-3xl font-black metrics-font">{stat.val}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black font-display mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { icon: Headphones, step: "1", title: "Learn", desc: "Rapid audio modules covering pitch structures and psychology between knocks." },
                    { icon: Target, step: "2", title: "Practice", desc: "Interactive quizzes that test identification of value props under pressure." },
                    { icon: PlayCircle, step: "3", title: "Simulate", desc: "Live AI roleplay sessions with difficult homeowner personas for real experience." },
                    { icon: BarChart3, step: "4", title: "Improve", desc: "AI analysis of roleplays providing managers with precise coaching data." }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-6 p-8 glass-card hud-border hud-corner-tl hover:bg-white/[0.05] transition-all">
                        <div className="h-14 w-14 rounded-xl bg-[#F97316]/10 flex items-center justify-center border border-[#F97316]/20">
                            <item.icon className="w-8 h-8 text-[#F97316]" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white font-display italic uppercase mb-2">{item.step}. {item.title}</h4>
                            <p className="text-slate-400 font-body leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Final Speed-to-Revenue CTA */}
            <div className="mt-32 max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/5 to-transparent -z-10" />
                <h3 className="text-3xl font-black text-white mb-6 font-display italic uppercase">Master the Sale in <span className="text-[#F97316] underline decoration-[#F97316]/30 px-2">168 Hours</span></h3>
                <p className="text-slate-400 mb-10 font-body">Stop wasting leads on untrained reps. Build a world-class sales army with the science of AI roleplay.</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button className="btn-solar px-10 py-5 text-sm h-auto translate-y-0">Get Started Now</button>
                    <button className="px-10 py-5 text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-display font-black uppercase text-white tracking-widest">Schedule Training Audit</button>
                </div>
            </div>
        </section>
    )
}

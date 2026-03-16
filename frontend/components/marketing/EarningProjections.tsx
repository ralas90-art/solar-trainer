"use client"

export function EarningProjections() {
    return (
        <section className="px-6 lg:px-20 py-24">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4 font-display italic uppercase">Earning Projections</h2>
                    <p className="text-slate-500 font-body">Industry-standard performance milestones for certified SeptiVolt consultants.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-2xl flex flex-col items-center text-center group hover:bg-white/[0.08] transition-all">
                        <span className="text-slate-400 font-bold mb-4 font-display uppercase tracking-widest text-xs">Month 1</span>
                        <div className="metrics-font text-5xl font-bold text-[#F97316] mb-2">$3-5K</div>
                        <p className="text-sm text-slate-500 font-medium font-body uppercase tracking-tighter">Early Ramp-up Phase</p>
                    </div>
                    <div className="bg-[#F97316]/10 border border-[#F97316]/30 p-10 rounded-2xl flex flex-col items-center text-center relative overflow-hidden scale-105 shadow-2xl shadow-[#F97316]/20">
                        <div className="absolute top-0 right-0 bg-[#F97316] text-black font-black px-4 py-1 text-[10px] uppercase tracking-widest font-display">Target</div>
                        <span className="text-slate-400 font-bold mb-4 font-display uppercase tracking-widest text-xs">Month 3</span>
                        <div className="metrics-font text-5xl font-bold text-white mb-2">$8-12K</div>
                        <p className="text-sm text-slate-400 font-medium font-body uppercase tracking-tighter">Consistent Closures</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-10 rounded-2xl flex flex-col items-center text-center group hover:bg-white/[0.08] transition-all">
                        <span className="text-slate-400 font-bold mb-4 font-display uppercase tracking-widest text-xs">Month 6+</span>
                        <div className="metrics-font text-5xl font-bold text-[#F59E0B] mb-2">$15-25K+</div>
                        <p className="text-sm text-slate-500 font-medium font-body uppercase tracking-tighter">Master Consultant Level</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client"

export function PhilosophySection() {
    return (
        <section className="px-6 lg:px-20 py-20 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                    <div className="flex-1">
                        <h2 className="text-[#F97316] text-sm font-black uppercase tracking-widest mb-4 font-display">
                            Our Core Philosophy
                        </h2>
                        <blockquote className="text-3xl lg:text-5xl font-black text-white leading-tight font-display italic">
                            &quot;You are not selling panels. You are <span className="text-[#F59E0B]">restructuring utility spending</span> and protecting families from inflation.&quot;
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    )
}

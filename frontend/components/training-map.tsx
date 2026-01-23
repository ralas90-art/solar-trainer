import { motion } from "framer-motion"
import { CheckCircle2, Lock, MapPin, PlayCircle, Gamepad2 } from "lucide-react"

interface TrainingMapProps {
    onSelectModule: (moduleId: string) => void
    currentDay: number
}

const FULL_CURRICULUM = [
    {
        day: 1,
        title: "The Foundation",
        description: "Mindset, Basics & Qualifying",
        topics: ["Solar Mindset", "How Solar Works", "The Perfect House"],
        status: "completed",
        moduleId: "day_1_foundation",
        hasSimulator: false
    },
    {
        day: 2,
        title: "Prospecting",
        description: "The Hunt",
        topics: ["Territory Management", "Door Psychology", "Opening Strategies"],
        status: "active",
        moduleId: "day_2_prospecting",
        hasSimulator: true
    },
    {
        day: 3,
        title: "Connection",
        description: "Discovery & Psychology",
        topics: ["In-Home Mastery", "Personality Types", "Sales Vocabulary"],
        status: "active",
        moduleId: "day_3_discovery",
        hasSimulator: false
    },
    {
        day: 4,
        title: "Presentation",
        description: "Building Value",
        topics: ["The Bill Swap", "Money Roadmap", "Financing 101"],
        status: "active",
        moduleId: "day_4_presentation",
        hasSimulator: true
    },
    {
        day: 5,
        title: "Closing",
        description: "Objections & Decisions",
        topics: ["Objection Judo", "The Decision Matrix", "Paperwork"],
        status: "active",
        moduleId: "day_5_closing",
        hasSimulator: true
    },
    {
        day: 6,
        title: "Mastery",
        description: "Certification",
        topics: ["The Referral Engine", "Virtual Sales", "Final Exam"],
        status: "active",
        moduleId: "day_6_mastery",
        hasSimulator: true
    }
]

export function TrainingMap({ onSelectModule, currentDay }: TrainingMapProps) {
    return (
        <div className="space-y-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute left-[50%] top-10 bottom-10 w-1 bg-slate-800/20 -z-10 transform -translate-x-1/2"></div>

            {FULL_CURRICULUM.map((day, index) => {
                const isLeft = index % 2 === 0
                const isActive = day.status === "active"
                const isLocked = day.status === "locked"
                const isCompleted = day.status === "completed"

                return (
                    <motion.div
                        key={day.day}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`flex md:justify-center relative group`}
                    >
                        {/* Connecting Line (Mobile) - Simple vertical line on left */}
                        <div className="md:hidden absolute left-8 top-full h-8 w-1 bg-slate-200"></div>

                        <div className={`
                            flex flex-col md:flex-row items-center w-full max-w-4xl
                            ${isLeft ? 'md:flex-row-reverse' : ''}
                        `}>
                            {/* Card Content side */}
                            <div className="flex-1 p-4 w-full">
                                <div
                                    onClick={() => !isLocked && onSelectModule(day.moduleId)}
                                    className={`
                                        bg-white group-hover:bg-slate-50 p-6 rounded-xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-xl
                                        ${isActive ? 'border-primary ring-4 ring-primary/10 shadow-lg scale-[1.02]' : 'border-slate-200'}
                                        ${isLocked ? 'opacity-70 grayscale cursor-not-allowed bg-slate-50' : 'hover:-translate-y-1'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`
                                            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            Day {day.day}
                                        </div>
                                        {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                        {isActive && <PlayCircle className="w-6 h-6 text-primary animate-pulse" />}
                                        {isLocked && <Lock className="w-5 h-5 text-slate-400" />}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{day.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4">{day.description}</p>

                                    {day.hasSimulator && (
                                        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                                            <Gamepad2 className="w-3.5 h-3.5" />
                                            <span>Simulator Available</span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {day.topics.map((topic, i) => (
                                            <div key={i} className="flex items-center text-sm text-slate-600">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
                                                {topic}
                                            </div>
                                        ))}
                                    </div>

                                    {!isLocked && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                            <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                {isActive ? "Continue Mission" : "Review Module"} →
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Center Marker */}
                            <div className="relative shrink-0 z-10 px-4 md:px-8">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                    ${isActive ? 'bg-primary border-white shadow-xl scale-125' : ''}
                                    ${isCompleted ? 'bg-green-500 border-white' : ''}
                                    ${isLocked ? 'bg-slate-200 border-white' : ''}
                                `}>
                                    <span className={`text-xl font-bold ${isActive || isCompleted ? 'text-white' : 'text-slate-400'}`}>
                                        {day.day}
                                    </span>
                                </div>
                            </div>

                            {/* Spacer for alignment on desktop */}
                            <div className="hidden md:block flex-1"></div>
                        </div>
                    </motion.div>
                )
            })}

            <div className="flex justify-center pt-8 pb-16">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-xl transform hover:scale-105 transition-all cursor-pointer">
                    <MapPin className="text-yellow-400" />
                    <span className="font-bold">View Full Curriculum Map</span>
                </div>
            </div>
        </div>
    )
}

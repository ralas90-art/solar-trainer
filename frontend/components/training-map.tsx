import { motion } from "framer-motion"
import { CheckCircle2, Lock, PlayCircle, Gamepad2, Stars, Trophy, Zap } from "lucide-react"

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
        hasSimulator: true
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

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function TrainingMap({ onSelectModule, currentDay }: TrainingMapProps) {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                    <Stars className="w-4 h-4" />
                    <span>Solar Consultant Certification</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100 text-glow">
                    SpaceForce Training
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                    Master the art of solar sales through our 6-day intensive curriculum.
                </p>
                
                <div className="flex justify-center gap-8 pt-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                           <Trophy className="w-5 h-5 text-yellow-500" /> 1
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Modules Done</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5 text-blue-500" /> 5
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Modules Active</div>
                    </div>
                </div>
            </motion.div>

            {/* Cinematic Grid */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4"
            >
                {FULL_CURRICULUM.map((day) => {
                    const isActive = day.status === "active"
                    const isLocked = day.status === "locked"
                    const isCompleted = day.status === "completed"

                    return (
                        <motion.div variants={item} key={day.day} className="h-full">
                            <div
                                onClick={() => !isLocked && onSelectModule(day.moduleId)}
                                className={`
                                    glass-card h-full p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer
                                    ${isActive ? 'ring-1 ring-blue-500/50 hover:ring-blue-400 hover:shadow-blue-500/20 hover:-translate-y-2' : ''}
                                    ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                    ${isCompleted ? 'border-green-500/30' : ''}
                                `}
                            >
                                {/* Background Glow for Active Cards */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                )}

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                                            ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}
                                            ${isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                                        `}>
                                            {day.day}
                                        </div>
                                        
                                        {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                                        {isActive && <PlayCircle className="w-6 h-6 text-blue-400 animate-pulse" />}
                                        {isLocked && <Lock className="w-5 h-5 text-slate-600" />}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">{day.title}</h3>
                                    <p className="text-slate-400 text-sm mb-6">{day.description}</p>

                                    {day.hasSimulator && (
                                        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold self-start">
                                            <Gamepad2 className="w-3.5 h-3.5" />
                                            <span>AI SIMULATOR</span>
                                        </div>
                                    )}

                                    <div className="space-y-2 mb-6 flex-1">
                                        {day.topics.map((topic, i) => (
                                            <div key={i} className="flex items-center text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                                                <div className={`w-1 h-1 rounded-full mr-2 ${isActive ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                                                {topic}
                                            </div>
                                        ))}
                                    </div>

                                    {!isLocked && (
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm font-medium">
                                            <span className="text-slate-400">20 min</span>
                                            <span className={`${isActive ? 'text-blue-400 group-hover:text-blue-300' : 'text-slate-400'} flex items-center gap-1 transition-all`}>
                                                {isActive ? "Start Mission" : "Review"} 
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}

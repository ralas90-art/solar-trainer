import { SlideDeck } from "@/components/slide-deck"
import { SimulationWindow } from "@/components/simulation-ui"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, BookOpen, Crown, AlertTriangle, CheckCircle } from "lucide-react"
import { MODULES } from "@/lib/modules"

interface TrainingContentProps {
    moduleId: string
    onBack: () => void
    onComplete: () => void
}

export function TrainingContent({ moduleId, onBack, onComplete }: TrainingContentProps) {
    const moduleData = MODULES[moduleId]

    if (!moduleData) {
        return (
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
                <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">Go Back</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Cinematic Header */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-white/5 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Base
                    </Button>

                    <div className="flex gap-3">
                        {moduleData.pdfDownloadUrl && (
                            <a href={moduleData.pdfDownloadUrl} download className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium">
                                <Download className="w-4 h-4" /> Workbook
                            </a>
                        )}
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live Session
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-12">
                {/* Title Section */}
                <div className="mb-16 text-center space-y-4">
                    <div className="inline-block text-amber-500 font-bold tracking-[0.2em] text-sm uppercase mb-2">{moduleData.subtitle}</div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white text-glow">{moduleData.title}</h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-8"></div>
                </div>

                {/* Content Flow */}
                <div className="space-y-16">
                    {moduleData.sections.map((section, index) => (
                        <section key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative" style={{ animationDelay: `${index * 150}ms` }}>
                            {/* Section Title */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700"></div>
                                <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm text-slate-400 border border-slate-700">{index + 1}</span>
                                    {section.title}
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700"></div>
                            </div>

                            {/* Resource Download Block (Day 1 etc) */}
                            {index === 0 && (moduleData.pdfDownloadUrl || moduleData.slideDeckUrl) && (
                                <div className="mb-12 glass-card p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-blue-500">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-blue-400" /> Mission Assets
                                        </h3>
                                        <p className="text-slate-400 text-sm">Vital intelligence for this mission. Download before proceeding.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {moduleData.pdfDownloadUrl && (
                                            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                                                <a href={moduleData.pdfDownloadUrl} download>
                                                    <Download className="w-4 h-4 mr-2" /> PDF Guide
                                                </a>
                                            </Button>
                                        )}
                                        {moduleData.slideDeckUrl && (
                                            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-white/5">
                                                <a href={moduleData.slideDeckUrl} download>
                                                    <Download className="w-4 h-4 mr-2" /> Slides (PPTX)
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Content Block */}
                            <div className="">
                                {section.type === 'text' && (
                                    <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                                )}

                                {section.type === 'quote' && (
                                    <blockquote className="glass-card p-8 border-l-4 border-l-amber-500 rounded-r-xl my-8">
                                        <p className="text-xl italic text-amber-100/90 font-light leading-relaxed">"{section.content}"</p>
                                    </blockquote>
                                )}

                                {section.type === 'image' && section.imageSrc && (
                                    <div className="my-8 rounded-2xl overflow-hidden glass-card p-2">
                                        <img src={section.imageSrc} alt={section.title} className="w-full h-auto rounded-xl" />
                                        <p className="p-3 text-center text-sm text-slate-500 italic">{section.content}</p>
                                    </div>
                                )}

                                {section.type === 'slides' && section.slides && (
                                    <div className="my-10 glass-card p-2 rounded-2xl">
                                        <SlideDeck slides={section.slides} />
                                        <p className="mt-4 text-sm text-center text-slate-500 italic pb-2">{section.content}</p>
                                    </div>
                                )}

                                {section.type === 'simulation' && section.scenarioId && (
                                    <div className="my-12">
                                        <SimulationWindow
                                            tenant={{ id: "demo", name: "Antigravity Solar" }}
                                            stateCode="CA" // Default to CA for training modules
                                            userId="trainee" // Default user
                                            scenario={{
                                                id: section.scenarioId,
                                                name: "Training Roleplay",
                                                description: section.content
                                            }}
                                        />
                                    </div>
                                )}

                                {section.type === 'list' && (
                                    <div className="space-y-6">
                                        <p className="text-slate-300">{section.content}</p>
                                        <ul className="grid gap-4">
                                            {section.items?.map((item, i) => (
                                                <li key={i} className="flex items-start gap-4 glass-card p-4 rounded-xl hover:bg-white/5 transition-colors">
                                                    <span className="bg-blue-500/20 text-blue-400 font-bold px-2.5 py-0.5 rounded text-sm shrink-0 border border-blue-500/30">0{i + 1}</span>
                                                    <span className="text-slate-200">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {section.type === 'comparison' && section.comparison && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div className="glass-card p-6 rounded-xl border-t-2 border-t-red-500 bg-red-900/5">
                                            <h3 className="font-bold text-red-400 mb-3 uppercase tracking-wide text-xs flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" /> Rookie Mistake
                                            </h3>
                                            <p className="text-slate-300">{section.comparison.rookie}</p>
                                        </div>
                                        <div className="glass-card p-6 rounded-xl border-t-2 border-t-green-500 bg-green-900/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <Crown className="w-12 h-12 text-green-500" />
                                            </div>
                                            <h3 className="font-bold text-green-400 mb-3 uppercase tracking-wide text-xs flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Pro Move
                                            </h3>
                                            <p className="text-white font-medium">{section.comparison.pro}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="mt-24 pb-12 text-center">
                    <Button
                        onClick={onComplete}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xl px-12 py-8 h-auto rounded-2xl shadow-2xl shadow-blue-900/50 hover:scale-105 transition-all w-full md:w-auto"
                    >
                        <span className="flex flex-col items-center">
                            <span>Complete Mission</span>
                            <span className="text-xs font-normal text-blue-200 mt-1 uppercase tracking-widest">Collect XP & Proceed</span>
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

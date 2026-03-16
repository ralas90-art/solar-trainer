import { useState } from "react"
import dynamic from "next/dynamic"
import { SlideDeck } from "@/components/slide-deck"
import { QuizModule } from "@/components/quiz"
import { SimulationWindow } from "@/components/simulation-ui"
import { SequentialSimulation } from "@/components/sequential-simulation"
import { WorkbookPromptBlock } from "@/components/workbook-prompt"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, BookOpen, Crown, AlertTriangle, CheckCircle, Zap, PenLine } from "lucide-react"
import { MODULES, MODULE_SCENARIOS } from "@/lib/modules"
import { WHITE_LABEL, SLIDE_START_PAGES } from "@/lib/white-label.config"

// Dynamically import to avoid SSR issues with react-pdf
const PdfSlideViewer = dynamic(
    () => import("@/components/pdf-slide-viewer").then(m => ({ default: m.PdfSlideViewer })),
    { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Loading slides…</div> }
)

interface TrainingContentProps {
    moduleId: string
    onBack: () => void
    onComplete: () => void
}

export function TrainingContent({ moduleId, onBack, onComplete }: TrainingContentProps) {
    // Image Zoom State
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    // Sequential Simulation State
    const [showSequentialSim, setShowSequentialSim] = useState(false)
    const moduleData = MODULES[moduleId]
    const moduleScenarios = MODULE_SCENARIOS[moduleId] || []

    if (!moduleData) {
        return (
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
                <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">Go Back</Button>
            </div>
        )
    }

    // Show Sequential Simulation if activated
    if (showSequentialSim && moduleScenarios.length > 0) {
        return (
            <SequentialSimulation
                moduleId={moduleId}
                scenarioIds={moduleScenarios}
                userId="trainee" // TODO: Get from props or context
                tenant={{ id: "demo", name: "SalesPro Solar" }}
                stateCode="CA"
                onComplete={() => {
                    setShowSequentialSim(false)
                    // Optionally mark scenarios as complete
                }}
                onBack={() => setShowSequentialSim(false)}
            />
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* ── SeptiVolt HUD Top Bar ── */}
            <div className="sticky top-0 z-50 border-b"
                style={{
                    background: 'rgba(18,18,18,0.92)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'rgba(255,87,34,0.1)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.5)'
                }}>
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                    <button onClick={onBack}
                        className="flex items-center gap-2 font-hud text-xs uppercase tracking-widest transition-all"
                        style={{ color: '#94A3B8' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FF5722'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}>
                        <ArrowLeft className="w-4 h-4" /> Back to Base
                    </button>

                    <div className="flex gap-2">
                        {moduleData.pdfDownloadUrl && (
                            <a href={moduleData.pdfDownloadUrl} download
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-hud text-xs uppercase tracking-wide transition-all"
                                style={{ background: 'rgba(255,87,34,0.08)', border: '1px solid rgba(255,87,34,0.25)', color: '#FF5722' }}>
                                <Download className="w-3.5 h-3.5" /> Workbook
                            </a>
                        )}
                        {moduleId.startsWith("mod_") && (
                            <button
                                onClick={() => {
                                    const dayNum = parseInt(moduleId.split("_")[1])
                                    if (dayNum) {
                                        import("@/lib/workbook-pdf").then(m => m.generateDayWorkbookPDF(dayNum))
                                    }
                                }}
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-hud text-xs uppercase tracking-wide transition-all"
                                style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.3)', color: '#FFB300' }}
                            >
                                <PenLine className="w-3.5 h-3.5" /> Day Workbook
                            </button>
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
                    <div className="inline-block font-hud text-xs uppercase tracking-[0.2em] mb-3"
                        style={{ color: '#FF5722' }}>{moduleData.subtitle}</div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-white"
                        style={{ textShadow: '0 0 40px rgba(255,87,34,0.2)' }}>
                        {moduleData.title}
                    </h1>
                    <div className="h-px w-24 mx-auto mt-6"
                        style={{ background: 'linear-gradient(90deg, transparent, #FF5722, transparent)' }} />

                    {/* Launch Simulator Button */}
                    {moduleScenarios.length > 0 && (
                        <div className="mt-12">
                            <Button
                                onClick={() => setShowSequentialSim(true)}
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-all"
                            >
                                <Zap className="mr-2 h-5 w-5" />
                                Launch AI Simulator ({moduleScenarios.length} Scenarios)
                            </Button>
                            <p className="text-sm text-slate-400 mt-3">
                                Complete all scenarios sequentially to master this module
                            </p>
                        </div>
                    )}
                </div>

                {/* ── PDF Slide Viewer ── */}
                {(() => {
                    if (WHITE_LABEL.presentationMode === "download_only") return null
                    const dayNum = parseInt(moduleId.split("_")[1])
                    if (!dayNum) return null

                    if (WHITE_LABEL.presentationMode === "google_slides") {
                        const embedUrl = WHITE_LABEL.slideEmbedUrls[dayNum as keyof typeof WHITE_LABEL.slideEmbedUrls]
                        if (!embedUrl) return null
                        return (
                            <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    style={{ aspectRatio: "16/9", border: 0 }}
                                    allowFullScreen
                                    title={`Day ${dayNum} Presentation`}
                                />
                            </div>
                        )
                    }

                    // local_pdf mode
                    const pdfPath = WHITE_LABEL.dayPdfPaths[dayNum as keyof typeof WHITE_LABEL.dayPdfPaths]
                    if (!pdfPath) return null
                    const startPage = SLIDE_START_PAGES[moduleId] ?? 1
                    const pptxPath = moduleData.slideDeckUrl

                    return (
                        <div className="mb-12">
                            <PdfSlideViewer
                                pdfUrl={pdfPath}
                                initialPage={startPage}
                                downloadUrl={pptxPath}
                                title={moduleData.title}
                            />
                        </div>
                    )
                })()}

                {/* Content Flow */}
                <div className="space-y-16">
                    {moduleData.sections
                        .filter(section => section.type !== 'simulation') // Hide individual simulations
                        .map((section, index) => (
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
                                        <div
                                            onClick={() => setSelectedImage(section.imageSrc!)}
                                            className="my-8 rounded-2xl overflow-hidden glass-card p-4 flex justify-center bg-black/20 cursor-zoom-in relative group"
                                        >
                                            <img src={section.imageSrc} alt={section.title} className="w-full h-auto max-w-5xl max-h-[700px] object-contain rounded-xl shadow-lg border border-white/5 group-hover:scale-[1.01] transition-transform duration-300" />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">Click to Expand</div>
                                            </div>
                                            <p className="p-3 text-center text-sm text-slate-500 italic hidden">{section.content}</p>
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
                                                tenant={{ id: "demo", name: "SalesPro Solar" }}
                                                stateCode="CA"
                                                userId="trainee"
                                                scenario={{
                                                    id: section.scenarioId,
                                                    name: "Training Roleplay",
                                                    description: section.content,
                                                    opening_line: section.openingLine
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

                {/* Workbook Prompts */}
                {moduleData.workbookPrompts && moduleData.workbookPrompts.length > 0 && (
                    <div className="max-w-4xl mx-auto px-6">
                        <WorkbookPromptBlock moduleId={moduleId} prompts={moduleData.workbookPrompts} />
                    </div>
                )}

                {/* Footer Action */}
            </div>

            {/* Quiz Section */}
            {moduleData.quiz && (
                <div className="mt-24 mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50"></div>
                        <h2 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Mission Certification</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/50"></div>
                    </div>
                    <QuizModule
                        quiz={moduleData.quiz}
                        onComplete={(score) => {
                            // For now, passing the quiz auto-completes the module
                            onComplete()
                        }}
                    />
                </div>
            )}

            {/* Footer Action - Only show if NO quiz (Quiz handles completion) */}
            {!moduleData.quiz && (
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
            )}

            {/* Image Zoom Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Zoomed Content"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                        <button className="absolute top-4 right-4 text-white hover:text-blue-400">
                            <span className="text-sm uppercase tracking-widest font-bold">Close [ESC]</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

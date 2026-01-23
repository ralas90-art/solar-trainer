import { SlideDeck } from "@/components/slide-deck"
import { SimulationWindow } from "@/components/simulation-ui" // Added import
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800">Module Not Found</h2>
                <p className="text-slate-500 mb-4">The content for this module is currently under development.</p>
                <div className="flex gap-4">
                    <Button onClick={onBack} variant="outline">Go Back</Button>
                    <Button onClick={onComplete}>Mock Complete (Dev)</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-xl">
            {/* Header */}
            <div className="bg-slate-900 text-white p-8 sticky top-0 z-10">
                <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white mb-4 pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Map
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-2">{moduleData.subtitle}</div>
                        <h1 className="text-4xl font-bold">{moduleData.title}</h1>
                    </div>
                    <div className="flex gap-4">
                        {moduleData.pdfDownloadUrl && (
                            <a href={moduleData.pdfDownloadUrl} download className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                <span>Workbook</span>
                            </a>
                        )}
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <div className="text-2xl font-bold text-center">In Progress</div>
                            <div className="text-xs text-slate-400 uppercase">Status</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-12 space-y-12 text-lg text-slate-800 leading-relaxed">

                {moduleData.sections.map((section, index) => (
                    <section key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            {section.title}
                        </h2>

                        {/* Highlighted Workbook Download Section (Only for the first section if URL exists) */}
                        {index === 0 && (moduleData.pdfDownloadUrl || moduleData.slideDeckUrl) && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-900 mb-1">Module Resources</h3>
                                    <p className="text-blue-700 text-sm">Download your workbook and presentation materials.</p>
                                </div>
                                <div className="flex gap-2">
                                    {moduleData.pdfDownloadUrl && (
                                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                            <a href={moduleData.pdfDownloadUrl} download>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                Workbook PDF
                                            </a>
                                        </Button>
                                    )}
                                    {moduleData.slideDeckUrl && (
                                        <Button asChild variant="secondary" className="bg-white hover:bg-slate-50 text-blue-700 border border-blue-200">
                                            <a href={moduleData.slideDeckUrl} download>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
                                                Slide Deck (PPTX)
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {section.type === 'text' && (
                            <p className="mb-4 text-slate-700 whitespace-pre-wrap">{section.content}</p>
                        )}

                        {section.type === 'quote' && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 italic text-blue-900 font-medium text-xl">
                                {section.content}
                            </div>
                        )}

                        {section.type === 'image' && section.imageSrc && (
                            <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                                <img src={section.imageSrc} alt={section.title} className="w-full h-auto object-contain bg-slate-100" />
                                <p className="p-3 text-center text-sm text-slate-500 bg-slate-50 border-t border-slate-100 italic">{section.content}</p>
                            </div>
                        )}

                        {section.type === 'slides' && section.slides && (
                            <div className="my-8">
                                <SlideDeck slides={section.slides} />
                                <p className="mt-4 text-sm text-center text-slate-500 italic">{section.content}</p>
                            </div>
                        )}

                        {section.type === 'simulation' && section.scenarioId && (
                            <div className="my-10">
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
                            <div className="space-y-4">
                                <p className="mb-4">{section.content}</p>
                                <ul className="space-y-3">
                                    {section.items?.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-sm shrink-0">{i + 1}</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {section.type === 'comparison' && section.comparison && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                    <h3 className="font-bold text-red-800 mb-2 uppercase tracking-wide text-sm">❌ Rookie Mistake</h3>
                                    <p className="text-red-700">{section.comparison.rookie}</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
                                    <h3 className="font-bold text-green-800 mb-2 uppercase tracking-wide text-sm">✅ Pro Move</h3>
                                    <p className="text-green-700 font-medium">{section.comparison.pro}</p>
                                </div>
                            </div>
                        )}
                    </section>
                ))}

                {/* Footer Action */}
                <div className="pt-12 border-t border-slate-200 flex justify-end">
                    <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl px-8 py-6 h-auto shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:-translate-y-1">
                        Complete Module & Collect XP →
                    </Button>
                </div>
            </div>
        </div>
    )
}

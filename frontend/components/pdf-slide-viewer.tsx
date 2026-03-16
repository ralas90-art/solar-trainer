"use client"
/**
 * pdf-slide-viewer.tsx
 * Interactive in-page PDF slide viewer built on react-pdf v6.
 */
import { useState, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, Maximize2, Download, Presentation } from "lucide-react"

// Use the CDN worker — avoids bundler ESM parsing issues with Next.js 14
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PdfSlideViewerProps {
    pdfUrl: string          // e.g. "/slides/Day_1_Foundation.pdf"
    initialPage?: number    // 1-indexed starting slide (from SLIDE_START_PAGES)
    downloadUrl?: string    // optional PPTX download link
    title?: string
}

export function PdfSlideViewer({ pdfUrl, initialPage = 1, downloadUrl, title }: PdfSlideViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
        setIsLoading(false)
    }, [])

    const onDocumentLoadError = useCallback((err: Error) => {
        setError("Could not load the presentation. Please try the download link below.")
        setIsLoading(false)
        console.error("PDF load error:", err)
    }, [])

    const goTo = (page: number) => {
        if (page >= 1 && page <= numPages) setCurrentPage(page)
    }

    const progress = numPages > 0 ? ((currentPage - 1) / (numPages - 1)) * 100 : 0

    return (
        <div className={`pdf-slide-viewer rounded-2xl overflow-hidden border border-white/10 bg-slate-900 ${isFullscreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl" : ""}`}>

            {/* ── Header Bar ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Presentation className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white truncate max-w-xs">{title || "Training Slides"}</span>
                </div>
                <div className="flex items-center gap-3">
                    {numPages > 0 && (
                        <span className="text-xs text-slate-400 font-mono">
                            {currentPage} / {numPages}
                        </span>
                    )}
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                            title="Download PPTX"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </a>
                    )}
                    <button
                        onClick={() => setIsFullscreen(f => !f)}
                        className="text-slate-400 hover:text-white transition-colors"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* ── Slide Canvas ── */}
            <div className="relative flex items-center justify-center bg-slate-950 min-h-[300px]" style={{ aspectRatio: "16/9" }}>
                {/* Prev button */}
                <button
                    onClick={() => goTo(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="absolute left-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* PDF Page */}
                {error ? (
                    <div className="text-center px-8 py-12">
                        <p className="text-red-400 text-sm mb-3">{error}</p>
                        {downloadUrl && (
                            <a href={downloadUrl} download className="text-amber-400 text-sm underline">
                                Download slides instead
                            </a>
                        )}
                    </div>
                ) : (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center gap-3 py-16">
                                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-slate-400 text-sm">Loading slides…</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={currentPage}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="max-w-full"
                            width={isFullscreen ? undefined : 960}
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </Document>
                )}

                {/* Next button */}
                <button
                    onClick={() => goTo(currentPage + 1)}
                    disabled={currentPage >= numPages}
                    className="absolute right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* ── Progress Bar + Page Dots ── */}
            {numPages > 0 && (
                <div className="px-4 py-3 bg-slate-800/60 border-t border-white/10 space-y-2">
                    {/* Thin progress bar */}
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {/* Jump buttons for small decks */}
                    {numPages <= 20 && (
                        <div className="flex gap-1 flex-wrap justify-center">
                            {Array.from({ length: numPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i + 1)}
                                    className={`w-2 h-2 rounded-full transition-all ${i + 1 === currentPage ? "bg-amber-400 scale-125" : "bg-slate-600 hover:bg-slate-400"}`}
                                />
                            ))}
                        </div>
                    )}
                    {/* Keyboard hint */}
                    <p className="text-center text-xs text-slate-600">Use ← → buttons or click the arrows to navigate</p>
                </div>
            )}
        </div>
    )
}

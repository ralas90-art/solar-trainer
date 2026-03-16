"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Slide {
    title: string
    content: string
    image?: string // Path to image
    imagePlaceholder?: string // Text to show in the placeholder box
}

interface SlideDeckProps {
    slides: Slide[]
}

export function SlideDeck({ slides }: SlideDeckProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1)
        }
    }

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1)
        }
    }

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 aspect-video relative flex flex-col">
            {/* Screen Content */}
            <div className="flex-1 relative overflow-hidden bg-slate-800">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center"
                    >
                        <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 max-w-2xl leading-tight">
                            {slides[currentSlide].title}
                        </h3>


                        {slides[currentSlide].image ? (
                            <div className="relative w-full h-[500px] mb-8 rounded-lg overflow-hidden shadow-lg border border-slate-600 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <img
                                    src={slides[currentSlide].image}
                                    alt={slides[currentSlide].title}
                                    className="object-contain w-full h-full max-h-full hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        ) : slides[currentSlide].imagePlaceholder && (
                            <div className="w-48 h-48 bg-slate-700 rounded-full flex items-center justify-center mb-8 border-4 border-slate-600 shadow-inner">
                                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">{slides[currentSlide].imagePlaceholder}</span>
                            </div>
                        )}

                        <p className="text-xl text-slate-200 max-w-3xl leading-relaxed">
                            {slides[currentSlide].content}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Slide Number */}
                <div className="absolute bottom-4 right-6 text-slate-500 font-mono text-sm">
                    {currentSlide + 1} / {slides.length}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-950 p-4 flex items-center justify-between border-t border-slate-800">
                <Button
                    variant="ghost"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ChevronLeft className="w-6 h-6 mr-2" /> Previous
                </Button>

                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-blue-500 w-6' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                    Next <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
            </div>
        </div>
    )
}

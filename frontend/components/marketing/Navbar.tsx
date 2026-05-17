"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Zap, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316]/20 transition-all">
                            <Zap className="w-4 h-4 fill-[#F97316]" />
                        </div>
                        <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">SeptiVolt</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/#process" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">How it Works</Link>
                        <Link href="/curriculum-preview" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Curriculum</Link>
                        <Link href="/solar-sales-training-assessment" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#F97316] transition-colors font-display">Free Audit</Link>
                        <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Pricing</Link>
                        <Link href="/enterprise" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Enterprise</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#F97316] transition-colors font-display">Log In</Link>
                        <Link href="/pricing" className="hidden md:block">
                            <Button className="btn-primary h-10 px-6 text-[10px]">Get Started</Button>
                        </Link>
                        <button 
                            className="md:hidden text-white min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
                            onClick={() => setIsOpen(prev => !prev)}
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] bg-[#121212] h-[100dvh] overflow-y-auto w-full flex flex-col">
                    {/* Header Bar matching desktop layout height */}
                    <div className="flex justify-between items-center h-20 px-4 sm:px-6 border-b border-white/5">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316]/20 transition-all">
                                <Zap className="w-4 h-4 fill-[#F97316]" />
                            </div>
                            <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">SeptiVolt</span>
                        </Link>
                        <button 
                            className="text-slate-400 hover:text-white min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                    <div className="flex flex-col px-6 pt-6 gap-6 flex-1 pb-24">
                        <Link href="/#process" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2">How it Works</Link>
                        <div className="h-px bg-white/5 w-full" />
                        <Link href="/curriculum-preview" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2">Curriculum</Link>
                        <div className="h-px bg-white/5 w-full" />
                        <Link href="/solar-sales-training-assessment" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-[#F97316] transition-colors font-display py-2">Free Audit</Link>
                        <div className="h-px bg-white/5 w-full" />
                        <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2">Pricing</Link>
                        <div className="h-px bg-white/5 w-full" />
                        <Link href="/enterprise" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2">Enterprise</Link>
                        <div className="h-px bg-white/5 w-full" />
                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2">Log In</Link>
                        
                        <div className="pt-8 pb-10 mt-auto">
                            <Link href="/pricing" onClick={() => setIsOpen(false)} className="w-full">
                                <Button variant="solar" className="w-full h-14 text-sm tracking-widest">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

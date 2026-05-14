"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { useState } from "react"
import { WHITE_LABEL } from "@/lib/white-label.config"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316]/20 transition-all">
                            <Zap className="w-4 h-4 fill-[#F97316]" />
                        </div>
                        <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
                            {WHITE_LABEL.companyName}
                            {WHITE_LABEL.isDemoMode && (
                                <span className="ml-1 text-[8px] bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 px-1 py-0.5 rounded uppercase not-italic tracking-widest">Demo</span>
                            )}
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/#process" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">How it Works</Link>
                        <Link href="/curriculum-preview" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Curriculum</Link>
                        <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Pricing</Link>
                        <Link href="/#about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#F97316] transition-colors font-display">Log In</Link>
                        <Link href="/pricing">
                            <Button className="btn-primary h-10 px-6 text-[10px]">Portal Access</Button>
                        </Link>
                        <button 
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#121212] border-b border-white/5 px-4 pt-2 pb-6 space-y-4">
                    <Link href="/#process" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                    <Link href="/curriculum-preview" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2" onClick={() => setIsMenuOpen(false)}>Curriculum</Link>
                    <Link href="/pricing" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    <Link href="/#about" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#F97316] transition-colors font-display py-2" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                            <Button className="btn-primary w-full h-12 text-[10px]">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

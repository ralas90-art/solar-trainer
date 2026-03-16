"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Zap } from "lucide-react"

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316]/20 transition-all">
                            <Zap className="w-4 h-4 fill-[#F97316]" />
                        </div>
                        <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">Septi<span className="text-[#F97316]">Volt</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/#process" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">How it Works</Link>
                        <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">Pricing</Link>
                        <Link href="/#about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#F97316] transition-colors font-display">About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#F97316] transition-colors font-display">Log In</Link>
                        <Button className="btn-solar h-10 px-6 text-[10px]">Portal Access</Button>
                        <button className="md:hidden text-white p-2">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

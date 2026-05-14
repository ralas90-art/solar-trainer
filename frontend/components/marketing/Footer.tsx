"use client"

import { Zap } from "lucide-react"
import Link from "next/link"
import { WHITE_LABEL } from "@/lib/white-label.config"

export function Footer() {
    return (
        <footer className="bg-[#121212] border-t border-white/5 py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
                                <Zap className="w-4 h-4 fill-[#F97316]" />
                            </div>
                            <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
                                {WHITE_LABEL.companyName}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            The elite AI flight simulator for {WHITE_LABEL.industry.toLowerCase()} sales teams. 
                            Training the next generation of top-tier closers.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-display font-black uppercase tracking-widest text-xs mb-6 italic">Product</h4>
                        <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-display">
                            <li><Link href="/#process" className="hover:text-[#F97316] transition-colors">Mastery Path</Link></li>
                            <li><Link href="/pricing" className="hover:text-[#F97316] transition-colors">Pricing</Link></li>
                            <li><Link href="/enterprise" className="hover:text-[#F97316] transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-display font-black uppercase tracking-widest text-xs mb-6 italic">Resources</h4>
                        <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-display">
                            <li><Link href="/curriculum-preview" className="hover:text-[#F97316] transition-colors">Framework Blog</Link></li>
                            <li><Link href="/curriculum-preview" className="hover:text-[#F97316] transition-colors">PPA Scripts</Link></li>
                            <li><Link href="/curriculum-preview" className="hover:text-[#F97316] transition-colors">Closed Deals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-display font-black uppercase tracking-widest text-xs mb-6 italic">Connect</h4>
                        <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-display">
                            <li><Link href="/contact" className="hover:text-[#F97316] transition-colors">Contact Support</Link></li>
                            <li><Link href="/#connect" className="hover:text-[#F97316] transition-colors opacity-50 cursor-not-allowed">Twitter / X (Coming Soon)</Link></li>
                            <li><Link href="/#connect" className="hover:text-[#F97316] transition-colors opacity-50 cursor-not-allowed">LinkedIn (Coming Soon)</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] font-display">© 2026 {WHITE_LABEL.companyName} Mastery. All rights reserved.</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
                        <Link href="/privacy" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] font-display">Privacy</Link>
                        <Link href="/terms" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] font-display">Terms</Link>
                        <Link href="/acceptable-use" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] font-display">Acceptable Use</Link>
                        <Link href="/refund-policy" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] font-display">Refunds</Link>
                        <Link href="/cookie-policy" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] font-display">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

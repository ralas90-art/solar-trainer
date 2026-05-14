"use client"

import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { motion } from "framer-motion"

interface LegalPageLayoutProps {
    title: string
    lastUpdated: string
    children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-body">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 lg:px-20 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-display font-black uppercase italic tracking-tighter mb-4">
                        {title}
                    </h1>
                    <p className="text-slate-500 text-sm mb-12 font-display uppercase tracking-widest italic">
                        Last Updated: {lastUpdated}
                    </p>
                    
                    <div className="prose prose-invert prose-slate max-w-none 
                        prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                        prose-li:text-slate-300 prose-li:mb-2
                        prose-strong:text-white prose-strong:font-bold
                    ">
                        {children}
                    </div>
                </motion.div>
            </main>
            
            <Footer />
        </div>
    )
}

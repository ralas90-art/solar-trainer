"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">SalesPro</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#product" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Product</Link>
                            <Link href="#use-cases" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Use Cases</Link>
                            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Pricing</Link>
                            <Link href="#enterprise" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Enterprise</Link>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-slate-300 hover:text-white font-medium text-sm">Login</Link>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                                Request Demo
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="#product" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Product</Link>
                        <Link href="#use-cases" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Use Cases</Link>
                        <Link href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Pricing</Link>
                        <Link href="#enterprise" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Enterprise</Link>
                        <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300">Login</Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                A
                            </div>
                            <span className="font-bold text-lg text-white">SalesPro</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            The AI Flight Simulator for Solar Sales Professionals.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400">Enterprise</a></li>
                            <li><a href="#" className="hover:text-blue-400">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400">Solar Sales Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400">Script Templates</a></li>
                            <li><a href="#" className="hover:text-blue-400">Objection Handling</a></li>
                            <li><a href="#" className="hover:text-blue-400">Customers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400">Legal</a></li>
                            <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-sm">© 2024 SalesPro. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-600 hover:text-white text-sm">Privacy Policy</a>
                        <a href="#" className="text-slate-600 hover:text-white text-sm">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

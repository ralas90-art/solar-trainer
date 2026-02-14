"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Printer } from "lucide-react"

export function CertificateUI({ user, score, tenant, moduleProgress }: { user: any, score: number, tenant: any, moduleProgress: any }) {
    const isCertified = moduleProgress?.["day_6_mastery"]?.quiz === true
    if (!isCertified) return null

    const handlePrint = () => {
        window.print()
    }

    return (
        <Card className="mt-6 border-2 border-yellow-400 bg-yellow-50">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                    <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-yellow-800">Sales Certification Ready!</h3>
                    <p className="text-sm text-yellow-700">You've reached {score} points. Claim your certificate.</p>
                </div>

                <Button onClick={handlePrint} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Printer className="mr-2 h-4 w-4" /> Print Certificate
                </Button>

                {/* Printable Section (Hidden normally, visible on print) */}
                <div className="hidden print:flex flex-col items-center justify-center fixed inset-0 bg-white z-[9999] p-20 text-center border-[20px] border-double border-slate-800">
                    <h1 className="text-6xl font-serif font-bold mb-8 text-slate-900">{tenant.name}</h1>
                    <p className="text-2xl italic mb-12">Certificate of Excellence</p>
                    <p className="text-xl mb-4">This certifies that</p>
                    <h2 className="text-5xl font-bold text-blue-900 mb-8 border-b-2 border-slate-400 pb-4 px-12">{user.name}</h2>
                    <p className="text-xl">Has successfully completed the</p>
                    <h3 className="text-3xl font-bold mb-12">Advanced Solar Sales Training</h3>
                    <div className="flex justify-between w-full px-32 mt-20">
                        <div className="text-center">
                            <div className="border-t-2 border-slate-900 w-64"></div>
                            <p className="mt-2 font-bold">Training Director</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t-2 border-slate-900 w-64"></div>
                            <p className="mt-2 font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

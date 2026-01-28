import { Navbar } from "@/components/marketing/Navbar"
import { HeroSection } from "@/components/marketing/HeroSection"
import { ValuePropGrid } from "@/components/marketing/ValuePropGrid"
import { HowItWorksPreview } from "@/components/marketing/HowItWorksPreview"
import { AudienceSplit } from "@/components/marketing/AudienceSplit"
import { CTASection } from "@/components/marketing/CTASection"
import { Footer } from "@/components/marketing/Footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
            <Navbar />
            <main>
                <HeroSection />
                <ValuePropGrid />
                <HowItWorksPreview />
                <AudienceSplit />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

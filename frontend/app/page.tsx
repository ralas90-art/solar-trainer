import { Navbar } from "@/components/marketing/Navbar"
import { HeroSection } from "@/components/marketing/HeroSection"
import { PhilosophySection } from "@/components/marketing/PhilosophySection"
import { ConversationFramework } from "@/components/marketing/ConversationFramework"
import { EarningProjections } from "@/components/marketing/EarningProjections"
import { HowItWorksPreview } from "@/components/marketing/HowItWorksPreview"
import { AudienceSplit } from "@/components/marketing/AudienceSplit"
import { CTASection } from "@/components/marketing/CTASection"
import { Footer } from "@/components/marketing/Footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-body selection:bg-[#F97316]/25">
            <Navbar />
            <main>
                <HeroSection />
                <PhilosophySection />
                <EarningProjections />
                <ConversationFramework />
                <HowItWorksPreview />
                <AudienceSplit />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

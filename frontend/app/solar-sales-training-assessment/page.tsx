import type { Metadata } from 'next'
import { AssessmentFunnelClient } from './assessment-funnel-client'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { WHITE_LABEL } from '@/lib/white-label.config'

export const metadata: Metadata = {
  title: `${WHITE_LABEL.industry} Sales Training Readiness Assessment`,
  description:
    `Take the ${WHITE_LABEL.companyName} ${WHITE_LABEL.industry} Sales Training Assessment to identify your team's biggest training gaps and find the right sales training path for reps, managers, and bilingual teams.`,
  openGraph: {
    title: `${WHITE_LABEL.industry} Sales Training Readiness Assessment | ${WHITE_LABEL.companyName}`,
    description:
      `Identify your ${WHITE_LABEL.industry.toLowerCase()} team's biggest training gaps and find the right path for mastery.`,
    type: 'website',
    url: 'https://solar-trainer.vercel.app/solar-sales-training-assessment',
  },
  alternates: {
    canonical: '/solar-sales-training-assessment',
  },
}

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[#F97316]/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F59E0B]/5 blur-[120px] rounded-full" />
      </div>
      <Navbar />
      <main className="relative z-10">
        <AssessmentFunnelClient />
      </main>
      <Footer />
    </div>
  )
}

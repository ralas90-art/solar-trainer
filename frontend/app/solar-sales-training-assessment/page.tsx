import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AssessmentFunnelClient } from './assessment-funnel-client'

export const metadata: Metadata = {
  title: 'Find Your SeptiVolt Plan | AI Sales Readiness Assessment',
  description: 'Answer a few questions and SeptiVolt will recommend the right training, AI simulation, or team readiness plan based on your role, team size, and sales process. Takes about 2 minutes.',
  openGraph: {
    type: 'website',
    title: 'Find Your SeptiVolt Plan | AI Sales Readiness Assessment',
    description: 'Answer a few questions and SeptiVolt will recommend the right training, AI simulation, or team readiness plan based on your role, team size, and sales process.',
    url: '/solar-sales-training-assessment',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your SeptiVolt Plan | AI Sales Readiness Assessment',
    description: 'Answer a few questions and SeptiVolt will recommend the right training, AI simulation, or team readiness plan based on your role, team size, and sales process.',
  },
  alternates: {
    canonical: '/solar-sales-training-assessment',
  },
}

function AssessmentLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-32 flex items-center justify-center min-h-[600px]">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 bg-[#F97316] flex items-center justify-center font-black text-white italic text-lg mx-auto animate-pulse">
          S
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Loading Assessment...
        </p>
      </div>
    </div>
  )
}

export default function SolarSalesTrainingAssessmentPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body">
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative">
        <Suspense fallback={<AssessmentLoadingSkeleton />}>
          <AssessmentFunnelClient />
        </Suspense>
      </div>
    </div>
  )
}

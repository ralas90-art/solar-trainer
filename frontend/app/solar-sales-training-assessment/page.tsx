import type { Metadata } from 'next'
import { AssessmentFunnelClient } from './assessment-funnel-client'

export const metadata: Metadata = {
  title: 'Solar Sales Training Assessment | SeptiVolt OS',
  description: 'Evaluate your solar sales readiness and find the right training path with our free diagnostic assessment.',
  openGraph: {
    title: 'Solar Sales Training Assessment',
    description: 'Find out if you have what it takes to scale your solar sales career.',
  },
  alternates: {
    canonical: '/solar-sales-training-assessment',
  },
}

export default function SolarSalesTrainingAssessmentPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body">
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative">
        <AssessmentFunnelClient />
      </div>
    </div>
  )
}

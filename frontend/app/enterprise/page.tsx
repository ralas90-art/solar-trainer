import type { Metadata } from 'next'
import EnterpriseClient from './EnterpriseClient'
import { WHITE_LABEL } from '@/lib/white-label.config'
import { JsonLd } from '@/components/seo/JsonLd'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: `Enterprise ${WHITE_LABEL.industry} Sales Training Solutions`,
    description: `Scale your ${WHITE_LABEL.industry.toLowerCase()} organization with AI-driven training models. Dedicated infrastructure, custom certification, and advanced team analytics.`,
    alternates: {
        canonical: '/enterprise',
    },
    openGraph: {
        title: `Enterprise Solutions | ${WHITE_LABEL.companyName}`,
        description: `Scale your ${WHITE_LABEL.industry.toLowerCase()} organization with AI-driven training models.`,
        url: 'https://solar-trainer.vercel.app/enterprise',
    },
}

export default function EnterprisePage() {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is ${WHITE_LABEL.companyName} Enterprise?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${WHITE_LABEL.companyName} Enterprise is a dedicated training infrastructure for large organizations, offering custom certification tracks and team-wide analytics.`
                }
            },
            {
                "@type": "Question",
                "name": `Does it support ${WHITE_LABEL.industry} specific training?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, our AI models are specifically trained for the ${WHITE_LABEL.industry.toLowerCase()} industry, including advanced PPA and lease logic.`
                }
            }
        ]
    }

    return (
        <>
            <JsonLd data={jsonLdData} />
            <Suspense fallback={<div className="min-h-screen bg-[#121212]" />}>
                <EnterpriseClient />
            </Suspense>
        </>
    )
}

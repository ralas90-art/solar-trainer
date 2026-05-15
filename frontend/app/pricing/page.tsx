import type { Metadata } from 'next'
import PricingClient from './PricingClient'
import { WHITE_LABEL } from '@/lib/white-label.config'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
    title: `Pricing & Plans`,
    description: `Choose the right ${WHITE_LABEL.industry} sales training plan for your team. Scalable AI infrastructure designed for peak performance and rapid closing growth.`,
    alternates: {
        canonical: '/pricing',
    },
    openGraph: {
        title: `Pricing & Plans | ${WHITE_LABEL.companyName}`,
        description: `Choose the right ${WHITE_LABEL.industry} sales training plan for your team.`,
        url: 'https://solar-trainer.vercel.app/pricing',
    },
}

export default function PricingPage() {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${WHITE_LABEL.companyName} ${WHITE_LABEL.industry} Sales Training`,
        "description": `Elite AI-powered training for the next generation of ${WHITE_LABEL.industry.toLowerCase()} sales professionals.`,
        "brand": {
            "@type": "Brand",
            "name": WHITE_LABEL.companyName
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Starter Plan",
                "price": "499.00",
                "priceCurrency": "USD",
                "description": "Essential AI training for emerging teams."
            },
            {
                "@type": "Offer",
                "name": "Growth Plan",
                "price": "999.00",
                "priceCurrency": "USD",
                "description": "Full AI deployment with advanced voice synthesis."
            }
        ]
    }

    return (
        <>
            <JsonLd data={jsonLdData} />
            <PricingClient />
        </>
    )
}

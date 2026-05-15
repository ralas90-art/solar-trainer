import type { Metadata } from 'next'
import './globals.css'
import { Montserrat, Roboto, JetBrains_Mono } from 'next/font/google'

import { WHITE_LABEL } from '@/lib/white-label.config'

export const metadata: Metadata = {
    metadataBase: new URL('https://solar-trainer.vercel.app'),
    title: {
        default: `${WHITE_LABEL.companyName} — ${WHITE_LABEL.industry} Sales Training Platform`,
        template: `%s | ${WHITE_LABEL.companyName}`
    },
    description: `Elite AI-powered training for the next generation of ${WHITE_LABEL.industry.toLowerCase()} sales professionals. Built for solar teams, individuals, and bilingual consultants.`,
    keywords: [`${WHITE_LABEL.industry} sales training`, 'AI sales simulation', 'solar sales mastery', 'bilingual sales training', 'sales coaching AI'],
    authors: [{ name: WHITE_LABEL.companyName }],
    creator: WHITE_LABEL.companyName,
    publisher: WHITE_LABEL.companyName,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: `${WHITE_LABEL.companyName} — ${WHITE_LABEL.industry} Sales Training Platform`,
        description: `Elite AI-powered training for the next generation of ${WHITE_LABEL.industry.toLowerCase()} sales professionals.`,
        url: 'https://solar-trainer.vercel.app',
        siteName: WHITE_LABEL.companyName,
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${WHITE_LABEL.companyName} — ${WHITE_LABEL.industry} Sales Training Platform`,
        description: `Elite AI-powered training for the next generation of ${WHITE_LABEL.industry.toLowerCase()} sales professionals.`,
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
}

// ... font configs ...
const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['400', '600', '700', '800', '900'],
    display: 'swap',
})

const roboto = Roboto({
    subsets: ['latin'],
    variable: '--font-body',
    weight: ['300', '400', '500', '700'],
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})

import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/language-context'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Dynamic brand colors injection
    const brandColorsStyle = `
        :root {
            --brand-primary: ${WHITE_LABEL.colors.primary};
            --brand-primary-dim: ${WHITE_LABEL.colors.primaryDim};
            --brand-accent: ${WHITE_LABEL.colors.accent};
            --brand-accent-dim: ${WHITE_LABEL.colors.accentDim};
            --brand-surface: ${WHITE_LABEL.colors.surface};
            --brand-card: ${WHITE_LABEL.colors.card};
            --brand-text: ${WHITE_LABEL.colors.text};
            --brand-glow: ${WHITE_LABEL.colors.primary}80; /* 50% opacity */
        }
    `;

    return (
        <html lang="en" className={`${montserrat.variable} ${roboto.variable} ${jetbrainsMono.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
                <style dangerouslySetInnerHTML={{ __html: brandColorsStyle }} />
            </head>
            <body className="font-body antialiased" suppressHydrationWarning>
                <LanguageProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    )
}

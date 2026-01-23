import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Solar Sales Trainer',
    description: 'AI-Powered Solar Sales Roleplay Agent',
}

import { Outfit, Space_Grotesk } from 'next/font/google'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}>{children}</body>
        </html>
    )
}

import type { Metadata } from 'next'
import './globals.css'
import { Montserrat, Roboto, JetBrains_Mono } from 'next/font/google'

export const metadata: Metadata = {
    title: 'SeptiVolt — Solar Sales Training Platform',
    description: 'Elite AI-powered training for the next generation of solar sales professionals.',
}

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${montserrat.variable} ${roboto.variable} ${jetbrainsMono.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
            </head>
            <body className="font-body antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}

import React from "react"
import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const _jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Luxury Estate // Off-Market Properties',
  description: 'Discover exclusive off-market luxury properties. Direct access to exceptional real estate opportunities.',
  openGraph: {
    title: 'Luxury Estate // Off-Market Properties',
    description: 'Premium off-market real estate platform. Exclusive properties tailored to discerning clients. Curated for 25 years.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Estate - Exclusive Off-Market Properties',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Estate // Off-Market Properties',
    description: 'Discover exclusive off-market luxury properties with Luxury Estate.',
    images: ['/images/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_bebasNeue.variable} ${_jetbrainsMono.variable}`}>
      <body className="font-mono antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}

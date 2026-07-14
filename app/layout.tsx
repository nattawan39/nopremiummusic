import type { Metadata } from 'next'
import './globals.css'
import GlobalPlayer from '@/components/GlobalPlayer'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'NO PREMIUM MUSIC',
  description: 'nopremiummusic.com',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ paddingTop: '48px', paddingBottom: '72px', background: '#bbbbbb' }}>
        <nav style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '48px',
          backgroundColor: '#b0b0b0',
          borderBottom: '1px solid #a0a0a0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100,
        }}>
          <Link href="/" style={{ color: '#0300ad', textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>
            ~/nopremiummusic
          </Link>
          <Link href="/admin" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, letterSpacing: '0.05em' }}>
            [upload]
          </Link>
        </nav>

        {children}

        <GlobalPlayer />
        <Analytics />
      </body>
    </html>
  )
}

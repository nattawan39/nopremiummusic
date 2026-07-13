import type { Metadata } from 'next'
import './globals.css'
import GlobalPlayer from '@/components/GlobalPlayer'
import Link from 'next/link'

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
      <body style={{ paddingTop: '48px', paddingBottom: '72px', background: '#141414' }}>
        <nav style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '48px',
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #2e2e2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100,
        }}>
          <Link href="/" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>
            ~/nopremiummusic
          </Link>
          <Link href="/admin" style={{ color: '#d4d4d4', textDecoration: 'none', fontSize: 13, letterSpacing: '0.05em' }}>
            [upload]
          </Link>
        </nav>

        {children}

        <GlobalPlayer />
      </body>
    </html>
  )
}

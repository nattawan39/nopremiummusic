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
      <body style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        {/* Fixed top nav */}
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '48px',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 100,
          }}
        >
          <Link
            href="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: 16,
            }}
          >
            NOPREMIUMMUSIC
          </Link>
          <Link
            href="/admin"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: 12,
            }}
          >
            UPLOAD
          </Link>
        </nav>

        {children}

        <GlobalPlayer />
      </body>
    </html>
  )
}

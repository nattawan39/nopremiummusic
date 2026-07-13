import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#bbbbbb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ fontSize: 24, color: '#888', marginBottom: 16 }}>
          ~/nopremiummusic
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: '#0300ad', lineHeight: 1 }}>
          NO PREMIUM
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: '#0300ad', lineHeight: 1 }}>
          MUSIC
        </div>
        <div style={{ fontSize: 24, color: '#555', marginTop: 32 }}>
          [▶] nopremiummusic.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}

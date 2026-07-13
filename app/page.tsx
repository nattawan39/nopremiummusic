'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import TrackCard from '@/components/TrackCard'
import type { Track } from '@/lib/db'

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tracks')
      .then((r) => r.json())
      .then((data) => {
        setTracks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '2px solid #000', paddingBottom: 24, marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          NO<br />PREMIUM<br />MUSIC
        </h1>
        {!loading && (
          <p
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#767676',
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {tracks.length} RECORDINGS
          </p>
        )}
      </div>

      {loading ? (
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 13, color: '#767676' }}>
          LOADING...
        </p>
      ) : tracks.length === 0 ? (
        <div style={{ padding: '40px 0' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 14, marginBottom: 16 }}>
            NO RECORDINGS YET. UPLOAD YOUR FIRST TRACK.
          </p>
          <Link
            href="/admin"
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 24px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontSize: 13,
            }}
          >
            UPLOAD
          </Link>
        </div>
      ) : (
        <div>
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </main>
  )
}

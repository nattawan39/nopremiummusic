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
      .then((data) => { setTracks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '1px solid #cccccc', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>$ ls -la ~/music</div>
        <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 700,
          lineHeight: 1.05,
          margin: 0,
          color: '#2563eb',
          letterSpacing: '-0.01em',
        }}>
          NO<br />PREMIUM<br />MUSIC
        </h1>
        {!loading && (
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>
            {tracks.length} file{tracks.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#6b7280', fontSize: 13 }}>loading<span style={{ color: '#2563eb' }}>_</span></div>
      ) : tracks.length === 0 ? (
        <div style={{ padding: '32px 0' }}>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
            {'>'} no files found. upload your first track.
          </div>
          <Link href="/admin" style={{
            display: 'inline-block',
            border: '1px solid #cccccc',
            color: '#2563eb',
            padding: '10px 20px',
            textDecoration: 'none',
            fontSize: 13,
          }}>
            [upload]
          </Link>
        </div>
      ) : (
        <div>
          {tracks.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i + 1} />
          ))}
        </div>
      )}
    </main>
  )
}

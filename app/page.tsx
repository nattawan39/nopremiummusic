'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import TrackCard from '@/components/TrackCard'
import type { Track } from '@/lib/db'

type SortMode = 'default' | 'latest' | 'oldest'

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortMode>('default')

  useEffect(() => {
    fetch('/api/tracks')
      .then((r) => r.json())
      .then((data) => { setTracks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const sorted = useMemo(() => {
    if (sort === 'latest') return [...tracks].sort((a, b) => b.year - a.year)
    if (sort === 'oldest') return [...tracks].sort((a, b) => a.year - b.year)
    return tracks
  }, [tracks, sort])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('set-playlist', { detail: { tracks: sorted } }))
  }, [sorted])

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '1px solid #a0a0a0', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ color: '#888888', fontSize: 12, marginBottom: 8 }}>$ ls -la ~/music</div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          margin: 0,
          color: '#0300ad',
          letterSpacing: '-0.01em',
        }}>
          NO PREMIUM MUSIC
        </h1>
        {!loading && (
          <div style={{ fontSize: 12, color: '#888888', marginTop: 12 }}>
            {tracks.length} file{tracks.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Year sort filter */}
      {!loading && tracks.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontFamily: "'Courier New', Courier, monospace" }}>
          <span style={{ fontSize: 12, color: '#888888' }}>sort by year:</span>
          {([
            { mode: 'latest' as SortMode, label: '[latest]' },
            { mode: 'oldest' as SortMode, label: '[oldest]' },
          ]).map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              style={{
                background: 'none',
                border: `1px solid ${sort === mode ? '#0300ad' : '#a0a0a0'}`,
                color: sort === mode ? '#0300ad' : '#888888',
                cursor: 'pointer',
                fontSize: 12,
                padding: '4px 10px',
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888888', fontSize: 13 }}>loading<span style={{ color: '#0300ad' }}>_</span></div>
      ) : tracks.length === 0 ? (
        <div style={{ padding: '32px 0' }}>
          <div style={{ color: '#888888', fontSize: 13, marginBottom: 16 }}>
            {'>'} no files found. upload your first track.
          </div>
          <Link href="/admin" style={{
            display: 'inline-block',
            border: '1px solid #a0a0a0',
            color: '#0300ad',
            padding: '10px 20px',
            textDecoration: 'none',
            fontSize: 13,
          }}>
            [upload]
          </Link>
        </div>
      ) : (
        <div>
          {sorted.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i + 1} />
          ))}
        </div>
      )}
    </main>
  )
}

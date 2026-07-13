'use client'

import type { Track } from '@/lib/db'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function dispatchPlayTrack(track: Track) {
  window.dispatchEvent(new CustomEvent('play-track', { detail: { track } }))
}

export default function TrackCard({ track }: { track: Track }) {
  const coverSrc = track.cover_url || null

  return (
    <div
      className="flex items-center gap-4 py-4 border-b border-black"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Cover */}
      <div
        style={{
          width: 80,
          height: 80,
          border: '1px solid #000',
          flexShrink: 0,
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverSrc} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 28, color: '#fff' }}>♪</span>
        )}
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.title}
        </div>
        <div style={{ fontSize: 13, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.artist}
        </div>
        {(track.genre || track.year > 0) && (
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#767676', marginTop: 4 }}>
            {[track.genre, track.year > 0 ? track.year : ''].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>

      {/* Duration + Play */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {track.duration > 0 && (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#767676' }}>
            {formatTime(track.duration)}
          </span>
        )}
        <button
          onClick={() => dispatchPlayTrack(track)}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={`Play ${track.title}`}
        >
          ▶
        </button>
      </div>
    </div>
  )
}

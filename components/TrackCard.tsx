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

export default function TrackCard({ track, index }: { track: Track; index: number }) {
  const coverSrc = track.cover_url || null
  const num = String(index).padStart(3, '0')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 0',
      borderBottom: '1px solid #cccccc',
      fontFamily: "'Courier New', Courier, monospace",
    }}>
      {/* Index */}
      <div style={{ color: '#6b7280', fontSize: 12, flexShrink: 0, width: 32 }}>{num}</div>

      {/* Cover */}
      <div style={{
        width: 48, height: 48,
        border: '1px solid #cccccc',
        flexShrink: 0,
        backgroundColor: '#e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {coverSrc
          ? <img src={coverSrc} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 18, color: '#333' }}>♪</span>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#1e3a8a', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.title}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.artist}{track.genre ? ` · ${track.genre}` : ''}{track.year > 0 ? ` · ${track.year}` : ''}
        </div>
      </div>

      {/* Duration + Play */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {track.duration > 0 && (
          <span style={{ fontSize: 12, color: '#6b7280' }}>{formatTime(track.duration)}</span>
        )}
        <button
          onClick={() => dispatchPlayTrack(track)}
          style={{
            background: 'none',
            border: '1px solid #cccccc',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: 13,
            padding: '6px 12px',
            letterSpacing: '0.05em',
          }}
          aria-label={`Play ${track.title}`}
        >
          [▶]
        </button>
      </div>
    </div>
  )
}

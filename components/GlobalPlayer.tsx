'use client'

import { useEffect, useRef, useState } from 'react'
import type { Track } from '@/lib/db'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GlobalPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const handler = (e: Event) => {
      const track = (e as CustomEvent<{ track: Track }>).detail.track
      setCurrentTrack(track)
      setCurrentTime(0)
      setDuration(0)
    }
    window.addEventListener('play-track', handler)
    return () => window.removeEventListener('play-track', handler)
  }, [])

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return
    audioRef.current.src = `/api/stream/${currentTrack.id}`
    audioRef.current.load()
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [currentTrack])

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  function skipBack() {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
  }

  function skipForward() {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
  }

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const coverSrc = currentTrack.cover_filename
    ? `/api/covers/${currentTrack.cover_filename}`
    : null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />
      <div
        style={{ backgroundColor: '#000', color: '#fff', height: '64px' }}
        className="fixed bottom-0 left-0 right-0 flex items-center px-4 gap-4 z-50"
      >
        {/* Cover */}
        <div
          style={{ width: 48, height: 48, border: '1px solid #fff', flexShrink: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {coverSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverSrc} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 20, color: '#fff' }}>♪</span>
          )}
        </div>

        {/* Track info */}
        <div style={{ minWidth: 0, flexShrink: 1, marginRight: 16 }}>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack.title}
          </div>
          <div style={{ fontSize: 11, color: '#767676', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack.artist}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={skipBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}>◀◀</button>
          <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#E8401C', cursor: 'pointer', fontSize: 20, padding: '4px 8px' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={skipForward} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}>▶▶</button>
        </div>

        {/* Time + progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, flexShrink: 0, color: '#767676' }}>
            {formatTime(currentTime)}
          </span>
          <div
            onClick={seek}
            style={{ flex: 1, height: 2, backgroundColor: '#333', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#E8401C' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 11, flexShrink: 0, color: '#767676' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </>
  )
}

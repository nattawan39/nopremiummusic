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

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '72px',
        backgroundColor: '#b0b0b0',
        borderTop: '1px solid #a0a0a0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        zIndex: 50,
        fontFamily: "'Courier New', Courier, monospace",
      }}>
        {/* Prompt + track info */}
        <div style={{ minWidth: 0, flexShrink: 1 }}>
          <div style={{ fontSize: 10, color: '#888888', marginBottom: 2 }}>$ now playing</div>
          <div style={{ fontSize: 12, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#0300ad' }}>{currentTrack.title}</span>
            <span style={{ color: '#888888' }}> — {currentTrack.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={skipBack} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 12, padding: '4px 6px' }}>[-10]</button>
          <button onClick={togglePlay} style={{ background: 'none', border: '1px solid #a0a0a0', color: '#0300ad', cursor: 'pointer', fontSize: 12, padding: '4px 10px' }}>
            {isPlaying ? '[⏸]' : '[▶]'}
          </button>
          <button onClick={skipForward} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 12, padding: '4px 6px' }}>[+10]</button>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, color: '#888888', flexShrink: 0 }}>{formatTime(currentTime)}</span>
          <div onClick={seek} style={{ flex: 1, height: 2, backgroundColor: '#a0a0a0', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#0300ad' }} />
          </div>
          <span style={{ fontSize: 11, color: '#888888', flexShrink: 0 }}>{formatTime(duration)}</span>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #a0a0a0',
  backgroundColor: '#b0b0b0',
  color: '#1a1a1a',
  fontSize: 13,
  outline: 'none',
  marginBottom: 16,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  color: '#888888',
  marginBottom: 6,
  letterSpacing: '0.05em',
}

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setSuccess(false)
    setError('')

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const artist = (form.elements.namedItem('artist') as HTMLInputElement).value
    const genre = (form.elements.namedItem('genre') as HTMLInputElement).value
    const year = parseInt((form.elements.namedItem('year') as HTMLInputElement).value || '0', 10)
    const audioFile = (form.elements.namedItem('audio') as HTMLInputElement).files?.[0]
    const coverFile = (form.elements.namedItem('cover') as HTMLInputElement).files?.[0]

    if (!audioFile) { setError('please select an audio file'); setUploading(false); return }

    try {
      setProgress('uploading audio...')
      const audioBlob = await upload(audioFile.name, audioFile, { access: 'public', handleUploadUrl: '/api/upload-token' })

      let coverUrl = ''
      if (coverFile) {
        setProgress('uploading cover...')
        const coverBlob = await upload(coverFile.name, coverFile, { access: 'public', handleUploadUrl: '/api/upload-token' })
        coverUrl = coverBlob.url
      }

      setProgress('saving...')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, genre, year, audio_url: audioBlob.url, cover_url: coverUrl }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'upload failed')
      } else {
        setSuccess(true)
        formRef.current?.reset()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'upload failed')
    } finally {
      setUploading(false)
      setProgress('')
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '1px solid #a0a0a0', paddingBottom: 24, marginBottom: 40 }}>
        <div style={{ color: '#888888', fontSize: 12, marginBottom: 8 }}>$ upload new file</div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1,
          margin: 0,
          color: '#0300ad',
        }}>
          UPLOAD
        </h1>
      </div>

      {success && (
        <div style={{ border: '1px solid #0300ad', color: '#0300ad', padding: '10px 14px', marginBottom: 24, fontSize: 12 }}>
          {'>'} track uploaded.{' '}
          <Link href="/" style={{ color: '#0300ad', textDecoration: 'underline' }}>view archive</Link>
        </div>
      )}

      {error && (
        <div style={{ border: '1px solid #c0392b', color: '#c0392b', padding: '10px 14px', marginBottom: 24, fontSize: 12 }}>
          {'>'} error: {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>{'>'} title *</label>
          <input style={inputStyle} type="text" name="title" required />
        </div>
        <div>
          <label style={labelStyle}>{'>'} artist *</label>
          <input style={inputStyle} type="text" name="artist" required />
        </div>
        <div>
          <label style={labelStyle}>{'>'} genre</label>
          <input style={inputStyle} type="text" name="genre" />
        </div>
        <div>
          <label style={labelStyle}>{'>'} year</label>
          <input style={inputStyle} type="number" name="year" min="1900" max="2099" />
        </div>
        <div>
          <label style={labelStyle}>{'>'} audio file *</label>
          <input style={inputStyle} type="file" name="audio" accept="audio/*" required />
        </div>
        <div>
          <label style={labelStyle}>{'>'} cover image</label>
          <input style={inputStyle} type="file" name="cover" accept="image/*" />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: uploading ? '#888888' : '#0300ad',
            border: `1px solid ${uploading ? '#a0a0a0' : '#0300ad'}`,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            letterSpacing: '0.05em',
            marginTop: 8,
          }}
        >
          {uploading ? `> ${progress}` : '> [upload track]'}
        </button>
      </form>
    </main>
  )
}

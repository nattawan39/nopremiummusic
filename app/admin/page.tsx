'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #2e2e2e',
  backgroundColor: '#1e1e1e',
  color: '#d4d4d4',
  fontSize: 13,
  outline: 'none',
  marginBottom: 16,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  color: '#555',
  marginBottom: 6,
  letterSpacing: '0.05em',
}

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setSuccess(false)
    setError('')
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'upload failed')
      } else {
        setSuccess(true)
        formRef.current?.reset()
      }
    } catch {
      setError('network error. please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '1px solid #2e2e2e', paddingBottom: 24, marginBottom: 40 }}>
        <div style={{ color: '#555', fontSize: 12, marginBottom: 8 }}>$ upload new file</div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1,
          margin: 0,
          color: '#4ade80',
        }}>
          UPLOAD
        </h1>
      </div>

      {success && (
        <div style={{ border: '1px solid #4ade80', color: '#4ade80', padding: '10px 14px', marginBottom: 24, fontSize: 12 }}>
          {'>'} track uploaded.{' '}
          <Link href="/" style={{ color: '#4ade80', textDecoration: 'underline' }}>view archive</Link>
        </div>
      )}

      {error && (
        <div style={{ border: '1px solid #f87171', color: '#f87171', padding: '10px 14px', marginBottom: 24, fontSize: 12 }}>
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
            color: uploading ? '#555' : '#4ade80',
            border: `1px solid ${uploading ? '#2e2e2e' : '#4ade80'}`,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            letterSpacing: '0.05em',
            marginTop: 8,
          }}
        >
          {uploading ? '> uploading...' : '> [upload track]'}
        </button>
      </form>
    </main>
  )
}

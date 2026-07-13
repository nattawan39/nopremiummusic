'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #000',
  backgroundColor: '#fff',
  fontSize: 14,
  outline: 'none',
  marginBottom: 16,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 6,
  color: '#000',
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Upload failed')
      } else {
        setSuccess(true)
        formRef.current?.reset()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ borderBottom: '2px solid #000', paddingBottom: 24, marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          UPLOAD
        </h1>
      </div>

      {success && (
        <div
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          TRACK UPLOADED SUCCESSFULLY.{' '}
          <Link href="/" style={{ color: '#E8401C', textDecoration: 'none', fontWeight: 700 }}>
            VIEW ARCHIVE →
          </Link>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#E8401C',
            color: '#fff',
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} type="text" name="title" required />
        </div>

        <div>
          <label style={labelStyle}>Artist *</label>
          <input style={inputStyle} type="text" name="artist" required />
        </div>

        <div>
          <label style={labelStyle}>Genre</label>
          <input style={inputStyle} type="text" name="genre" />
        </div>

        <div>
          <label style={labelStyle}>Year</label>
          <input style={inputStyle} type="number" name="year" min="1900" max="2099" />
        </div>

        <div>
          <label style={labelStyle}>Audio File *</label>
          <input style={inputStyle} type="file" name="audio" accept="audio/*" required />
        </div>

        <div>
          <label style={labelStyle}>Cover Image</label>
          <input style={inputStyle} type="file" name="cover" accept="image/*" />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            backgroundColor: uploading ? '#767676' : '#000',
            color: '#fff',
            border: 'none',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: 8,
          }}
        >
          {uploading ? 'UPLOADING...' : 'UPLOAD TRACK'}
        </button>
      </form>
    </main>
  )
}

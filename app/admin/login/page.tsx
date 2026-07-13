'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('wrong password')
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px', fontFamily: "'Courier New', Courier, monospace" }}>
      <div style={{ borderBottom: '1px solid #a0a0a0', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>$ authenticate</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#0300ad' }}>LOGIN</h1>
      </div>

      {error && (
        <div style={{ border: '1px solid #c0392b', color: '#c0392b', padding: '10px 14px', marginBottom: 24, fontSize: 12 }}>
          {'>'} {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 6 }}>{'>'} password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          style={{
            display: 'block', width: '100%',
            padding: '10px 12px',
            border: '1px solid #a0a0a0',
            backgroundColor: '#b0b0b0',
            color: '#1a1a1a',
            fontSize: 13, outline: 'none', marginBottom: 16,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'block', width: '100%', padding: '12px',
            backgroundColor: 'transparent',
            color: loading ? '#888' : '#0300ad',
            border: `1px solid ${loading ? '#a0a0a0' : '#0300ad'}`,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13, letterSpacing: '0.05em',
          }}
        >
          {loading ? '> checking...' : '> [enter]'}
        </button>
      </form>
    </main>
  )
}

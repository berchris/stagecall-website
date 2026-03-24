'use client'

import { useState } from 'react'

export default function EarlyAccessForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{
        background: 'rgba(0,212,170,0.1)',
        border: '1px solid rgba(0,212,170,0.3)',
        borderRadius: 14,
        padding: '20px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🎭</div>
        <div style={{ fontWeight: 700, color: 'var(--teal)', fontSize: 16 }}>You&apos;re on the list!</div>
        <div style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 4 }}>
          We&apos;ll reach out when early access opens.
        </div>
      </div>
    )
  }

  return (
    <div>
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1,
          minWidth: 200,
          background: 'var(--surface-r)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '13px 16px',
          fontSize: 15,
          color: 'var(--text)',
          fontFamily: 'inherit',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: 'var(--teal)',
          color: '#0B0B16',
          padding: '13px 28px',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontFamily: 'inherit',
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
      >
        {loading ? 'Saving…' : 'Notify me'}
      </button>
    </form>
    {error && (
      <div style={{ color: 'var(--urgent)', fontSize: 14, marginTop: 8 }}>{error}</div>
    )}
    </div>
  )
}

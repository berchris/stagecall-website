'use client'

import { useState } from 'react'
import type { Dictionary, Locale } from '@/lib/i18n'

export default function EarlyAccessForm({ lang, t }: { lang: Locale; t: Dictionary['form'] }) {
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
        body: JSON.stringify({ email, lang }),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setError(t.error)
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
        <div style={{ fontWeight: 700, color: 'var(--teal)', fontSize: 16 }}>{t.successTitle}</div>
        <div style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 4 }}>
          {t.successBody}
        </div>
      </div>
    )
  }

  return (
    <div>
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <input
        type="email"
        required
        placeholder={t.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: '999 1 220px',
          minWidth: 220,
          background: 'var(--bg)',
          border: '1px solid #2E2E48',
          borderRadius: 14,
          padding: '17px 20px',
          fontSize: 16,
          color: 'var(--text)',
          fontFamily: 'inherit',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={(e) => (e.target.style.borderColor = '#2E2E48')}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: 'var(--gold)',
          color: '#0B0B16',
          padding: '17px 32px',
          borderRadius: 14,
          fontSize: 16,
          flexGrow: 1,
          fontWeight: 700,
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontFamily: 'inherit',
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
      >
        {loading ? t.loading : t.submit}
      </button>
    </form>
    {error && (
      <div style={{ color: 'var(--urgent)', fontSize: 14, marginTop: 8 }}>{error}</div>
    )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OtpForm({ verifyPath }: { verifyPath: string }) {
  const router = useRouter()
  const [channel, setChannel] = useState<'email' | 'phone'>('email')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const trimmed = contact.trim()

    const { error: otpError } = channel === 'email'
      ? await supabase.auth.signInWithOtp({ email: trimmed, options: { shouldCreateUser: true } })
      : await supabase.auth.signInWithOtp({ phone: trimmed, options: { shouldCreateUser: true } })

    if (otpError) {
      setError(otpError.message)
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ channel, contact: trimmed })
    router.push(`${verifyPath}?${params}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['email', 'phone'] as const).map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            style={{
              flex: 1, padding: '10px',
              background: channel === c ? 'var(--surface-r)' : 'transparent',
              border: `1px solid ${channel === c ? 'var(--gold)' : 'var(--border)'}`,
              borderRadius: 10, color: channel === c ? 'var(--text)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {c === 'email' ? 'Email' : 'Phone'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 8 }}>
          {channel === 'email' ? 'Email address' : 'Phone number'}
        </label>
        <input
          type={channel === 'email' ? 'email' : 'tel'}
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder={channel === 'email' ? 'you@example.com' : '+31 6 12345678'}
          required
          className="portal-input"
          style={{ width: '100%', background: 'var(--surface-r)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 15, outline: 'none' }}
        />
      </div>

      {error && <p style={{ color: 'var(--urgent)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading || !contact.trim()}
        style={{
          width: '100%', padding: '14px',
          background: loading || !contact.trim() ? 'var(--surface-r)' : 'var(--gold)',
          color: loading || !contact.trim() ? 'var(--text-sec)' : '#000',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700,
          cursor: loading || !contact.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Sending…' : 'Send code'}
      </button>
    </form>
  )
}

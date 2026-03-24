'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OtpVerify({
  channel,
  contact,
  redirectTo,
}: {
  channel: 'email' | 'phone'
  contact: string
  redirectTo: string
}) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: verifyError } = channel === 'email'
      ? await supabase.auth.verifyOtp({ email: contact, token, type: 'email' })
      : await supabase.auth.verifyOtp({ phone: contact, token, type: 'sms' })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    // Accept any pending invites for this user
    await supabase.rpc('accept_pending_invites')

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        We sent a code to <strong style={{ color: 'var(--text)' }}>{contact}</strong>.
        Enter it below to sign in.
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 8 }}>
          Verification code
        </label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={token}
          onChange={e => setToken(e.target.value.replace(/\D/g, '').slice(0, 8))}
          placeholder="12345678"
          required
          className="portal-input"
          style={{ width: '100%', background: 'var(--surface-r)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 22, fontWeight: 700, outline: 'none', letterSpacing: 6, textAlign: 'center' }}
        />
      </div>

      {error && <p style={{ color: 'var(--urgent)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading || token.length < 6}
        style={{
          width: '100%', padding: '14px',
          background: loading || token.length < 6 ? 'var(--surface-r)' : 'var(--gold)',
          color: loading || token.length < 6 ? 'var(--text-sec)' : '#000',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700,
          cursor: loading || token.length < 6 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Verifying…' : 'Verify code'}
      </button>
    </form>
  )
}

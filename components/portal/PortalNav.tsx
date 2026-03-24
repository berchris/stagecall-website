'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PortalNav({ label }: { label: string }) {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 60,
      background: 'rgba(11,11,22,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5, color: 'var(--gold)' }}>
            STAGECALL
          </span>
          <span style={{ color: 'var(--border)', fontSize: 14 }}>|</span>
          <span style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 500 }}>
            {label}
          </span>
        </div>
        <button
          onClick={signOut}
          style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 14px',
            color: 'var(--text-sec)', fontSize: 13, cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}

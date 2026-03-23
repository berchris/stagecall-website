'use client'

import { useEffect, useState } from 'react'

const CALLS = [
  { name: 'Half hour call',     team: 'All Teams',       minsLeft: 4,   color: '#FF4757', glow: true },
  { name: 'Orchestra Warm-Up',  team: 'Sound · Lighting', minsLeft: 42,  color: '#F5B942', glow: true },
  { name: 'Costume check',      team: 'Wardrobe',         minsLeft: 75,  color: '#00D4AA', glow: false },
  { name: 'Load-in complete',   team: 'Stage Manager',    minsLeft: -10, color: '#4A4A6A', glow: false },
]

function formatMins(mins: number) {
  if (mins < 0) return 'passed'
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}:${String(m).padStart(2, '0')}`
  }
  return `${mins}m`
}

export default function PhoneMockup() {
  const [seconds, setSeconds] = useState(42 * 60 + 18)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div style={{ width: 280, margin: '0 auto' }}>
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 40,
        padding: '24px 16px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {/* Notch */}
        <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3, margin: '0 auto 20px' }} />

        {/* Hero card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,185,66,0.15), rgba(245,185,66,0.05))',
          border: '1px solid rgba(245,185,66,0.3)',
          borderRadius: 18,
          padding: 16,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>
            ⚡ Next Call
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Orchestra Warm-Up
          </div>
          <div style={{
            fontSize: 32, fontWeight: 900, color: 'var(--gold)',
            fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
          }}>
            {hh}:{mm}:{ss}
          </div>
        </div>

        {/* Call rows */}
        {CALLS.map((call) => (
          <div key={call.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface-r)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '10px 12px',
            marginBottom: 8,
            opacity: call.minsLeft < 0 ? 0.35 : 1,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: call.color,
              boxShadow: call.glow ? `0 0 6px ${call.color}` : 'none',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{call.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-sec)' }}>{call.team}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: call.color, fontVariantNumeric: 'tabular-nums' }}>
              {formatMins(call.minsLeft)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

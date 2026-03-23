'use client'

import { useEffect, useState } from 'react'

const BASE_CALLS = [
  { name: 'Overture call',     team: 'All Teams',        minsLeft: 135, color: '#F5B942', glow: true  },
  { name: 'Orchestra Warm-Up', team: 'Sound · Lighting',  minsLeft: 90,  color: '#00D4AA', glow: false },
  { name: 'Costume check',     team: 'Wardrobe',          minsLeft: 60,  color: '#A78BFA', glow: false },
  { name: 'Load-in complete',  team: 'Stage Manager',     minsLeft: -10, color: '#4A4A6A', glow: false },
]

const NEW_CALL       = { name: 'Places', team: 'All Teams', minsLeft: 15, color: '#FF4757', glow: true }
const NEW_CALL_LABEL = 'Places'

// Height of the create card + its bottom margin — must match the rendered card
const CREATE_CARD_H = 112

function formatMins(mins: number) {
  if (mins < 0) return 'passed'
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}:${String(m).padStart(2, '0')}`
  }
  return `${mins}m`
}

function fmt(s: number) {
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

type Phase = 'idle' | 'typing' | 'added'

const PHASE_DURATION: Record<Phase, number> = { idle: 5000, typing: 2800, added: 4500 }
const NEXT_PHASE:     Record<Phase, Phase>  = { idle: 'typing', typing: 'added', added: 'idle' }

export default function PhoneMockup() {
  const [seconds, setSeconds]             = useState(2 * 3600 + 15 * 60)
  const [placesSeconds, setPlacesSeconds] = useState(14 * 60 + 58)
  const [phase, setPhase]                 = useState<Phase>('idle')
  const [typedChars, setTypedChars]       = useState(0)
  const [heroKey, setHeroKey]             = useState(0)

  // Main countdown — ticks during idle + typing
  useEffect(() => {
    if (phase === 'added') return
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [phase])

  // Places countdown — ticks only during added
  useEffect(() => {
    if (phase !== 'added') return
    const t = setInterval(() => setPlacesSeconds(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [phase])

  // Phase transitions
  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === 'added') {
        setSeconds(2 * 3600 + 15 * 60)
        setPlacesSeconds(14 * 60 + 58)
        setTypedChars(0)
      }
      if (NEXT_PHASE[phase] === 'added') setHeroKey(k => k + 1)
      setPhase(NEXT_PHASE[phase])
    }, PHASE_DURATION[phase])
    return () => clearTimeout(t)
  }, [phase])

  // Typing animation — one char every 150 ms
  useEffect(() => {
    if (phase !== 'typing' || typedChars >= NEW_CALL_LABEL.length) return
    const t = setTimeout(() => setTypedChars(c => c + 1), 150)
    return () => clearTimeout(t)
  }, [phase, typedChars])

  const showTyping  = phase === 'typing'
  const showNew     = phase === 'added'
  const typingDone  = showTyping && typedChars >= NEW_CALL_LABEL.length

  const heroName   = showNew ? 'Places'        : 'Overture call'
  const heroTime   = showNew ? fmt(placesSeconds) : fmt(seconds)
  const heroColor  = showNew ? '#FF4757'       : 'var(--gold)'
  const heroBg     = showNew
    ? 'linear-gradient(135deg, rgba(255,71,87,0.15), rgba(255,71,87,0.05))'
    : 'linear-gradient(135deg, rgba(245,185,66,0.15), rgba(245,185,66,0.05))'
  const heroBorder = showNew ? 'rgba(255,71,87,0.35)' : 'rgba(245,185,66,0.3)'

  const calls = showNew ? [NEW_CALL, ...BASE_CALLS] : BASE_CALLS

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

        {/*
          Fixed-height window — overflow:hidden prevents the phone from resizing.
          The content-inner slides up/down inside it to reveal the create card.
        */}
        <div style={{ overflow: 'hidden', height: 394 }}>
          <div style={{
            transform: `translateY(${showTyping ? 0 : -CREATE_CARD_H}px)`,
            transition: 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>

            {/* Create-call card — sits above the hero card; slides in with the content */}
            <div style={{
              background: typingDone
                ? 'linear-gradient(135deg, rgba(0,212,170,0.18), rgba(0,212,170,0.07))'
                : 'linear-gradient(135deg, rgba(0,212,170,0.10), rgba(0,212,170,0.03))',
              border: `1px solid ${typingDone ? 'rgba(0,212,170,0.6)' : 'rgba(0,212,170,0.35)'}`,
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 12,
              height: CREATE_CARD_H - 12, // minus marginBottom
              boxSizing: 'border-box',
              transition: 'background 0.3s, border-color 0.3s',
              animation: typingDone ? 'phoneConfirmFlash 0.5s ease' : undefined,
              opacity: showTyping ? 1 : 0,
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#00D4AA', textTransform: 'uppercase', marginBottom: 8 }}>
                {typingDone ? '✓ Call added' : '+ New Call'}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: 'var(--text)',
                background: 'var(--surface-r)', borderRadius: 8, padding: '6px 10px',
                marginBottom: 6, display: 'flex', alignItems: 'center', gap: 2,
              }}>
                {NEW_CALL_LABEL.slice(0, typedChars)}
                {!typingDone && <span className="phone-cursor" />}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ fontSize: 10, background: 'var(--surface-r)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-sec)' }}>All Teams</div>
                <div style={{ fontSize: 10, background: 'var(--surface-r)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-sec)' }}>15 mins</div>
              </div>
            </div>

            {/* Hero card — Next Call */}
            <div style={{
              background: heroBg,
              border: `1px solid ${heroBorder}`,
              borderRadius: 18,
              padding: 16,
              marginBottom: 12,
              transition: 'background 0.45s ease, border-color 0.45s ease',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: heroColor, textTransform: 'uppercase', marginBottom: 4, transition: 'color 0.45s ease' }}>
                ⚡ Next Call
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                {heroName}
              </div>
              <div key={heroKey} style={{
                fontSize: 32, fontWeight: 900, color: heroColor,
                fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
                transition: 'color 0.45s ease',
                animation: heroKey > 0 ? 'phoneTimerIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' : undefined,
              }}>
                {heroTime}
              </div>
            </div>

            {/* Call rows */}
            {calls.map((call, i) => (
              <div key={call.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface-r)',
                border: `1px solid ${i === 0 && showNew ? 'rgba(255,71,87,0.35)' : 'var(--border)'}`,
                borderRadius: 12, padding: '10px 12px', marginBottom: 8,
                opacity: call.minsLeft < 0 ? 0.35 : 1,
                animation: i === 0 && showNew ? 'phoneRowBounce 0.55s cubic-bezier(0.34,1.56,0.64,1)' : undefined,
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
      </div>
    </div>
  )
}

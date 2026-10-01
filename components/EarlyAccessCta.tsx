import { CSSProperties } from 'react'
import { BellRing } from 'lucide-react'
import EarlyAccessForm from '@/components/EarlyAccessForm'

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

// The panel pops in and its contents follow in sequence when the section arrives (CSS `.reveal`, see globals.css).
export default function EarlyAccessCta() {
  return (
    <div className="cta-panel reveal reveal-pop">
      <div className="cta-glow-wrap">
        <div className="cta-glow reveal reveal-glow" />
      </div>
      <div style={{ position: 'relative' }}>
        <div className="reveal cta-badge" style={{ ...d(0.20), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,185,66,0.12)', border: '1px solid rgba(245,185,66,0.3)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>
          <BellRing size={14} strokeWidth={2.5} /> Launching soon
        </div>
        <h2 className="reveal" style={{ ...d(0.29), fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 20 }}>
          Be the first <span style={{ color: 'var(--gold)' }}>on stage.</span>
        </h2>
        <p className="reveal cta-lead" style={{ ...d(0.38), color: 'var(--text-sec)', fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
          StageCall is in active development. Join the early access list and we&apos;ll reach out when it&apos;s ready.
        </p>
        <div className="reveal" style={{ ...d(0.47), maxWidth: 540, margin: '0 auto' }}>
          <EarlyAccessForm />
        </div>
        <p className="reveal" style={{ ...d(0.56), fontSize: 13, color: 'var(--text-sec)', marginTop: 18 }}>No spam. Just a heads-up when we launch.</p>
      </div>
    </div>
  )
}

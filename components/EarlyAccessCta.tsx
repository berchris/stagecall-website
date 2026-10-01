'use client'

import { motion, MotionConfig, type Variants } from 'framer-motion'
import { BellRing } from 'lucide-react'
import EarlyAccessForm from '@/components/EarlyAccessForm'

const panel: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  shown: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 110, damping: 18, staggerChildren: 0.09, delayChildren: 0.18 },
  },
}

const glow: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: 'easeOut', delay: 0.15 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// Replays each time the panel scrolls into view, so arriving via a "Save my seat" button always animates.
export default function EarlyAccessCta() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="cta-panel"
        variants={panel}
        initial="hidden"
        whileInView="shown"
        viewport={{ amount: 0.35 }}
      >
        <div className="cta-glow-wrap">
          <motion.div className="cta-glow" variants={glow} />
        </div>
        <div style={{ position: 'relative' }}>
          <motion.div variants={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,185,66,0.12)', border: '1px solid rgba(245,185,66,0.3)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>
            <BellRing size={14} strokeWidth={2.5} /> Launching soon
          </motion.div>
          <motion.h2 variants={item} style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 20 }}>
            Be the first <span style={{ color: 'var(--gold)' }}>on stage.</span>
          </motion.h2>
          <motion.p variants={item} style={{ color: 'var(--text-sec)', fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            StageCall is in active development. Join the early access list and we&apos;ll reach out when it&apos;s ready.
          </motion.p>
          <motion.div variants={item} style={{ maxWidth: 540, margin: '0 auto' }}>
            <EarlyAccessForm />
          </motion.div>
          <motion.p variants={item} style={{ fontSize: 13, color: 'var(--text-sec)', marginTop: 18 }}>No spam. Just a heads-up when we launch.</motion.p>
        </div>
      </motion.div>
    </MotionConfig>
  )
}

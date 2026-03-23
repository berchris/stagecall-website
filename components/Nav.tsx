'use client'

import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: 64,
        background: scrolled ? 'rgba(11,11,22,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #111120' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 5, color: 'var(--gold)' }}>
        STAGECALL
      </span>

      <ul style={{ display: 'flex', gap: 32, listStyle: 'none', alignItems: 'center' }}>
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-sec)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sec)')}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#early-access"
        style={{
          background: 'var(--gold)',
          color: '#0B0B16',
          padding: '10px 22px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Get early access
      </a>
    </nav>
  )
}

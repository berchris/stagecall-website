'use client'

import { useEffect, useState } from 'react'
import { dictionaries, LANG_COOKIE, LOCALES, localePath, type Locale } from '@/lib/i18n'

// Remember an explicit choice so the device-language redirect in middleware never overrides it.
function rememberLang(l: Locale) {
  document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
}

// `lang` is only passed on the landing page; without it the nav is English and has no language switcher.
export default function Nav({ lang }: { lang?: Locale }) {
  const t = dictionaries[lang ?? 'en'].nav
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // The root layout renders <html lang="en">; correct it for the page's language.
  useEffect(() => {
    if (!lang) return
    document.documentElement.lang = lang
    return () => { document.documentElement.lang = 'en' }
  }, [lang])

  const switcher = (size: 'sm' | 'lg') => lang && (
    <div role="group" aria-label={t.language} style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      {LOCALES.map((l) => (
        <a key={l} href={localePath(l)} hrefLang={l} aria-current={l === lang ? 'true' : undefined} onClick={() => rememberLang(l)}
          style={{
            padding: size === 'lg' ? '10px 20px' : '7px 11px',
            fontSize: size === 'lg' ? 14 : 12, fontWeight: 700, letterSpacing: 1, textDecoration: 'none',
            background: l === lang ? 'var(--surface-r)' : 'transparent',
            color: l === lang ? 'var(--gold)' : 'var(--text-sec)',
          }}>
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t.howItWorks, href: '#how-it-works' },
    { label: t.features, href: '#features' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 64,
        background: scrolled || menuOpen ? 'rgba(11,11,22,0.96)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #111120' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 5, color: 'var(--gold)' }}>
          STAGECALL
        </span>

        {/* Desktop links */}
        <ul className="nav-desktop" style={{ gap: 32, listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-sec)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sec)')}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: 14 }}>
          {switcher('sm')}
          <a href="#early-access"
            style={{ background: 'var(--gold)', color: '#0B0B16', padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
            {t.cta}
          </a>
        </div>

        {/* Hamburger */}
        <button className="nav-mobile" onClick={() => setMenuOpen((o) => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}
          aria-label={t.menu}>
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className="nav-mobile" style={{
        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
        flexDirection: 'column',
        background: 'rgba(11,11,22,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: menuOpen ? '1px solid #111120' : 'none',
        padding: menuOpen ? '16px 24px 24px' : '0 24px',
        maxHeight: menuOpen ? 360 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
            style={{ display: 'block', padding: '14px 0', fontSize: 16, fontWeight: 600, color: 'var(--text-sec)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
            {link.label}
          </a>
        ))}
        <a href="#early-access" onClick={() => setMenuOpen(false)}
          style={{ display: 'block', marginTop: 16, background: 'var(--gold)', color: '#0B0B16', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
          {t.cta}
        </a>
        {lang && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>{switcher('lg')}</div>}
      </div>
    </>
  )
}

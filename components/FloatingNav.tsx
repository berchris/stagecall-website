'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Home, Route, LayoutGrid, Users, BellRing } from 'lucide-react'
import { dictionaries, LANG_COOKIE, LOCALES, localePath, type Locale } from '@/lib/i18n'

// Remember an explicit choice so the device-language redirect in middleware never overrides it.
function rememberLang(l: Locale) {
  document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
}

const SECTIONS = [
  { id: 'top', key: 'home', Icon: Home },
  { id: 'how-it-works', key: 'howItWorks', Icon: Route },
  { id: 'features', key: 'features', Icon: LayoutGrid },
  { id: 'roles', key: 'roles', Icon: Users },
] as const

const CTA_ID = 'early-access'

// Landing page navigation: a glass pill floating at the bottom of the screen with one entry per section and the
// sign-up button, plus the wordmark and language switch at the top. A highlight slides to the section in view.
// Links are plain `#id` anchors; SectionScroller turns them into glides.
export default function FloatingNav({ lang }: { lang: Locale }) {
  const t = dictionaries[lang].nav
  const [active, setActive] = useState<string>('top')
  const [blob, setBlob] = useState<{ left: number; width: number } | null>(null)
  const pillRef = useRef<HTMLDivElement>(null)

  // The root layout renders <html lang="en">; correct it for the page's language.
  useEffect(() => {
    document.documentElement.lang = lang
    return () => { document.documentElement.lang = 'en' }
  }, [lang])

  // The section covering the middle of the screen is the active one.
  useEffect(() => {
    const ids = [...SECTIONS.map((s) => s.id), CTA_ID]
    const update = () => {
      const mid = window.innerHeight / 2
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= mid && r.bottom > mid) { setActive(id); return }
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Keep the highlight on the active item, also while items change width (labels expanding on phones).
  useLayoutEffect(() => {
    const pill = pillRef.current
    if (!pill) return
    const place = () => {
      const el = pill.querySelector<HTMLElement>('.float-item[data-active="true"]')
      setBlob(el ? { left: el.offsetLeft, width: el.offsetWidth } : null)
    }
    place()
    const ro = new ResizeObserver(place)
    pill.querySelectorAll('.float-item').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [active, lang])

  return (
    <>
      <header className="float-top">
        <a href="#top" className="float-wordmark">STAGECALL</a>
        <div className="float-lang" role="group" aria-label={t.language}>
          {LOCALES.map((l) => (
            <a key={l} href={localePath(l)} hrefLang={l} aria-current={l === lang ? 'true' : undefined}
              className={l === lang ? 'active' : undefined} onClick={() => rememberLang(l)}>
              {l.toUpperCase()}
            </a>
          ))}
        </div>
      </header>

      <nav className="float-nav" aria-label={t.sections}>
        <div className="float-pill" ref={pillRef}>
          <span className="float-blob" aria-hidden="true"
            style={blob ? { transform: `translateX(${blob.left}px)`, width: blob.width, opacity: 1 } : { opacity: 0 }} />
          {SECTIONS.map(({ id, key, Icon }) => (
            <a key={id} href={`#${id}`} className="float-item" data-active={active === id}
              aria-current={active === id ? 'true' : undefined} aria-label={t[key]}>
              <Icon size={17} strokeWidth={2} aria-hidden="true" />
              <span className="float-label float-label-full">{t[key]}</span>
              <span className="float-label float-label-short">{t.short[key]}</span>
            </a>
          ))}
          <a href={`#${CTA_ID}`} className="float-cta" data-active={active === CTA_ID}>
            <BellRing size={15} strokeWidth={2.5} aria-hidden="true" />
            <span className="float-label-full">{t.cta}</span>
            <span className="float-label-short">{t.ctaShort}</span>
          </a>
        </div>
      </nav>
    </>
  )
}

import FloatingNav from '@/components/FloatingNav'
import PhoneMockup from '@/components/PhoneMockup'
import FadeIn, { StaggerItem } from '@/components/FadeIn'
import CardRow from '@/components/CardRow'
import SectionScroller from '@/components/SectionScroller'
import EarlyAccessCta from '@/components/EarlyAccessCta'
import { dictionaries, type Locale } from '@/lib/i18n'
import { Bell, BellRing, CheckCircle2, LayoutList, Eye, Pencil, History, Clapperboard, Timer, Check } from 'lucide-react'

const S = {
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--gold)', textAlign: 'center' as const, marginBottom: 16 },
  h2: { fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: -1, textAlign: 'center' as const, marginBottom: 16, lineHeight: 1.1 },
  sub: { textAlign: 'center' as const, color: 'var(--text-sec)', fontSize: 17, maxWidth: 520, margin: '0 auto clamp(28px, 6vh, 64px)', lineHeight: 1.7 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, height: '100%' } as React.CSSProperties,
}

const FEATURE_ICONS = [Bell, CheckCircle2, LayoutList, Eye, Pencil, History]
const STEP_ICONS = [Clapperboard, Timer, BellRing]

const ROLE_STYLES = {
  manager: { color: 'var(--purple)', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)' },
  crew: { color: 'var(--gold)', bg: 'rgba(245,185,66,0.15)', border: 'rgba(245,185,66,0.3)' },
}

export default function LandingPage({ lang }: { lang: Locale }) {
  const t = dictionaries[lang]
  const roles = [
    { ...t.roles.manager, ...ROLE_STYLES.manager },
    { ...t.roles.crew, ...ROLE_STYLES.crew },
  ]

  return (
    <>
      <FloatingNav lang={lang} />
      <SectionScroller />

      {/* HERO */}
      <section id="top" className="snap-section snap-hero">
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(245,185,66,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="hero-inner">
          <div className="hero-text snap-stop">
            <FadeIn>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,185,66,0.1)', border: '1px solid rgba(245,185,66,0.25)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 }}>
                <Clapperboard size={14} strokeWidth={2.5} /> {t.hero.badge}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, maxWidth: 820 }}>
                {t.hero.titleStart}<span style={{ color: 'var(--gold)' }}>{t.hero.titleAccent}</span><br />{t.hero.titleEnd}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-sec)', maxWidth: 520, marginBottom: 48, lineHeight: 1.7 }}>
                {t.hero.body}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="hero-buttons">
                <a href="#early-access" style={{ background: 'var(--gold)', color: '#0B0B16', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>{t.hero.primary}</a>
                <a href="#how-it-works" style={{ background: 'transparent', color: 'var(--text-sec)', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border)' }}>{t.hero.secondary}</a>
              </div>
            </FadeIn>
          </div>

          <div className="hero-phone-wrap snap-stop">
            <FadeIn delay={0.4}><PhoneMockup t={t.mockup} /></FadeIn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="snap-section">
        <div className="section-inner">
        <FadeIn><p style={S.sectionLabel}>{t.how.label}</p></FadeIn>
        <FadeIn delay={0.1}><h2 className="section-title" style={S.h2}>{t.how.title[0]}<br />{t.how.title[1]}</h2></FadeIn>
        <FadeIn delay={0.2}><p className="section-sub" style={S.sub}>{t.how.sub}</p></FadeIn>
        <CardRow min={240}>
          {t.how.steps.map((step, i) => {
            const Icon = STEP_ICONS[i]
            return (
            <StaggerItem key={step.title}>
              <div style={S.card}>
                <div style={{ marginBottom: 16, color: 'var(--gold)' }}><Icon size={32} strokeWidth={1.5} /></div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>{t.how.step} {String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </StaggerItem>
            )
          })}
        </CardRow>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="snap-section snap-alt">
        <div className="section-inner">
          <FadeIn><p style={S.sectionLabel}>{t.features.label}</p></FadeIn>
          <FadeIn delay={0.1}><h2 className="section-title" style={S.h2}>{t.features.title}</h2></FadeIn>
          <FadeIn delay={0.2}><p className="section-sub" style={S.sub}>{t.features.sub}</p></FadeIn>
          <CardRow min={300}>
            {t.features.items.map((f, i) => {
              const Icon = FEATURE_ICONS[i]
              return (
              <StaggerItem key={f.title}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, height: '100%' }}>
                  <div style={{ marginBottom: 14, color: 'var(--gold)' }}><Icon size={28} strokeWidth={1.5} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </StaggerItem>
              )
            })}
          </CardRow>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="snap-section">
        <div className="section-inner">
        <FadeIn><p style={S.sectionLabel}>{t.roles.label}</p></FadeIn>
        <FadeIn delay={0.1}><h2 className="section-title" style={S.h2}>{t.roles.title}</h2></FadeIn>
        <FadeIn delay={0.2}><p className="section-sub" style={S.sub}>{t.roles.sub}</p></FadeIn>
        <CardRow min={280}>
          {roles.map((r) => (
            <StaggerItem key={r.role}>
              <div style={{ ...S.card, borderColor: r.border }}>
                <div style={{ display: 'inline-block', background: r.bg, color: r.color, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{r.role}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{r.title}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {r.items.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-sec)', alignItems: 'center' }}>
                      <Check size={14} strokeWidth={2.5} color="var(--teal)" style={{ flexShrink: 0 }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </CardRow>
        </div>
      </section>

      {/* EARLY ACCESS + FOOTER (one screen) */}
      <section id="early-access" className="snap-section cta-band">
        <div className="cta-center">
          <EarlyAccessCta lang={lang} />
        </div>
        <footer className="cta-footer">
          <span className="cta-footer-logo" style={{ fontSize: 14, fontWeight: 900, letterSpacing: 4, color: 'var(--gold)' }}>STAGECALL</span>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.footer}</p>
        </footer>
      </section>
    </>
  )
}

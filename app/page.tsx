import Nav from '@/components/Nav'
import PhoneMockup from '@/components/PhoneMockup'
import FadeIn from '@/components/FadeIn'
import EarlyAccessCta from '@/components/EarlyAccessCta'
import { Bell, BellRing, CheckCircle2, LayoutList, Eye, Pencil, History, Clapperboard, Timer, Check } from 'lucide-react'

const S = {
  section: { maxWidth: 1100, margin: '0 auto', padding: '100px 24px' } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--gold)', textAlign: 'center' as const, marginBottom: 16 },
  h2: { fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: -1, textAlign: 'center' as const, marginBottom: 16, lineHeight: 1.1 },
  sub: { textAlign: 'center' as const, color: 'var(--text-sec)', fontSize: 17, maxWidth: 520, margin: '0 auto 64px', lineHeight: 1.7 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 } as React.CSSProperties,
}

const FEATURES = [
  { Icon: Bell,         title: 'Team-specific alerts',   body: "Calls go only to the teams that need them. Sound doesn't get Wardrobe's alerts. Each team sees exactly their schedule, nothing more." },
  { Icon: CheckCircle2, title: 'Group acknowledgment',    body: 'One tap from any team member clears the call for the whole team. No chasing everyone for individual confirmations.' },
  { Icon: LayoutList,   title: 'Full timeline view',      body: 'See every call across all teams in chronological order. Know exactly where you are in the schedule at a glance.' },
  { Icon: Eye,          title: 'Team peek',               body: "Managers and Stage Managers can view any team's call schedule in read-only mode without leaving the app." },
  { Icon: Pencil,       title: 'Live editing',            body: 'Need to adjust a call mid-show? Managers can edit or delete calls on the fly. Changes reflect instantly for all crew.' },
  { Icon: History,      title: 'Alert history',           body: 'Full log of every alert that fired — acknowledged by whom and when. Perfect for post-show review.' },
]

const STEPS = [
  { num: '01', Icon: Clapperboard, title: 'Create a production',     body: 'Add your show details, set up your teams — Sound, Lighting, Wardrobe, Stage Manager — and invite crew by email or phone.' },
  { num: '02', Icon: Timer,        title: 'Build your call schedule', body: 'Set up all your calls with how many minutes before show each fires. "Half hour", "Overture call", "Places" — set once, runs forever.' },
  { num: '03', Icon: BellRing,     title: 'Run the show',            body: "Crew get alerts at the right moment. One acknowledgment clears the call for the entire team. No chasing, no repeating yourself." },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(245,185,66,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="hero-inner">
          <div className="hero-text">
            <FadeIn>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,185,66,0.1)', border: '1px solid rgba(245,185,66,0.25)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 }}>
                <Clapperboard size={14} strokeWidth={2.5} /> Built for live productions
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, maxWidth: 820 }}>
                Every call, <span style={{ color: 'var(--gold)' }}>on time.</span><br />Every time.
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-sec)', maxWidth: 520, marginBottom: 48, lineHeight: 1.7 }}>
                StageCall keeps your production on schedule. Countdown timers and instant alerts for every crew team, delivered the moment they need them.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="hero-buttons">
                <a href="#early-access" style={{ background: 'var(--gold)', color: '#0B0B16', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>Save my seat</a>
                <a href="#how-it-works" style={{ background: 'transparent', color: 'var(--text-sec)', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border)' }}>See how it works</a>
              </div>
            </FadeIn>
          </div>

          <div className="hero-phone-wrap">
            <FadeIn delay={0.4}><PhoneMockup /></FadeIn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={S.section}>
        <FadeIn><p style={S.sectionLabel}>How it works</p></FadeIn>
        <FadeIn delay={0.1}><h2 style={S.h2}>Simple for managers.<br />Effortless for crew.</h2></FadeIn>
        <FadeIn delay={0.2}><p style={S.sub}>Set it up once. StageCall handles the rest — from load-in to curtain up.</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div style={S.card}>
                <div style={{ marginBottom: 16, color: 'var(--gold)' }}><step.Icon size={32} strokeWidth={1.5} /></div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>Step {step.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <div id="features" style={{ background: 'var(--surface)', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <FadeIn><p style={S.sectionLabel}>Features</p></FadeIn>
          <FadeIn delay={0.1}><h2 style={S.h2}>Everything your production needs</h2></FadeIn>
          <FadeIn delay={0.2}><p style={S.sub}>Designed for the realities of live theater — fast, reliable, and built for the chaos of tech week.</p></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
                  <div style={{ marginBottom: 14, color: 'var(--gold)' }}><f.Icon size={28} strokeWidth={1.5} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ROLES */}
      <section style={S.section}>
        <FadeIn><p style={S.sectionLabel}>Roles</p></FadeIn>
        <FadeIn delay={0.1}><h2 style={S.h2}>Right access for every role</h2></FadeIn>
        <FadeIn delay={0.2}><p style={S.sub}>No configuration needed. Crew only see what they need. Managers control everything.</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { role: 'Production Manager', color: 'var(--purple)', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)', title: 'In full control', items: ['Create and manage productions', 'Add and remove crew members', 'Build, edit and delete calls', "View all teams' schedules", 'See full alert and ack history'] },
            { role: 'Crew Member', color: 'var(--gold)', bg: 'rgba(245,185,66,0.15)', border: 'rgba(245,185,66,0.3)', title: 'Focused on their job', items: ["See only their team's calls", 'Get alerted at the right moment', 'One-tap acknowledgment for the team', "Peek at other teams' schedules", 'View the full production timeline'] },
          ].map((r, i) => (
            <FadeIn key={r.role} delay={i * 0.1}>
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
            </FadeIn>
          ))}
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section id="early-access" className="cta-band">
        <EarlyAccessCta />
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-sub)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 4, color: 'var(--gold)' }}>STAGECALL</span>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 StageCall. Built for the people who make shows happen.</p>
      </footer>
    </>
  )
}

import Nav from '@/components/Nav'
import PhoneMockup from '@/components/PhoneMockup'
import FadeIn from '@/components/FadeIn'
import EarlyAccessForm from '@/components/EarlyAccessForm'

const S = {
  section: { maxWidth: 1100, margin: '0 auto', padding: '100px 24px' } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--gold)', textAlign: 'center' as const, marginBottom: 16 },
  h2: { fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: -1, textAlign: 'center' as const, marginBottom: 16, lineHeight: 1.1 },
  sub: { textAlign: 'center' as const, color: 'var(--text-sec)', fontSize: 17, maxWidth: 520, margin: '0 auto 64px', lineHeight: 1.7 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 } as React.CSSProperties,
}

const FEATURES = [
  { icon: '🎯', title: 'Team-specific alerts',   body: "Calls go only to the teams that need them. Sound doesn't get Wardrobe's alerts. Each team sees exactly their schedule, nothing more." },
  { icon: '✅', title: 'Group acknowledgment',    body: 'One tap from any team member clears the call for the whole team. No chasing everyone for individual confirmations.' },
  { icon: '📅', title: 'Full timeline view',      body: 'See every call across all teams in chronological order. Know exactly where you are in the schedule at a glance.' },
  { icon: '👁',  title: 'Team peek',              body: "Managers and Stage Managers can view any team's call schedule in read-only mode without leaving the app." },
  { icon: '✏️', title: 'Live editing',            body: 'Need to adjust a call mid-show? Managers can edit or delete calls on the fly. Changes reflect instantly for all crew.' },
  { icon: '📋', title: 'Alert history',           body: 'Full log of every alert that fired — acknowledged by whom and when. Perfect for post-show review.' },
]

const STEPS = [
  { num: '01', icon: '🎬', title: 'Create a production',    body: 'Add your show details, set up your teams — Sound, Lighting, Wardrobe, Stage Manager — and invite crew by email or phone.' },
  { num: '02', icon: '⏱',  title: 'Build your call schedule', body: 'Set up all your calls with how many minutes before show each fires. "Half hour", "Overture call", "Places" — set once, runs forever.' },
  { num: '03', icon: '🔔', title: 'Run the show',           body: "Crew get alerts at the right moment. One acknowledgment clears the call for the entire team. No chasing, no repeating yourself." },
]

const PLANS = [
  {
    name: 'Free', price: '€0', period: '/mo', featured: false,
    desc: 'Great for community theater and first-time users.',
    features: [
      { yes: true,  label: '1 active production' },
      { yes: true,  label: 'Up to 3 teams' },
      { yes: true,  label: 'Up to 15 calls' },
      { yes: true,  label: 'Unlimited crew members' },
      { yes: false, label: 'Push notifications' },
      { yes: false, label: 'Invite flow' },
    ],
    cta: 'Get started free', ctaStyle: 'ghost',
  },
  {
    name: 'Pro', price: '€29', period: '/mo', featured: true,
    desc: 'Independent producers and regional theater companies.',
    features: [
      { yes: true, label: '5 concurrent productions' },
      { yes: true, label: 'Unlimited teams & calls' },
      { yes: true, label: 'Unlimited crew members' },
      { yes: true, label: 'Push notifications' },
      { yes: true, label: 'Email & phone invite flow' },
      { yes: true, label: 'Full ack audit log' },
    ],
    cta: 'Get early access', ctaStyle: 'gold',
  },
  {
    name: 'Company', price: '€99', period: '/mo', featured: false,
    desc: 'Production companies and festivals running multiple shows.',
    features: [
      { yes: true, label: 'Unlimited productions' },
      { yes: true, label: 'Everything in Pro' },
      { yes: true, label: 'Multi-night productions' },
      { yes: true, label: 'Broadcast messages to teams' },
      { yes: true, label: 'Team Lead role' },
      { yes: true, label: 'White-label option' },
    ],
    cta: 'Get early access', ctaStyle: 'ghost',
  },
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
                🎭 Built for live productions
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
                <a href="#early-access" style={{ background: 'var(--gold)', color: '#0B0B16', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>Get early access</a>
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
                <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
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
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
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
                    <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-sec)' }}>
                      <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <div id="pricing" style={{ background: 'var(--surface)', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <FadeIn><p style={S.sectionLabel}>Pricing</p></FadeIn>
          <FadeIn delay={0.1}><h2 style={S.h2}>Start free. Scale when you&apos;re ready.</h2></FadeIn>
          <FadeIn delay={0.2}><p style={S.sub}>Crew access is always free. Only the production manager pays — and only when the show demands it.</p></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div style={{ background: plan.featured ? 'linear-gradient(160deg, rgba(245,185,66,0.07), var(--bg))' : 'var(--bg)', border: `1px solid ${plan.featured ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 20, padding: '32px 28px', position: 'relative' }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#0B0B16', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>Most popular</div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 12 }}>{plan.name}</div>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2 }}>{plan.price}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-sec)' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 24, minHeight: 36 }}>{plan.desc}</div>
                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <li key={f.label} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-sec)', alignItems: 'flex-start' }}>
                        <span style={{ color: f.yes ? 'var(--teal)' : 'var(--text-muted)', fontWeight: 700, flexShrink: 0 }}>{f.yes ? '✓' : '–'}</span>
                        {f.label}
                      </li>
                    ))}
                  </ul>
                  <a href="#early-access" style={{ display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', background: plan.ctaStyle === 'gold' ? 'var(--gold)' : 'transparent', color: plan.ctaStyle === 'gold' ? '#0B0B16' : 'var(--text-sec)', border: plan.ctaStyle === 'ghost' ? '1px solid var(--border)' : 'none' }}>
                    {plan.cta}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* EARLY ACCESS */}
      <section id="early-access" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ maxWidth: 580, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,212,170,0.07), transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ ...S.sectionLabel, marginBottom: 16 }}>Early access</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Be first on stage.</h2>
            <p style={{ color: 'var(--text-sec)', fontSize: 16, marginBottom: 32 }}>
              StageCall is in active development. Join the early access list and we&apos;ll reach out when it&apos;s ready.
            </p>
            <EarlyAccessForm />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>No spam. Just a heads-up when we launch.</p>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-sub)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 4, color: 'var(--gold)' }}>STAGECALL</span>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 StageCall. Built for the people who make shows happen.</p>
      </footer>
    </>
  )
}

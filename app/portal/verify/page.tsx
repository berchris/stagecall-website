import { redirect } from 'next/navigation'
import OtpVerify from '@/components/portal/OtpVerify'

export default async function PortalVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; contact?: string }>
}) {
  const { channel, contact } = await searchParams

  if (!channel || !contact || (channel !== 'email' && channel !== 'phone')) {
    redirect('/portal/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, color: 'var(--gold)' }}>STAGECALL</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>Check your {channel}</h1>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <OtpVerify channel={channel} contact={contact} redirectTo="/portal/settings" />
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <a href="/portal/login" style={{ color: 'var(--text-sec)', textDecoration: 'none' }}>← Use a different {channel}</a>
        </p>
      </div>
    </div>
  )
}

import OtpForm from '@/components/portal/OtpForm'

export default function PortalLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, color: 'var(--gold)' }}>STAGECALL</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>Sign in to your portal</h1>
          <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>Manage your organisation details</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <OtpForm verifyPath="/portal/verify" />
        </div>
      </div>
    </div>
  )
}

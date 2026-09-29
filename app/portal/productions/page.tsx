import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/portal/PortalShell'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'LIVE', color: 'var(--teal)' },
  upcoming: { label: 'SOON', color: 'var(--gold)' },
  done: { label: 'DONE', color: 'var(--text-muted)' },
}

export default async function PortalProductionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'org_admin') redirect('/portal/settings')

  const { data: productions } = await supabase
    .from('productions')
    .select('id, name, venue, status, created_at')
    .eq('organisation_id', profile.organisation_id)
    .order('created_at', { ascending: false })

  return (
    <PortalShell>
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          Organisation portal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Productions</h1>
        <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 8 }}>
          {productions?.length ?? 0} production{productions?.length !== 1 ? 's' : ''} in your organisation
        </p>
      </div>

      {!productions || productions.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>No productions yet. Create your first production in the StageCall app.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {productions.map(prod => {
            const status = STATUS_LABELS[prod.status] ?? STATUS_LABELS.upcoming
            return (
              <div
                key={prod.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{prod.name}</p>
                  {prod.venue && (
                    <p style={{ color: 'var(--text-sec)', fontSize: 13 }}>{prod.venue}</p>
                  )}
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  color: status.color,
                  background: `${status.color}18`,
                  border: `1px solid ${status.color}40`,
                  borderRadius: 6,
                  padding: '3px 8px',
                  whiteSpace: 'nowrap',
                }}>
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
    </PortalShell>
  )
}

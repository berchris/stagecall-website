import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminOrgsTable from './OrgsTable'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_staff')
    .eq('id', user.id)
    .single()

  if (!profile?.is_staff) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>🔒</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Staff access only</h2>
          <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>Your account doesn&apos;t have staff access.</p>
        </div>
      </div>
    )
  }

  const { data: orgs } = await supabase
    .from('organisations')
    .select('id, name, city, country, email, created_at')
    .order('name')

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
            Staff portal
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Organisations</h1>
          <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 4 }}>{orgs?.length ?? 0} total</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/admin/staff" style={{ padding: '10px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-sec)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
            Manage staff
          </Link>
          <Link href="/admin/orgs/new" style={{ padding: '10px 18px', background: 'var(--gold)', borderRadius: 10, color: '#000', fontSize: 14, textDecoration: 'none', fontWeight: 700 }}>
            + New organisation
          </Link>
        </div>
      </div>

      <AdminOrgsTable orgs={orgs ?? []} />
    </div>
  )
}

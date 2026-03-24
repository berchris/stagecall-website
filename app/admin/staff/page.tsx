import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import StaffManager from './StaffManager'

async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
  if (!profile?.is_staff) redirect('/admin')
  return user
}

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const currentUser = await requireStaff()
  const { error, success } = await searchParams

  const supabase = await createClient()
  const { data: staffProfiles } = await supabase
    .from('profiles')
    .select('id, name, is_staff, role, organisation_id')
    .eq('is_staff', true)
    .order('id')

  // Enrich with emails via admin client
  const admin = createAdminClient()
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = new Map(authUsers.map(u => [u.id, u.email ?? u.phone ?? '']))

  const staffList = (staffProfiles ?? []).map(p => ({
    ...p,
    contact: emailMap.get(p.id) ?? '—',
  }))

  async function toggleStaff(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: callerProfile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
    if (!callerProfile?.is_staff) return

    const contact = (formData.get('contact') as string)?.trim()
    const action = formData.get('action') as 'add' | 'remove'

    if (!contact) return

    const admin = createAdminClient()
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const match = users.find(u => u.email === contact || u.phone === contact)

    if (!match) {
      redirect(`/admin/staff?error=${encodeURIComponent('No account found with that email or phone')}`)
    }

    await supabase.from('profiles').update({ is_staff: action === 'add' }).eq('id', match.id)
    redirect('/admin/staff?success=1')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Organisations</a>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, marginTop: 16 }}>
          Staff portal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Staff members</h1>
        <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 4 }}>{staffList.length} staff account{staffList.length !== 1 ? 's' : ''}</p>
      </div>

      <StaffManager
        staffList={staffList}
        currentUserId={currentUser.id}
        toggleStaff={toggleStaff}
        error={error}
        success={success === '1'}
      />
    </div>
  )
}

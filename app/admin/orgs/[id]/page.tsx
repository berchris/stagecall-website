import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrgForm from '@/components/portal/OrgForm'

async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
  if (!profile?.is_staff) redirect('/admin')
  return user
}

export default async function AdminOrgPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  await requireStaff()
  const { id } = await params
  const { saved, error } = await searchParams

  const supabase = await createClient()
  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .single()

  if (!org) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 40 }}>
          <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>Organisation not found.</p>
          <a href="/admin" style={{ color: 'var(--gold)', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Back to organisations</a>
        </div>
      </div>
    )
  }

  // Get production count
  const { count } = await supabase
    .from('productions')
    .select('id', { count: 'exact', head: true })
    .eq('organisation_id', id)

  async function updateOrg(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
    if (!profile?.is_staff) return

    const { error } = await supabase
      .from('organisations')
      .update({
        name: formData.get('name') as string,
        email: (formData.get('email') as string) || null,
        phone: (formData.get('phone') as string) || null,
        website: (formData.get('website') as string) || null,
        address: (formData.get('address') as string) || null,
        city: (formData.get('city') as string) || null,
        postal_code: (formData.get('postal_code') as string) || null,
        country: (formData.get('country') as string) || null,
      })
      .eq('id', id)

    const params = error ? `?error=${encodeURIComponent(error.message)}` : '?saved=1'
    redirect(`/admin/orgs/${id}${params}`)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Organisations</a>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, marginTop: 16 }}>
          Staff portal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{org.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
          {count ?? 0} production{count !== 1 ? 's' : ''} · Created {new Date(org.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
        <OrgForm org={org} action={updateOrg} error={error} success={saved === '1'} />
      </div>
    </div>
  )
}

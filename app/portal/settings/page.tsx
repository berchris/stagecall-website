import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrgForm from '@/components/portal/OrgForm'

export default async function PortalSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organisation_id, is_staff')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'org_admin') {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>🔒</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>No portal access</h2>
          <p style={{ color: 'var(--text-sec)', fontSize: 14, lineHeight: 1.6 }}>
            This portal is for organisation admins. Ask your StageCall organisation admin to add you.
          </p>
        </div>
      </div>
    )
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', profile.organisation_id)
    .single()

  if (!org) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 40 }}>
          <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>Organisation not found. Contact StageCall support.</p>
        </div>
      </div>
    )
  }

  const { saved, error } = await searchParams

  async function updateOrg(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'org_admin') return

    const updates = {
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      website: (formData.get('website') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || null,
      postal_code: (formData.get('postal_code') as string) || null,
      country: (formData.get('country') as string) || null,
    }

    const { error } = await supabase
      .from('organisations')
      .update(updates)
      .eq('id', profile.organisation_id)

    const params = error ? `?error=${encodeURIComponent(error.message)}` : '?saved=1'
    redirect(`/portal/settings${params}`)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          Organisation portal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{org.name}</h1>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
        <OrgForm
          org={org}
          action={updateOrg}
          error={error}
          success={saved === '1'}
        />
      </div>
    </div>
  )
}

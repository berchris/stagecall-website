import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import FormField from '@/components/portal/FormField'
import SubmitButton from '@/components/portal/SubmitButton'

async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
  if (!profile?.is_staff) redirect('/admin')
  return user
}

async function createOrg(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('is_staff').eq('id', user.id).single()
  if (!profile?.is_staff) return

  const admin = createAdminClient()

  const { data: org, error: orgError } = await admin
    .from('organisations')
    .insert({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      website: (formData.get('website') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || null,
      postal_code: (formData.get('postal_code') as string) || null,
      country: (formData.get('country') as string) || null,
    })
    .select('id')
    .single()

  if (orgError || !org) {
    redirect(`/admin/orgs/new?error=${encodeURIComponent(orgError?.message ?? 'Failed to create organisation')}`)
  }

  const adminEmail = (formData.get('admin_email') as string)?.trim()
  const adminPhone = (formData.get('admin_phone') as string)?.trim()

  if (adminEmail || adminPhone) {
    await admin.from('invites').insert({
      email: adminEmail || null,
      phone: adminPhone || null,
      organisation_id: org.id,
      role: 'org_admin',
      invited_by: user.id,
    })

    if (adminEmail) {
      await admin.auth.admin.inviteUserByEmail(adminEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stagecall.app'}/portal`,
      })
    }
  }

  redirect(`/admin/orgs/${org.id}`)
}

export default async function NewOrgPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireStaff()
  const { error } = await searchParams

  const divider = <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Organisations</a>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, marginTop: 16 }}>
          Staff portal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>New organisation</h1>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
        <form action={createOrg}>
          {/* Org details */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            Organisation details
          </p>
          <FormField label="Organisation name" name="name" required placeholder="e.g. The Grand Theatre" />
          <FormField label="Email" name="email" type="email" placeholder="info@yourorg.com" />
          <FormField label="Phone" name="phone" placeholder="+31 6 12345678" />
          <FormField label="Website" name="website" placeholder="https://yourorg.com" />

          {divider}

          {/* Address */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            Address
          </p>
          <FormField label="Street address" name="address" placeholder="Theaterlaan 12" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="City" name="city" placeholder="Amsterdam" />
            <FormField label="Postal code" name="postal_code" placeholder="1234 AB" />
          </div>
          <FormField label="Country" name="country" placeholder="Netherlands" />

          {divider}

          {/* Admin invite */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
            First admin invite
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Optional. This person will receive an invite email and be set up as the org admin.
          </p>
          <FormField label="Admin email" name="admin_email" type="email" placeholder="admin@theirorg.com" />
          <FormField label="Admin phone (if no email)" name="admin_phone" type="tel" placeholder="+31 6 12345678" />

          {error && (
            <p style={{ color: 'var(--urgent)', fontSize: 14, marginBottom: 16 }}>{error}</p>
          )}

          <SubmitButton label="Create organisation" loadingLabel="Creating…" />
        </form>
      </div>
    </div>
  )
}

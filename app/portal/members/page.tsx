import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import MembersManager from '@/components/portal/MembersManager'
import PortalShell from '@/components/portal/PortalShell'
import { sendInviteEmail } from '@/lib/sendInviteEmail'

async function requireOrgAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'org_admin') redirect('/portal/settings')

  return { user, profile }
}

export default async function PortalMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { user, profile } = await requireOrgAdmin()
  const { error, success } = await searchParams

  const supabase = await createClient()

  const [{ data: members }, { data: pendingInvites }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, email, phone, role')
      .eq('organisation_id', profile.organisation_id)
      .in('role', ['org_admin', 'manager'])
      .order('role', { ascending: true })
      .order('name', { ascending: true }),
    supabase
      .from('invites')
      .select('id, email, phone, role, created_at')
      .eq('organisation_id', profile.organisation_id)
      .is('production_id', null)
      .in('role', ['org_admin', 'manager'])
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  const orgAdminCount = members?.filter(m => m.role === 'org_admin').length ?? 0

  async function changeRole(formData: FormData) {
    'use server'
    const { user, profile } = await requireOrgAdmin()
    const targetId = formData.get('user_id') as string
    const newRole = formData.get('new_role') as string

    if (targetId === user.id) redirect('/portal/members?error=Cannot+change+your+own+role')
    if (newRole !== 'org_admin' && newRole !== 'manager') redirect('/portal/members?error=Invalid+role')

    if (newRole === 'manager') {
      const admin = createAdminClient()
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
        .eq('role', 'org_admin')
      if ((count ?? 0) <= 1) redirect('/portal/members?error=Cannot+demote+the+last+org+admin')
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetId)
      .eq('organisation_id', profile.organisation_id)

    if (error) redirect(`/portal/members?error=${encodeURIComponent(error.message)}`)
    redirect('/portal/members?success=Role+updated')
  }

  async function removeMember(formData: FormData) {
    'use server'
    const { user, profile } = await requireOrgAdmin()
    const targetId = formData.get('user_id') as string

    if (targetId === user.id) redirect('/portal/members?error=Cannot+remove+yourself')

    const admin = createAdminClient()
    const { data: target } = await admin
      .from('profiles')
      .select('role')
      .eq('id', targetId)
      .eq('organisation_id', profile.organisation_id)
      .single()

    if (!target) redirect('/portal/members?error=Member+not+found')

    if (target.role === 'org_admin') {
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
        .eq('role', 'org_admin')
      if ((count ?? 0) <= 1) redirect('/portal/members?error=Cannot+remove+the+last+org+admin')
    }

    const { error } = await admin
      .from('profiles')
      .update({ organisation_id: null, role: 'crew' })
      .eq('id', targetId)
      .eq('organisation_id', profile.organisation_id)

    if (error) redirect(`/portal/members?error=${encodeURIComponent(error.message)}`)
    redirect('/portal/members?success=Member+removed')
  }

  async function inviteMember(formData: FormData) {
    'use server'
    const { user, profile } = await requireOrgAdmin()
    const contact = (formData.get('contact') as string)?.trim()
    const role = formData.get('role') as string

    if (!contact) redirect('/portal/members?error=Email+or+phone+is+required')
    if (role !== 'org_admin' && role !== 'manager') redirect('/portal/members?error=Invalid+role')

    const isEmail = contact.includes('@')
    const invite = {
      organisation_id: profile.organisation_id,
      role,
      invited_by: user.id,
      status: 'pending',
      production_id: null,
      team_name: null,
      ...(isEmail ? { email: contact, phone: null } : { phone: contact, email: null }),
    }

    const admin = createAdminClient()

    // Check for existing pending invite
    const query = admin
      .from('invites')
      .select('id')
      .eq('organisation_id', profile.organisation_id)
      .eq('status', 'pending')
    if (isEmail) query.eq('email', contact)
    else query.eq('phone', contact)

    const { data: existing } = await query.single()
    if (existing) redirect('/portal/members?error=An+invite+already+exists+for+this+contact')

    const { data: created, error } = await admin.from('invites').insert(invite).select('id').single()
    if (error) redirect(`/portal/members?error=${encodeURIComponent(error.message)}`)

    const emailed = isEmail && (await sendInviteEmail(created.id))
    redirect(emailed ? '/portal/members?success=Invite+sent' : '/portal/members?success=Invite+created')
  }

  async function cancelInvite(formData: FormData) {
    'use server'
    const { profile } = await requireOrgAdmin()
    const inviteId = formData.get('invite_id') as string

    const admin = createAdminClient()
    const { error } = await admin
      .from('invites')
      .delete()
      .eq('id', inviteId)
      .eq('organisation_id', profile.organisation_id)

    if (error) redirect(`/portal/members?error=${encodeURIComponent(error.message)}`)
    redirect('/portal/members?success=Invite+cancelled')
  }

  return (
    <PortalShell>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
            Organisation portal
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Admins & Managers</h1>
          <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 8 }}>
            {members?.length ?? 0} member{members?.length !== 1 ? 's' : ''} with organisation access
          </p>
        </div>

        <MembersManager
          members={(members ?? []) as any}
          currentUserId={user.id}
          orgAdminCount={orgAdminCount}
          pendingInvites={pendingInvites ?? []}
          changeRole={changeRole}
          removeMember={removeMember}
          inviteMember={inviteMember}
          cancelInvite={cancelInvite}
          error={error}
          success={success}
        />
      </div>
    </PortalShell>
  )
}

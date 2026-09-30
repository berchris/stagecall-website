import { createClient } from '@/lib/supabase/server'

// Emails an invite via the StageCall `send-invite-email` edge function (Loops remotely, Mailpit locally).
// Must run as the signed-in user who created the invite (invites.invited_by) — the function checks this.
export async function sendInviteEmail(inviteId: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.functions.invoke('send-invite-email', { body: { invite_id: inviteId } })
  if (error) console.error('send-invite-email failed:', error.message)
  return !error
}

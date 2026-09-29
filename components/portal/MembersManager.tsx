'use client'

import { useState } from 'react'
import SubmitButton from './SubmitButton'

export type OrgMember = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  role: 'org_admin' | 'manager'
}

export type PendingInvite = {
  id: string
  email: string | null
  phone: string | null
  role: string
  created_at: string
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  org_admin: { label: 'Org Admin', color: 'var(--purple)' },
  manager: { label: 'Manager', color: 'var(--gold)' },
}

export default function MembersManager({
  members,
  currentUserId,
  orgAdminCount,
  pendingInvites,
  changeRole,
  removeMember,
  inviteMember,
  cancelInvite,
  error,
  success,
}: {
  members: OrgMember[]
  currentUserId: string
  orgAdminCount: number
  pendingInvites: PendingInvite[]
  changeRole: (formData: FormData) => Promise<void>
  removeMember: (formData: FormData) => Promise<void>
  inviteMember: (formData: FormData) => Promise<void>
  cancelInvite: (formData: FormData) => Promise<void>
  error?: string
  success?: string
}) {
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [showInviteForm, setShowInviteForm] = useState(false)

  return (
    <>
      {error && (
        <div style={{ background: 'var(--urgent)18', border: '1px solid var(--urgent)40', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ color: 'var(--urgent)', fontSize: 14 }}>{error}</p>
        </div>
      )}
      {success && (
        <div style={{ background: 'var(--teal)18', border: '1px solid var(--teal)40', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ color: 'var(--teal)', fontSize: 14 }}>{success}</p>
        </div>
      )}

      {/* Active members */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {members.map(member => {
          const isCurrentUser = member.id === currentUserId
          const roleInfo = ROLE_LABELS[member.role]
          const isLastAdmin = member.role === 'org_admin' && orgAdminCount <= 1
          const canModify = !isCurrentUser

          return (
            <div
              key={member.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{member.name || 'Unnamed'}</p>
                    {isCurrentUser && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px' }}>YOU</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-sec)', fontSize: 13 }}>
                    {member.email || member.phone || 'No contact info'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                    color: roleInfo.color,
                    background: `${roleInfo.color}18`,
                    border: `1px solid ${roleInfo.color}40`,
                    borderRadius: 6,
                    padding: '3px 10px',
                    whiteSpace: 'nowrap',
                  }}>
                    {roleInfo.label}
                  </span>

                  {canModify && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <form action={changeRole}>
                        <input type="hidden" name="user_id" value={member.id} />
                        <input type="hidden" name="new_role" value={member.role === 'org_admin' ? 'manager' : 'org_admin'} />
                        <button
                          type="submit"
                          disabled={isLastAdmin && member.role === 'org_admin'}
                          title={isLastAdmin ? 'Cannot demote the last org admin' : member.role === 'org_admin' ? 'Demote to Manager' : 'Promote to Org Admin'}
                          style={{
                            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                            padding: '5px 10px',
                            color: isLastAdmin && member.role === 'org_admin' ? 'var(--text-muted)' : 'var(--text-sec)',
                            fontSize: 12, cursor: isLastAdmin && member.role === 'org_admin' ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {member.role === 'org_admin' ? '↓ Demote' : '↑ Promote'}
                        </button>
                      </form>

                      {confirmRemove === member.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <form action={removeMember}>
                            <input type="hidden" name="user_id" value={member.id} />
                            <button
                              type="submit"
                              style={{
                                background: 'var(--urgent)', border: 'none', borderRadius: 8,
                                padding: '5px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                              }}
                            >
                              Confirm
                            </button>
                          </form>
                          <button
                            type="button"
                            onClick={() => setConfirmRemove(null)}
                            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', color: 'var(--text-sec)', fontSize: 12, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isLastAdmin && member.role === 'org_admin'}
                          title={isLastAdmin ? 'Cannot remove the last org admin' : 'Remove from organisation'}
                          onClick={() => setConfirmRemove(member.id)}
                          style={{
                            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                            padding: '5px 10px',
                            color: isLastAdmin && member.role === 'org_admin' ? 'var(--text-muted)' : 'var(--urgent)',
                            fontSize: 12, cursor: isLastAdmin && member.role === 'org_admin' ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            Pending invites
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingInvites.map(invite => {
              const roleInfo = ROLE_LABELS[invite.role] ?? ROLE_LABELS.manager
              return (
                <div
                  key={invite.id}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: '14px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    opacity: 0.8,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>
                      {invite.email || invite.phone}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      Invited · hasn't signed up yet
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                      color: roleInfo.color, background: `${roleInfo.color}18`,
                      border: `1px solid ${roleInfo.color}40`, borderRadius: 6,
                      padding: '3px 10px', whiteSpace: 'nowrap',
                    }}>
                      {roleInfo.label}
                    </span>
                    <form action={cancelInvite}>
                      <input type="hidden" name="invite_id" value={invite.id} />
                      <button
                        type="submit"
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Invite form */}
      {!showInviteForm ? (
        <button
          onClick={() => setShowInviteForm(true)}
          style={{ padding: '10px 20px', background: 'var(--gold)', border: 'none', borderRadius: 10, color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          + Invite member
        </button>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            Invite member
          </p>
          <form action={async (fd) => { await inviteMember(fd); setShowInviteForm(false) }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 8 }}>
                Email or phone
              </label>
              <input
                name="contact"
                type="text"
                placeholder="name@example.com or +31 6 12345678"
                required
                style={{ width: '100%', background: 'var(--surface-r)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 8 }}>
                Role
              </label>
              <select
                name="role"
                defaultValue="manager"
                style={{ width: '100%', background: 'var(--surface-r)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 15, outline: 'none' }}
              >
                <option value="manager">Manager</option>
                <option value="org_admin">Org Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <SubmitButton label="Send invite" loadingLabel="Inviting…" />
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                style={{ flex: 1, padding: '14px', background: 'none', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-sec)', fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

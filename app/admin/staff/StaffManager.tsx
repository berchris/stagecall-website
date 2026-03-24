'use client'

import { useState } from 'react'
import SubmitButton from '@/components/portal/SubmitButton'

type StaffMember = {
  id: string
  name: string | null
  contact: string
  role: string
  is_staff: boolean
}

export default function StaffManager({
  staffList,
  currentUserId,
  toggleStaff,
  error,
  success,
}: {
  staffList: StaffMember[]
  currentUserId: string
  toggleStaff: (formData: FormData) => Promise<void>
  error?: string
  success?: boolean
}) {
  const [addMode, setAddMode] = useState(false)

  return (
    <>
      {/* Current staff list */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 24 }}>
        {staffList.length === 0 ? (
          <p style={{ padding: '32px 24px', color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>No staff accounts yet.</p>
        ) : staffList.map((member, i) => (
          <div
            key={member.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', gap: 12,
              borderBottom: i < staffList.length - 1 ? '1px solid var(--border-sub)' : 'none',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{member.name ?? 'Unnamed'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{member.contact}</p>
            </div>
            {member.id !== currentUserId && (
              <form action={toggleStaff}>
                <input type="hidden" name="contact" value={member.contact} />
                <input type="hidden" name="action" value="remove" />
                <button
                  type="submit"
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', color: 'var(--urgent)', fontSize: 13, cursor: 'pointer' }}
                >
                  Remove
                </button>
              </form>
            )}
            {member.id === currentUserId && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>You</span>
            )}
          </div>
        ))}
      </div>

      {/* Add staff */}
      {!addMode ? (
        <button
          onClick={() => setAddMode(true)}
          style={{ padding: '10px 20px', background: 'var(--gold)', border: 'none', borderRadius: 10, color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          + Add staff member
        </button>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            Add staff member
          </p>
          <form action={toggleStaff}>
            <input type="hidden" name="action" value="add" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 8 }}>
                Email or phone
              </label>
              <input
                name="contact"
                type="text"
                placeholder="Email or +31 6 12345678"
                required
                className="portal-input"
                style={{ width: '100%', background: 'var(--surface-r)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 15, outline: 'none' }}
              />
            </div>
            {error && <p style={{ color: 'var(--urgent)', fontSize: 14, marginBottom: 12 }}>{error}</p>}
            {success && <p style={{ color: 'var(--teal)', fontSize: 14, marginBottom: 12 }}>Staff member added.</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <SubmitButton label="Add staff" loadingLabel="Adding…" />
              <button type="button" onClick={() => setAddMode(false)} style={{ flex: 1, padding: '14px', background: 'none', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-sec)', fontSize: 15, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

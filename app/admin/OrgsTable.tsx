'use client'

import { useState } from 'react'
import Link from 'next/link'

type OrgRow = {
  id: string
  name: string
  city: string | null
  country: string | null
  email: string | null
  created_at: string
}

export default function AdminOrgsTable({ orgs }: { orgs: OrgRow[] }) {
  const [query, setQuery] = useState('')

  const filtered = orgs.filter(o =>
    o.name.toLowerCase().includes(query.toLowerCase()) ||
    (o.city ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (o.country ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search organisations…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="portal-input"
          style={{ width: '100%', maxWidth: 360, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <div className="portal-table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Organisation', 'City', 'Country', 'Email', 'Created', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No organisations found
                </td>
              </tr>
            ) : filtered.map(org => (
              <tr key={org.id} className="portal-table-row" style={{ borderBottom: '1px solid var(--border-sub)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{org.name}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)', fontSize: 14 }}>{org.city ?? '—'}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)', fontSize: 14 }}>{org.country ?? '—'}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)', fontSize: 14 }}>{org.email ?? '—'}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {new Date(org.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/admin/orgs/${org.id}`} style={{ fontSize: 13, color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

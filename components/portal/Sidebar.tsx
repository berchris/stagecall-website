'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, LogOut, Settings, Drama, Users, Building, Shield, type LucideIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SidebarItem = {
  href: string
  label: string
  icon: LucideIcon
}

const VARIANTS: Record<'portal' | 'admin', { sectionLabel: string; items: SidebarItem[] }> = {
  portal: {
    sectionLabel: 'Organisation Portal',
    items: [
      { href: '/portal/settings', label: 'Settings', icon: Settings },
      { href: '/portal/productions', label: 'Productions', icon: Drama },
      { href: '/portal/members', label: 'Members', icon: Users },
    ],
  },
  admin: {
    sectionLabel: 'Staff Portal',
    items: [
      { href: '/admin', label: 'Organisations', icon: Building },
      { href: '/admin/staff', label: 'Manage staff', icon: Shield },
    ],
  },
}

export default function Sidebar({ variant }: { variant: 'portal' | 'admin' }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { sectionLabel, items } = VARIANTS[variant]

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const brand = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5, color: 'var(--gold)' }}>
        STAGECALL
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {sectionLabel}
      </span>
    </div>
  )

  const navLink = (item: SidebarItem, onClick?: () => void) => {
    const active = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className="portal-sidebar-link"
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? 'var(--text)' : 'var(--text-sec)',
          padding: '11px 14px',
          borderRadius: 12,
          background: active ? 'var(--surface-r)' : 'transparent',
          border: active ? '1px solid var(--border)' : '1px solid transparent',
          textDecoration: 'none',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <Icon size={17} color={active ? 'var(--gold)' : 'currentColor'} strokeWidth={2} />
        {item.label}
      </Link>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="portal-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        width: 248,
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
      }}>
        <div style={{ padding: '0 6px', marginBottom: 32 }}>{brand}</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {items.map(item => navLink(item))}
        </nav>

        <button
          onClick={signOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 12, padding: '11px 14px',
            color: 'var(--text-sec)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <LogOut size={17} strokeWidth={2} />
          Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="portal-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: 'rgba(11,11,22,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        {brand}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 6 }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className="portal-topbar-menu" style={{
        position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
        flexDirection: 'column', gap: 4,
        background: 'rgba(11,11,22,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: menuOpen ? '1px solid var(--border)' : 'none',
        padding: menuOpen ? '12px 16px 16px' : '0 16px',
        maxHeight: menuOpen ? 400 : 0,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}>
        {items.map(item => navLink(item, () => setMenuOpen(false)))}
        <button
          onClick={signOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 12, padding: '11px 14px', marginTop: 6,
            color: 'var(--text-sec)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <LogOut size={17} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </>
  )
}

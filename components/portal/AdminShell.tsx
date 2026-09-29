import Sidebar from './Sidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar variant="admin" />
      <main className="portal-main" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </>
  )
}

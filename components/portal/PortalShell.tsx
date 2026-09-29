import Sidebar from './Sidebar'

export default function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar variant="portal" />
      <main className="portal-main" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </>
  )
}

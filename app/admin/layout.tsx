import PortalNav from '@/components/portal/PortalNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNav label="Staff Portal" />
      <main style={{ paddingTop: 60, minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </>
  )
}

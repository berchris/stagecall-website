import PortalNav from '@/components/portal/PortalNav'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNav label="My Organisation" />
      <main style={{ paddingTop: 60, minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </>
  )
}

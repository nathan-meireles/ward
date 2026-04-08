import { Sidebar } from '@/components/shell/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          background: 'var(--bg)',
          minWidth: 0,
          padding: '32px 36px',
        }}
      >
        {children}
      </main>
    </div>
  )
}

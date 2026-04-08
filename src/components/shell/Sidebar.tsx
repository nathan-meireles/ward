'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Bookmark,
  Package,
  Megaphone,
  CheckSquare,
  BarChart2,
} from 'lucide-react'

const NAV = [
  { href: '/swipe', icon: Bookmark, label: 'Swipe File' },
  { href: '/produtos', icon: Package, label: 'Produtos' },
  { href: '/criativos', icon: Megaphone, label: 'Criativos' },
  { href: '/tarefas', icon: CheckSquare, label: 'Tarefas' },
  { href: '/benchmark', icon: BarChart2, label: 'Benchmark' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        width: 220,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            letterSpacing: 2,
            color: 'var(--brand)',
            lineHeight: 1,
          }}
        >
          NOTREGLR
        </span>
        <div style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 2 }}>
          Central de Operações
        </div>
      </div>

      {/* Project pill */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            background: 'var(--brand-dim)',
            border: '1px solid var(--brand)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brand)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--brand)',
              display: 'inline-block',
            }}
          />
          NOTREGLR
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 8px', flex: 1 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 2,
                textDecoration: 'none',
                color: active ? 'var(--brand)' : 'var(--text-2)',
                background: active ? 'var(--brand-dim)' : 'transparent',
                fontWeight: active ? 600 : 400,
                fontSize: 13.5,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-4)',
          fontSize: 11,
        }}
      >
        ward.notreglr.com · interno
      </div>
    </aside>
  )
}

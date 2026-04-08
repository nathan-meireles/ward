'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, Package, Megaphone, CheckSquare, BarChart2 } from 'lucide-react'

const NAV = [
  { href: '/swipe',     icon: Bookmark,    label: 'Swipe File'  },
  { href: '/produtos',  icon: Package,     label: 'Produtos'    },
  { href: '/criativos', icon: Megaphone,   label: 'Criativos'   },
  { href: '/tarefas',   icon: CheckSquare, label: 'Tarefas'     },
  { href: '/benchmark', icon: BarChart2,   label: 'Benchmark'   },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      width: 216,
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          letterSpacing: 3,
          color: 'var(--text)',
          lineHeight: 1,
          marginBottom: 3,
        }}>
          NOTREGLR
        </div>
        <div style={{ color: 'var(--text-4)', fontSize: 11, letterSpacing: 0.3 }}>
          Central de Operações
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '4px 10px', flex: 1 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 1,
              textDecoration: 'none',
              color: active ? 'var(--text)' : 'var(--text-3)',
              background: active ? 'var(--surface-2)' : 'transparent',
              fontWeight: active ? 600 : 400,
              fontSize: 13.5,
              transition: 'background 0.1s, color 0.1s',
            }}>
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-4)',
        fontSize: 11,
      }}>
        ward.notreglr.com
      </div>
    </aside>
  )
}

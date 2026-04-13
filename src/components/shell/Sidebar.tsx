'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, Package, Megaphone, CheckSquare, BarChart2, Sun, Moon, FlaskConical, BookOpen, ChevronDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/swipe',      icon: Bookmark,     label: 'Swipe File' },
  { href: '/mineracao',  icon: FlaskConical, label: 'Mineração'  },
  { href: '/produtos',   icon: Package,      label: 'Produtos'   },
  { href: '/esteira',    icon: TrendingUp,   label: 'Esteira'    },
  { href: '/criativos',  icon: Megaphone,    label: 'Criativos'  },
  { href: '/tarefas',    icon: CheckSquare,  label: 'Tarefas'    },
  { href: '/benchmark',  icon: BarChart2,    label: 'Benchmark'  },
]

const MARCA_SUBNAV = [
  { href: '/marca',           label: 'Overview'    },
  { href: '/marca/visao',     label: 'Visão'       },
  { href: '/marca/voz',       label: 'Voz'         },
  { href: '/marca/avatar',    label: 'Avatar'      },
  { href: '/marca/fundadora', label: 'Fundadora'   },
  { href: '/marca/concorrentes', label: 'Concorrentes' },
  { href: '/marca/criativos', label: 'Criativos'   },
  { href: '/marca/trafego',   label: 'Tráfego'     },
  { href: '/marca/time',      label: 'Time'        },
  { href: '/marca/roadmap',   label: 'Roadmap'     },
]

export function Sidebar() {
  const pathname = usePathname()
  const [light, setLight] = useState(false)
  const isMarcaActive = pathname.startsWith('/marca')
  const [marcaOpen, setMarcaOpen] = useState(isMarcaActive)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      document.documentElement.classList.add('light')
      setLight(true)
    }
  }, [])

  useEffect(() => {
    if (isMarcaActive) setMarcaOpen(true)
  }, [isMarcaActive])

  function toggleTheme() {
    const next = !light
    setLight(next)
    document.documentElement.classList.toggle('light', next)
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  return (
    <aside style={{
      background: 'var(--surface-panel)',
      borderRight: '1px solid var(--border)',
      width: 216,
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          letterSpacing: 2,
          color: 'var(--brand)',
          lineHeight: 1,
          marginBottom: 3,
        }}>
          NOTREGLR
        </div>
        <div style={{ color: 'var(--text-4)', fontSize: 11, letterSpacing: 0.3 }}>
          Central de Operações
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }} />

      {/* Nav */}
      <nav style={{ padding: '8px 8px', flex: 1, overflowY: 'auto' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 2,
              textDecoration: 'none',
              color: active ? 'var(--brand)' : 'var(--text-3)',
              background: active ? 'var(--brand-dim)' : 'transparent',
              fontWeight: active ? 600 : 400,
              fontSize: 13.5,
              transition: 'background 0.15s, color 0.15s',
              borderLeft: active ? `2px solid var(--brand)` : '2px solid transparent',
            }}>
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          )
        })}

        {/* Marca group */}
        <div style={{ marginBottom: 2 }}>
          <button
            onClick={() => setMarcaOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              width: '100%',
              background: isMarcaActive ? 'var(--brand-dim)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isMarcaActive ? 'var(--brand)' : 'var(--text-3)',
              fontWeight: isMarcaActive ? 600 : 400,
              fontSize: 13.5,
              transition: 'background 0.15s, color 0.15s',
              borderLeft: isMarcaActive ? `2px solid var(--brand)` : '2px solid transparent',
              textAlign: 'left',
            }}
          >
            <BookOpen size={15} strokeWidth={isMarcaActive ? 2.2 : 1.8} />
            <span style={{ flex: 1 }}>Marca</span>
            <ChevronDown
              size={12}
              style={{
                transition: 'transform 0.2s',
                transform: marcaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: 0.6,
              }}
            />
          </button>

          {/* Sub-items */}
          <div style={{
            overflow: 'hidden',
            maxHeight: marcaOpen ? `${MARCA_SUBNAV.length * 34}px` : '0px',
            transition: 'max-height 0.25s ease',
          }}>
            {MARCA_SUBNAV.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px 6px 36px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 1,
                  textDecoration: 'none',
                  color: active ? 'var(--brand)' : 'var(--text-4)',
                  background: active ? 'var(--brand-dim)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: 12.5,
                  transition: 'background 0.15s, color 0.15s',
                  borderLeft: active ? `2px solid var(--brand)` : '2px solid transparent',
                }}>
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: 'var(--text-4)', fontSize: 11 }}>ward.notreglr.com</span>
        <button
          onClick={toggleTheme}
          title={light ? 'Tema escuro' : 'Tema claro'}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--text-3)',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          {light ? <Moon size={13} /> : <Sun size={13} />}
        </button>
      </div>
    </aside>
  )
}

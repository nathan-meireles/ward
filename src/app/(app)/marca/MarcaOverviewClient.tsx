'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    href: '/marca/visao',
    title: 'Visão',
    sub: 'Missão, Valores & Start With Why',
    desc: 'O propósito existencial da marca. Por que a NOTREGLR existe.',
  },
  {
    href: '/marca/voz',
    title: 'Voz',
    sub: 'Copy, Premissas & CTAs',
    desc: 'Como a NOTREGLR fala. Marketing de premissas irrefutáveis, vocabulário, CTAs por contexto.',
  },
  {
    href: '/marca/avatar',
    title: 'Avatar',
    sub: 'Elena — A Curadora Cultural',
    desc: 'Hipótese de público-alvo. Gatilhos de compra, objeções e hipótese alternativa.',
  },
  {
    href: '/marca/fundadora',
    title: 'Fundadora',
    sub: 'Stef Meireles — Founder Story',
    desc: 'Storytelling oficial, hooks para criativos, arco narrativo e regras do rosto da marca.',
  },
  {
    href: '/marca/concorrentes',
    title: 'Concorrentes',
    sub: 'Benchmark Competitivo',
    desc: 'POMME, SOERA, Vovia Bags, Florrenes. Gap identificado. Inspiração de marca.',
  },
  {
    href: '/marca/criativos',
    title: 'Criativos',
    sub: 'Produção de Criativos',
    desc: 'Regras visuais, ângulos de criativo, hierarquia de produção, 3 pilares de humor.',
  },
  {
    href: '/marca/trafego',
    title: 'Tráfego',
    sub: 'Meta Ads Playbook',
    desc: 'Kill criteria, estrutura ABO/CBO, métricas de benchmark, países prioritários.',
  },
  {
    href: '/marca/time',
    title: 'Time',
    sub: 'Equipe & Conselho Estratégico',
    desc: 'Departamentos, responsabilidades e o conselho de 8 membros em 4 camadas.',
  },
  {
    href: '/marca/roadmap',
    title: 'Roadmap',
    sub: 'Ativos Estratégicos',
    desc: 'Playbooks, módulos Ward, biblioteca de referência e prioridades por fase.',
  },
]

export function MarcaOverviewClient() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          BRANDBOOK
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 400, letterSpacing: '0.06em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
          NOTREGLR
        </h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--brand)', letterSpacing: '0.05em', marginTop: 6 }}>
          "Not regular. Not for everyone."
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 12, maxWidth: 560 }}>
          Central de documentação da marca. Selecione uma seção.
        </p>
      </div>

      {/* Manifesto */}
      <div style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 32 }}>
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
          A gente não tenta ser elegante. A gente tenta ser inesquecível. Se é estranho, colorido ou fora da curva — provavelmente é pra gente.
          Nossas bolsas não foram feitas pra combinar com tudo. Foram feitas pra dizer alguma coisa.
        </p>
      </div>

      {/* Sections grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '18px 20px',
              transition: 'border-color 0.15s, background 0.15s',
              cursor: 'pointer',
              height: '100%',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--brand)'
              el.style.background = 'var(--brand-dim)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.background = 'var(--surface)'
            }}>
              <div style={{ fontFamily: 'var(--font-alt)', fontSize: 22, color: 'var(--text)', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.08em', marginBottom: 8 }}>{s.sub.toUpperCase()}</div>
              <p style={{ color: 'var(--text-4)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

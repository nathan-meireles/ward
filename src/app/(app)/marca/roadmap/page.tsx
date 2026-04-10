export const metadata = { title: 'Roadmap — Marca NOTREGLR' }

export default function RoadmapPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / ROADMAP
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Roadmap de Ativos
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Inventário de ativos intelectuais e operacionais a construir ao longo do tempo.
        </p>
      </div>

      {/* Prioridades */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          PRIORIDADES POR FASE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              fase: 'Agora — Pré-teste',
              items: [
                { ok: true, text: 'Business plan com dados reais' },
                { ok: false, text: 'Conselho Estratégico v2 (completar)' },
                { ok: false, text: 'Playbook de Criativos (antes do shoot)' },
                { ok: false, text: 'Playbook de Mineração (3-5 SKUs do teste)' },
              ]
            },
            {
              fase: 'Fase Teste — €200 ad spend',
              items: [
                { ok: false, text: 'Playbook de Lançamento de Campanha' },
                { ok: false, text: 'Agente de Análise de Performance' },
              ]
            },
            {
              fase: 'Fase Validação — pós kill criteria',
              items: [
                { ok: false, text: 'Playbook de CRO da Loja' },
                { ok: false, text: 'Agente de UX/UI' },
                { ok: false, text: 'Playbook de Email e LTV' },
              ]
            },
          ].map(f => (
            <div key={f.fase}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', marginBottom: 10 }}>{f.fase.toUpperCase()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {f.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: item.ok ? 'var(--success, #4ade80)' : 'var(--text-4)', fontSize: 13, flexShrink: 0 }}>{item.ok ? '✓' : '○'}</span>
                    <span style={{ color: item.ok ? 'var(--text-2)' : 'var(--text-3)', fontSize: 12, lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playbooks */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          PLAYBOOKS OPERACIONAIS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { title: 'Mineração de Produtos', status: '📋 Planejado', file: 'playbooks/mineracao-de-produtos.md' },
            { title: 'Construção de Criativos', status: '📋 Planejado', file: 'playbooks/construcao-de-criativos.md' },
            { title: 'Lançamento de Campanha', status: '💡 Ideia', file: 'playbooks/lancamento-de-campanha.md' },
            { title: 'CRO Shopify', status: '💡 Ideia', file: 'playbooks/cro-shopify.md' },
            { title: 'Email Marketing e LTV', status: '💡 Ideia', file: 'playbooks/email-ltv.md' },
          ].map(p => (
            <div key={p.title} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ marginBottom: 6, fontSize: 14 }}>{p.status.split(' ')[0]}</div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)' }}>{p.file}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward + Biblioteca */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            WARD — MÓDULOS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { mod: 'Meta Ad Library', status: '✅', desc: 'Busca concorrentes em NL/BE/DE/FR/GB' },
              { mod: 'Token Manager', status: '✅', desc: 'npm run refresh-token — 60 dias' },
              { mod: 'AliExpress API', status: '📋', desc: 'Mineração: preço, reviews, variações' },
              { mod: 'IXSpy Export Processor', status: '📋', desc: 'Produtos bestsellers por país/categoria' },
              { mod: 'Kalodata Export Processor', status: '📋', desc: 'Análise de produtos em alta' },
              { mod: 'Claude Analyzer', status: '📋', desc: 'Analisar Ad Library + produtos' },
            ].map(m => (
              <div key={m.mod} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{m.status}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12 }}>{m.mod}</div>
                  <div style={{ color: 'var(--text-4)', fontSize: 11 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            BIBLIOTECA DE REFERÊNCIA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { cat: 'Copywriting', books: ['Breakthrough Advertising — Schwartz', 'Scientific Advertising — Hopkins'] },
              { cat: 'Marketing', books: ['$100M Offers — Hormozi', 'This Is Marketing — Godin', 'Purple Cow — Godin'] },
              { cat: 'Psicologia', books: ['Influence — Cialdini', 'Thinking Fast & Slow — Kahneman'] },
              { cat: 'Design / UX', books: ["Don't Make Me Think — Krug"] },
            ].map(c => (
              <div key={c.cat} style={{ paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', marginBottom: 4 }}>{c.cat.toUpperCase()}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {c.books.map(b => (
                    <div key={b} style={{ color: 'var(--text-3)', fontSize: 11 }}>— {b}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

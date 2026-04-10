export const metadata = { title: 'Tráfego — Marca NOTREGLR' }

export default function TrafegoPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / TRÁFEGO
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Traffic Playbook
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Meta Ads (Facebook + Instagram) · Europa · Conselho: Simo B. + Faruk Ilkhan + Spencer Pawliw
        </p>
      </div>

      {/* Kill criteria */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            KILL CRITERIA — FASE TESTE
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Gasto', 'Condição', 'Decisão'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['$10', 'CPC > $1 OU zero ATC', '❌ Mata'],
                  ['$10', 'CPC ≤ $1 OU teve ATC', '✓ Continua até $20'],
                  ['$20', 'Zero ATC', '❌ Mata'],
                  ['$20', 'ATC ≥ 1', '✓ Continua até $30'],
                  ['$30', 'Zero compras', '❌ Para'],
                  ['$30', 'Teve compra', '✓ Continua'],
                ].map(([g, c, d], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--brand)', fontWeight: 700 }}>{g}</td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-3)' }}>{c}</td>
                    <td style={{ padding: '7px 10px', color: d.startsWith('❌') ? 'var(--error, #e05)' : 'var(--success, #4ade80)', fontWeight: 600 }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            KILL CRITERIA — FASE ESCALA
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead>
                <tr>
                  {['Gasto desde $30', 'Condição', 'Decisão'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['$60', '≥ 2 compras', '✓ Deixa rodar / escala'],
                  ['$60', '< 2 compras', '❌ Para'],
                ].map(([g, c, d], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--brand)', fontWeight: 700 }}>{g}</td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-3)' }}>{c}</td>
                    <td style={{ padding: '7px 10px', color: d.startsWith('❌') ? 'var(--error, #e05)' : 'var(--success, #4ade80)', fontWeight: 600 }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Margem alta + boa margem → dobrar budget',
              'Margem alta + margem apertada → +20% budget',
              'Janela de decisão: 48–72h (nunca 1 dia isolado)',
              'Nunca escalar horizontalmente — sempre vertical (subir budget)',
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--brand)', fontSize: 12 }}>→</span>
                <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fases de campanha */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
          ESTRUTURA DE CAMPANHA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { fase: 'Fase 1', title: 'Descoberta de Linha', type: 'ABO', pergunta: 'Qual categoria ressoa?', budget: '$10/dia/campanha', duracao: '3–5 dias', estrutura: '1-1-3 ou 1-1-5', nota: 'ABO garante budget igual por linha' },
            { fase: 'Fase 2', title: 'Aprofundamento', type: 'ABO', pergunta: 'Qual produto converte?', budget: '$10/dia', duracao: 'Até kill criteria', estrutura: '1-1-5', nota: 'Broad targeting, sem interesses' },
            { fase: 'Fase 3', title: 'Escala', type: 'CBO', pergunta: 'Até onde escala?', budget: '$20–30/dia inicial', duracao: '48–72h para dobrar', estrutura: 'Budget livre', nota: '"Upload your ads and let it rip"' },
          ].map(f => (
            <div key={f.fase} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '16px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', marginBottom: 4 }}>{f.fase.toUpperCase()}</div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, marginBottom: 2 }}>{f.title}</div>
              <div style={{ color: 'var(--brand)', fontSize: 12, marginBottom: 12, fontStyle: 'italic' }}>{f.pergunta}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[['Tipo', f.type], ['Budget', f.budget], ['Duração', f.duracao], ['Estrutura', f.estrutura]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{k}</span>
                    <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, color: 'var(--text-4)', fontSize: 11, fontStyle: 'italic' }}>{f.nota}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas + Países */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            MÉTRICAS E BENCHMARKS (EUROPA)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Métrica', 'Benchmark', 'Kill / OK'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['CPM', '€8–15 (varia por país)', 'Referência apenas'],
                ['CPC', '€0.40–1.20', '> €1.20 com $10 → alerta'],
                ['CTR', '1–2% (fashion)', '< 0.8% → criativo não para scroll'],
                ['Add to Cart Rate', '3–8% dos cliques', 'Zero ATC com $20 → kill'],
                ['CAC', '€28–80', '> €50 com AOV €65 = margem zero'],
                ['ROAS break-even', '~4.0x (dropship)', '< 2.0x com $60 → kill'],
              ].map(([m, b, k], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '7px 10px', color: 'var(--text-2)', fontWeight: 600 }}>{m}</td>
                  <td style={{ padding: '7px 10px', color: 'var(--brand)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{b}</td>
                  <td style={{ padding: '7px 10px', color: 'var(--text-4)', fontSize: 11 }}>{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            PAÍSES — PRIORIDADE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { pais: 'UK', cpm: '~$11.81', conv: '2.6–4.1%', prior: 'Alta', color: '#4ade80' },
              { pais: 'Holanda', cpm: '~$8.58', conv: '2.2–2.7%', prior: 'Alta', color: '#4ade80' },
              { pais: 'Bélgica', cpm: '~$7.96', conv: 'Similar NL', prior: 'Alta', color: '#4ade80' },
              { pais: 'Alemanha', cpm: '~$9.05', conv: '2.22–2.7%', prior: 'Média', color: '#f90' },
              { pais: 'França', cpm: 'Médio', conv: 'Médio', prior: 'Média', color: '#f90' },
            ].map(p => (
              <div key={p.pais} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{p.pais}</span>
                  <span style={{ color: 'var(--text-4)', fontSize: 11, marginLeft: 6 }}>CPM {p.cpm}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{p.conv}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: p.color, fontWeight: 600 }}>{p.prior}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--brand-dim)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--brand)' }}>
            Fase inicial: UK + NL + BE
          </div>
        </div>
      </div>
    </div>
  )
}

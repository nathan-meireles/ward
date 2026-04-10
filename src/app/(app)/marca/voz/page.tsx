export const metadata = { title: 'Voz — Marca NOTREGLR' }

export default function VozPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / VOZ
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Voz da Marca
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Como a NOTREGLR fala, escreve e se comunica. Referência para todo copy.
        </p>
      </div>

      {/* Slogan + linhas fundadoras */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            NORTE VERDADEIRO
          </div>
          <div style={{ fontFamily: 'var(--font-alt)', fontSize: 28, color: 'var(--brand)', lineHeight: 1.2, marginBottom: 12 }}>
            "Not regular.<br />Not for everyone."
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
            Filtro de toda decisão criativa. Se o copy parece genérico, tenta agradar todo mundo, ou tem medo de perder o cliente — não está alinhado.
          </p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            LINHAS FUNDADORAS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Not regular. Not for everyone.',
              'Find yours. If you dare.',
              'Not for everyone. Maybe for you.',
              'See the full weirdness.',
              'Get the one that makes people ask.',
              'Not a model. Still makes heads turn.',
              'You\'ll know if it\'s for you.',
            ].map((line, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premissas Irrefutáveis */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          MARKETING DE PREMISSAS IRREFUTÁVEIS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', marginBottom: 8 }}>❌ PROMESSA (o que todo mundo faz)</div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>
              "Esta bolsa vai fazer você se destacar."
            </div>
            <p style={{ color: 'var(--text-4)', fontSize: 12, marginTop: 8 }}>O consumidor ouve → desconfia → ignora. Promessa pede fé.</p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', marginBottom: 8 }}>✓ PREMISSA (o que a NOTREGLR faz)</div>
            <div style={{ background: 'var(--brand-dim)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontStyle: 'italic' }}>
              "Este é o único formato de bolsa que ninguém na Europa está carregando nessa faixa de preço."
            </div>
            <p style={{ color: 'var(--text-4)', fontSize: 12, marginTop: 8 }}>O consumidor confirma com a própria lógica e conclui sozinho.</p>
          </div>
        </div>
      </div>

      {/* Remodelagem de copy */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          REMODELAGEM DO COPY CLÁSSICO
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Elemento', 'Hard Copy tradicional', 'NOTREGLR — remodela para'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Urgência', '"Oferta termina HOJE!"', '"We test small batches. When it\'s gone, it\'s gone."'],
                ['Escassez', '"Apenas 3 unidades!"', '"We only found one supplier who makes this."'],
                ['Prova social', '"10.000 clientes satisfeitos!"', '"People stopped her on the street to ask where she got it."'],
                ['Preço', '"Só €65! Aproveite!"', '"€65 for something nobody else is carrying."'],
                ['CTA', '"Compre agora!"', '"Find yours. If you dare."'],
              ].map(([el, trad, nr], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{el}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-4)', fontStyle: 'italic' }}>{trad}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--brand)' }}>{nr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vocabulário */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            VOCABULÁRIO — USAR
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['weird / estranha', 'statement', 'head turn', 'found / discovered', 'not for everyone', 'yours / you', 'I (founder)', 'makes people ask', 'obsessed'].map(w => (
              <span key={w} className="badge badge-success" style={{ fontSize: 11 }}>{w}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            VOCABULÁRIO — EVITAR
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['luxury', 'premium', 'high quality', 'affordable', 'trendy', 'cute', 'exclusive', 'sophisticated', 'must-have', 'Shop now'].map(w => (
              <span key={w} className="badge badge-error" style={{ fontSize: 11 }}>{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs por contexto */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          CTAs POR CONTEXTO
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { ctx: 'Ads (topo de funil)', lines: ['"Find yours. If you dare."', '"Not for everyone. Maybe for you."', '"See the full weirdness →"'] },
            { ctx: 'Página de produto', lines: ['"Take it to Europe."', '"Add to bag. Explain it to no one."', '"Yes, this is really €65."'] },
            { ctx: 'Email (carrinho)', lines: ['"Still thinking? That\'s fair."', '"It found you. Don\'t ignore that."'] },
            { ctx: 'Email pós-compra', lines: ['"Worth the wait."', '"Now make people ask."'] },
          ].map(item => (
            <div key={item.ctx}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', marginBottom: 8 }}>{item.ctx.toUpperCase()}</div>
              {item.lines.map((l, i) => (
                <div key={i} style={{ color: 'var(--text-2)', fontSize: 12, fontStyle: 'italic', marginBottom: 4 }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata = { title: 'Concorrentes — Marca NOTREGLR' }

export default function ConcorrentesPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / CONCORRENTES
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Benchmark Competitivo
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Concorrentes ativos em Meta Ads na Europa. Dados coletados via Meta Ad Library.
        </p>
      </div>

      {/* Concorrentes diretos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            CONCORRENTES DIRETOS — META ADS EUROPA
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>Dados: 01/04/2026</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Marca', 'Ads ativos', 'Preço', 'Posicionamento', 'Observação'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { marca: 'POMME', ads: 410, preco: '€40–80', pos: 'Francesa, vegan leather, personalização', obs: 'Sem personalidade forte — gap aberto', risk: 'high' },
                { marca: 'SOERA', ads: 390, preco: '€40–100', pos: 'Minimalista, "The Row lookalike", quiet luxury', obs: 'Trustpilot ruim (devoluções China) — não repetir', risk: 'high' },
                { marca: 'Vovia Bags', ads: 120, preco: '€45–176', pos: 'Amsterdam-based, vegan leather, clean', obs: 'Posicionamento oposto — confirma o gap', risk: 'medium' },
                { marca: 'Florrenes', ads: 61, preco: '€50–90', pos: 'Minimalista, vegan leather, clássica', obs: 'Monitorar crescimento de volume', risk: 'low' },
                { marca: 'Polène', ads: 1200, preco: '€150–500', pos: 'Francesa, semi-luxo, forte DTC', obs: 'Referência de escala e criativos — fora do price range', risk: 'ref' },
              ].map((c, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.marca}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: c.ads >= 300 ? 'var(--error, #e05)' : c.ads >= 100 ? 'var(--warning, #f90)' : 'var(--text-3)',
                    }}>{c.ads}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-2)', fontSize: 12 }}>{c.preco}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-3)', fontSize: 12 }}>{c.pos}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-4)', fontSize: 11, fontStyle: 'italic' }}>{c.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--brand-dim)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)' }}>GAP IDENTIFICADO: </span>
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>
            Nenhuma dessas marcas faz anti-fashion, humor ou statement bags com voz própria. Todas jogam no campo elegante/minimalista/feminino. Esse é o espaço da NOTREGLR.
          </span>
        </div>
      </div>

      {/* Inspiração de marca */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          INSPIRAÇÃO DE MARCA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { marca: 'Yes We Vibe', why: 'Origem da ideia do subnicho — referência de vibe e estética inicial' },
            { marca: 'BAGGU', why: 'Bags coloridas/fun acessíveis, energia statement sem pretensão de luxo' },
            { marca: 'Disturbia', why: 'DNA "not for everyone", marketing de identidade, anti-mainstream — posicionamento de nicho forte' },
          ].map(item => (
            <div key={item.marca} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{item.marca}</div>
              <div style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.5 }}>{item.why}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Referência operacional */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          REFERÊNCIA OPERACIONAL
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { marca: 'Kapten & Son', learn: 'Começou com bag como herói → expandiu para óculos/relógios. Rota que NOTREGLR pode seguir depois de validar o core.' },
            { marca: 'Vinci-eyewear (Matheus Davila)', learn: 'Execução de founder-story DTC via Meta Ads. Mesmo conselheiro — ver como aplica na prática.' },
          ].map(item => (
            <div key={item.marca} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 6 }}>{item.marca}</div>
              <div style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.5 }}>{item.learn}</div>
            </div>
          ))}
        </div>

        {/* Alerta Icon Amsterdam */}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e05', marginBottom: 4 }}>⚠ CASO DE ALERTA — ICON AMSTERDAM</div>
          <p style={{ color: 'var(--text-3)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            Dropship menswear EU. Reviews terríveis no Trustpilot por taxas de importação surpresa, devoluções caras, atendimento ruim. O SOERA tem o mesmo problema. Não repetir esses erros.
          </p>
        </div>
      </div>
    </div>
  )
}

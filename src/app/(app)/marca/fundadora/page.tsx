export const metadata = { title: 'Fundadora — Marca NOTREGLR' }

export default function FundadoraPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / FUNDADORA
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Stef Meireles
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Stefania Meireles — founder story oficial da NOTREGLR.
        </p>
      </div>

      {/* Nome e identidade */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            IDENTIDADE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Nome informal', 'Stef Meireles'],
              ['Nome completo', 'Stefania Meireles'],
              ['Pessoa real', 'Estefanny Silva Azevedo de Souza'],
              ['Idioma em vídeo', 'Inglês via IA (não fala inglês fluente)'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', marginBottom: 2 }}>{k.toUpperCase()}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: k === 'Nome informal' ? 600 : 400 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--brand-dim)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', marginBottom: 4 }}>DECISÃO FECHADA — 06/04/2026</div>
            <p style={{ color: 'var(--text-3)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>
              Nome não reaberto para discussão. Stefania = forma italiana/europeia de Estefanny. Meireles = sobrenome real da família.
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            HISTÓRIA — VERSÃO CURTA (About / Bio)
          </div>
          <div style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>My name is Stef.</div>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
            I didn't start NOTREGLR because I knew anything about fashion. I started it because I was tired of knowing too much about the wrong kind.
          </p>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
            Every season, new colors. Same shapes. I kept walking into stores looking for something that didn't exist yet — a bag that made you stop. Not because of the logo. Not because of the price tag. Because of what it <em>was</em>.
          </p>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
            I couldn't find it anywhere in Europe at a price that made sense. So I went looking further. Much further.
          </p>
          <p style={{ color: 'var(--brand)', fontSize: 14, fontStyle: 'italic', margin: 0 }}>
            Every piece here passed one test: would a stranger stop you on the street to ask about it?
          </p>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-3)' }}>— Stef Meireles</div>
        </div>
      </div>

      {/* Hooks para criativos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          HOOKS PARA CRIATIVOS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            { hook: '"I found this bag that nobody in Europe had seen yet."', angle: 'Discovery', when: 'Cold traffic, awareness' },
            { hook: '"People kept asking where I got it, so I built a store."', angle: 'Reaction', when: 'Prova social implícita' },
            { hook: '"I\'m not a model. This bag still makes heads turn."', angle: 'Anti-editorial', when: 'Founder no frame' },
            { hook: '"I was tired of every store having the same bag."', angle: 'Origin', when: 'About page, email boas-vindas' },
            { hook: '"One filter: would someone stop you to ask about it?"', angle: 'Curadoria', when: 'Produto mais extremo' },
            { hook: '"I find them before you see them anywhere else."', angle: 'Curadoria ativa', when: 'Cold traffic, awareness' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', borderLeft: '2px solid var(--brand)' }}>
              <div style={{ color: 'var(--text)', fontSize: 13, fontStyle: 'italic', marginBottom: 8 }}>{item.hook}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-neutral" style={{ fontSize: 10 }}>{item.angle}</span>
                <span style={{ color: 'var(--text-4)', fontSize: 10, alignSelf: 'center' }}>{item.when}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arco narrativo + o que não é */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            ARCO NARRATIVO (vídeo 30–60s)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { beat: 'BEAT 1 — FRUSTRAÇÃO', text: '"Entrava em loja atrás de loja e saía com a mesma bolsa que todo mundo."' },
              { beat: 'BEAT 2 — DESCOBERTA', text: '"Comecei a procurar em outros lugares. Muito mais longe."' },
              { beat: 'BEAT 3 — PREMISSA', text: '"Um filtro só: alguém ia parar pra perguntar de onde é?"' },
              { beat: 'BEAT 4 — CONVITE', text: '"É isso que a NOTREGLR faz. Cada peça passou por esse filtro."' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', width: 24, textAlign: 'center', paddingTop: 2, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', marginBottom: 3 }}>{b.beat}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 12, fontStyle: 'italic' }}>{b.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            REGRAS DO ROSTO DA MARCA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { ok: false, text: 'Poses ensaiadas, olhar distante, estética editorial' },
              { ok: false, text: 'Influencer de moda — haul, OOTD genérico' },
              { ok: false, text: 'Embaixadora de luxo — conotação de prestígio aspiracional' },
              { ok: true, text: 'Fundadora — alguém que fez curadoria por você' },
              { ok: true, text: 'Descobridora — o produto chegou a você porque ela foi atrás primeiro' },
              { ok: true, text: 'Pessoa real — expressão genuína, postura natural, contexto urbano real' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: r.ok ? 'var(--success, #4ade80)' : 'var(--error, #e05)', fontSize: 13, flexShrink: 0 }}>{r.ok ? '✓' : '✕'}</span>
                <span style={{ color: r.ok ? 'var(--text-2)' : 'var(--text-3)', fontSize: 13 }}>{r.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--brand-dim)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ color: 'var(--text-2)', fontSize: 12, margin: 0, fontStyle: 'italic' }}>
              "A Stef aparece nos criativos como alguém que encontrou algo incrível — não como alguém que está vendendo algo."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

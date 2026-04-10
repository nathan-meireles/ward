export const metadata = { title: 'Visão — Marca NOTREGLR' }

export default function VisaoPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / VISÃO
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Visão, Missão & Valores
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          O propósito existencial da marca. O "porquê" antes do "o quê" e do "como".
        </p>
      </div>

      {/* Visão + Missão */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            VISÃO
          </div>
          <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Ser a marca de referência europeia para mulheres que recusam o uniforme da moda em massa — provando que design impossível de ignorar não precisa custar €300.
          </p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            MISSÃO
          </div>
          <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Garimpar o mundo em busca das peças que ninguém em nenhuma loja europeia está carregando — e entregar essa descoberta diretamente para quem recusa ser mais uma pessoa de Zara da cabeça aos pés.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
          VALORES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { n: '01', title: 'Honestidade antes de tudo', body: 'Não prometemos o que não entregamos. O que vendemos é a curadoria — e essa é genuína.' },
            { n: '02', title: 'Premissas, não promessas', body: 'Não dizemos "você vai se destacar". Mostramos a peça e deixamos você concluir.' },
            { n: '03', title: 'Curadoria rigorosa', body: 'Menos é mais. 10 peças que passam no teste de scroll valem mais que 100 medianas.' },
            { n: '04', title: 'Identidade, não status', body: 'Não vendemos o desejo de parecer rica. Vendemos o desejo de parecer você mesma.' },
            { n: '05', title: 'Construção de longo prazo', body: 'Não queremos vender uma vez. Queremos que a Elena conte para a amiga onde comprou.' },
          ].map(v => (
            <div key={v.n} style={{ borderLeft: '2px solid var(--brand)', paddingLeft: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', marginBottom: 4 }}>{v.n}</div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 4 }}>{v.title}</div>
              <div style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.5 }}>{v.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start With Why */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          START WITH WHY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'POR QUÊ', text: 'Em toda capital europeia, existe uma mulher que entra em loja atrás de loja e sai de mãos vazias — não por falta de dinheiro, mas por falta de algo que não pareça igual a tudo que ela já tem.' },
            { label: 'COMO', text: 'Curadoria global de peças com design impossível de ignorar, entregues diretamente a quem não quer explicar por que a bolsa dela não combina com nada — porque esse é exatamente o ponto.' },
            { label: 'O QUÊ', text: 'Bolsas femininas com design diferenciado, de €55 a €80, entregues na Europa.' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: 8 }}>{item.label}</div>
              <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* O que NÃO somos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          O QUE A NOTREGLR NÃO É
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Não somos uma loja de "bolsas bonitas" — bonito é subjetivo e esquecível',
            'Não somos uma marca de luxo acessível — não aspiramos a parecer o que não somos',
            'Não somos uma marca de tendências — tendências passam; identidade fica',
            'Não somos para todo mundo — "Not for everyone" não é postura, é verdade',
            'Não somos uma loja de dropshipping anônima — temos rosto, nome e história',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: 'var(--error, #e05)', fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>✕</span>
              <span style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

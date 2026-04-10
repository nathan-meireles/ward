export const metadata = { title: 'Avatar — Marca NOTREGLR' }

export default function AvatarPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / AVATAR
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Elena — A Curadora Cultural
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Hipótese informada. Validar com dados dos primeiros criativos.
        </p>
      </div>

      {/* Perfil */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            PERFIL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Idade', '26–35 anos (pico: 28–32)'],
              ['Local', 'Amsterdam, Berlim, Bruxelas, Paris, Londres'],
              ['Ocupação', 'Criativo, tech, design, comunicação'],
              ['Renda', '€2.000–3.500/mês líquido'],
              ['Device', 'iPhone — compra no mobile'],
              ['Idioma', 'Inglês fluente (segunda língua)'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', marginBottom: 2 }}>{k.toUpperCase()}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              A DOR REAL
            </div>
            <p style={{ color: 'var(--text)', fontSize: 15, fontStyle: 'italic', borderLeft: '2px solid var(--brand)', paddingLeft: 14, margin: '0 0 12px' }}>
              "Todo mundo no metrô parece igual. Eu compro em lojas diferentes, mas na prática estou comprando o mesmo guarda-roupa que todas as outras."
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 13, margin: 0 }}>
              Não é falta de dinheiro. É falta de algo que não pareça igual a tudo que ela já tem.
              O que ela não tem: uma peça que faz alguém parar e perguntar — não por ser cara, por ser impossível de ignorar.
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              O QUE ELA PENSA (MAS NÃO FALA)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Eu tenho gosto próprio. Por que é tão difícil encontrar algo que prove isso?',
                'Não quero parecer rica. Quero parecer que presto atenção.',
                'Se todo mundo está usando, eu não quero mais.',
                '€65 é um bom preço se a peça for realmente diferente. €300 é ridículo.',
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--brand)', fontSize: 12, flexShrink: 0 }}>—</span>
                  <span style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gatilhos de compra */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          GATILHOS DE COMPRA
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Gatilho', 'Por que funciona', 'Como a NOTREGLR ativa'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Stop-the-scroll visual', 'Ela para porque nunca viu aquilo antes', 'Produto que passa no filtro de scroll'],
                ['Founder authenticity', 'Pessoa real = confiança', 'Stef Meireles visível, foto real, história real'],
                ['Escassez real', 'Lote pequeno = raridade genuína', '"We test small batches. When it\'s gone, it\'s gone."'],
                ['Preço como premissa', '€65 para algo que ninguém tem = valor percebido alto', '"€65 for something nobody else is carrying."'],
                ['Identidade confirmada', 'O produto diz algo que ela já sente', '"Not for everyone. Maybe for you."'],
              ].map(([g, p, a], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--brand)', fontWeight: 600, fontSize: 12 }}>{g}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-3)' }}>{p}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-2)', fontStyle: 'italic' }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Objeções + Hipótese alternativa */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            OBJEÇÕES — COMO RESPONDER
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Não conheço essa loja', 'Founder visível + About page real + reviews + política de devolução clara'],
              ['Vai demorar para chegar?', '"Ships from our supplier. Arrives in 10-15 days." — não esconde, contextualiza'],
              ['E se não gostar?', '"30-day returns. No questions asked." — visível, sem letras miúdas'],
              ['Parece AliExpress', 'Foto própria, founder usando o produto, qualidade visual da loja'],
              ['€65 é caro pra marca desconhecida', 'Bundle + garantia + founder story reduz o risco percebido'],
            ].map(([ob, resp], i) => (
              <div key={i} style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none', paddingBottom: i < 4 ? 10 : 0 }}>
                <div style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 2, fontStyle: 'italic' }}>"{ob}"</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12 }}>{resp}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            HIPÓTESE ALTERNATIVA
          </div>
          <p style={{ color: 'var(--text-4)', fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
            A Elena é o público que <em>queremos</em>. Quem <em>vai comprar</em> no teste pode ser diferente:
          </p>
          <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-3)', fontSize: 12, marginBottom: 4 }}>Hipótese B — A Impulsiva</div>
            <div style={{ color: 'var(--text-4)', fontSize: 12, lineHeight: 1.5 }}>
              20–27 anos, menos preocupada com "vibe de marca", mais com "achei bonita e cabe no orçamento". Compra mais rápido, com menos pesquisa.
            </div>
            <div style={{ marginTop: 10, color: 'var(--text-4)', fontSize: 11 }}>
              Os dados do teste vão revelar qual hipótese é verdadeira.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

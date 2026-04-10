'use client'

// ─── BRAND DOCUMENTATION — NOTREGLR ──────────────────────────────────────────
// Brandbook completo para colaboradores, sócios e equipe interna.
// Conteúdo derivado de: brand-vision.md, brand-voice.md, avatar-elena.md,
// competitors.md, team-structure.md, playbooks/criativos.md

export function MarcaClient() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px 96px' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 64 }}>
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--brand)',
          marginBottom: 16,
        }}>
          Brandbook v1.0 — 06/04/2026
        </div>
        <h1 style={{
          fontFamily: 'var(--font-alt)',
          fontSize: 'clamp(48px, 8vw, 80px)',
          lineHeight: 1,
          color: 'var(--text)',
          marginBottom: 24,
          fontWeight: 400,
        }}>
          NOTREGLR
        </h1>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: 20,
          color: 'var(--text-3)',
          maxWidth: 560,
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Not regular. Not for everyone.
        </p>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--brand)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          maxWidth: 680,
        }}>
          <p style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            "A gente não tenta ser elegante. A gente tenta ser inesquecível. Se é estranho, colorido ou
            fora da curva — provavelmente é pra gente. Nossas bolsas não foram feitas pra combinar com
            tudo. Foram feitas pra dizer alguma coisa."
          </p>
        </div>
      </section>

      {/* ── ÍNDICE ────────────────────────────────────────────────────────────── */}
      <nav style={{ marginBottom: 64 }}>
        <SectionLabel>Índice</SectionLabel>
        <div className="bento" style={{ gridTemplateColumns: 'repeat(2, 1fr)', borderRadius: 'var(--radius)' }}>
          {[
            ['01', 'Visão, Missão e Valores'],
            ['02', 'Posicionamento'],
            ['03', 'Filosofia de Comunicação'],
            ['04', 'Voz da Marca'],
            ['05', 'Avatar: Elena'],
            ['06', 'Founder Story'],
            ['07', 'Linhas de Produto'],
            ['08', 'Concorrentes'],
            ['09', 'Estratégia de Criativos'],
            ['10', 'Time e Operação'],
          ].map(([num, label]) => (
            <a
              key={num}
              href={`#s${num}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 18px',
                textDecoration: 'none',
                background: 'var(--surface)',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brand)', minWidth: 22 }}>{num}</span>
              <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text-3)' }}>{label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* ── 01 VISÃO, MISSÃO E VALORES ────────────────────────────────────────── */}
      <section id="s01" style={{ marginBottom: 72 }}>
        <SectionHeader num="01" title="Visão, Missão e Valores" />

        <BlockCard title="Visão">
          <Quote>
            Ser a marca de referência europeia para mulheres que recusam o uniforme da moda em
            massa — provando que design impossível de ignorar não precisa custar €300.
          </Quote>
          <p style={bodyStyle}>
            Em termos práticos: uma mulher em Amsterdam, Berlim ou Paris que quer uma peça
            verdadeiramente diferente sabe que existe um lugar onde alguém já fez a curadoria por ela.
            Esse lugar é a NOTREGLR.
          </p>
        </BlockCard>

        <BlockCard title="Missão">
          <Quote>
            Garimpar o mundo em busca das peças que ninguém em nenhuma loja europeia está
            carregando — e entregar essa descoberta diretamente para quem recusa ser mais uma
            pessoa de Zara da cabeça aos pés.
          </Quote>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {[
              ['Garimpar', 'Curadoria ativa e criteriosa. Não vendemos qualquer coisa diferente. Vendemos o que passou no teste de scroll.'],
              ['Descoberta', 'O valor não está só no produto. Está no fato de que a founder foi atrás antes de você.'],
              ['Entrega direta', 'Sem intermediários de boutique, sem markup de loja física. O preço justo é a consequência da estrutura.'],
            ].map(([label, desc]) => (
              <div key={label} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brand)', minWidth: 100, paddingTop: 2 }}>{label}</span>
                <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</span>
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard title="Valores">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['1. Honestidade antes de tudo', 'Não prometemos o que não entregamos. A bolsa vem da China, demora um pouco mais, e isso está escrito claramente. O que vendemos é a curadoria — e essa é genuína.'],
              ['2. Premissas, não promessas', 'Não dizemos "você vai se destacar". Mostramos a peça e deixamos você concluir. A persuasão funciona pela verdade, não pela pressão.'],
              ['3. Curadoria rigorosa', 'Menos é mais. Preferimos ter 10 peças que passam no teste de scroll a ter 100 peças medianas. Cada produto no catálogo foi escolhido com intenção.'],
              ['4. Identidade, não status', 'Não vendemos o desejo de parecer rica. Vendemos o desejo de parecer você mesma — numa versão que para o scroll de quem passa.'],
              ['5. Construção de longo prazo', 'Não queremos vender uma vez. Queremos que a Elena conte para a amiga onde comprou. Isso exige produto que entrega, atendimento que respeita, e marca que dura.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ borderLeft: '2px solid var(--brand-dim)', paddingLeft: 16 }}>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>{title}</p>
                <p style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard title="O que a NOTREGLR NÃO é">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Não somos uma loja de "bolsas bonitas" — bonito é subjetivo e esquecível',
              'Não somos uma marca de luxo acessível — não aspiramos a parecer o que não somos',
              'Não somos uma marca de tendências — tendências passam; identidade fica',
              'Não somos para todo mundo — "Not for everyone" não é postura, é verdade',
              'Não somos uma loja de dropshipping anônima — temos rosto, nome e história',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--brand)', fontSize: 13, marginTop: 2, flexShrink: 0 }}>✕</span>
                <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </BlockCard>
      </section>

      {/* ── 02 POSICIONAMENTO ─────────────────────────────────────────────────── */}
      <section id="s02" style={{ marginBottom: 72 }}>
        <SectionHeader num="02" title="Posicionamento" />

        <BlockCard title="Mapa de Posicionamento">
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-3)',
            lineHeight: 1.8,
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px 24px',
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}>
{`         CARA (€200+)
              │
  Cult Gaia   │   Danse Lente
  Staud        │   Elleme
              │
GENÉRICA ─────┼───────── DIFERENTE
              │
  Zara        │   ← NOTREGLR ←
  H&M         │   (€55-80, design impossível
              │    de ignorar, DTC, Europa)
              │
         BARATA (<€40)`}
          </div>
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            A NOTREGLR ocupa o quadrante que não existe: <strong style={{ color: 'var(--brand)' }}>diferente + acessível</strong>.
            As marcas com design forte custam €200+. As acessíveis são genéricas. O gap é real.
          </p>
        </BlockCard>

        <div className="bento" style={{ gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 'var(--radius)', marginTop: 16 }}>
          {[
            { label: 'Faixa de preço', value: '€55 – €80', sub: 'por bolsa' },
            { label: 'Mercado', value: 'Europa', sub: 'UK, NL, BE, DE, FR, IE' },
            { label: 'Canal', value: 'Meta Ads', sub: 'Facebook + Instagram' },
            { label: 'Plataforma', value: 'Shopify', sub: 'DTC — sem intermediários' },
            { label: 'Status', value: 'Pré-lançamento', sub: 'Fase de teste' },
            { label: 'Idioma', value: 'Inglês', sub: 'Loja multi-país' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ padding: '20px 20px', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-alt)', fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>{value}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 FILOSOFIA DE COMUNICAÇÃO ───────────────────────────────────────── */}
      <section id="s03" style={{ marginBottom: 72 }}>
        <SectionHeader num="03" title="Filosofia de Comunicação" />

        <BlockCard title="Premissas Irrefutáveis — Light Copy">
          <p style={bodyStyle}>
            Há dois tipos de marketing. A NOTREGLR pratica apenas um deles.
          </p>
          <div className="bento" style={{ gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius-sm)', marginTop: 16 }}>
            <div style={{ padding: '20px 20px', background: 'var(--surface-2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 12 }}>Marketing de Promessas ✕</div>
              {[
                '"Esta bolsa vai fazer você se destacar."',
                '"Qualidade premium por um preço acessível."',
                '"Compre agora e sinta a diferença."',
              ].map(t => (
                <div key={t} style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid rgba(255,80,80,0.3)' }}>{t}</div>
              ))}
              <p style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', marginTop: 12, lineHeight: 1.5 }}>
                O consumidor ouve → desconfia → ignora. Porque promessa é uma afirmação que pede fé.
              </p>
            </div>
            <div style={{ padding: '20px 20px', background: 'var(--surface-2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 12 }}>Marketing de Premissas ✓</div>
              {[
                '"Este é o único formato de bolsa que ninguém na Europa está carregando nessa faixa de preço."',
                '"Compramos pequenos lotes. Quando esgota, não reabastecemos."',
                '"I found this bag that nobody here had seen yet."',
              ].map(t => (
                <div key={t} style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid var(--brand)' }}>{t}</div>
              ))}
              <p style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', marginTop: 12, lineHeight: 1.5 }}>
                O consumidor lê → confirma com a própria lógica → chega à conclusão sozinho. A premissa é um fato que o leitor verifica.
              </p>
            </div>
          </div>
        </BlockCard>

        <BlockCard title="Remodelagem de Copy Clássico">
          <p style={bodyStyle}>Os elementos clássicos de copy não são descartados — são remodelados para o ângulo verdadeiro da marca.</p>
          <DataTable
            headers={['Elemento', 'Hard Copy tradicional', 'NOTREGLR — versão verdadeira']}
            rows={[
              ['Urgência', '"Oferta termina HOJE!"', '"We test small batches. When it\'s gone, it\'s gone."'],
              ['Escassez', '"Apenas 3 unidades!"', '"We only found one supplier who makes this."'],
              ['Prova social', '"10.000 clientes satisfeitos!"', '"People stopped her on the street to ask where she got it."'],
              ['Autoridade', '"Especialistas recomendam!"', '"I spent months finding this. You don\'t have to."'],
              ['Origem', '"Importado diretamente!"', '"I found this bag that nobody in Europe had seen yet."'],
              ['Preço', '"Só €65! Aproveite!"', '"€65 for something nobody else is carrying."'],
              ['CTA', '"Compre agora!"', '"Find yours. If you dare."'],
            ]}
          />
        </BlockCard>

        <BlockCard title="Regra Inviolável">
          <Quote>
            A premissa tem que ser verdadeira. A remodelagem nunca inventa — ela enquadra o que é real pelo ângulo mais vantajoso e honesto.
          </Quote>
        </BlockCard>
      </section>

      {/* ── 04 VOZ DA MARCA ───────────────────────────────────────────────────── */}
      <section id="s04" style={{ marginBottom: 72 }}>
        <SectionHeader num="04" title="Voz da Marca" />

        <BlockCard title="Tom em uma frase">
          <div style={{
            fontFamily: 'var(--font-alt)',
            fontSize: 24,
            color: 'var(--text)',
            padding: '20px 0',
          }}>
            Honesta. Direta. Um pouco estranha. Sempre em cima de algo real.
          </div>
        </BlockCard>

        <BlockCard title="Três Eixos de Comunicação">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                title: 'Eixo 1 — Autoironia sem insegurança',
                desc: 'A marca ri de si mesma antes que outros riam. Mas nunca de forma que pareça insegura — é confiança disfarçada de humor.',
                yes: ['"Provavelmente sua mãe vai odiar essa bolsa."', '"Não é pra todo mundo. Literalmente."'],
                no: ['"Sabemos que é um estilo diferente..." (parece pedido de desculpa)'],
              },
              {
                title: 'Eixo 2 — Mostra, não diz',
                desc: 'Nunca afirmar o que pode ser demonstrado. O Volvo nunca disse "somos seguros" — eles mostraram acidentes.',
                yes: ['"I found this bag in China and had to bring it to Europe."', '"People kept asking where I got it, so I built a store."'],
                no: ['"Nossa marca é autêntica e diferente." (dizer é fraco — mostrar é forte)'],
              },
              {
                title: 'Eixo 3 — Identidade, não status',
                desc: 'Nunca prometer que o produto vai fazer a pessoa parecer rica ou sofisticada. Prometer que vai fazer a pessoa parecer ela mesma.',
                yes: ['"Não combina com todo look. Combina com quem você é."', '"A bolsa que faz alguém te parar na rua. Não pra elogiar — pra perguntar."'],
                no: ['"Luxury feel for an accessible price." (status aspiracional — não é a NOTREGLR)'],
              },
            ].map(({ title, desc, yes, no }) => (
              <div key={title} style={{ borderLeft: '2px solid var(--brand-dim)', paddingLeft: 16 }}>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>{title}</p>
                <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 10 }}>{desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {yes.map(t => <div key={t} style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-2)', paddingLeft: 10, borderLeft: '2px solid var(--brand)' }}>✓ {t}</div>)}
                  {no.map(t => <div key={t} style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', paddingLeft: 10, borderLeft: '2px solid rgba(255,80,80,0.35)' }}>✕ {t}</div>)}
                </div>
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard title="Linhas Fundadoras">
          <p style={{ ...bodyStyle, marginBottom: 16 }}>
            Estas linhas são o coração que bate na NOTREGLR. Não são campanhas — são a linguagem permanente da marca.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Not regular. Not for everyone.',
              'Find yours. If you dare.',
              'Not for everyone. Maybe for you.',
              'See the full weirdness.',
              'Get the one that makes people ask.',
              'I found this bag and had to bring it to Europe.',
              'Not a model. Still makes heads turn.',
              "You'll know if it's for you.",
            ].map(line => (
              <div key={line} style={{
                fontFamily: 'var(--font)',
                fontSize: 14,
                color: 'var(--text-2)',
                padding: '10px 16px',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '2px solid var(--brand)',
              }}>
                {line}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', marginTop: 12, lineHeight: 1.5 }}>
            Princípio: cada linha implica mais do que diz. Nenhuma usa as palavras "único", "diferente", "premium" ou "exclusivo". A conclusão é sempre do leitor — nunca da marca.
          </p>
        </BlockCard>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginTop: 16 }}>
          <div style={{ background: 'var(--surface)', padding: '24px 24px' }}>
            <SectionLabel>Vocabulário — Usar</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['weird / estranha', 'Elogio — a Elena quer isso'],
                ['statement', 'Categoria que ela reconhece e busca'],
                ['head turn', 'Resultado concreto que ela quer'],
                ['found / discovered', 'Narrativa de garimpagem'],
                ['not for everyone', 'Filtro de tribo'],
                ['yours / you', 'Copy em segunda pessoa'],
                ['I (founder)', 'Voz humana, não corporativa'],
                ['makes people ask', 'Prova social implícita'],
                ['obsessed', 'Emoção autêntica da founder'],
              ].map(([word, reason]) => (
                <div key={word} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--brand)' }}>{word}</span>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', textAlign: 'right' }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '24px 24px' }}>
            <SectionLabel>Vocabulário — Evitar</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['luxury / premium', 'Status aspiracional'],
                ['high quality', 'Vago e esperado'],
                ['affordable', 'Posiciona pelo preço'],
                ['trendy', 'Temporário'],
                ['cute', 'Registro errado — é Vendula, não NOTREGLR'],
                ['exclusive', 'Implica escassez artificial'],
                ['sophisticated', 'Tom errado — marca é raw'],
                ['must-have', 'Clichê de e-commerce genérico'],
                ['Shop now (sozinho)', 'CTA genérico sem contexto'],
              ].map(([word, reason]) => (
                <div key={word} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,80,80,0.7)' }}>{word}</span>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', textAlign: 'right' }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BlockCard title="CTAs por Contexto" style={{ marginTop: 16 }}>
          <DataTable
            headers={['Contexto', 'CTAs aprovadas']}
            rows={[
              ['Ad imagem estática (topo)', '"Find yours. If you dare." / "Not for everyone. Maybe for you." / "See the full weirdness →"'],
              ['Página de produto', '"Take it to Europe." / "Add to bag. Explain it to no one." / "Claim yours."'],
              ['Email — recuperação', '"Still thinking? That\'s fair. It\'s not a boring bag." / "It found you. Don\'t ignore that."'],
              ['Email — pós-compra', '"It\'s on its way. Worth the wait." / "You picked well. Now make people ask."'],
            ]}
          />
        </BlockCard>
      </section>

      {/* ── 05 AVATAR ELENA ───────────────────────────────────────────────────── */}
      <section id="s05" style={{ marginBottom: 72 }}>
        <SectionHeader num="05" title="Avatar: Elena" />

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <span className="badge badge-warning" style={{ flexShrink: 0 }}>Hipótese</span>
          <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
            A Elena foi construída com dados de mercado e lógica de posicionamento, mas só será validada ou derrubada pelo teste de ads. Os dados do primeiro lote de criativos podem revelar que a compradora real é diferente — e este documento deve ser atualizado com o que os dados disserem.
          </p>
        </div>

        <div className="bento" style={{ gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 'var(--radius)', marginBottom: 16 }}>
          {[
            { label: 'Idade', value: '26–35 anos', sub: 'pico: 28-32' },
            { label: 'Localização', value: 'Capital europeia', sub: 'Amsterdam, Berlim, Bruxelas, Paris, Londres' },
            { label: 'Renda', value: '€2.000–3.500/mês', sub: 'não é rica, mas tem agência' },
            { label: 'Dispositivo', value: 'iPhone', sub: 'descoberta + compra no mobile' },
            { label: 'Ocupação', value: 'Criativo / Tech', sub: 'trabalho que exige presença, não uniforme' },
            { label: 'Idioma', value: 'Multilíngue', sub: 'inglês fluente como segunda língua' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ padding: '18px 20px', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{value}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)' }}>{sub}</div>
            </div>
          ))}
        </div>

        <BlockCard title="A Dor Real da Elena">
          <Quote>
            "Todo mundo no metrô parece igual. Eu compro em lojas diferentes, mas na prática estou comprando o mesmo guarda-roupa que todas as outras."
          </Quote>
          <p style={bodyStyle}>Ela não está procurando uma bolsa. Está procurando uma peça que faz alguém parar e perguntar. Não por ser cara. Por ser impossível de ignorar.</p>
        </BlockCard>

        <BlockCard title="Gatilhos de Compra">
          <DataTable
            headers={['Gatilho', 'Por que funciona', 'Como a NOTREGLR ativa']}
            rows={[
              ['Stop-the-scroll visual', 'Ela para porque nunca viu aquilo antes', 'Produto que passa no filtro de scroll'],
              ['Founder authenticity', 'Pessoa real = confiança', 'Stef Meireles visível, foto real, história real'],
              ['Escassez real', 'Lote pequeno = raridade genuína', '"We test small batches. When it\'s gone, it\'s gone."'],
              ['Preço como premissa', '€65 para algo que ninguém tem = valor alto', '"€65 for something nobody else is carrying."'],
              ['Identidade confirmada', 'O produto diz algo que ela já sente', '"Not for everyone. Maybe for you."'],
            ]}
          />
        </BlockCard>

        <BlockCard title="Objeções e Respostas">
          <DataTable
            headers={['Objeção', 'O que ela pensa', 'Resposta da marca']}
            rows={[
              ['Não conheço essa loja', 'Será que é confiável?', 'Founder visível + About page real + reviews honestos + devolução clara'],
              ['Vai demorar?', 'Não quero esperar 3 semanas', '"Ships from our supplier. Arrives in 10-15 days." — transparência, não ocultação'],
              ['E se não gostar?', 'Perco o dinheiro?', '"30-day returns. No questions asked." — visível, sem letras miúdas'],
              ['Parece AliExpress', 'Vai ser igual ao que acho lá', 'Foto própria, founder usando, qualidade visual da loja'],
              ['"Não combina com nada"', 'Vou usar só uma vez', '"Doesn\'t need to match anything. That\'s the point."'],
            ]}
          />
        </BlockCard>

        <BlockCard title="Hipótese Alternativa — A Compradora Real Pode Ser:">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ borderLeft: '2px solid var(--brand)', paddingLeft: 16 }}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--brand)', marginBottom: 8 }}>Hipótese A — Elena</p>
              <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>26-35 anos, setor criativo, preocupada com "vibe de marca", pesquisa antes de comprar, quer raridade acessível.</p>
            </div>
            <div style={{ borderLeft: '2px solid var(--text-4)', paddingLeft: 16 }}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--text-2)', marginBottom: 8 }}>Hipótese B — A Impulsiva</p>
              <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>20-27 anos, mais jovem, menos preocupada com "vibe de marca", mais com "achei bonita e cabe no orçamento". Compra mais rápido.</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-4)', marginTop: 16, lineHeight: 1.6 }}>
            O teste de ads vai revelar: faixa etária que mais converte (Meta Analytics), copy que mais ressoa (A/B de ângulos), preço que converte (bundle e AOV).
          </p>
        </BlockCard>
      </section>

      {/* ── 06 FOUNDER STORY ──────────────────────────────────────────────────── */}
      <section id="s06" style={{ marginBottom: 72 }}>
        <SectionHeader num="06" title="Founder Story" />

        <div className="bento" style={{ gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius)', marginBottom: 16 }}>
          <div style={{ padding: '24px 24px', background: 'var(--surface)' }}>
            <SectionLabel>Founder Oficial</SectionLabel>
            <div style={{ fontFamily: 'var(--font-alt)', fontSize: 24, color: 'var(--text)', marginBottom: 4 }}>Stef Meireles</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>Stefania Meireles — forma completa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Stefania = forma italiana/europeia de Estefanny (derivação direta)',
                'Meireles = sobrenome real da família — não é fictício',
                'Branca, cabelos cacheados, 1.60m — perfil próximo à mulher europeia mediana',
                'Esposa de Nathan — co-fundadora e rosto da marca',
              ].map(t => (
                <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--brand)', fontSize: 11, marginTop: 3, flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '24px 24px', background: 'var(--surface)' }}>
            <SectionLabel>Estratégia de Presença</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {[
                { phase: 'Fase 1 — Teste', desc: 'Foto real dela + produto + fundo simples. Só @notreglr (marca).' },
                { phase: 'Fase 2 — Pós-validação', desc: 'Criar @stefmeireles com bastidores. Os dois se alimentam.' },
                { phase: 'Fase 3 — Maturidade', desc: 'Vídeos reais gravados + IA (voz) para multiplicar variações em inglês.' },
              ].map(({ phase, desc }) => (
                <div key={phase} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{phase}</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BlockCard title="Hooks de Founder Story Aprovados">
          {[
            '"I found this bag that nobody in Europe had seen yet."',
            '"People kept asking where I got it, so I built a store."',
            '"I\'m not a model. This bag still makes heads turn."',
            '"I went looking for something that didn\'t exist here yet."',
          ].map(hook => (
            <div key={hook} style={{
              fontFamily: 'var(--font)',
              fontSize: 14,
              color: 'var(--text-2)',
              padding: '10px 16px',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '2px solid var(--brand)',
              marginBottom: 8,
            }}>
              {hook}
            </div>
          ))}
        </BlockCard>
      </section>

      {/* ── 07 LINHAS DE PRODUTO ──────────────────────────────────────────────── */}
      <section id="s07" style={{ marginBottom: 72 }}>
        <SectionHeader num="07" title="Linhas de Produto" />

        <p style={{ ...bodyStyle, marginBottom: 24 }}>
          46 SKUs minerados, organizados em 7 categorias. Filtro de curadoria: <strong style={{ color: 'var(--brand)' }}>"Essa bolsa faria alguém parar o scroll e pensar 'que porra é essa'?"</strong>
        </p>

        <div className="bento" style={{ borderRadius: 'var(--radius)' }}>
          {[
            {
              num: 'L1',
              title: 'Shape Diferente',
              qty: '14 modelos',
              priority: 'PRIORIDADE MÁXIMA',
              desc: 'Bolsas geométricas, crescent bags, loop handle, metal handle, abstract shapes. Mais alinhada com o conceito da marca.',
              badge: 'success',
            },
            {
              num: 'L2',
              title: 'Furry / Textura',
              qty: '4 modelos',
              priority: 'Alta',
              desc: 'Material peludo ou textura diferenciada. Stop-the-scroll alto.',
              badge: 'success',
            },
            {
              num: 'L3',
              title: 'Colorida Agressiva',
              qty: '7 modelos',
              priority: 'Alta',
              desc: 'Gradients, color blocks, múltiplas cores saturadas. DNA visual da marca.',
              badge: 'success',
            },
            {
              num: 'L4',
              title: 'Floral',
              qty: '8 modelos',
              priority: 'Média',
              desc: 'Padrões florais, jacquard, tapestry. Depende de execução visual.',
              badge: 'warning',
            },
            {
              num: 'L5',
              title: 'Floral com Bordado',
              qty: '1 modelo',
              priority: 'Média',
              desc: 'Bordados especiais. Aval visual necessário.',
              badge: 'warning',
            },
            {
              num: 'L6',
              title: 'Marinha / Shell',
              qty: '6 modelos',
              priority: 'Média',
              desc: 'Shell bags, iridescent. Formatação diferente, mas depende de tendência.',
              badge: 'warning',
            },
            {
              num: 'L7',
              title: 'Rhinestone / Beaded',
              qty: '6 modelos',
              priority: 'Alta',
              desc: 'Rhinestone shoulder bags, beaded bags. Altíssima atenção visual.',
              badge: 'success',
            },
          ].map(({ num, title, qty, priority, desc, badge }) => (
            <div key={num} style={{ padding: '20px 20px', background: 'var(--surface)', display: 'flex', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--brand)', minWidth: 28, paddingTop: 2 }}>{num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--text-2)' }}>{title}</span>
                  <span className={`badge badge-${badge}`}>{priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)' }}>{qty}</span>
                </div>
                <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="badge badge-error" style={{ flexShrink: 0 }}>Atenção</span>
            <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: 'var(--text-2)' }}>O produto é commodity.</strong> Qualquer pessoa pode comprar a mesma bolsa no AliExpress. O diferencial é APENAS branding + posicionamento + linguagem + fotografia própria. Se o consumidor fizer busca reversa de imagem, encontra o mesmo produto por €10-20.
            </p>
          </div>
        </div>
      </section>

      {/* ── 08 CONCORRENTES ───────────────────────────────────────────────────── */}
      <section id="s08" style={{ marginBottom: 72 }}>
        <SectionHeader num="08" title="Análise de Concorrentes" />

        <BlockCard title="Gap de Mercado">
          <Quote>
            Nenhuma marca com posicionamento forte de design sculptural opera consistentemente em €55-80 via Meta Ads cold traffic na Europa. Esse é o espaço da NOTREGLR.
          </Quote>
        </BlockCard>

        <DataTable
          headers={['Marca', 'Preço', 'Tipo', 'Canal', 'Founder Story', 'Meta Ads frio', 'Ponto Fraco']}
          rows={[
            ['NOTREGLR', '€55-80', 'Escultural/statement', 'Shopify DTC', '✓ Stef Meireles', '✓ (plano)', 'Zero histórico'],
            ['Vendula London', '€35-105', 'Cute/whimsy', 'Orgânico/UK', '✕', '✕ fraco', 'Não escultural'],
            ['Banned Alt EU', '€43-75', 'Gothic/alt', 'Shopify DTC', '✕', '✕ fraco', 'Nicho estreito + reviews ruins'],
            ['HVISK', '€50-150', 'Colorido/vegan', 'DTC + retail', '✕', 'Desconhecido', 'Design ≠ diferencial'],
            ['Irregular Choice', '€40-175', 'Eccentric vintage', 'Multi-channel', '✕', '✕ fraco', 'Distribuição diluída'],
            ['Polène', '€200-400', 'Sculptural/min.', 'DTC forte', '✕', 'Fraco', 'Preço alto, shipping lento'],
          ]}
        />

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="badge badge-error" style={{ flexShrink: 0 }}>Ponto Cego Crítico</span>
            <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
              O maior risco são <strong style={{ color: 'var(--text-2)' }}>lojas Shopify de dropshipping sem nome</strong> rodando Meta Ads com bolsas statement agora. Esses concorrentes não aparecem no Google — vivem 100% dentro do ecossistema de ads. Para identificar: <strong style={{ color: 'var(--brand)' }}>Minea ou Dropispy</strong> antes do primeiro lote de criativos.
            </p>
          </div>
        </div>
      </section>

      {/* ── 09 ESTRATÉGIA DE CRIATIVOS ────────────────────────────────────────── */}
      <section id="s09" style={{ marginBottom: 72 }}>
        <SectionHeader num="09" title="Estratégia de Criativos" />

        <BlockCard title="Filtro Zero">
          <p style={bodyStyle}>Antes de iniciar qualquer criativo, responder:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {[
              '"Esse criativo está alinhado com Not regular. Not for everyone.?"',
              '"Ele apresenta uma premissa irrefutável — ou está fazendo uma promessa vaga?"',
            ].map(q => (
              <div key={q} style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text-2)', padding: '10px 16px', background: 'var(--surface-2)', borderLeft: '2px solid var(--brand)', borderRadius: 'var(--radius-sm)' }}>
                {q}
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard title="Ângulos Validados">
          <DataTable
            headers={['Ângulo', 'Premissa irrefutável central', 'Quando usar']}
            rows={[
              ['Founder Discovery', '"I found this bag that nobody in Europe had seen yet."', 'Cold traffic, awareness'],
              ['Anti-Combina', '"Not every bag needs to match. This one needs to stand out."', 'Audience que conhece moda básica'],
              ['Reaction', '"People stopped her to ask where she got it."', 'Prova social sem reviews ainda'],
              ['Identity', '"Not for everyone. Maybe for you."', 'Filtro de tribo, awareness'],
              ['The Weird One', '"Yes, this bag is strange. That\'s exactly the point."', 'Produto mais escultural'],
              ['Manifesto', '"We\'re not trying to be elegant. We\'re trying to be unforgettable."', 'Brand awareness, Instagram orgânico'],
            ]}
          />
        </BlockCard>

        <BlockCard title="Kill Criteria por Criativo">
          <DataTable
            headers={['Sinal', 'Diagnóstico', 'Ação']}
            rows={[
              ['CTR < 0.5% após 500+ impressões', 'Não está parando o scroll', 'Pausa — muda o hook visual'],
              ['CTR > 1% mas 0 ATC', 'Problema na página, não no ad', 'Não pausa o ad — verifica a página'],
              ['Frequency > 3 + CTR caindo', 'Audiência saturada', 'Expande audiência ou pausa'],
              ['CPC > €1.50 sustentado', 'Ineficiência de targeting', 'Muda segmentação'],
            ]}
          />
        </BlockCard>

        <BlockCard title="Regras Visuais Invioláveis">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              'Produto ocupa pelo menos 50% do frame',
              'Fundo simples — branco, cor sólida saturada, ou ambiente urbano limpo',
              'Zero estética editorial de luxo',
              'Founder = pessoa real, postura natural',
              'Cores saturadas quando colorido (não pastel)',
              'Tipografia bold, sem serif quando houver texto',
              'Mobile-first — texto legível em tela de 5"',
              'Hook visual comunica em menos de 2 segundos sem áudio',
            ].map(rule => (
              <div key={rule} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--brand)', fontSize: 11, marginTop: 3, flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{rule}</span>
              </div>
            ))}
          </div>
        </BlockCard>
      </section>

      {/* ── 10 TIME E OPERAÇÃO ────────────────────────────────────────────────── */}
      <section id="s10" style={{ marginBottom: 72 }}>
        <SectionHeader num="10" title="Time e Operação" />

        <div className="bento" style={{ borderRadius: 'var(--radius)', marginBottom: 16 }}>
          {[
            { name: 'Nathan', role: 'Fundador / Operador-geral', status: 'Ativo', desc: 'Estratégia, tráfego pago, produto, loja, copy, tech.' },
            { name: 'Stef Meireles', role: 'Co-fundadora / Rosto da Marca', status: 'Ativa', desc: 'Validação visual, shoot fotográfico, curadoria de produto, identidade da marca.' },
            { name: 'Hyann', role: 'Criativo / Edição / Mídia', status: 'Off — entrada prevista', desc: 'Execução de criativos, edição de imagem/vídeo, assets de marca.' },
          ].map(({ name, role, status, desc }) => (
            <div key={name} style={{ padding: '20px 20px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text)' }}>{name}</span>
                <span className={`badge ${status === 'Ativo' || status === 'Ativa' ? 'badge-success' : 'badge-neutral'}`}>{status}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brand)', marginBottom: 8 }}>{role}</div>
              <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <BlockCard title="Mapa de Delegação">
          <DataTable
            headers={['Departamento', 'Delegar quando', 'Para quem']}
            rows={[
              ['Criativos (execução)', 'Hyann entra', 'Hyann'],
              ['Produto (pesquisa)', '2-3 produtos validados', 'VA com playbook'],
              ['Tráfego pago', '>€1.500/mês em ads', 'Media buyer freelancer'],
              ['Atendimento', '>20 pedidos/semana', 'VA de suporte'],
              ['Email', 'Escala >50 pedidos/mês', 'Especialista Omnisend'],
              ['Estratégia', '>€10K/mês', 'Advisor/mentor EU'],
            ]}
          />
        </BlockCard>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-alt)', fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>NOTREGLR</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)' }}>Brandbook v1.0 — 06/04/2026 — Documento vivo</div>
        </div>
        <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--text-4)', maxWidth: 320, textAlign: 'right', lineHeight: 1.6 }}>
          Revisitar a cada 6 meses ou sempre que uma decisão estratégica maior estiver em jogo.
          Atualizar após primeiros dados de conversão.
        </div>
      </div>

    </main>
  )
}

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-4)',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--brand)' }}>{num}</span>
        <h2 style={{
          fontFamily: 'var(--font-alt)',
          fontSize: 28,
          color: 'var(--text)',
          fontWeight: 400,
          margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function BlockCard({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      marginBottom: 12,
      ...style,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-4)',
        marginBottom: 14,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      fontFamily: 'var(--font)',
      fontSize: 16,
      fontStyle: 'italic',
      color: 'var(--text-2)',
      lineHeight: 1.7,
      margin: '0 0 12px',
      borderLeft: '2px solid var(--brand)',
      paddingLeft: 16,
    }}>
      {children}
    </blockquote>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-4)',
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: '1px solid var(--border)',
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  fontFamily: j === 0 ? 'var(--font-mono)' : 'var(--font)',
                  fontSize: j === 0 ? 12 : 13,
                  color: j === 0 ? 'var(--brand)' : 'var(--text-3)',
                  padding: '10px 12px',
                  lineHeight: 1.5,
                  verticalAlign: 'top',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font)',
  fontSize: 14,
  color: 'var(--text-3)',
  lineHeight: 1.7,
  margin: 0,
}

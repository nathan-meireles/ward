export const metadata = { title: 'Criativos — Marca NOTREGLR' }

export default function CriativosPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / CRIATIVOS
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
          Produção de Criativos
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Regras visuais, ângulos de criativo e hierarquia de produção.
        </p>
      </div>

      {/* Regras visuais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            REGRAS VISUAIS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { ok: true, text: 'Fundo simples — bolsa como protagonista' },
              { ok: true, text: 'Cores saturadas' },
              { ok: true, text: 'Tipografia bold, sem serif' },
              { ok: true, text: 'Vibe street / playful / raw' },
              { ok: false, text: 'Estética editorial de luxo' },
              { ok: false, text: 'Luz dramática de editorial' },
              { ok: false, text: 'Poses de modelo — mão no quadril, olhar distante' },
              { ok: false, text: 'Fundo studio branco perfeito (pode usar branco cru, não de ensaio)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: r.ok ? 'var(--success, #4ade80)' : 'var(--error, #e05)', fontSize: 13, flexShrink: 0 }}>{r.ok ? '✓' : '✕'}</span>
                <span style={{ color: r.ok ? 'var(--text-2)' : 'var(--text-3)', fontSize: 13 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            HIERARQUIA DE CRIATIVOS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { fase: 'Fase 1 — Teste', label: 'Imagem estática', desc: 'Foto real da Stef + produto + fundo simples', badge: 'Agora' },
              { fase: 'Fase 2 — Escala', label: 'IA background', desc: 'IA para background replacement (cenários variados)', badge: 'Pós-validação' },
              { fase: 'Fase 3 — Maturidade', label: 'Vídeo + IA (voz)', desc: 'Vídeos reais + voz IA para multiplicar variações em inglês', badge: 'Escala' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--brand)', fontWeight: 700, minWidth: 24 }}>{i + 1}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{item.label}</span>
                    <span className="badge badge-neutral" style={{ fontSize: 10 }}>{item.badge}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', marginBottom: 2 }}>{item.fase.toUpperCase()}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 12 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ângulos de criativo */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          ÂNGULOS DE CRIATIVO — ORDEM DE TESTE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { n: '01', title: 'Produto puro', desc: 'Foto do produto em fundo limpo, copy mínima. Teste base.', diag: 'CTR < 1% → criativo ruim' },
            { n: '02', title: 'Founder story', desc: 'Stef usando/apresentando o produto. Humaniza a marca.', diag: 'CTR alto mas zero ATC → produto ou preço' },
            { n: '03', title: 'Contraste/humor', desc: '"Não é para todo mundo" angle. Filtro de tribo.', diag: 'CTR > 1% + ATC → continua' },
            { n: '04', title: 'Social proof', desc: 'Dados reais do fornecedor: "4.000+ pedidos neste modelo"', diag: 'Usar só depois dos 3 anteriores testados' },
          ].map(a => (
            <div key={a.n} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--brand)', fontWeight: 700 }}>{a.n}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, alignSelf: 'center' }}>{a.title}</span>
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '0 0 6px' }}>{a.desc}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>DIAGNÓSTICO: {a.diag}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, color: 'var(--text-4)', fontSize: 12 }}>
          Mínimo 8 variações antes de qualquer decisão de kill/scale. Volume de criativos é o que move o CAC.
        </div>
      </div>

      {/* Workflow de imagens */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          WORKFLOW DE IMAGENS DE PRODUTO
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {[
            { step: 'Download', detail: 'AliExpress' },
            { step: 'Upscale 4K', detail: 'Upscayl (gratuito)' },
            { step: 'Edit / BG', detail: 'Canva' },
            { step: 'Export', detail: '1600×1600 WebP ≤200KB' },
            { step: 'Upload', detail: 'Shopify CDN' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', minWidth: 100, textAlign: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12, marginBottom: 2 }}>{s.step}</div>
                <div style={{ color: 'var(--text-4)', fontSize: 10 }}>{s.detail}</div>
              </div>
              {i < 4 && <div style={{ width: 24, textAlign: 'center', color: 'var(--text-4)', fontSize: 14 }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, color: 'var(--text-4)', fontSize: 11 }}>
          Ratio: 1:1 (quadrado) para produtos · 16:9 para hero/banners · Upscale para 4K antes de downsample preserva qualidade de textura
        </div>
      </div>

      {/* 3 pilares de humor */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          3 PILARES DE HUMOR DA MARCA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { title: 'Autoironia', desc: 'Zoar a própria marca, assumir que a bolsa é estranha.', ex: '"Provavelmente sua mãe vai odiar essa bolsa."', nao: 'Não pode parecer inseguro.' },
            { title: 'Contraste com fashion sério', desc: 'Ironizar luxo exagerado, brincar com mercado tradicional.', ex: '"Mais uma bolsa preta? Não hoje."', nao: 'Não pode atacar marcas diretamente.' },
            { title: 'Identidade, não status', desc: 'Falar de personalidade e vibe.', ex: '"Não combina com todo look. Combina com quem você é."', nao: 'Não pode prometer sucesso social ou luxo aspiracional.' },
          ].map(p => (
            <div key={p.title} style={{ borderLeft: '2px solid var(--brand)', paddingLeft: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 6 }}>{p.title}</div>
              <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '0 0 8px' }}>{p.desc}</p>
              <div style={{ color: 'var(--brand)', fontSize: 12, fontStyle: 'italic', marginBottom: 4 }}>{p.ex}</div>
              <div style={{ color: 'var(--text-4)', fontSize: 11 }}>{p.nao}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

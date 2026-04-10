export const metadata = { title: 'Time — Marca NOTREGLR' }

export default function TimePage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          MARCA / TIME
        </div>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
          Time & Conselho Estratégico
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Equipe atual, departamentos e conselho de referência.
        </p>
      </div>

      {/* Equipe atual */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          EQUIPE ATUAL
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { nome: 'Nathan', papel: 'Fundador / Operador-geral', status: 'Ativo', desc: 'Estratégia, tráfego, produto, loja, copy' },
            { nome: 'Esposa (Stef)', papel: 'Co-fundadora / Rosto da Marca', status: 'Ativa', desc: 'Validação visual, curadoria, shoot fotográfico' },
            { nome: 'Hyann', papel: 'Criativo / Edição / Mídia', status: 'OFF — entrando em breve', desc: 'Edição de imagem/vídeo, assets de marca' },
          ].map(m => (
            <div key={m.nome} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{m.nome}</span>
                <span className={`badge ${m.status.startsWith('Ativ') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{m.status}</span>
              </div>
              <div style={{ color: 'var(--brand)', fontSize: 12, marginBottom: 6 }}>{m.papel}</div>
              <div style={{ color: 'var(--text-4)', fontSize: 11 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Departamentos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          DEPARTAMENTOS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { emoji: '🧠', dept: 'Estratégia', resp: 'Nathan', delega: '>€10K/mês' },
            { emoji: '🎯', dept: 'Marca e Curadoria', resp: 'Nathan + Esposa', delega: 'Designer freelancer' },
            { emoji: '🎨', dept: 'Criativos e Mídia', resp: 'Nathan (dir.) + Hyann', delega: 'Quando Hyann entrar' },
            { emoji: '📦', dept: 'Produto e Mineração', resp: 'Nathan', delega: '2–3 produtos validados' },
            { emoji: '📣', dept: 'Tráfego Pago', resp: 'Nathan', delega: '>€1.500/mês em ads' },
            { emoji: '🛒', dept: 'Loja e CRO', resp: 'Nathan', delega: 'Scale →' },
            { emoji: '📧', dept: 'Email e Retenção', resp: 'Nathan [a construir]', delega: '>50 pedidos/mês' },
            { emoji: '🎧', dept: 'Atendimento', resp: 'Nathan [a construir]', delega: '>20 pedidos/semana' },
          ].map(d => (
            <div key={d.dept} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{d.emoji}</div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12, marginBottom: 2 }}>{d.dept}</div>
              <div style={{ color: 'var(--text-3)', fontSize: 11, marginBottom: 4 }}>{d.resp}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)' }}>DELEGA: {d.delega}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conselho Estratégico */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--brand)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
          CONSELHO ESTRATÉGICO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              camada: 'L0 — Grande Mentor',
              members: [{ nome: 'Davie Fogarty', handle: '@daviefogarty', spec: 'Fundou The Oodie: $500 → $500M. Dropshipping → marca real. Percurso exato da NOTREGLR.' }]
            },
            {
              camada: 'L1 — Operadores EU Fashion',
              members: [{ nome: 'Faruk Ilkhan', handle: '@faruk.ecom', spec: 'Fashion dropshipping EU, Facebook Ads, FFOrder, sub-nicho de moda.' }]
            },
            {
              camada: 'L2 — Estrategistas de Marca',
              members: [{ nome: 'Matheus Davila', handle: '@matheus_davila', spec: '"Marca > produto", 40% margem sem produto vencedor, Europa vs EUA.' }]
            },
            {
              camada: 'L3 — Funil e Testes',
              members: [
                { nome: 'Caio Rodrigues', handle: '@caiocrr', spec: 'Funil completo, E4Planner, LTV, criativos por nível de consciência.' },
                { nome: 'Simo B.', handle: '@realsimob', spec: 'IA ads (Higgsfield), product research, FFOrder, "0 to $100k" methodology.' },
                { nome: 'Spencer Pawliw', handle: '@spencerpawliw', spec: 'Meta Ads mechanics (ad angles, roller coaster fix), Shopify CRO.' },
              ]
            },
            {
              camada: 'L4 — Psicologia e Design',
              members: [
                { nome: 'Bruno Ávila', handle: '@truquesdemarketing', spec: 'Pricing psychology, percepção de valor, psicologia de compra.' },
                { nome: 'Rian Dutra', handle: '@DesignFromHuman', spec: 'UX/design de ecommerce, card de produto, psicologia de conversão.' },
              ]
            },
          ].map(layer => (
            <div key={layer.camada}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', marginBottom: 8 }}>{layer.camada.toUpperCase()}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                {layer.members.map(m => (
                  <div key={m.nome} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', borderLeft: '2px solid var(--brand)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{m.nome}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>{m.handle}</span>
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: 11, lineHeight: 1.4 }}>{m.spec}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

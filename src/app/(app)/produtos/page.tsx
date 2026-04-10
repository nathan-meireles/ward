export const metadata = { title: 'Produtos — WARD' }

export default function ProdutosPage() {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
        WARD / PRODUTOS
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>Produtos</h1>
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Módulo em desenvolvimento · Fase 3 do roadmap
      </p>
    </div>
  )
}

'use client'

/**
 * /produtos — Catálogo central de produtos
 *
 * Propósito: banco de dados de todos os produtos com foco em precificação.
 * Aqui você configura COG, preço de venda, vê lucro calculado, e gerencia
 * quais produtos existem. NÃO é o pipeline de testes (isso é a Esteira).
 *
 * Diferença da Esteira:
 *   Produtos = "o que temos" (catálogo, dados, financeiro)
 *   Esteira   = "o que estamos testando" (kanban, fluxo, decisão)
 */

import { useEffect, useState, useCallback } from 'react'
import { Search, Loader2, FlaskConical, Megaphone, TrendingUp, Package, DollarSign, ArrowRight, BarChart3 } from 'lucide-react'
import { ProductDrawer, type ProductFull } from '@/components/products/ProductDrawer'
import { calcPricing, fmtEur, fmtPct } from '@/lib/pricing'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function profitColor(margin: number | null) {
  if (margin === null) return 'var(--text-4)'
  if (margin >= 0.3) return 'var(--success)'
  if (margin > 0) return 'var(--warning)'
  return 'var(--error)'
}

const PIPELINE_LABELS: Record<string, string> = {
  a_testar: 'A Testar', testando: 'Testando', validado: 'Validado', descartado: 'Descartado',
}
const PIPELINE_COLORS: Record<string, string> = {
  a_testar: 'var(--text-4)', testando: 'var(--warning)', validado: 'var(--success)', descartado: 'var(--error)',
}

// ─── Product Row (list view) ──────────────────────────────────────────────────

function ProductRow({ product, onClick }: { product: ProductFull; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const pricing = product.product_pricing
  const calc = pricing ? calcPricing({
    cog_eur: pricing.cog_eur, freight_eur: pricing.freight_eur,
    sale_price_eur: pricing.sale_price_eur, coupon_pct: pricing.coupon_pct,
    iof_rate: pricing.iof_rate, checkout_fee_rate: pricing.checkout_fee_rate,
    gateway_fee_rate: pricing.gateway_fee_rate,
    marketing_allocation_pct: pricing.marketing_allocation_pct,
    other_taxes_rate: pricing.other_taxes_rate,
  }) : null

  const hasPricing = !!pricing?.sale_price_eur
  const pipeColor = PIPELINE_COLORS[product.pipeline_status] ?? 'var(--text-4)'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 90px 90px 90px 90px 80px 100px',
        gap: 12, padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer', alignItems: 'center',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Thumb */}
      <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
        {product.images?.[0] && !imgErr
          ? <img src={product.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={14} style={{ color: 'var(--text-4)' }} /></div>
        }
      </div>

      {/* Name + category */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 2, alignItems: 'center' }}>
          {product.line_category && (
            <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{product.line_category}</span>
          )}
          {product.notreglr_score !== null && (
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>score {product.notreglr_score}</span>
          )}
        </div>
      </div>

      {/* COG */}
      <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
        {hasPricing ? fmtEur(pricing?.cog_eur) : <span style={{ color: 'var(--text-4)' }}>—</span>}
      </span>

      {/* Venda */}
      <span style={{ fontSize: 12, color: 'var(--brand)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
        {hasPricing ? fmtEur(pricing?.sale_price_eur) : <span style={{ color: 'var(--text-4)' }}>—</span>}
      </span>

      {/* Lucro */}
      <span style={{ fontSize: 12, color: calc ? profitColor(calc.profitMarginPct) : 'var(--text-4)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
        {calc ? fmtEur(calc.netProfit) : '—'}
      </span>

      {/* Margem */}
      <span style={{ fontSize: 12, color: calc ? profitColor(calc.profitMarginPct) : 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
        {calc ? fmtPct(calc.profitMarginPct) : '—'}
      </span>

      {/* CPA ideal */}
      <span style={{ fontSize: 11, color: calc ? 'var(--info)' : 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
        {calc ? fmtEur(calc.cpaIdeal) : '—'}
      </span>

      {/* Pipeline status */}
      <span style={{ fontSize: 10, color: pipeColor, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>
        {PIPELINE_LABELS[product.pipeline_status] ?? product.pipeline_status}
      </span>
    </div>
  )
}

// ─── Summary Stats ────────────────────────────────────────────────────────────

function SummaryBar({ products }: { products: ProductFull[] }) {
  const withPricing = products.filter(p => p.product_pricing?.sale_price_eur)
  const calcs = withPricing.map(p => calcPricing({
    cog_eur: p.product_pricing!.cog_eur,
    freight_eur: p.product_pricing!.freight_eur,
    sale_price_eur: p.product_pricing!.sale_price_eur,
    coupon_pct: p.product_pricing!.coupon_pct,
    iof_rate: p.product_pricing!.iof_rate,
    checkout_fee_rate: p.product_pricing!.checkout_fee_rate,
    gateway_fee_rate: p.product_pricing!.gateway_fee_rate,
    marketing_allocation_pct: p.product_pricing!.marketing_allocation_pct,
    other_taxes_rate: p.product_pricing!.other_taxes_rate,
  })).filter(Boolean)

  const avgMargin = calcs.length ? calcs.reduce((s, c) => s + c!.profitMarginPct, 0) / calcs.length : null
  const avgCpaIdeal = calcs.length ? calcs.reduce((s, c) => s + c!.cpaIdeal, 0) / calcs.length : null
  const avgRoas = calcs.length ? calcs.reduce((s, c) => s + c!.roasMin, 0) / calcs.length : null

  const cells = [
    { label: 'Total produtos', value: String(products.length), color: 'var(--text)' },
    { label: 'Precificados', value: String(withPricing.length), color: 'var(--brand)' },
    { label: 'Margem média', value: avgMargin !== null ? fmtPct(avgMargin) : '—', color: avgMargin !== null ? profitColor(avgMargin) : 'var(--text-4)' },
    { label: 'CPA ideal médio', value: avgCpaIdeal !== null ? fmtEur(avgCpaIdeal) : '—', color: 'var(--info)' },
    { label: 'ROAS mín médio', value: avgRoas !== null ? `${avgRoas.toFixed(2)}x` : '—', color: 'var(--warning)' },
    { label: 'Na Esteira', value: String(products.filter(p => p.pipeline_status !== 'descartado').length), color: 'var(--success)' },
  ]

  return (
    <div className="bento" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 28, border: '1px solid var(--border-input)', backgroundColor: 'rgba(255,255,255,0.12)' }}>
      {cells.map(({ label, value, color }) => (
        <div key={label} style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 26, fontFamily: 'var(--font-alt)', color, lineHeight: 1 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Send to Pipeline CTA ─────────────────────────────────────────────────────

function SendToEsteiraButton({ product, onDone }: { product: ProductFull; onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (product.pipeline_status !== 'a_testar' || done) return null

  return (
    <button
      onClick={async e => {
        e.stopPropagation()
        setLoading(true)
        await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: product.id, pipeline_status: 'testando' }),
        })
        setLoading(false)
        setDone(true)
        onDone()
      }}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', fontSize: 10, borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--warning)', color: 'var(--warning)',
        background: 'rgba(251,191,36,0.07)', cursor: 'pointer',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
        transition: 'all 0.15s',
      }}
    >
      {loading ? <Loader2 size={9} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={9} />}
      Iniciar Teste
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'with_pricing' | 'no_pricing' | 'in_pipeline'

export function ProdutosClient() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p => {
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'with_pricing' && !p.product_pricing?.sale_price_eur) return false
    if (filter === 'no_pricing' && p.product_pricing?.sale_price_eur) return false
    if (filter === 'in_pipeline' && p.pipeline_status === 'descartado') return false
    return true
  })

  const FILTERS: Array<{ key: StatusFilter; label: string; icon: React.ReactNode }> = [
    { key: 'all', label: 'Todos', icon: <Package size={11} /> },
    { key: 'with_pricing', label: 'Precificados', icon: <DollarSign size={11} /> },
    { key: 'no_pricing', label: 'Sem preço', icon: <DollarSign size={11} /> },
    { key: 'in_pipeline', label: 'Ativos', icon: <TrendingUp size={11} /> },
  ]

  const TABLE_HEADERS = ['', 'Produto', 'COG', 'Venda', 'Lucro', 'Margem', 'CPA Ideal', 'Esteira']

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            WARD / PRODUTOS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
            Produtos
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/esteira" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="btn btn-secondary">
            <TrendingUp size={13} /> Ver Esteira
          </a>
          <a href="/mineracao" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="btn btn-ghost">
            <FlaskConical size={13} /> + Mineração
          </a>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 24, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.6 }}>
        Catálogo de todos os produtos · configure preços · clique para ver 360°
      </p>

      {/* Stats */}
      {!loading && <SummaryBar products={products} />}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto…" className="form-input" style={{ paddingLeft: 30, height: 32, fontSize: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {FILTERS.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', fontSize: 11, border: '1px solid',
              borderColor: filter === key ? 'var(--brand)' : 'var(--border)',
              borderRadius: 'var(--radius-full)', cursor: 'pointer',
              background: filter === key ? 'var(--brand-dim)' : 'transparent',
              color: filter === key ? 'var(--brand)' : 'var(--text-3)',
              fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
            }}>
              {icon} {label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
          <Package size={28} style={{ color: 'var(--text-4)', marginBottom: 12 }} />
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {products.length === 0
              ? 'Nenhum produto. Use a Mineração para adicionar produtos.'
              : 'Nenhum produto neste filtro.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 90px 90px 90px 90px 80px 100px',
            gap: 12, padding: '8px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            {TABLE_HEADERS.map((h, i) => (
              <span key={i} style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: i >= 5 ? 'right' : 'left' }}>
                {h}
              </span>
            ))}
          </div>

          {filtered.map(p => (
            <ProductRow key={p.id} product={p} onClick={() => setDrawerProductId(p.id)} />
          ))}
        </div>
      )}

      {/* ProductDrawer */}
      <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} onUpdate={load} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

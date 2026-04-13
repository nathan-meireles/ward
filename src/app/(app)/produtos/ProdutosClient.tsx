'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Loader2, TrendingUp, FlaskConical, Megaphone, Package } from 'lucide-react'
import { ProductDrawer, type ProductFull } from '@/components/products/ProductDrawer'
import { calcPricing, fmtEur, fmtPct } from '@/lib/pricing'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PIPELINE_LABELS: Record<string, string> = {
  a_testar: 'A Testar', testando: 'Testando', validado: 'Validado', descartado: 'Descartado',
}
const PIPELINE_COLORS: Record<string, string> = {
  a_testar: 'var(--text-3)', testando: 'var(--warning)', validado: 'var(--success)', descartado: 'var(--error)',
}

function scoreColor(score: number | null) {
  if (score === null) return 'var(--text-4)'
  if (score >= 70) return 'var(--success)'
  if (score >= 50) return 'var(--warning)'
  return 'var(--error)'
}

function labelBadgeClass(label: string | null) {
  if (label === 'forte') return 'badge badge-success'
  if (label === 'medio') return 'badge badge-warning'
  if (label === 'fraco') return 'badge badge-error'
  return 'badge badge-neutral'
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClick }: { product: ProductFull; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const mainImg = product.images?.[0]
  const pricing = product.product_pricing
  const calc = pricing ? calcPricing({
    cog_eur: pricing.cog_eur,
    freight_eur: pricing.freight_eur,
    sale_price_eur: pricing.sale_price_eur,
    coupon_pct: pricing.coupon_pct,
    iof_rate: pricing.iof_rate,
    checkout_fee_rate: pricing.checkout_fee_rate,
    gateway_fee_rate: pricing.gateway_fee_rate,
    marketing_allocation_pct: pricing.marketing_allocation_pct,
    other_taxes_rate: pricing.other_taxes_rate,
  }) : null

  const pipelineColor = PIPELINE_COLORS[product.pipeline_status] ?? 'var(--text-4)'

  return (
    <div
      onClick={onClick}
      className="card"
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)', overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0', flexShrink: 0 }}>
        {mainImg && !imgErr
          ? <img src={mainImg} alt={product.name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={24} style={{ color: 'var(--text-4)' }} /></div>
        }
        {/* Pipeline badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          padding: '2px 7px', borderRadius: 'var(--radius-full)',
          background: 'rgba(9,9,10,0.82)', border: `1px solid ${pipelineColor}`,
          fontSize: 9, color: pipelineColor, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {PIPELINE_LABELS[product.pipeline_status]}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {/* Name */}
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', lineHeight: 1.4, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.8em' }}>
          {product.name}
        </p>

        {/* Score + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {product.notreglr_score !== null && (
            <span style={{ fontWeight: 900, fontSize: 18, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -0.5 }}>
              {product.notreglr_score}
            </span>
          )}
          {product.notreglr_label && (
            <span className={labelBadgeClass(product.notreglr_label)} style={{ fontSize: 9 }}>
              {product.notreglr_label}
            </span>
          )}
        </div>

        {/* Pricing snapshot */}
        {calc ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              { label: 'Venda', value: fmtEur(pricing?.sale_price_eur) },
              { label: 'Lucro', value: fmtEur(calc.netProfit), color: calc.netProfit > 0 ? 'var(--success)' : 'var(--error)' },
              { label: 'Margem', value: fmtPct(calc.profitMarginPct) },
              { label: 'CPA Ideal', value: fmtEur(calc.cpaIdeal), color: 'var(--info)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '4px 6px', background: 'var(--surface-2)', borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                <div style={{ fontSize: 11, color: color ?? 'var(--text)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>
            Precificação não configurada
          </div>
        )}

        {/* Module presence */}
        <div style={{ display: 'flex', gap: 4, marginTop: 'auto', paddingTop: 4, flexWrap: 'wrap' }}>
          {product.mineracao_id && (
            <span title="Na Mineração" style={{ color: 'var(--info)', display: 'flex', alignItems: 'center' }}><FlaskConical size={10} /></span>
          )}
          {product.creatives?.length > 0 && (
            <span title={`${product.creatives.length} criativo(s)`} style={{ color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, fontFamily: 'var(--font-mono)' }}>
              <Megaphone size={10} /> {product.creatives.length}
            </span>
          )}
          {product.ad_campaigns?.length > 0 && (
            <span title={`${product.ad_campaigns.length} campanha(s)`} style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, fontFamily: 'var(--font-mono)' }}>
              <TrendingUp size={10} /> {product.ad_campaigns.length}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ products }: { products: ProductFull[] }) {
  if (!products.length) return null
  const counts = {
    a_testar: products.filter(p => p.pipeline_status === 'a_testar').length,
    testando: products.filter(p => p.pipeline_status === 'testando').length,
    validado: products.filter(p => p.pipeline_status === 'validado').length,
    descartado: products.filter(p => p.pipeline_status === 'descartado').length,
  }
  const withPricing = products.filter(p => p.product_pricing?.sale_price_eur).length

  const cells = [
    { label: 'Total', value: String(products.length), color: 'var(--text)' },
    { label: 'A Testar', value: String(counts.a_testar), color: 'var(--text-3)' },
    { label: 'Testando', value: String(counts.testando), color: 'var(--warning)' },
    { label: 'Validados', value: String(counts.validado), color: 'var(--success)' },
    { label: 'Descartados', value: String(counts.descartado), color: 'var(--error)' },
    { label: 'Com Preço', value: String(withPricing), color: 'var(--brand)' },
  ]

  return (
    <div className="bento" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 28, border: '1px solid var(--border-input)', backgroundColor: 'rgba(255,255,255,0.12)' }}>
      {cells.map(({ label, value, color }) => (
        <div key={label} style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-alt)', color, lineHeight: 1 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type PipelineFilter = 'all' | 'a_testar' | 'testando' | 'validado' | 'descartado'

export function ProdutosClient() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pipelineFilter, setPipelineFilter] = useState<PipelineFilter>('all')
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p => {
    if (pipelineFilter !== 'all' && p.pipeline_status !== pipelineFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const PIPELINE_FILTERS: Array<{ key: PipelineFilter; label: string }> = [
    { key: 'all', label: 'Todos' },
    { key: 'a_testar', label: 'A Testar' },
    { key: 'testando', label: 'Testando' },
    { key: 'validado', label: 'Validados' },
    { key: 'descartado', label: 'Descartados' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            WARD / PRODUTOS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
            Produtos
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {products.length} produto{products.length !== 1 ? 's' : ''} · hub central
          </p>
        </div>
        <a href="/mineracao" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Adicionar via Mineração
        </a>
      </div>

      {/* Stats */}
      <StatsBar products={products} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto…"
            className="form-input"
            style={{ paddingLeft: 30, height: 32, fontSize: 12 }}
          />
        </div>

        {/* Pipeline filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {PIPELINE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPipelineFilter(key)}
              style={{
                padding: '5px 12px', fontSize: 11, border: '1px solid',
                borderColor: pipelineFilter === key ? PIPELINE_COLORS[key] ?? 'var(--brand)' : 'var(--border)',
                borderRadius: 'var(--radius-full)', cursor: 'pointer',
                background: pipelineFilter === key ? `color-mix(in srgb, ${PIPELINE_COLORS[key] ?? 'var(--brand)'} 12%, transparent)` : 'transparent',
                color: pipelineFilter === key ? (PIPELINE_COLORS[key] ?? 'var(--brand)') : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {products.length === 0
              ? 'Nenhum produto ainda. Use a Mineração para enviar produtos para cá.'
              : 'Nenhum produto neste filtro.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => setDrawerProductId(p.id)} />
          ))}
        </div>
      )}

      {/* ProductDrawer */}
      <ProductDrawer
        productId={drawerProductId}
        onClose={() => setDrawerProductId(null)}
        onUpdate={load}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

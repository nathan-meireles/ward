'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, ChevronRight, Package, FlaskConical, Megaphone, TrendingUp } from 'lucide-react'
import { ProductDrawer, type ProductFull } from '@/components/products/ProductDrawer'
import { calcPricing, fmtEur, fmtPct } from '@/lib/pricing'

// ─── Types & Helpers ──────────────────────────────────────────────────────────

type PipelineStatus = 'a_testar' | 'testando' | 'validado' | 'descartado'

const COLUMNS: Array<{ key: PipelineStatus; label: string; color: string; description: string }> = [
  { key: 'a_testar',    label: 'A Testar',    color: 'var(--text-3)',  description: 'Produtos aguardando entrada no teste' },
  { key: 'testando',    label: 'Testando',    color: 'var(--warning)', description: 'Ads ativos, coletando dados' },
  { key: 'validado',    label: 'Validado',    color: 'var(--success)', description: 'Kill criteria positivos' },
  { key: 'descartado',  label: 'Descartado',  color: 'var(--error)',   description: 'Kill criteria negativos' },
]

function scoreColor(score: number | null) {
  if (score === null) return 'var(--text-4)'
  if (score >= 70) return 'var(--success)'
  if (score >= 50) return 'var(--warning)'
  return 'var(--error)'
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({
  product,
  onMove,
  onClick,
  moving,
}: {
  product: ProductFull
  onMove: (id: string, status: PipelineStatus) => void
  onClick: () => void
  moving: boolean
}) {
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

  const currentIdx = COLUMNS.findIndex(c => c.key === product.pipeline_status)
  const nextCol = currentIdx < COLUMNS.length - 1 ? COLUMNS[currentIdx + 1] : null

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        opacity: moving ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Image strip */}
      <div
        onClick={onClick}
        style={{ height: 72, background: 'var(--surface-3)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
      >
        {mainImg && !imgErr
          ? <img src={mainImg} alt={product.name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} style={{ color: 'var(--text-4)' }} /></div>
        }
        {/* Score badge */}
        {product.notreglr_score !== null && (
          <div style={{
            position: 'absolute', bottom: 6, right: 8,
            fontSize: 16, fontWeight: 900, fontFamily: 'var(--font-alt)',
            color: scoreColor(product.notreglr_score), lineHeight: 1,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {product.notreglr_score}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }} onClick={onClick}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', lineHeight: 1.4, margin: 0, cursor: 'pointer', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </p>

        {/* Pricing mini */}
        {calc ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--brand)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {fmtEur(pricing?.sale_price_eur)}
            </span>
            <span style={{ fontSize: 10, color: calc.netProfit > 0 ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>
              {fmtEur(calc.netProfit)} / {fmtPct(calc.profitMarginPct)}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>sem preço</span>
        )}

        {/* CPA */}
        {calc && (
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
              CPA ideal <span style={{ color: 'var(--info)', fontWeight: 600 }}>{fmtEur(calc.cpaIdeal)}</span>
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
              CPA máx <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>{fmtEur(calc.cpaMax)}</span>
            </span>
          </div>
        )}

        {/* Modules */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {product.mineracao_id && <span title="Na Mineração"><FlaskConical size={10} style={{ color: 'var(--info)' }} /></span>}
          {product.creatives?.length > 0 && (
            <span style={{ fontSize: 9, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-mono)' }}>
              <Megaphone size={9} /> {product.creatives.length}
            </span>
          )}
          {product.ad_campaigns?.length > 0 && (
            <span style={{ fontSize: 9, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-mono)' }}>
              <TrendingUp size={9} /> {product.ad_campaigns.length}
            </span>
          )}
        </div>
      </div>

      {/* Move to next stage */}
      {nextCol && product.pipeline_status !== 'descartado' && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '6px 10px' }}>
          <button
            onClick={e => { e.stopPropagation(); onMove(product.id, nextCol.key) }}
            disabled={moving}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '5px 8px', fontSize: 10, cursor: 'pointer',
              background: `color-mix(in srgb, ${nextCol.color} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${nextCol.color} 30%, transparent)`,
              borderRadius: 'var(--radius-sm)', color: nextCol.color,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              transition: 'all 0.15s',
            }}
          >
            → {nextCol.label} <ChevronRight size={9} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  products,
  onMove,
  onCardClick,
  movingId,
}: {
  column: typeof COLUMNS[0]
  products: ProductFull[]
  onMove: (id: string, status: PipelineStatus) => void
  onCardClick: (id: string) => void
  movingId: string | null
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Column header */}
      <div style={{
        padding: '10px 12px', marginBottom: 10,
        borderBottom: `2px solid ${column.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: column.color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {column.label}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-4)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            {column.description}
          </div>
        </div>
        <span style={{
          minWidth: 22, height: 22, borderRadius: 'var(--radius-full)',
          background: `color-mix(in srgb, ${column.color} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${column.color} 40%, transparent)`,
          color: column.color, fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
        }}>
          {products.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.length === 0 ? (
          <div style={{
            border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
            padding: '20px 12px', textAlign: 'center',
            color: 'var(--text-4)', fontSize: 10, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            vazio
          </div>
        ) : (
          products.map(p => (
            <KanbanCard
              key={p.id}
              product={p}
              onMove={onMove}
              onClick={() => onCardClick(p.id)}
              moving={movingId === p.id}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EsteiraClient() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)
  const [movingId, setMovingId] = useState<string | null>(null)
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleMove(id: string, newStatus: PipelineStatus) {
    setMovingId(id)
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, pipeline_status: newStatus } : p))
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pipeline_status: newStatus }),
    })
    setMovingId(null)
  }

  const columnProducts = (key: PipelineStatus) => products.filter(p => p.pipeline_status === key)

  // Summary stats
  const totalBudget = products
    .filter(p => p.pipeline_status === 'testando' && p.ad_campaigns?.some(c => c.status === 'testando'))
    .reduce((acc) => acc, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          WARD / ESTEIRA
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
          Esteira de Testes
        </h1>
        <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {products.length} produto{products.length !== 1 ? 's' : ''} · pipeline de validação
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : products.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Nenhum produto na esteira. Use a Mineração para enviar produtos.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.key}
              column={col}
              products={columnProducts(col.key)}
              onMove={handleMove}
              onCardClick={id => setDrawerProductId(id)}
              movingId={movingId}
            />
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

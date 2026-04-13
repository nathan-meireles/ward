'use client'

/**
 * /esteira — Pipeline de Testes
 *
 * Propósito: gerenciar o fluxo de validação dos produtos via Meta Ads.
 * 4 estágios: A Testar → Testando → Validado / Descartado
 * Cada card mostra CPA ideal, CPA máximo, ROAS mínimo.
 *
 * Diferença de /produtos:
 *   Produtos = catálogo/database (todos os produtos, dados financeiros)
 *   Esteira  = pipeline (quais estão sendo testados agora, decisão kill/scale)
 */

import { useEffect, useState, useCallback } from 'react'
import { Loader2, ChevronRight, ChevronLeft, Package, FlaskConical, Megaphone, TrendingUp, X, Info } from 'lucide-react'
import { ProductDrawer, type ProductFull } from '@/components/products/ProductDrawer'
import { calcPricing, fmtEur, fmtPct } from '@/lib/pricing'

type PipelineStatus = 'a_testar' | 'testando' | 'validado' | 'descartado'

const COLUMNS: Array<{
  key: PipelineStatus
  label: string
  color: string
  bg: string
  description: string
  next: PipelineStatus | null
  prev: PipelineStatus | null
}> = [
  {
    key: 'a_testar',
    label: 'A Testar',
    color: 'var(--text-3)',
    bg: 'rgba(175,175,175,0.06)',
    description: 'Aguardando início do teste',
    next: 'testando',
    prev: null,
  },
  {
    key: 'testando',
    label: 'Testando',
    color: 'var(--warning)',
    bg: 'rgba(251,191,36,0.06)',
    description: 'Ads ativos · coletando dados',
    next: null, // pode ir para validado OU descartado
    prev: 'a_testar',
  },
  {
    key: 'validado',
    label: 'Validado',
    color: 'var(--success)',
    bg: 'rgba(74,222,128,0.06)',
    description: 'Kill criteria aprovados · escalar',
    next: null,
    prev: 'testando',
  },
  {
    key: 'descartado',
    label: 'Descartado',
    color: 'var(--error)',
    bg: 'rgba(248,113,113,0.06)',
    description: 'Kill criteria negativos · encerrado',
    next: null,
    prev: 'testando',
  },
]

// Kill criteria da Simo B. (resumo visual)
const KILL_CRITERIA = [
  { spend: '€10', rule: 'CPC > €1 ou zero ATC → mata' },
  { spend: '€20', rule: 'Zero ATC → mata' },
  { spend: '€30', rule: 'Zero compras → para' },
  { spend: '€60', rule: '< 2 compras → para · ≥ 2 → escala' },
]

function scoreColor(s: number | null) {
  if (!s) return 'var(--text-4)'
  return s >= 70 ? 'var(--success)' : s >= 50 ? 'var(--warning)' : 'var(--error)'
}

// ─── Kill Criteria Panel ──────────────────────────────────────────────────────

function KillCriteriaPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Kill Criteria · Framework Simo B.
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)' }}>
          <X size={13} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {KILL_CRITERIA.map(({ spend, rule }) => (
          <div key={spend} style={{ padding: '6px 10px', background: 'var(--surface-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--brand)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{spend}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({
  product,
  column,
  onMove,
  onClick,
  moving,
}: {
  product: ProductFull
  column: typeof COLUMNS[0]
  onMove: (id: string, to: PipelineStatus) => void
  onClick: () => void
  moving: boolean
}) {
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

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${column.color}`,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      opacity: moving ? 0.5 : 1,
      transition: 'opacity 0.2s, box-shadow 0.15s',
    }}>
      {/* Image + name row */}
      <div onClick={onClick} style={{ display: 'flex', gap: 10, padding: '10px 12px', cursor: 'pointer', alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
          {product.images?.[0] && !imgErr
            ? <img src={product.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={14} style={{ color: 'var(--text-4)' }} /></div>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </p>
          {product.notreglr_score !== null && (
            <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(product.notreglr_score), fontFamily: 'var(--font-mono)' }}>
              {product.notreglr_score}pts
            </span>
          )}
        </div>
      </div>

      {/* Financial metrics */}
      {calc ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'CPA ideal', value: fmtEur(calc.cpaIdeal), color: 'var(--info)' },
            { label: 'CPA máx', value: fmtEur(calc.cpaMax), color: 'var(--text-3)' },
            { label: 'ROAS mín', value: `${calc.roasMin.toFixed(1)}x`, color: 'var(--brand)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '6px 8px', background: 'var(--surface-2)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontSize: 12, color, fontFamily: 'var(--font-mono)', fontWeight: 600, lineHeight: 1.4 }}>{value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>
          Configure preço para ver CPA/ROAS
        </div>
      )}

      {/* Margin + links */}
      {calc && (
        <div style={{ display: 'flex', gap: 8, padding: '5px 12px', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, color: calc.netProfit > 0 ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>
            {fmtEur(pricing?.sale_price_eur)} · {fmtEur(calc.netProfit)} · {fmtPct(calc.profitMarginPct)}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center' }}>
            {product.mineracao_id && <FlaskConical size={10} style={{ color: 'var(--info)' }} />}
            {product.creatives?.length > 0 && (
              <span style={{ fontSize: 9, color: 'var(--brand)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Megaphone size={9} />{product.creatives.length}
              </span>
            )}
            {product.ad_campaigns?.length > 0 && (
              <span style={{ fontSize: 9, color: 'var(--warning)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp size={9} />{product.ad_campaigns.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Move buttons */}
      <div style={{ display: 'flex', gap: 4, padding: '6px 10px', borderTop: '1px solid var(--border)' }}>
        {/* Back */}
        {column.prev && (
          <button
            onClick={e => { e.stopPropagation(); onMove(product.id, column.prev!) }}
            disabled={moving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
              padding: '4px', fontSize: 9, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-4)', fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s',
            }}
          >
            <ChevronLeft size={9} /> {COLUMNS.find(c => c.key === column.prev)?.label}
          </button>
        )}

        {/* Forward — "Testando" can go to Validado or Descartado */}
        {column.key === 'testando' ? (
          <>
            <button
              onClick={e => { e.stopPropagation(); onMove(product.id, 'validado') }}
              disabled={moving}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                padding: '4px', fontSize: 9, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--success)', background: 'rgba(74,222,128,0.08)',
                color: 'var(--success)', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
              }}
            >
              ✓ Validar
            </button>
            <button
              onClick={e => { e.stopPropagation(); onMove(product.id, 'descartado') }}
              disabled={moving}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                padding: '4px', fontSize: 9, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--error)', background: 'rgba(248,113,113,0.08)',
                color: 'var(--error)', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
              }}
            >
              ✗ Descartar
            </button>
          </>
        ) : column.next ? (
          <button
            onClick={e => { e.stopPropagation(); onMove(product.id, column.next!) }}
            disabled={moving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
              padding: '4px', fontSize: 9, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
              border: `1px solid ${COLUMNS.find(c => c.key === column.next)?.color}`,
              background: `color-mix(in srgb, ${COLUMNS.find(c => c.key === column.next)?.color} 10%, transparent)`,
              color: COLUMNS.find(c => c.key === column.next)?.color,
              fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
            }}
          >
            {COLUMNS.find(c => c.key === column.next)?.label} <ChevronRight size={9} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  column, products, onMove, onCardClick, movingId,
}: {
  column: typeof COLUMNS[0]
  products: ProductFull[]
  onMove: (id: string, to: PipelineStatus) => void
  onCardClick: (id: string) => void
  movingId: string | null
}) {
  const totalBudget = products.reduce((acc, p) => {
    const c = p.product_pricing ? calcPricing({
      cog_eur: p.product_pricing.cog_eur, freight_eur: p.product_pricing.freight_eur,
      sale_price_eur: p.product_pricing.sale_price_eur, coupon_pct: p.product_pricing.coupon_pct,
      iof_rate: p.product_pricing.iof_rate, checkout_fee_rate: p.product_pricing.checkout_fee_rate,
      gateway_fee_rate: p.product_pricing.gateway_fee_rate,
      marketing_allocation_pct: p.product_pricing.marketing_allocation_pct,
      other_taxes_rate: p.product_pricing.other_taxes_rate,
    }) : null
    return acc + (c?.cpaIdeal ?? 0)
  }, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Column header */}
      <div style={{
        padding: '10px 14px 10px', marginBottom: 10,
        background: column.bg,
        border: `1px solid color-mix(in srgb, ${column.color} 25%, transparent)`,
        borderRadius: 'var(--radius)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: column.color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {column.label}
          </span>
          <span style={{
            minWidth: 22, height: 22, borderRadius: 'var(--radius-full)',
            background: `color-mix(in srgb, ${column.color} 20%, transparent)`,
            color: column.color, fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
          }}>
            {products.length}
          </span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
          {column.description}
        </div>
        {column.key === 'testando' && totalBudget > 0 && (
          <div style={{ fontSize: 9, color: column.color, fontFamily: 'var(--font-mono)', marginTop: 3 }}>
            CPA ideal total: {fmtEur(totalBudget)}
          </div>
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.length === 0 ? (
          <div style={{
            border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
            padding: '20px 12px', textAlign: 'center',
            color: 'var(--text-4)', fontSize: 9, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            vazio
          </div>
        ) : (
          products.map(p => (
            <KanbanCard
              key={p.id}
              product={p}
              column={column}
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
  const [showKillCriteria, setShowKillCriteria] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleMove(id: string, newStatus: PipelineStatus) {
    setMovingId(id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, pipeline_status: newStatus } : p))
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pipeline_status: newStatus }),
    })
    setMovingId(null)
  }

  const testando = products.filter(p => p.pipeline_status === 'testando').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            WARD / ESTEIRA DE TESTES
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
            Esteira
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowKillCriteria(v => !v)} className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Info size={13} /> Kill Criteria
          </button>
          <a href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="btn btn-secondary">
            <Package size={13} /> Ver Catálogo
          </a>
        </div>
      </div>
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 20, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {products.length} produto{products.length !== 1 ? 's' : ''} na pipeline
        {testando > 0 && <span style={{ color: 'var(--warning)', marginLeft: 10 }}>· {testando} testando agora</span>}
      </p>

      {showKillCriteria && <KillCriteriaPanel onClose={() => setShowKillCriteria(false)} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : products.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
          <TrendingUp size={28} style={{ color: 'var(--text-4)', marginBottom: 12 }} />
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Nenhum produto. Use a Mineração para enviar produtos para a esteira.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.key}
              column={col}
              products={products.filter(p => p.pipeline_status === col.key)}
              onMove={handleMove}
              onCardClick={id => setDrawerProductId(id)}
              movingId={movingId}
            />
          ))}
        </div>
      )}

      <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} onUpdate={load} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

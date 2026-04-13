'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trash2, ExternalLink, Loader2, Plus, RefreshCw, ImagePlus, X, ChevronDown, LayoutGrid, List, Search, Download, Tag, Check, TrendingUp } from 'lucide-react'

// ─── ALIEXPRESS ID EXTRACTOR ─────────────────────────────────────────────────

function clientExtractProductId(url: string): string | null {
  const m = url.match(/\/item\/(\d+)/)
  return m ? m[1] : null
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────

function ConfirmModal({ title, body, confirmLabel = 'Confirmar', onConfirm, onCancel }: {
  title: string; body: string; confirmLabel?: string
  onConfirm: () => void; onCancel: () => void
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancel])
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal" style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontFamily: 'var(--font-alt)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 10 }}>{title}</h2>
        <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 24 }}>{body}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="btn btn-destructive">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  aliexpress_id: string | null
  aliexpress_url: string
  title: string | null
  price_min: number | null
  price_max: number | null
  orders_count: string | null
  rating: number | null
  review_count: number | null
  seller_name: string | null
  seller_positive_rate: string | null
  images: string[]
  notreglr_score: number | null
  notreglr_label: string | null
  notreglr_reasoning: string | null
  notreglr_visual_traits: string[] | null
  status: string
  error_msg: string | null
  created_at: string
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

function scoreBg(label: string | null) {
  if (label === 'forte') return 'rgba(74,222,128,0.07)'
  if (label === 'medio') return 'rgba(251,191,36,0.07)'
  if (label === 'fraco') return 'rgba(248,113,113,0.07)'
  return 'var(--surface-2)'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function formatPrice(min: number | null, max: number | null): string | null {
  if (!min && !max) return null
  if (!max || min === max) return `€${(min ?? max)!.toFixed(2)}`
  return `€${min!.toFixed(2)}–${max!.toFixed(2)}`
}

function cleanTitle(title: string | null, fallback: string): string {
  if (!title) return fallback
  if (/^\d{10,}$/.test(title.trim())) return fallback
  // Reject single CamelCase component names that slipped through extraction
  if (/^[A-Z][a-zA-Z0-9]+$/.test(title.trim())) return fallback
  return title
}

// ─── STATUS DOT ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'var(--text-4)', analyzing: 'var(--info)', done: 'var(--success)',
    partial: 'var(--warning)', error: 'var(--error)',
  }
  const labels: Record<string, string> = {
    pending: 'Pendente', analyzing: 'Analisando', done: 'Concluído',
    partial: 'Parcial', error: 'Erro',
  }
  const color = colors[status] ?? colors.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {labels[status] ?? status}
    </span>
  )
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────

function StatsBar({ products }: { products: Product[] }) {
  if (!products.length) return null
  const analyzed = products.filter(p => p.notreglr_score !== null)
  const avg = analyzed.length ? Math.round(analyzed.reduce((s, p) => s + p.notreglr_score!, 0) / analyzed.length) : null
  const forte = products.filter(p => p.notreglr_label === 'forte').length
  const medio = products.filter(p => p.notreglr_label === 'medio').length
  const fraco = products.filter(p => p.notreglr_label === 'fraco').length
  const errors = products.filter(p => p.status === 'error').length

  const cells = [
    { label: 'Total', value: String(products.length), color: 'var(--text)' },
    { label: 'Score Médio', value: avg !== null ? String(avg) : '—', color: avg !== null ? scoreColor(avg) : 'var(--text-4)' },
    { label: 'Forte', value: String(forte), color: 'var(--success)' },
    { label: 'Médio', value: String(medio), color: 'var(--warning)' },
    { label: 'Fraco', value: String(fraco), color: 'var(--error)' },
    { label: 'Erros', value: String(errors), color: errors > 0 ? 'var(--error)' : 'var(--text-4)' },
  ]

  return (
    <div
      className="bento"
      style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 28, border: '1px solid var(--border-input)', backgroundColor: 'rgba(255,255,255,0.12)' }}
    >
      {cells.map(({ label, value, color }) => (
        <div key={label} style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
            {label}
          </div>
          <div style={{ fontSize: 32, fontFamily: 'var(--font-alt)', color, lineHeight: 1 }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────

function DetailModal({ product, onClose, onDelete, onImageSubmit, isPromoted, onPromote }: {
  product: Product
  onClose: () => void
  onDelete: (id: string) => void
  onImageSubmit: (id: string, url: string) => Promise<void>
  isPromoted: boolean
  onPromote: (id: string) => Promise<void>
}) {
  const [imgInput, setImgInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [promoting, setPromoting] = useState(false)

  async function handleImg() {
    if (!imgInput.trim()) return
    setSubmitting(true)
    await onImageSubmit(product.id, imgInput.trim())
    setImgInput('')
    setSubmitting(false)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const hasImage = product.images?.[0] && !imgErr
  const title = cleanTitle(product.title, `Produto AliExpress #${product.aliexpress_id}`)

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ width: '100%', maxWidth: 720, padding: 0, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {product.notreglr_label && (
              <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
            )}
            {product.notreglr_score !== null && (
              <span style={{ fontWeight: 900, fontSize: 26, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>
                {product.notreglr_score}
                <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 400, letterSpacing: 0 }}>/100</span>
              </span>
            )}
            {!product.notreglr_label && <StatusDot status={product.status} />}
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 6px', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Body: 2-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr' }}>

          {/* Left: image */}
          <div style={{ background: 'var(--surface-2)', borderRight: '1px solid var(--border)' }}>
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={title}
                onError={() => setImgErr(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 240 }}
              />
            ) : (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 240 }}>
                <ImagePlus size={28} style={{ color: 'var(--text-4)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                  <input
                    value={imgInput}
                    onChange={e => setImgInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleImg()}
                    placeholder="URL da imagem"
                    className="form-input"
                    style={{ fontSize: 11 }}
                  />
                  <button onClick={handleImg} disabled={submitting || !imgInput.trim()} className="btn btn-primary" style={{ width: '100%' }}>
                    {submitting ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : 'Carregar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: 440 }}>

            {/* Title */}
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>{title}</p>

            {/* Seller */}
            {(product.seller_name || product.seller_positive_rate) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendedor</span>
                {product.seller_name && (
                  <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{product.seller_name}</span>
                )}
                {product.seller_positive_rate && (
                  <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>{product.seller_positive_rate} ✓</span>
                )}
              </div>
            )}

            {/* Stats mini-bento */}
            <div className="bento" style={{ gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              {[
                { label: 'Preço', value: formatPrice(product.price_min, product.price_max) ?? '—', color: 'var(--brand)' },
                { label: 'Pedidos', value: product.orders_count ?? '—', color: 'var(--text-2)' },
                { label: 'Reviews', value: product.review_count ? product.review_count.toLocaleString('pt-BR') : '—', color: 'var(--text-2)' },
                { label: 'Prazo EU', value: '15–25 dias', color: 'var(--text-3)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Rating */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--warning)' }}>★ {product.rating.toFixed(1)}</span>
                {product.review_count && (
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                    {product.review_count.toLocaleString('pt-BR')} avaliações
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              {/* Enviar para Esteira */}
              {!isPromoted ? (
                <button
                  onClick={async () => { setPromoting(true); await onPromote(product.id); setPromoting(false) }}
                  disabled={promoting || (product.notreglr_score ?? 0) < 50}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: (product.notreglr_score ?? 0) < 50 ? 0.5 : 1 }}
                  title={(product.notreglr_score ?? 0) < 50 ? 'Score mínimo 50 para enviar para esteira' : ''}
                >
                  {promoting
                    ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Enviando…</>
                    : <><TrendingUp size={12} /> Enviar para Esteira</>
                  }
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--success)', color: 'var(--success)', fontSize: 12 }}>
                  <TrendingUp size={12} /> Já está na Esteira
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={product.aliexpress_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> Ver no AliExpress
                </a>
                <button
                  onClick={() => { onDelete(product.id); onClose() }}
                  className="btn btn-ghost"
                  style={{ color: 'var(--error)', borderColor: 'rgba(248,113,113,0.25)' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Adicionado {formatDate(product.created_at)}
            </span>
          </div>
        </div>

        {/* Footer: análise + traits */}
        {(product.notreglr_reasoning || product.notreglr_visual_traits?.length || product.error_msg) && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.notreglr_reasoning && (
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-4)', marginBottom: 6, letterSpacing: '0.14em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Análise NOTREGLR</div>
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{product.notreglr_reasoning}</p>
              </div>
            )}
            {product.notreglr_visual_traits && product.notreglr_visual_traits.length > 0 && (
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-4)', marginBottom: 6, letterSpacing: '0.14em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Características Visuais</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {product.notreglr_visual_traits.map((t, i) => (
                    <span key={i} className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Tag size={8} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.error_msg && (
              <p style={{ fontSize: 11, color: 'var(--error)', margin: 0, background: 'rgba(248,113,113,0.06)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                {product.error_msg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClick, selected, onToggleSelect, isPromoted }: {
  product: Product
  onClick: () => void
  selected: boolean
  onToggleSelect: (e: React.MouseEvent) => void
  isPromoted?: boolean
}) {
  const [imgErr, setImgErr] = useState(false)
  const [hover, setHover] = useState(false)
  const mainImg = product.images?.[0]
  const isAnalyzing = product.status === 'analyzing'
  const title = cleanTitle(product.title, 'Produto AliExpress')
  const price = formatPrice(product.price_min, product.price_max)

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        border: selected ? '2px solid var(--brand)' : '1px solid var(--border)',
        boxShadow: selected ? '0 0 0 3px var(--brand-dim)' : undefined,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Score strip */}
      <div style={{
        padding: '8px 12px',
        background: scoreBg(product.notreglr_label),
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 38, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {product.notreglr_label
            ? <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
            : <StatusDot status={product.status} />
          }
          {isPromoted && (
            <span title="Na Esteira" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--success)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              <TrendingUp size={9} /> ESTEIRA
            </span>
          )}
        </div>
        <span style={{ fontWeight: 900, fontSize: 22, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>
          {isAnalyzing
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }} />
            : (product.notreglr_score ?? '—')
          }
        </span>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)', overflow: 'hidden', flexShrink: 0 }}>
        {mainImg && !imgErr
          ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainImg} alt={title} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )
          : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImagePlus size={20} style={{ color: 'var(--text-4)' }} />
            </div>
          )
        }
        {/* Checkbox overlay */}
        <div
          onClick={onToggleSelect}
          style={{
            position: 'absolute', top: 8, left: 8,
            width: 20, height: 20,
            background: selected ? 'var(--brand)' : 'rgba(9,9,10,0.7)',
            border: `1.5px solid ${selected ? 'var(--brand)' : 'rgba(255,255,255,0.45)'}`,
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            opacity: (selected || hover) ? 1 : 0,
            transition: 'opacity 0.15s',
            zIndex: 5,
          }}
        >
          {selected && <Check size={11} color="var(--bg)" strokeWidth={3} />}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {/* Title */}
        <p style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text-2)', lineHeight: 1.45, margin: 0,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: '2.9em',
        }}>
          {title}
        </p>

        {/* Price */}
        {price && (
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', lineHeight: 1 }}>
            {price}
          </span>
        )}

        {/* Rating + reviews + orders */}
        {(product.rating || product.orders_count) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {product.rating && (
              <>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning)' }}>★ {product.rating.toFixed(1)}</span>
                {product.review_count && (
                  <span style={{ fontSize: 10, color: 'var(--text-4)' }}>({product.review_count.toLocaleString('pt-BR')})</span>
                )}
              </>
            )}
            {product.orders_count && (
              <span style={{ fontSize: 10, color: 'var(--text-4)' }}>· {product.orders_count} vend.</span>
            )}
          </div>
        )}

        {/* Date */}
        <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 'auto', paddingTop: 2 }}>
          {formatDate(product.created_at)}
        </span>
      </div>
    </div>
  )
}

// ─── LIST ROW ─────────────────────────────────────────────────────────────────

function ListRow({ product, onClick, selected, onToggleSelect }: {
  product: Product
  onClick: () => void
  selected: boolean
  onToggleSelect: (e: React.MouseEvent) => void
}) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 56px 48px 1fr 96px 80px 80px 80px 90px',
        gap: 10, padding: '9px 14px',
        background: selected ? 'var(--accent-08)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer', alignItems: 'center',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)' }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <div onClick={onToggleSelect} style={{
        width: 18, height: 18,
        background: selected ? 'var(--brand)' : 'transparent',
        border: `1.5px solid ${selected ? 'var(--brand)' : 'var(--border-2)'}`,
        borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        {selected && <Check size={10} color="var(--bg)" strokeWidth={3} />}
      </div>

      <span style={{ fontWeight: 900, fontSize: 20, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>
        {product.notreglr_score ?? '—'}
      </span>

      <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
        {product.images?.[0] && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>

      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block' }}>
          {cleanTitle(product.title, 'Produto AliExpress')}
        </span>
      </div>

      <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 700 }}>{formatPrice(product.price_min, product.price_max) ?? '—'}</span>
      <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{product.orders_count ?? '—'}</span>
      <span style={{ fontSize: 11, color: product.rating ? 'var(--warning)' : 'var(--text-4)' }}>
        {product.rating ? `★ ${product.rating.toFixed(1)}` : '—'}
      </span>
      {product.notreglr_label
        ? <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
        : <StatusDot status={product.status} />
      }
      <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{formatDate(product.created_at)}</span>
    </div>
  )
}

// ─── BULK ACTION BAR ──────────────────────────────────────────────────────────

function BulkActionBar({ count, onDelete, onExport, onRefetch, onClear }: {
  count: number; onDelete: () => void; onExport: () => void; onRefetch: () => void; onClear: () => void
}) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200,
      background: 'var(--surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 'var(--radius-full)',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      animation: 'bulkIn 0.2s var(--ease-decel)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {count} sel.
      </span>
      <div style={{ width: 1, height: 16, background: 'var(--border-2)' }} />
      <button onClick={onRefetch} className="btn btn-ghost" style={{ minHeight: 28, padding: '4px 10px' }}>
        <RefreshCw size={12} /> Atualizar dados
      </button>
      <button onClick={onExport} className="btn btn-ghost" style={{ minHeight: 28, padding: '4px 10px' }}>
        <Download size={12} /> Exportar
      </button>
      <button onClick={onDelete} className="btn btn-ghost" style={{ minHeight: 28, padding: '4px 10px', color: 'var(--error)' }}>
        <Trash2 size={12} /> Excluir
      </button>
      <button onClick={onClear} className="btn btn-ghost" style={{ minHeight: 28, padding: '4px 6px' }}>
        <X size={14} />
      </button>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

type SortKey = 'score' | 'date' | 'price' | 'orders'
type FilterKey = 'all' | 'forte' | 'medio' | 'fraco' | 'error'
type DateFilter = 'all' | 'custom'

export function MineracaoClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState<{ current: number; total: number } | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('score')
  const [selected, setSelected] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmAction, setConfirmAction] = useState<{ title: string; body: string; onConfirm: () => void } | null>(null)
  const [promotedIds, setPromotedIds] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    const res = await fetch('/api/mineracao')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  const loadPromoted = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) return
      const data: { mineracao_id: string | null }[] = await res.json()
      setPromotedIds(new Set(data.map(p => p.mineracao_id).filter(Boolean) as string[]))
    } catch { /* silent */ }
  }, [])

  useEffect(() => { load(); loadPromoted() }, [load, loadPromoted])

  useEffect(() => {
    const hasAnalyzing = products.some(p => p.status === 'analyzing' || p.status === 'pending')
    if (!hasAnalyzing) return
    const timer = setInterval(load, 3000)
    return () => clearInterval(timer)
  }, [products, load])

  useEffect(() => {
    if (!selected) return
    const updated = products.find(p => p.id === selected.id)
    if (updated) setSelected(updated)
  }, [products, selected])

  function toggleSelect(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function handleCardClick(product: Product) {
    if (selectedIds.size > 0) {
      setSelectedIds(prev => { const n = new Set(prev); n.has(product.id) ? n.delete(product.id) : n.add(product.id); return n })
    } else {
      setSelected(product)
    }
  }

  async function handleAnalyze() {
    const urls = input.split('\n').map(u => u.trim()).filter(Boolean)
    if (!urls.length) return
    setAnalyzing(true)
    setShowInput(false)
    setInput('')
    setAnalyzeError(null)

    try {
      for (let i = 0; i < urls.length; i++) {
        setAnalyzeProgress({ current: i + 1, total: urls.length })
        const rawUrl = urls[i]
        const productId = clientExtractProductId(rawUrl)

        if (!productId) {
          setAnalyzeError(`URL inválida: ${rawUrl.slice(0, 60)}`)
          continue
        }

        let payload: Record<string, unknown> = { productId, url: rawUrl }

        try {
          const apiRes = await fetch(`/api/mineracao/product?id=${productId}`)
          const data = await apiRes.json()
          if (!data.error) {
            payload = { ...payload, ...data }
          } else {
            payload.fetchError = data.error
          }
        } catch (e) {
          payload.fetchError = e instanceof Error ? e.message : 'Erro de fetch'
        }

        try {
          const res = await fetch('/api/mineracao/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          if (!res.ok) {
            const text = await res.text()
            setAnalyzeError(`Erro ${res.status}: ${text.slice(0, 200)}`)
          }
        } catch (e) {
          setAnalyzeError(e instanceof Error ? e.message : 'Erro de rede')
        }

        await load()
      }
    } finally {
      setAnalyzing(false)
      setAnalyzeProgress(null)
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/mineracao', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setProducts(prev => prev.filter(p => p.id !== id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  async function handleDeleteErrors() {
    const errors = products.filter(p => p.status === 'error')
    await Promise.all(errors.map(p =>
      fetch('/api/mineracao', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) })
    ))
    setProducts(prev => prev.filter(p => p.status !== 'error'))
  }

  function handleDeleteAll() {
    setConfirmAction({
      title: 'Remover tudo',
      body: `Isso vai remover todos os ${products.length} produtos minerados. Não dá pra desfazer.`,
      onConfirm: async () => {
        setConfirmAction(null)
        await Promise.all(products.map(p =>
          fetch('/api/mineracao', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) })
        ))
        setProducts([])
        setSelected(null)
        setSelectedIds(new Set())
      },
    })
  }

  function handleDeleteSelected() {
    const count = selectedIds.size
    setConfirmAction({
      title: `Remover ${count} produto${count !== 1 ? 's' : ''}`,
      body: `Isso vai remover ${count} produto${count !== 1 ? 's' : ''} selecionado${count !== 1 ? 's' : ''}. Não dá pra desfazer.`,
      onConfirm: async () => {
        setConfirmAction(null)
        const ids = Array.from(selectedIds)
        await Promise.all(ids.map(id =>
          fetch('/api/mineracao', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        ))
        setProducts(prev => prev.filter(p => !selectedIds.has(p.id)))
        setSelectedIds(new Set())
      },
    })
  }

  // Re-fetch data from AliExpress for a list of products (title + images + re-analyze)
  async function handleRefetch(targetProducts: Product[]) {
    if (!targetProducts.length) return
    setAnalyzing(true)
    setAnalyzeError(null)

    try {
      for (let i = 0; i < targetProducts.length; i++) {
        setAnalyzeProgress({ current: i + 1, total: targetProducts.length })
        const p = targetProducts[i]
        const productId = p.aliexpress_id
        if (!productId) continue

        let payload: Record<string, unknown> = { productId, url: p.aliexpress_url }

        try {
          const apiRes = await fetch(`/api/mineracao/product?id=${productId}`)
          const data = await apiRes.json()
          if (!data.error) {
            payload = { ...payload, ...data }
          } else {
            payload.fetchError = data.error
          }
        } catch (e) {
          payload.fetchError = e instanceof Error ? e.message : 'Erro de fetch'
        }

        try {
          await fetch('/api/mineracao/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        } catch { /* continue on individual error */ }

        await load()
      }
    } finally {
      setAnalyzing(false)
      setAnalyzeProgress(null)
      setSelectedIds(new Set())
    }
  }

  async function handlePromote(mineracaoId: string) {
    const res = await fetch('/api/products/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mineracao_id: mineracaoId }),
    })
    if (res.ok) {
      setPromotedIds(prev => new Set([...prev, mineracaoId]))
    }
  }

  async function handleImageSubmit(id: string, imageUrl: string) {
    await fetch('/api/mineracao/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, imageUrl }),
    })
    await load()
  }

  function exportCSV(items: Product[]) {
    const headers = ['ID AliExpress', 'Título', 'Score', 'Label', 'Preço Min (€)', 'Preço Max (€)', 'Pedidos', 'Rating', 'Reviews', 'Vendedor', '% Positivo', 'Traits', 'URL', 'Data']
    const rows = items.map(p => [
      p.aliexpress_id ?? '',
      (p.title ?? '').replace(/,/g, ';'),
      p.notreglr_score ?? '',
      p.notreglr_label ?? '',
      p.price_min ?? '',
      p.price_max ?? '',
      p.orders_count ?? '',
      p.rating ?? '',
      p.review_count ?? '',
      p.seller_name ?? '',
      p.seller_positive_rate ?? '',
      (p.notreglr_visual_traits ?? []).join('; '),
      p.aliexpress_url,
      formatDate(p.created_at),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mineracao-notreglr-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function toggleSelectAll(items: Product[]) {
    if (items.every(p => selectedIds.has(p.id))) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map(p => p.id)))
    }
  }

  // ── Filtering ──
  const now = new Date()
  const filtered = products.filter(p => {
    if (filter === 'error' && p.status !== 'error') return false
    if (filter !== 'all' && filter !== 'error' && p.notreglr_label !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.title?.toLowerCase().includes(q) && !p.aliexpress_id?.includes(q)) return false
    }
    if (dateFilter === 'custom') {
      const created = new Date(p.created_at)
      if (dateFrom && created < new Date(dateFrom)) return false
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        if (created > end) return false
      }
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'score') return (b.notreglr_score ?? -1) - (a.notreglr_score ?? -1)
    if (sort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sort === 'price') return (a.price_min ?? 999) - (b.price_min ?? 999)
    if (sort === 'orders') return parseInt(b.orders_count ?? '0') - parseInt(a.orders_count ?? '0')
    return 0
  })

  const stats = {
    forte: products.filter(p => p.notreglr_label === 'forte').length,
    medio: products.filter(p => p.notreglr_label === 'medio').length,
    fraco: products.filter(p => p.notreglr_label === 'fraco').length,
    error: products.filter(p => p.status === 'error').length,
  }

  const allVisibleSelected = sorted.length > 0 && sorted.every(p => selectedIds.has(p.id))

  // ── Shared select style ──
  const selectStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-3)',
    fontSize: 11,
    fontFamily: 'var(--font)',
    padding: '6px 28px 6px 10px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
  }

  return (
    <div>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            WARD / MINERAÇÃO
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 400, letterSpacing: '0.04em',
            color: 'var(--text)', margin: 0, lineHeight: 1,
          }}>
            Mineração
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {products.length} produto{products.length !== 1 ? 's' : ''} · análise visual via Claude Vision
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {(['grid', 'list'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                background: viewMode === mode ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer',
                color: viewMode === mode ? 'var(--text)' : 'var(--text-4)',
                padding: '7px 10px', display: 'flex', alignItems: 'center',
                transition: 'background 0.1s, color 0.1s',
              }}>
                {mode === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
          {products.length > 0 && (
            <button onClick={() => exportCSV(products)} className="btn btn-ghost" title="Exportar CSV">
              <Download size={14} />
            </button>
          )}
          {stats.error > 0 && (
            <button onClick={handleDeleteErrors} className="btn btn-ghost" style={{ color: 'var(--error)' }}>
              <Trash2 size={12} /> Erros ({stats.error})
            </button>
          )}
          {products.length > 0 && (
            <button onClick={() => handleRefetch(products)} disabled={analyzing} className="btn btn-ghost" title="Buscar dados atualizados no AliExpress para todos os produtos">
              <RefreshCw size={14} /> Atualizar todos
            </button>
          )}
          {products.length > 0 && (
            <button onClick={handleDeleteAll} className="btn btn-ghost" title="Remover todos">
              <Trash2 size={14} />
            </button>
          )}
          <button onClick={load} className="btn btn-secondary" title="Recarregar">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => !analyzing && setShowInput(true)} disabled={analyzing} className="btn btn-primary">
            {analyzing && analyzeProgress
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {analyzeProgress.current}/{analyzeProgress.total}</>
              : <><Plus size={14} /> Analisar URLs</>
            }
          </button>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <StatsBar products={products} />

      {/* ── PROGRESS ── */}
      {analyzing && analyzeProgress && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Analisando {analyzeProgress.current} de {analyzeProgress.total}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
              {Math.round((analyzeProgress.current / analyzeProgress.total) * 100)}%
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(analyzeProgress.current / analyzeProgress.total) * 100}%`,
              background: 'var(--brand)', borderRadius: 99,
              transition: 'width 0.4s var(--ease-decel)',
            }} />
          </div>
        </div>
      )}

      {analyzeError && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {analyzeError}
          <button onClick={() => setAnalyzeError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'flex' }}><X size={12} /></button>
        </div>
      )}

      {/* ── FILTER BAR ── */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Select all */}
          <button
            onClick={() => toggleSelectAll(sorted)}
            style={{
              background: allVisibleSelected ? 'var(--accent-12)' : 'transparent',
              border: `1px solid ${allVisibleSelected ? 'var(--brand)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', padding: '5px 10px', cursor: 'pointer',
              color: allVisibleSelected ? 'var(--brand)' : 'var(--text-4)',
              fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
            }}
          >
            <Check size={11} /> {allVisibleSelected ? 'Desmarcar' : 'Selec. tudo'}
          </button>

          <div style={{ width: 1, height: 18, background: 'var(--border-2)' }} />

          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, color: 'var(--text-4)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="form-input"
              style={{ paddingLeft: 30, paddingRight: search ? 28 : 12, width: 180, fontSize: 12, padding: '6px 12px 6px 30px' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={10} />
              </button>
            )}
          </div>

          {/* Label filters */}
          {([
            { key: 'all', label: 'Todos', count: products.length },
            { key: 'forte', label: 'Forte', count: stats.forte },
            { key: 'medio', label: 'Médio', count: stats.medio },
            { key: 'fraco', label: 'Fraco', count: stats.fraco },
            { key: 'error', label: 'Erros', count: stats.error },
          ] as const).map(({ key, label, count }) => {
            const isActive = filter === key
            const color = key === 'forte' ? 'var(--success)' : key === 'medio' ? 'var(--warning)' : (key === 'fraco' || key === 'error') ? 'var(--error)' : 'var(--brand)'
            return (
              <button key={key} onClick={() => setFilter(key)} style={{
                background: isActive ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.18)'}`,
                borderRadius: 'var(--radius-full)', padding: '4px 12px', cursor: 'pointer',
                color: isActive ? color : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                transition: 'border-color 0.15s, color 0.15s',
              }}>
                {label}
                <span style={{ background: 'var(--surface-3)', borderRadius: 99, padding: '0 5px', fontSize: 9, color: 'var(--text-4)' }}>{count}</span>
              </button>
            )
          })}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setDateFilter(e.target.value || dateTo ? 'custom' : 'all') }}
                className="form-input"
                style={{ padding: '5px 8px', fontSize: 12, height: 30, width: 130 }}
              />
              <span style={{ color: 'var(--text-4)', fontSize: 12 }}>—</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setDateFilter(dateFrom || e.target.value ? 'custom' : 'all') }}
                className="form-input"
                style={{ padding: '5px 8px', fontSize: 12, height: 30, width: 130 }}
              />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); setDateFilter('all') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', fontSize: 14, padding: '0 2px' }}>✕</button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={selectStyle}>
                <option value="score">Score ↓</option>
                <option value="date">Mais recente</option>
                <option value="price">Menor preço</option>
                <option value="orders">Mais pedidos</option>
              </select>
              <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── URL INPUT MODAL ── */}
      {showInput && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) { setShowInput(false); setInput('') } }}>
          <div className="modal" style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-alt)', fontSize: 24, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
                  Analisar Produtos
                </h2>
                <p style={{ color: 'var(--text-4)', fontSize: 10, marginTop: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Cole os links do AliExpress, um por linha
                </p>
              </div>
              <button onClick={() => { setShowInput(false); setInput('') }} className="btn btn-ghost" style={{ padding: '4px 6px' }}>
                <X size={16} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'https://www.aliexpress.com/item/...\nhttps://www.aliexpress.com/item/...'}
              rows={8}
              autoFocus
              className="form-input"
              style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowInput(false); setInput('') }} className="btn btn-secondary">Cancelar</button>
              <button onClick={handleAnalyze} disabled={!input.trim() || analyzing} className="btn btn-primary">
                Analisar {input.trim().split('\n').filter(Boolean).length > 0 && `(${input.trim().split('\n').filter(Boolean).length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-2)', borderRadius: 'var(--radius-xl)', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {products.length === 0 ? 'Nenhum produto. Clique em "Analisar URLs" para começar.' : `Nenhum produto neste filtro${search ? ` para "${search}"` : ''}.`}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {sorted.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              selected={selectedIds.has(p.id)}
              onToggleSelect={e => toggleSelect(e, p.id)}
              onClick={() => handleCardClick(p)}
              isPromoted={promotedIds.has(p.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* List header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '32px 56px 48px 1fr 96px 80px 80px 80px 90px',
            gap: 10, padding: '10px 14px',
            borderBottom: '1px solid var(--border-2)',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--text-4)', letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            <span /><span>Score</span><span /><span>Produto</span>
            <span>Preço</span><span>Pedidos</span><span>Rating</span><span>Label</span><span>Data</span>
          </div>
          {sorted.map(p => (
            <ListRow
              key={p.id}
              product={p}
              selected={selectedIds.has(p.id)}
              onToggleSelect={e => toggleSelect(e, p.id)}
              onClick={() => handleCardClick(p)}
            />
          ))}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <DetailModal
          product={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onImageSubmit={handleImageSubmit}
          isPromoted={promotedIds.has(selected.id)}
          onPromote={handlePromote}
        />
      )}

      {/* ── BULK ACTION BAR ── */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onDelete={handleDeleteSelected}
          onExport={() => exportCSV(products.filter(p => selectedIds.has(p.id)))}
          onRefetch={() => handleRefetch(products.filter(p => selectedIds.has(p.id)))}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

      {/* ── CONFIRM MODAL ── */}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          body={confirmAction.body}
          confirmLabel="Remover"
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bulkIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  )
}

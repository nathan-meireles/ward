'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trash2, ExternalLink, Loader2, Plus, RefreshCw, ImagePlus, X, ChevronDown, LayoutGrid, List, Search, Download, Tag } from 'lucide-react'

// ─── CLIENT-SIDE ALIEXPRESS PARSER ────────────────────────────────────────────
const CF_WORKER = 'https://ali-proxy.nathan-meireles.workers.dev'

function clientExtractProductId(url: string): string | null {
  const m = url.match(/\/item\/(\d+)/)
  return m ? m[1] : null
}

function clientExtractTitle(html: string): string | null {
  const og = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
  if (og) return og[1].replace(/\s*[-|].*AliExpress.*$/i, '').trim()
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return t ? t[1].replace(/\s*[-|].*$/, '').trim() : null
}

function clientExtractImages(html: string): string[] {
  const images: string[] = []
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
  if (og) images.push(og[1].split('?')[0])
  const re = /"(https:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const u = m[1].split('?')[0]
    if (!images.includes(u)) images.push(u)
    if (images.length >= 6) break
  }
  return images
}

function clientExtractPrice(html: string): { min: number | null; max: number | null } {
  const r = html.match(/"minPrice"\s*:\s*"?([0-9.]+)"?[^}]{0,200}"maxPrice"\s*:\s*"?([0-9.]+)"?/)
  if (r) return { min: parseFloat(r[1]), max: parseFloat(r[2]) }
  const sale = html.match(/"salePrice"\s*:\s*"[^0-9]*([0-9]+[.,][0-9]+)"/)
  if (sale) { const v = parseFloat(sale[1].replace(',', '.')); return { min: v, max: v } }
  const a = html.match(/"formatedActivityPrice"\s*:\s*"([^"]+)"/)
  if (a) {
    const nums = a[1].match(/[0-9]+[.,][0-9]+/g)
    if (nums) {
      const prices = nums.map(n => parseFloat(n.replace(',', '.')))
      return { min: Math.min(...prices), max: Math.max(...prices) }
    }
  }
  const generic = html.match(/"price"\s*:\s*"[^0-9]*([0-9]+[.,][0-9]+)"/)
  if (generic) { const v = parseFloat(generic[1].replace(',', '.')); return { min: v, max: v } }
  return { min: null, max: null }
}

function clientExtractOrders(html: string): string | null {
  const patterns = [
    /"formatTradeCount"\s*:\s*"([^"]+)"/,
    /"tradeCount"\s*:\s*"?(\d+)"?/,
    /"soldCount"\s*:\s*"?(\d+)"?/,
    /"totalOrders"\s*:\s*"?(\d+)"?/,
    /(\d[\d,]+)\s*(?:sold|orders|vendidos)/i,
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return m[1]
  }
  return null
}

function clientExtractRating(html: string) {
  const rPatterns = [/"averageStar"\s*:\s*"?([0-9.]+)"?/, /"rating"\s*:\s*"?([0-9.]+)"?/, /"starRating"\s*:\s*"?([0-9.]+)"?/]
  const cPatterns = [/"totalValidNum"\s*:\s*"?(\d+)"?/, /"reviewCount"\s*:\s*"?(\d+)"?/, /"evaluateCount"\s*:\s*"?(\d+)"?/]
  let rating = null, reviewCount = null
  for (const p of rPatterns) { const m = html.match(p); if (m) { rating = parseFloat(m[1]); break } }
  for (const p of cPatterns) { const m = html.match(p); if (m) { reviewCount = parseInt(m[1]); break } }
  return { rating, reviewCount }
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

function labelBg(label: string | null) {
  if (label === 'forte') return 'rgba(74,222,128,0.10)'
  if (label === 'medio') return 'rgba(251,191,36,0.10)'
  if (label === 'fraco') return 'rgba(248,113,113,0.10)'
  return 'var(--accent-05)'
}

function labelBadgeClass(label: string | null) {
  if (label === 'forte') return 'badge badge-success'
  if (label === 'medio') return 'badge badge-warning'
  if (label === 'fraco') return 'badge badge-error'
  return 'badge badge-neutral'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function formatPrice(min: number | null, max: number | null): string | null {
  if (!min && !max) return null
  if (!max || min === max) return `€${(min ?? max)!.toFixed(2)}`
  return `€${min!.toFixed(2)}–${max!.toFixed(2)}`
}

function cleanTitle(title: string | null, fallback: string): string {
  if (!title) return fallback
  if (/^\d{10,}$/.test(title.trim())) return fallback
  return title
}

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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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

  return (
    <div style={{ display: 'flex', gap: 1, marginBottom: 24, background: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {[
        { label: 'TOTAL', value: String(products.length), color: 'var(--text)' },
        { label: 'SCORE MÉDIO', value: avg !== null ? String(avg) : '—', color: avg !== null ? scoreColor(avg) : 'var(--text-4)' },
        { label: 'FORTE', value: String(forte), color: 'var(--success)' },
        { label: 'MÉDIO', value: String(medio), color: 'var(--warning)' },
        { label: 'FRACO', value: String(fraco), color: 'var(--error)' },
        { label: 'ERROS', value: String(errors), color: errors > 0 ? 'var(--error)' : 'var(--text-4)' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ flex: 1, background: 'var(--surface)', padding: '12px 16px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

function DetailPanel({ product, onClose, onDelete, onImageSubmit }: {
  product: Product
  onClose: () => void
  onDelete: (id: string) => void
  onImageSubmit: (id: string, url: string) => Promise<void>
}) {
  const [imgInput, setImgInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imgErr, setImgErr] = useState(false)

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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,10,0.65)' }} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: 440, maxWidth: '100vw',
        background: 'var(--surface-panel)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'var(--surface-panel)', zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status={product.status} />
            {product.notreglr_label && (
              <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
            )}
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div style={{ background: 'var(--surface-2)', aspectRatio: '1', position: 'relative', flexShrink: 0 }}>
          {product.images?.[0] && !imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title ?? ''}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
              <span style={{ color: 'var(--text-4)', fontSize: 12 }}>Sem imagem</span>
              <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                <input
                  value={imgInput}
                  onChange={e => setImgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleImg()}
                  placeholder="Cole URL da imagem do AliExpress"
                  className="form-input"
                  style={{ flex: 1, fontSize: 11 }}
                />
                <button onClick={handleImg} disabled={submitting || !imgInput.trim()} className="btn btn-primary" style={{ flexShrink: 0 }}>
                  {submitting ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : 'OK'}
                </button>
              </div>
            </div>
          )}
          {/* Score overlay */}
          {product.notreglr_score !== null && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: labelBg(product.notreglr_label),
              border: `1px solid ${scoreColor(product.notreglr_score)}`,
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              display: 'flex', alignItems: 'baseline', gap: 6,
            }}>
              <span style={{ fontWeight: 900, fontSize: 32, color: scoreColor(product.notreglr_score), lineHeight: 1 }}>
                {product.notreglr_score}
              </span>
              <span style={{ fontSize: 11, color: scoreColor(product.notreglr_score), fontFamily: 'var(--font-mono)' }}>
                /100
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>
            {cleanTitle(product.title, `Produto AliExpress #${product.aliexpress_id}`)}
          </h3>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {[
              { label: 'PREÇO', value: formatPrice(product.price_min, product.price_max) ?? '—', color: 'var(--brand)' },
              { label: 'PEDIDOS', value: product.orders_count ?? '—', color: 'var(--text-2)' },
              { label: 'PRAZO EU', value: '15–25 dias', color: 'var(--text-3)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--surface-2)', padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Rating + reviews */}
          {(product.rating || product.review_count) && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {product.rating && (
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--warning)' }}>★ {product.rating.toFixed(1)}</span>
              )}
              {product.review_count && (
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {product.review_count.toLocaleString('pt-BR')} avaliações
                </span>
              )}
            </div>
          )}

          {/* Analysis */}
          {product.notreglr_reasoning && (
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', marginBottom: 8, letterSpacing: 0.6, fontFamily: 'var(--font-mono)' }}>ANÁLISE NOTREGLR</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
                {product.notreglr_reasoning}
              </p>
            </div>
          )}

          {/* Visual traits */}
          {product.notreglr_visual_traits && product.notreglr_visual_traits.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: 'var(--text-4)', marginBottom: 8, letterSpacing: 0.6, fontFamily: 'var(--font-mono)' }}>CARACTERÍSTICAS VISUAIS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.notreglr_visual_traits.map((t, i) => (
                  <span key={i} className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={8} /> {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {product.error_msg && (
            <p style={{ fontSize: 11, color: 'var(--error)', margin: 0, background: 'rgba(248,113,113,0.08)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
              {product.error_msg}
            </p>
          )}

          {/* Date */}
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
            Adicionado em {formatDate(product.created_at)}
          </span>

          {/* Actions */}
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
              style={{ color: 'var(--error)', borderColor: 'rgba(248,113,113,0.3)' }}
            >
              <Trash2 size={12} /> Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const mainImg = product.images?.[0]
  const isAnalyzing = product.status === 'analyzing'

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        border: `1px solid ${product.notreglr_score !== null ? scoreColor(product.notreglr_score) + '30' : 'var(--border)'}`,
        transition: 'transform 0.1s, box-shadow 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Score strip — sempre presente, define layout uniforme */}
      <div style={{
        padding: '7px 12px',
        background: product.notreglr_label ? labelBg(product.notreglr_label) : isAnalyzing ? 'var(--accent-05)' : 'var(--surface-2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 36,
        flexShrink: 0,
      }}>
        {product.notreglr_label ? (
          <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
        ) : (
          <StatusDot status={product.status} />
        )}
        <span style={{ fontWeight: 900, fontSize: 20, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -0.5, display: 'flex', alignItems: 'center' }}>
          {isAnalyzing
            ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }} />
            : (product.notreglr_score ?? '—')}
        </span>
      </div>

      {/* Image — 1:1 */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)', overflow: 'hidden', flexShrink: 0 }}>
        {mainImg && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImg}
            alt={product.title ?? ''}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
            <ImagePlus size={18} style={{ color: 'var(--text-4)' }} />
            <span style={{ color: 'var(--text-4)', fontSize: 10 }}>Sem imagem</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <p style={{
          fontSize: 12, color: 'var(--text-2)', lineHeight: 1.35, margin: 0,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: '2.7em',
        }}>
          {cleanTitle(product.title, 'Produto AliExpress')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
          {(product.price_min || product.price_max) && (
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>
              {formatPrice(product.price_min, product.price_max)}
            </span>
          )}
          {product.rating && (
            <span style={{ fontSize: 10, color: 'var(--warning)' }}>★{product.rating.toFixed(1)}</span>
          )}
          {product.review_count && (
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>({product.review_count.toLocaleString('pt-BR')})</span>
          )}
          {product.orders_count && !product.review_count && (
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{product.orders_count} vendas</span>
          )}
        </div>

        <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
          {formatDate(product.created_at)}
        </span>
      </div>
    </div>
  )
}

// ─── LIST ROW (componente separado para evitar useState em .map) ───────────────

function ListRow({ product, onClick }: { product: Product; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 44px 1fr 90px 80px 80px 80px 90px',
        gap: 12, padding: '8px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        alignItems: 'center',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
    >
      <span style={{ fontWeight: 800, fontSize: 20, color: scoreColor(product.notreglr_score), lineHeight: 1, letterSpacing: -0.5 }}>
        {product.notreglr_score ?? '—'}
      </span>
      <div style={{ width: 36, height: 36, borderRadius: 4, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
        {product.images?.[0] && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {cleanTitle(product.title, 'Produto AliExpress')}
      </span>
      <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>
        {formatPrice(product.price_min, product.price_max) ?? '—'}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{product.orders_count ?? '—'}</span>
      <span style={{ fontSize: 11, color: product.rating ? 'var(--warning)' : 'var(--text-4)' }}>
        {product.rating ? `★ ${product.rating.toFixed(1)}` : '—'}
      </span>
      {product.notreglr_label ? (
        <span className={labelBadgeClass(product.notreglr_label)}>{product.notreglr_label}</span>
      ) : (
        <StatusDot status={product.status} />
      )}
      <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{formatDate(product.created_at)}</span>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

type SortKey = 'score' | 'date' | 'price' | 'orders'
type FilterKey = 'all' | 'forte' | 'medio' | 'fraco' | 'error'
type DateFilter = 'all' | 'today' | '7d' | '30d'

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

  const load = useCallback(async () => {
    const res = await fetch('/api/mineracao')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

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
          const targetUrl = `https://www.aliexpress.com/item/${productId}.html`
          const proxyUrl = `${CF_WORKER}?url=${encodeURIComponent(targetUrl)}`
          const html = await fetch(proxyUrl).then(r => r.text())

          if (html.length > 5000) {
            payload = {
              ...payload,
              title: clientExtractTitle(html),
              images: clientExtractImages(html),
              ...clientExtractPrice(html),
              orders_count: clientExtractOrders(html),
              ...clientExtractRating(html),
            }
          } else {
            payload.fetchError = `HTML muito curto (${html.length} chars)`
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
    await fetch('/api/mineracao', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  async function handleDeleteErrors() {
    const errors = products.filter(p => p.status === 'error')
    await Promise.all(errors.map(p =>
      fetch('/api/mineracao', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id }),
      })
    ))
    setProducts(prev => prev.filter(p => p.status !== 'error'))
  }

  async function handleDeleteAll() {
    if (!confirm(`Remover todos os ${products.length} produtos?`)) return
    await Promise.all(products.map(p =>
      fetch('/api/mineracao', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id }),
      })
    ))
    setProducts([])
    setSelected(null)
  }

  async function handleImageSubmit(id: string, imageUrl: string) {
    await fetch('/api/mineracao/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, imageUrl }),
    })
    await load()
  }

  function handleExportCSV() {
    const headers = ['ID AliExpress', 'Título', 'Score', 'Label', 'Preço Min (€)', 'Preço Max (€)', 'Pedidos', 'Rating', 'Reviews', 'Traits', 'URL', 'Data']
    const rows = products.map(p => [
      p.aliexpress_id ?? '',
      (p.title ?? '').replace(/,/g, ';'),
      p.notreglr_score ?? '',
      p.notreglr_label ?? '',
      p.price_min ?? '',
      p.price_max ?? '',
      p.orders_count ?? '',
      p.rating ?? '',
      p.review_count ?? '',
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

  // Filtering
  const now = new Date()
  const filtered = products.filter(p => {
    if (filter === 'error' && p.status !== 'error') return false
    if (filter !== 'all' && filter !== 'error' && p.notreglr_label !== filter) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.title?.toLowerCase().includes(q) && !p.aliexpress_id?.includes(q)) return false
    }

    if (dateFilter !== 'all') {
      const diffDays = (now.getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
      if (dateFilter === 'today' && diffDays > 1) return false
      if (dateFilter === '7d' && diffDays > 7) return false
      if (dateFilter === '30d' && diffDays > 30) return false
    }

    return true
  })

  // Sorting
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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Mineração</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>
            {products.length} produto{products.length !== 1 ? 's' : ''} · análise visual via Claude Vision
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {(['grid', 'list'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                background: viewMode === mode ? 'var(--surface-2)' : 'none',
                border: 'none', cursor: 'pointer',
                color: viewMode === mode ? 'var(--text)' : 'var(--text-4)',
                padding: '7px 10px', display: 'flex', alignItems: 'center',
              }}>
                {mode === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>

          {products.length > 0 && (
            <button onClick={handleExportCSV} className="btn btn-ghost" title="Exportar CSV">
              <Download size={14} />
            </button>
          )}
          {stats.error > 0 && (
            <button onClick={handleDeleteErrors} className="btn btn-ghost" style={{ color: 'var(--error)', borderColor: 'rgba(248,113,113,0.3)' }}>
              <Trash2 size={12} /> Erros ({stats.error})
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
          <button
            onClick={() => !analyzing && setShowInput(true)}
            disabled={analyzing}
            className="btn btn-primary"
          >
            {analyzing && analyzeProgress
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {analyzeProgress.current}/{analyzeProgress.total}</>
              : <><Plus size={14} /> Analisar URLs</>
            }
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar products={products} />

      {/* Progress bar */}
      {analyzing && analyzeProgress && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Analisando {analyzeProgress.current} de {analyzeProgress.total}...
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
              {Math.round((analyzeProgress.current / analyzeProgress.total) * 100)}%
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(analyzeProgress.current / analyzeProgress.total) * 100}%`,
              background: 'var(--brand)',
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}

      {/* Error banner */}
      {analyzeError && (
        <div style={{
          marginBottom: 16, padding: '10px 14px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--error)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {analyzeError}
          <button onClick={() => setAnalyzeError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'flex', alignItems: 'center' }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Filters bar */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, color: 'var(--text-4)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                fontSize: 12, padding: '6px 28px 6px 28px',
                fontFamily: 'var(--font)', outline: 'none', width: 180,
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', alignItems: 'center' }}>
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
            { key: 'error', label: 'Erro', count: stats.error },
          ] as const).map(({ key, label, count }) => {
            const color = key === 'forte' ? 'var(--success)' : key === 'medio' ? 'var(--warning)' : key === 'fraco' ? 'var(--error)' : key === 'error' ? 'var(--text-4)' : 'var(--brand)'
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  background: filter === key ? 'var(--surface-2)' : 'transparent',
                  border: `1px solid ${filter === key ? color : 'var(--border)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px', cursor: 'pointer',
                  color: filter === key ? color : 'var(--text-3)',
                  fontSize: 12, fontWeight: filter === key ? 600 : 400,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: 'var(--font)',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
              >
                {label}
                <span style={{ background: 'var(--surface-3)', borderRadius: 99, padding: '0 5px', fontSize: 10, color: 'var(--text-4)' }}>
                  {count}
                </span>
              </button>
            )
          })}

          {/* Date + Sort — right aligned */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value as DateFilter)}
                style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-3)',
                  fontSize: 12, padding: '6px 24px 6px 10px',
                  cursor: 'pointer', outline: 'none', appearance: 'none',
                  fontFamily: 'var(--font)',
                }}
              >
                <option value="all">Todas as datas</option>
                <option value="today">Hoje</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
              </select>
              <ChevronDown size={11} style={{ position: 'absolute', right: 7, color: 'var(--text-4)', pointerEvents: 'none' }} />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-3)',
                  fontSize: 12, padding: '6px 24px 6px 10px',
                  cursor: 'pointer', outline: 'none', appearance: 'none',
                  fontFamily: 'var(--font)',
                }}
              >
                <option value="score">Score ↓</option>
                <option value="date">Mais recente</option>
                <option value="price">Menor preço</option>
                <option value="orders">Mais pedidos</option>
              </select>
              <ChevronDown size={11} style={{ position: 'absolute', right: 7, color: 'var(--text-4)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* Input modal */}
      {showInput && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(9,9,10,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24, width: '100%', maxWidth: 560,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
              Analisar Produtos
            </h2>
            <p style={{ color: 'var(--text-4)', fontSize: 12, margin: '0 0 16px' }}>
              Cole os links do AliExpress, um por linha.
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'https://www.aliexpress.com/item/...\nhttps://www.aliexpress.com/item/...'}
              rows={8}
              autoFocus
              className="form-input"
              style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowInput(false); setInput('') }} className="btn btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!input.trim() || analyzing}
                className="btn btn-primary"
              >
                Analisar {input.trim().split('\n').filter(Boolean).length > 0 && `(${input.trim().split('\n').filter(Boolean).length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : sorted.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)',
          padding: 60, textAlign: 'center', color: 'var(--text-4)', fontSize: 13,
        }}>
          {products.length === 0
            ? 'Nenhum produto ainda. Clique em "Analisar URLs" para começar.'
            : `Nenhum produto neste filtro${search ? ` para "${search}"` : ''}.`}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 14,
          alignItems: 'start',
        }}>
          {sorted.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 44px 1fr 90px 80px 80px 80px 90px',
            gap: 12, padding: '6px 12px',
            fontSize: 10, color: 'var(--text-4)', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
          }}>
            <span>Score</span><span></span><span>Produto</span>
            <span>Preço</span><span>Pedidos</span><span>Rating</span>
            <span>Label</span><span>Data</span>
          </div>
          {sorted.map(p => <ListRow key={p.id} product={p} onClick={() => setSelected(p)} />)}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          product={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onImageSubmit={handleImageSubmit}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

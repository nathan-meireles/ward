'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trash2, ExternalLink, Loader2, Plus, RefreshCw, ImagePlus, X, ChevronDown, LayoutGrid, List } from 'lucide-react'

// ─── CLIENT-SIDE ALIEXPRESS PARSER ────────────────────────────────────────────
// Roda no browser do usuário (IP residencial) → não é bloqueado pelo AliExpress

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
  // Padrão desktop JSON
  const r = html.match(/"minPrice"\s*:\s*"?([0-9.]+)"?[^}]{0,200}"maxPrice"\s*:\s*"?([0-9.]+)"?/)
  if (r) return { min: parseFloat(r[1]), max: parseFloat(r[2]) }
  // Padrão mobile: "salePrice":"US $12.34" ou "originalPrice"
  const sale = html.match(/"salePrice"\s*:\s*"[^0-9]*([0-9]+[.,][0-9]+)"/)
  if (sale) { const v = parseFloat(sale[1].replace(',', '.')); return { min: v, max: v } }
  // Padrão com formatedActivityPrice
  const a = html.match(/"formatedActivityPrice"\s*:\s*"([^"]+)"/)
  if (a) {
    const nums = a[1].match(/[0-9]+[.,][0-9]+/g)
    if (nums) {
      const prices = nums.map(n => parseFloat(n.replace(',', '.')))
      return { min: Math.min(...prices), max: Math.max(...prices) }
    }
  }
  // Padrão genérico: qualquer "price" com valor numérico
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
  status: string
  error_msg: string | null
  created_at: string
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scoreColor(score: number | null) {
  if (score === null) return 'var(--text-4)'
  if (score >= 70) return '#4ade80'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}

function labelBg(label: string | null) {
  if (label === 'forte') return 'rgba(74,222,128,0.18)'
  if (label === 'medio') return 'rgba(251,191,36,0.18)'
  if (label === 'fraco') return 'rgba(248,113,113,0.18)'
  return 'rgba(255,255,255,0.06)'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'var(--text-4)', analyzing: '#60a5fa', done: '#4ade80',
    partial: '#fbbf24', error: '#f87171',
  }
  const labels: Record<string, string> = {
    pending: 'Pendente', analyzing: 'Analisando', done: 'Concluído',
    partial: 'Parcial', error: 'Erro',
  }
  const color = colors[status] ?? colors.pending
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: 0.4 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {labels[status] ?? status}
    </span>
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,10,0.6)' }}
      />
      {/* panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: 420, maxWidth: '100vw',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2,
        }}>
          <StatusDot status={product.status} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div style={{ background: 'var(--surface-2)', aspectRatio: '1', position: 'relative' }}>
          {product.images?.[0] && !imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title ?? ''}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ color: 'var(--text-4)', fontSize: 12 }}>Sem imagem</span>
              <div style={{ display: 'flex', gap: 6, width: '80%' }}>
                <input
                  value={imgInput}
                  onChange={e => setImgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleImg()}
                  placeholder="Cole URL da imagem do AliExpress"
                  style={{
                    flex: 1, fontSize: 11, padding: '6px 10px',
                    background: 'var(--surface-3)', border: '1px solid var(--border-input)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text)', outline: 'none',
                  }}
                />
                <button
                  onClick={handleImg}
                  disabled={submitting || !imgInput.trim()}
                  style={{
                    background: 'var(--brand)', color: 'var(--bg)', border: 'none',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: '6px 10px',
                    fontWeight: 600, fontSize: 11,
                    opacity: submitting || !imgInput.trim() ? 0.5 : 1,
                  }}
                >
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
              padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontWeight: 800, fontSize: 22, color: scoreColor(product.notreglr_score), lineHeight: 1 }}>
                {product.notreglr_score}
              </span>
              <span style={{ fontSize: 10, color: scoreColor(product.notreglr_score), textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {product.notreglr_label}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>
            {product.title ?? `Produto ${product.aliexpress_id}`}
          </h3>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {(product.price_min || product.price_max) && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>PREÇO</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)' }}>
                  €{product.price_min?.toFixed(2)}{product.price_max && product.price_max !== product.price_min ? `–${product.price_max.toFixed(2)}` : ''}
                </div>
              </div>
            )}
            {product.orders_count && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>PEDIDOS</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>{product.orders_count}</div>
              </div>
            )}
            {product.rating && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>RATING</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>★ {product.rating.toFixed(1)}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>ADICIONADO</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{formatDate(product.created_at)}</div>
            </div>
          </div>

          {/* Reasoning */}
          {product.notreglr_reasoning && (
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 6, letterSpacing: 0.5 }}>ANÁLISE CLAUDE</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                {product.notreglr_reasoning}
              </p>
            </div>
          )}

          {/* Error */}
          {product.error_msg && (
            <p style={{ fontSize: 11, color: '#f87171', margin: 0, background: 'rgba(248,113,113,0.08)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
              {product.error_msg}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
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

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────────

function labelBadgeClass(label: string | null) {
  if (label === 'forte') return 'badge badge-success'
  if (label === 'medio') return 'badge badge-warning'
  if (label === 'fraco') return 'badge badge-error'
  return 'badge badge-neutral'
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const mainImg = product.images?.[0]
  const isAnalyzing = product.status === 'analyzing'

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        border: `1px solid ${product.notreglr_score !== null ? scoreColor(product.notreglr_score) + '40' : 'var(--border)'}`,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.1s, box-shadow 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)' }}>
        {isAnalyzing && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(9,9,10,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
          }}>
            <Loader2 size={20} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>Analisando...</span>
          </div>
        )}
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
            {!isAnalyzing && (
              <>
                <ImagePlus size={18} style={{ color: 'var(--text-4)' }} />
                <span style={{ color: 'var(--text-4)', fontSize: 10 }}>Sem imagem</span>
              </>
            )}
          </div>
        )}

        {/* Score badge */}
        {product.notreglr_score !== null && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: labelBg(product.notreglr_label),
            border: `1px solid ${scoreColor(product.notreglr_score)}`,
            borderRadius: 'var(--radius-sm)',
            padding: '2px 8px',
            display: 'flex', alignItems: 'baseline', gap: 4,
          }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: scoreColor(product.notreglr_score), lineHeight: 1.2 }}>
              {product.notreglr_score}
            </span>
          </div>
        )}

        {/* Status dot (só se não tiver score) */}
        {product.notreglr_score === null && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <StatusDot status={product.status} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <p style={{
          fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          margin: 0,
        }}>
          {product.title ?? product.aliexpress_id ?? '—'}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
          {(product.price_min || product.price_max) && (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand)' }}>
              €{product.price_min?.toFixed(2)}{product.price_max && product.price_max !== product.price_min ? `–${product.price_max.toFixed(2)}` : ''}
            </span>
          )}
          {product.orders_count && (
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{product.orders_count} ped.</span>
          )}
          {product.rating && (
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>★{product.rating.toFixed(1)}</span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 'auto' }}>{formatDate(product.created_at)}</span>
        </div>

        {/* Label badge */}
        {product.notreglr_label && (
          <span className={labelBadgeClass(product.notreglr_label)} style={{ alignSelf: 'flex-start' }}>
            {product.notreglr_label}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

type SortKey = 'score' | 'date' | 'price' | 'orders'
type FilterKey = 'all' | 'forte' | 'medio' | 'fraco' | 'error'

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

  // Re-sync selected product
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
          // Fetch do browser (IP residencial → não bloqueado pelo AliExpress)
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

  // Filter
  const filtered = products.filter(p => {
    if (filter === 'all') return true
    if (filter === 'error') return p.status === 'error'
    return p.notreglr_label === filter
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'score') return (b.notreglr_score ?? -1) - (a.notreglr_score ?? -1)
    if (sort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sort === 'price') return (a.price_min ?? 999) - (b.price_min ?? 999)
    if (sort === 'orders') {
      const aOrders = parseInt(a.orders_count ?? '0')
      const bOrders = parseInt(b.orders_count ?? '0')
      return bOrders - aOrders
    }
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
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

          {/* Delete buttons */}
          {stats.error > 0 && (
            <button onClick={handleDeleteErrors} className="btn btn-ghost" style={{ color: 'var(--error)', borderColor: 'rgba(248,113,113,0.3)' }}>
              <Trash2 size={12} /> Limpar erros ({stats.error})
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

      {/* Progress bar */}
      {analyzing && analyzeProgress && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Analisando produto {analyzeProgress.current} de {analyzeProgress.total}...
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
              {Math.round((analyzeProgress.current / analyzeProgress.total) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
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

      {/* Error */}
      {analyzeError && (
        <div style={{
          marginBottom: 16, padding: '10px 14px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid #f87171',
          borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#f87171',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {analyzeError}
          <button onClick={() => setAnalyzeError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Filters + Sort */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {([
            { key: 'all', label: 'Todos', count: products.length },
            { key: 'forte', label: 'Forte', count: stats.forte },
            { key: 'medio', label: 'Médio', count: stats.medio },
            { key: 'fraco', label: 'Fraco', count: stats.fraco },
            { key: 'error', label: 'Erro', count: stats.error },
          ] as const).map(({ key, label, count }) => {
            const activeColor = key === 'forte' ? 'var(--success)' : key === 'medio' ? 'var(--warning)' : key === 'fraco' ? 'var(--error)' : key === 'error' ? 'var(--text-4)' : 'var(--brand)'
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  background: filter === key ? 'var(--surface-2)' : 'transparent',
                  border: `1px solid ${filter === key ? activeColor : 'var(--border)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px', cursor: 'pointer',
                  color: filter === key ? activeColor : 'var(--text-3)',
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

          {/* Sort */}
          <div style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-3)',
                fontSize: 12, padding: '6px 28px 6px 10px',
                cursor: 'pointer', outline: 'none', appearance: 'none',
                fontFamily: 'var(--font)',
              }}
            >
              <option value="score">Ordenar: Score</option>
              <option value="date">Ordenar: Data</option>
              <option value="price">Ordenar: Preço</option>
              <option value="orders">Ordenar: Pedidos</option>
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, color: 'var(--text-4)', pointerEvents: 'none' }} />
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
              <button
                onClick={() => { setShowInput(false); setInput('') }}
                className="btn btn-secondary"
              >
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

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : sorted.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
          padding: 60, textAlign: 'center', color: 'var(--text-4)', fontSize: 13,
        }}>
          {products.length === 0
            ? 'Nenhum produto ainda. Clique em "Analisar URLs" para começar.'
            : 'Nenhum produto neste filtro.'}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {sorted.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      ) : (
        /* List view */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* List header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 48px 1fr 80px 80px 60px 70px 90px',
            gap: 12, padding: '6px 12px',
            fontSize: 10, color: 'var(--text-4)', letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span>Score</span>
            <span></span>
            <span>Produto</span>
            <span>Preço</span>
            <span>Pedidos</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Data</span>
          </div>
          {sorted.map(p => {
            const [rowImgErr, setRowImgErr] = [false, () => {}]
            return (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 48px 1fr 80px 80px 60px 70px 90px',
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
                {/* Score */}
                <span style={{ fontWeight: 800, fontSize: 18, color: scoreColor(p.notreglr_score), lineHeight: 1 }}>
                  {p.notreglr_score ?? '—'}
                </span>
                {/* Thumb */}
                <div style={{ width: 36, height: 36, borderRadius: 4, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                </div>
                {/* Title */}
                <span style={{
                  fontSize: 12, color: 'var(--text-2)',
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>
                  {p.title ?? p.aliexpress_id ?? '—'}
                </span>
                {/* Price */}
                <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>
                  {p.price_min ? `€${p.price_min.toFixed(2)}` : '—'}
                </span>
                {/* Orders */}
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{p.orders_count ?? '—'}</span>
                {/* Rating */}
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{p.rating ? `★ ${p.rating.toFixed(1)}` : '—'}</span>
                {/* Status */}
                <StatusDot status={p.status} />
                {/* Date */}
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{formatDate(p.created_at)}</span>
              </div>
            )
          })}
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

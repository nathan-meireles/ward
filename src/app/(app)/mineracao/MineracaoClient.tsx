'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Trash2, ExternalLink, Loader2, Plus, RefreshCw } from 'lucide-react'

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
  if (label === 'forte') return 'rgba(74,222,128,0.15)'
  if (label === 'medio') return 'rgba(251,191,36,0.15)'
  return 'rgba(248,113,113,0.15)'
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pendente',   color: 'var(--text-4)' },
    analyzing: { label: 'Analisando', color: '#60a5fa' },
    done:      { label: 'Concluído',  color: '#4ade80' },
    partial:   { label: 'Parcial',    color: '#fbbf24' },
    error:     { label: 'Erro',       color: '#f87171' },
  }
  const s = map[status] ?? map.pending
  return (
    <span style={{
      fontSize: 10,
      color: s.color,
      border: `1px solid ${s.color}`,
      borderRadius: 'var(--radius-sm)',
      padding: '1px 6px',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  )
}

function ProductCard({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)
  const mainImg = product.images?.[0]
  const isAnalyzing = product.status === 'analyzing'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.15s',
      position: 'relative',
    }}>
      {/* Imagem */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)' }}>
        {isAnalyzing && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(9,9,10,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Loader2 size={24} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {mainImg && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImg}
            alt={product.title ?? ''}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-4)', fontSize: 11 }}>Sem imagem</span>
          </div>
        )}

        {/* Score badge */}
        {product.notreglr_score !== null && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: labelBg(product.notreglr_label),
            border: `1px solid ${scoreColor(product.notreglr_score)}`,
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: scoreColor(product.notreglr_score) }}>
              {product.notreglr_score}
            </span>
            <span style={{ fontSize: 9, color: scoreColor(product.notreglr_score), textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {product.notreglr_label}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Title + status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <p style={{
            fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            margin: 0, flex: 1,
          }}>
            {product.title ?? product.aliexpress_id ?? '—'}
          </p>
          <StatusBadge status={product.status} />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(product.price_min || product.price_max) && (
            <span style={{ fontSize: 11, color: 'var(--brand)' }}>
              €{product.price_min?.toFixed(2) ?? '?'}{product.price_max && product.price_max !== product.price_min ? `–${product.price_max?.toFixed(2)}` : ''}
            </span>
          )}
          {product.orders_count && (
            <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{product.orders_count} pedidos</span>
          )}
          {product.rating && (
            <span style={{ fontSize: 11, color: 'var(--text-4)' }}>★ {product.rating.toFixed(1)}</span>
          )}
        </div>

        {/* Reasoning */}
        {product.notreglr_reasoning && (
          <p style={{
            fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5, margin: 0,
            borderLeft: `2px solid ${scoreColor(product.notreglr_score)}`,
            paddingLeft: 8,
          }}>
            {product.notreglr_reasoning}
          </p>
        )}

        {product.error_msg && (
          <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>{product.error_msg}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
          <a
            href={product.aliexpress_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, color: 'var(--text-4)',
              textDecoration: 'none', padding: '4px 8px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              flex: 1, justifyContent: 'center',
            }}
          >
            <ExternalLink size={10} /> AliExpress
          </a>
          <button
            onClick={() => onDelete(product.id)}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--text-4)', padding: '4px 8px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function MineracaoClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [filter, setFilter] = useState<'all' | 'forte' | 'medio' | 'fraco'>('all')

  const load = useCallback(async () => {
    const res = await fetch('/api/mineracao')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Polling enquanto há produtos em análise
  useEffect(() => {
    const hasAnalyzing = products.some(p => p.status === 'analyzing' || p.status === 'pending')
    if (!hasAnalyzing) return
    const timer = setInterval(load, 3000)
    return () => clearInterval(timer)
  }, [products, load])

  const [analyzeProgress, setAnalyzeProgress] = useState<{ current: number; total: number } | null>(null)

  async function handleAnalyze() {
    const urls = input.split('\n').map(u => u.trim()).filter(Boolean)
    if (!urls.length) return
    setAnalyzing(true)
    setShowInput(false)
    setInput('')

    try {
      // Processa 1 URL por vez para evitar timeout do Vercel
      for (let i = 0; i < urls.length; i++) {
        setAnalyzeProgress({ current: i + 1, total: urls.length })
        await fetch('/api/mineracao/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [urls[i]] }),
        })
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

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.notreglr_label === filter)

  const stats = {
    forte: products.filter(p => p.notreglr_label === 'forte').length,
    medio: products.filter(p => p.notreglr_label === 'medio').length,
    fraco: products.filter(p => p.notreglr_label === 'fraco').length,
    pending: products.filter(p => !p.notreglr_label && p.status !== 'error').length,
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Mineração</h1>
          <p style={{ color: 'var(--text-4)', fontSize: 12, marginTop: 4 }}>
            Análise visual de produtos via Claude Vision — {products.length} produto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={load}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--text-3)', padding: '7px 10px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => !analyzing && setShowInput(true)}
            disabled={analyzing}
            style={{
              background: 'var(--brand)', color: 'var(--bg)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              padding: '8px 14px', cursor: analyzing ? 'default' : 'pointer',
              fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
              opacity: analyzing ? 0.7 : 1,
            }}
          >
            {analyzing && analyzeProgress ? (
              <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {analyzeProgress.current}/{analyzeProgress.total}</>
            ) : (
              <><Plus size={14} /> Analisar URLs</>
            )}
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

      {/* Stats */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Todos', count: products.length, color: 'var(--text-3)' },
            { key: 'forte', label: 'Forte', count: stats.forte, color: '#4ade80' },
            { key: 'medio', label: 'Médio', count: stats.medio, color: '#fbbf24' },
            { key: 'fraco', label: 'Fraco', count: stats.fraco, color: '#f87171' },
          ].map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              style={{
                background: filter === key ? 'var(--surface-2)' : 'none',
                border: `1px solid ${filter === key ? color : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '5px 12px', cursor: 'pointer',
                color: filter === key ? color : 'var(--text-4)',
                fontSize: 12, fontWeight: filter === key ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {label}
              <span style={{
                background: 'var(--surface-3)', borderRadius: 99,
                padding: '0 6px', fontSize: 10, color: 'var(--text-4)',
              }}>
                {count}
              </span>
            </button>
          ))}
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
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
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
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: 12,
                padding: '10px 12px', resize: 'vertical',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowInput(false); setInput('') }}
                style={{
                  background: 'none', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '8px 16px',
                  cursor: 'pointer', color: 'var(--text-3)', fontSize: 13,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!input.trim() || analyzing}
                style={{
                  background: 'var(--brand)', color: 'var(--bg)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  padding: '8px 20px', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13,
                  opacity: !input.trim() || analyzing ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {analyzing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
                Analisar
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
      ) : filtered.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          padding: 60,
          textAlign: 'center',
          color: 'var(--text-4)',
          fontSize: 13,
        }}>
          {products.length === 0
            ? 'Nenhum produto ainda. Clique em "Analisar URLs" para começar.'
            : 'Nenhum produto neste filtro.'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

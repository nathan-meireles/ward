'use client'

import { useEffect, useState, useCallback } from 'react'
import { extractMetaAdId, formatDate } from '@/lib/utils'
import { Bookmark, ExternalLink, Trash2, Plus, X, Loader2, RefreshCw } from 'lucide-react'

interface SwipeItem {
  id: string
  project_id: string
  source_type: 'meta_ad' | 'manual'
  meta_ad_id: string | null
  page_name: string | null
  page_url: string | null
  title: string | null
  body: string | null
  destination_domain: string | null
  snapshot_url: string | null
  platforms: string[]
  status: string | null
  days_running: number | null
  start_date: string | null
  tags: string[]
  notes: string | null
  created_at: string
}

const PROJECT_ID = 'notreglr'

const TAG_COLORS: Record<string, string> = {
  'copy-forte': '#e47c24',
  'hook': '#22c55e',
  'formato': '#3b82f6',
  'concorrente': '#a855f7',
  'referência': '#ec4899',
  'produto': '#f59e0b',
}

function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? '#8a7a6a'
}

export function SwipeClient() {
  const [items, setItems] = useState<SwipeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // Add form state
  const [showAdd, setShowAdd] = useState(false)
  const [inputUrl, setInputUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [preview, setPreview] = useState<Partial<SwipeItem> | null>(null)
  const [notes, setNotes] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  // Filter state
  const [filterTag, setFilterTag] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  // Modal
  const [selected, setSelected] = useState<SwipeItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/swipe?project_id=${PROJECT_ID}`)
      if (!res.ok) throw new Error('Erro ao carregar')
      setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleFetchAd() {
    setFetchError('')
    setPreview(null)
    const id = extractMetaAdId(inputUrl)
    if (!id) {
      setFetchError('URL inválida. Use: https://www.facebook.com/ads/library/?id=XXXX')
      return
    }
    setFetching(true)
    try {
      const res = await fetch(`/api/meta/ad?id=${id}`)
      if (!res.ok) {
        const d = await res.json()
        setFetchError(d.error ?? 'Não encontrado')
        return
      }
      const data = await res.json()
      setPreview({ ...data, meta_ad_id: id, source_type: 'meta_ad' as const })
    } catch {
      setFetchError('Erro ao buscar. Verifique o token Meta.')
    } finally {
      setFetching(false)
    }
  }

  async function handleSave() {
    if (!preview) return
    setAdding(true)
    try {
      const payload = {
        project_id: PROJECT_ID,
        source_type: preview.source_type ?? 'meta_ad',
        meta_ad_id: preview.meta_ad_id ?? null,
        page_name: preview.page_name ?? null,
        page_url: preview.page_url ?? null,
        title: preview.title ?? null,
        body: preview.body ?? null,
        destination_domain: preview.destination_domain ?? null,
        snapshot_url: preview.snapshot_url ?? null,
        platforms: preview.platforms ?? [],
        status: preview.status ?? null,
        days_running: preview.days_running ?? null,
        start_date: preview.start_date ?? null,
        tags,
        notes: notes.trim() || null,
      }
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        setFetchError(d.error ?? 'Erro ao salvar')
        return
      }
      setShowAdd(false)
      setInputUrl('')
      setPreview(null)
      setNotes('')
      setTags([])
      await load()
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este item do swipe file?')) return
    await fetch(`/api/swipe?id=${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  // All tags from saved items
  const allTags = Array.from(new Set(items.flatMap((i) => i.tags)))

  const filtered = items.filter((item) => {
    if (filterTag && !item.tags.includes(filterTag)) return false
    if (filterStatus && item.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !item.page_name?.toLowerCase().includes(q) &&
        !item.title?.toLowerCase().includes(q) &&
        !item.body?.toLowerCase().includes(q) &&
        !item.destination_domain?.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Swipe File</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>
            {items.length} anúncios salvos
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={load}
            style={btnStyle('secondary')}
            title="Recarregar"
          >
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowAdd(true)} style={btnStyle('primary')}>
            <Plus size={15} /> Adicionar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle({ width: 200 })}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle({ width: 140 })}>
          <option value="">Todos status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                border: `1px solid ${filterTag === tag ? tagColor(tag) : 'var(--border)'}`,
                background: filterTag === tag ? tagColor(tag) + '20' : 'transparent',
                color: filterTag === tag ? tagColor(tag) : 'var(--text-3)',
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', padding: 40 }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Carregando...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
          <Bookmark size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            {items.length === 0 ? 'Nenhum anúncio salvo ainda' : 'Nenhum resultado'}
          </p>
          <p style={{ fontSize: 13 }}>Cole uma URL da Meta Ad Library para começar.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((item) => (
            <SwipeCard
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setPreview(null); setFetchError(''); setInputUrl('') }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Adicionar ao Swipe File
          </h2>

          {/* URL input */}
          <label style={labelStyle()}>URL do Anúncio (Meta Ad Library)</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchAd()}
              placeholder="https://www.facebook.com/ads/library/?id=..."
              style={inputStyle({ flex: '1' })}
            />
            <button
              onClick={handleFetchAd}
              disabled={fetching || !inputUrl.trim()}
              style={btnStyle('primary')}
            >
              {fetching ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Buscar'}
            </button>
          </div>
          {fetchError && (
            <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{fetchError}</p>
          )}

          {/* Preview */}
          {preview && (
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{preview.page_name}</p>
                  {preview.destination_domain && (
                    <p style={{ fontSize: 12, color: 'var(--brand)' }}>{preview.destination_domain}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <StatusBadge status={preview.status ?? ''} />
                  {preview.days_running != null && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{preview.days_running}d no ar</span>
                  )}
                </div>
              </div>
              {preview.title && <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{preview.title}</p>}
              {preview.body && (
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 8 }}>
                  {preview.body.slice(0, 200)}{preview.body.length > 200 ? '…' : ''}
                </p>
              )}
              {preview.platforms && preview.platforms.length > 0 && (
                <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{preview.platforms.join(' · ')}</p>
              )}
            </div>
          )}

          {/* Tags */}
          <label style={labelStyle()}>Tags</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
              placeholder="hook, copy-forte, concorrente..."
              style={inputStyle({ flex: '1', marginBottom: 0 })}
            />
            <button onClick={addTag} style={{ ...btnStyle('secondary'), padding: '8px 12px', flexShrink: 0 }}>+</button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 20,
                    fontSize: 12,
                    background: tagColor(tag) + '20',
                    color: tagColor(tag),
                    border: `1px solid ${tagColor(tag)}40`,
                  }}
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1, padding: 0 }}
                  >×</button>
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          <label style={labelStyle()}>Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="O que chamou atenção neste anúncio?"
            rows={3}
            style={{ ...inputStyle({}), resize: 'vertical' as const }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowAdd(false); setPreview(null); setFetchError(''); setInputUrl('') }} style={btnStyle('secondary')}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!preview || adding}
              style={btnStyle('primary')}
            >
              {adding ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              Salvar
            </button>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)} wide>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>{selected.page_name}</p>
              {selected.destination_domain && (
                <a
                  href={`https://${selected.destination_domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'none' }}
                >
                  {selected.destination_domain} ↗
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <StatusBadge status={selected.status ?? ''} />
              {selected.snapshot_url && (
                <a
                  href={`https://www.facebook.com/ads/library/?id=${selected.meta_ad_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...btnStyle('secondary'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <ExternalLink size={13} /> Ver no Meta
                </a>
              )}
              {selected.page_url && (
                <a
                  href={selected.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...btnStyle('secondary'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  Pág. FB
                </a>
              )}
              <button onClick={() => handleDelete(selected.id)} style={{ ...btnStyle('secondary'), color: '#ef4444' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <Stat label="Dias no ar" value={selected.days_running != null ? `${selected.days_running}d` : '—'} />
            <Stat label="Início" value={formatDate(selected.start_date)} />
            <Stat label="Plataformas" value={selected.platforms?.join(', ') || '—'} />
            <Stat label="Adicionado" value={formatDate(selected.created_at)} />
          </div>

          {selected.title && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>TÍTULO</p>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{selected.title}</p>
            </div>
          )}

          {selected.body && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>COPY</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.body}</p>
            </div>
          )}

          {selected.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    background: tagColor(tag) + '20',
                    color: tagColor(tag),
                    border: `1px solid ${tagColor(tag)}40`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {selected.notes && (
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
                fontSize: 13,
                color: 'var(--text-2)',
                fontStyle: 'italic',
              }}
            >
              {selected.notes}
            </div>
          )}
        </Modal>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function SwipeCard({
  item,
  onClick,
  onDelete,
}: {
  item: SwipeItem
  onClick: () => void
  onDelete: () => void
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(228,124,36,0.1)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.page_name || 'Sem nome'}
          </p>
          {item.destination_domain && (
            <p style={{ fontSize: 11, color: 'var(--brand)', marginTop: 1 }}>{item.destination_domain}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <StatusBadge status={item.status ?? ''} small />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4, borderRadius: 4 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {item.title && (
        <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>
          {item.title.slice(0, 80)}{item.title.length > 80 ? '…' : ''}
        </p>
      )}

      {item.body && (
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 10 }}>
          {item.body.slice(0, 120)}{item.body.length > 120 ? '…' : ''}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                padding: '2px 7px',
                borderRadius: 20,
                background: tagColor(tag) + '15',
                color: tagColor(tag),
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {item.days_running != null && (
          <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>
            {item.days_running}d
          </span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const active = status === 'ACTIVE'
  return (
    <span
      style={{
        fontSize: small ? 10 : 11,
        padding: small ? '2px 6px' : '3px 8px',
        borderRadius: 20,
        fontWeight: 600,
        background: active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        color: active ? '#16a34a' : '#dc2626',
      }}
    >
      {active ? 'ATIVO' : 'INATIVO'}
    </span>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
      <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{value}</p>
    </div>
  )
}

function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          width: '100%',
          maxWidth: wide ? 660 : 500,
          maxHeight: '90dvh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
          }}
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'opacity 0.15s',
    fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
  }
  if (variant === 'primary') return { ...base, background: 'var(--brand)', color: '#fff', border: '1px solid var(--brand-dark)' }
  if (variant === 'secondary') return { ...base, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }
  return { ...base, background: 'transparent', color: 'var(--text-3)' }
}

function inputStyle(extra: React.CSSProperties): React.CSSProperties {
  return {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    fontSize: 13,
    color: 'var(--text)',
    fontFamily: 'var(--font)',
    outline: 'none',
    width: '100%',
    marginBottom: 12,
    ...extra,
  }
}

function labelStyle(): React.CSSProperties {
  return { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }
}

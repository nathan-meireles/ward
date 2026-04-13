'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Loader2, X, Save, Package, Megaphone, ChevronDown, Trash2, ExternalLink } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductRef {
  id: string
  name: string
  images: string[]
  notreglr_score: number | null
  notreglr_label: string | null
  pipeline_status: string
}

interface Creative {
  id: string
  product_id: string | null
  title: string
  brief: string | null
  format: 'image' | 'video' | 'carousel'
  platform: 'instagram' | 'facebook' | 'both'
  angle: string | null
  status: 'briefing' | 'production' | 'review' | 'approved' | 'published'
  // strategy
  persona_description: string | null
  mental_triggers: string[]
  awareness_stage: string | null
  wow_factor: string | null
  cta_strategy: string | null
  // performance
  result_ctr: number | null
  result_cpc: number | null
  result_cpm: number | null
  result_cpa: number | null
  result_impressions: number | null
  total_spend_eur: number | null
  kill_criteria_result: string | null
  swipe_refs: string[]
  created_at: string
  // joined
  products: ProductRef | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  briefing: 'Briefing', production: 'Produção', review: 'Revisão',
  approved: 'Aprovado', published: 'Publicado',
}
const STATUS_COLORS: Record<string, string> = {
  briefing: 'var(--text-4)', production: 'var(--warning)', review: 'var(--info)',
  approved: 'var(--success)', published: 'var(--brand)',
}
const FORMAT_LABELS: Record<string, string> = {
  image: 'Imagem', video: 'Vídeo', carousel: 'Carrossel',
}
const AWARENESS_LABELS: Record<string, string> = {
  unaware: 'Sem consciência', problem_aware: 'Consciência do problema',
  solution_aware: 'Consciência da solução', product_aware: 'Consciência do produto',
  most_aware: 'Totalmente consciente',
}
const MENTAL_TRIGGER_OPTIONS = [
  'Identidade', 'FOMO', 'Prova social', 'Novidade', 'Escassez real',
  'Autoexpressão', 'Curiosidade', 'Contraste', 'Humor', 'Autoridade',
]

function scoreBadge(score: number | null) {
  if (!score) return null
  const color = score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)'
  return <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score}</span>
}

// ─── Creative Form Modal ──────────────────────────────────────────────────────

function CreativeFormModal({
  products,
  creative,
  onClose,
  onSave,
}: {
  products: ProductRef[]
  creative?: Creative | null
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!creative
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    product_id: creative?.product_id ?? '',
    title: creative?.title ?? '',
    brief: creative?.brief ?? '',
    format: creative?.format ?? 'image',
    platform: creative?.platform ?? 'both',
    angle: creative?.angle ?? '',
    status: creative?.status ?? 'briefing',
    persona_description: creative?.persona_description ?? '',
    mental_triggers: creative?.mental_triggers ?? [] as string[],
    awareness_stage: creative?.awareness_stage ?? '',
    wow_factor: creative?.wow_factor ?? '',
    cta_strategy: creative?.cta_strategy ?? '',
  })

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function toggleTrigger(t: string) {
    setForm(f => ({
      ...f,
      mental_triggers: f.mental_triggers.includes(t)
        ? f.mental_triggers.filter(x => x !== t)
        : [...f.mental_triggers, t],
    }))
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      product_id: form.product_id || null,
      brief: form.brief || null,
      angle: form.angle || null,
      persona_description: form.persona_description || null,
      awareness_stage: form.awareness_stage || null,
      wow_factor: form.wow_factor || null,
      cta_strategy: form.cta_strategy || null,
    }
    if (isEdit && creative) {
      await fetch('/api/criativos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: creative.id, ...payload }) })
    } else {
      await fetch('/api/criativos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setSaving(false)
    onSave()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)', padding: '7px 10px', color: 'var(--text)',
    fontSize: 13, fontFamily: 'var(--font)', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, display: 'block',
  }
  const sectionStyle: React.CSSProperties = {
    borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4,
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-alt)', fontSize: 22, fontWeight: 400, color: 'var(--text)', margin: 0 }}>
            {isEdit ? 'Editar Criativo' : 'Novo Criativo'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Produto */}
            <div>
              <label style={labelStyle}>Produto vinculado</label>
              <div style={{ position: 'relative' }}>
                <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                  <option value="">— Sem produto específico —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.notreglr_score ? ` (${p.notreglr_score}pts)` : ''}</option>
                  ))}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
              </div>
              {form.product_id && (() => {
                const p = products.find(x => x.id === form.product_id)
                return p ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, padding: '6px 10px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />}
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{p.name}</span>
                    {scoreBadge(p.notreglr_score)}
                  </div>
                ) : null
              })()}
            </div>

            {/* Título */}
            <div>
              <label style={labelStyle}>Título / Identificador *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Crescent Bag — Founder Story v1" style={inputStyle} />
            </div>

            {/* Format + Platform + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Formato</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value as 'image' | 'video' | 'carousel' }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    <option value="image">Imagem</option>
                    <option value="video">Vídeo</option>
                    <option value="carousel">Carrossel</option>
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Plataforma</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as 'instagram' | 'facebook' | 'both' }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    <option value="both">Instagram + Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Creative['status'] }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Ângulo */}
            <div>
              <label style={labelStyle}>Ângulo / Hook principal</label>
              <input value={form.angle} onChange={e => setForm(f => ({ ...f, angle: e.target.value }))} placeholder="Ex: Founder story — I found this bag nobody had seen yet" style={inputStyle} />
            </div>

            {/* Brief */}
            <div>
              <label style={labelStyle}>Brief</label>
              <textarea value={form.brief} onChange={e => setForm(f => ({ ...f, brief: e.target.value }))} placeholder="Descrição do criativo, contexto, referências visuais…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* ── ESTRATÉGIA ── */}
            <div style={sectionStyle}>
              <div style={{ fontSize: 11, color: 'var(--brand)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                Estratégia
              </div>

              {/* Persona */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Cliente ideal (persona)</label>
                <textarea value={form.persona_description} onChange={e => setForm(f => ({ ...f, persona_description: e.target.value }))} placeholder="Quem é essa pessoa? O que ela quer? O que a frustra? O que a motiva a comprar?" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Nível de consciência */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Nível de consciência do público</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.awareness_stage} onChange={e => setForm(f => ({ ...f, awareness_stage: e.target.value }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    <option value="">— Selecionar —</option>
                    {Object.entries(AWARENESS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Gatilhos */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Gatilhos mentais</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MENTAL_TRIGGER_OPTIONS.map(t => {
                    const active = form.mental_triggers.includes(t)
                    return (
                      <button key={t} onClick={() => toggleTrigger(t)} style={{
                        padding: '4px 10px', fontSize: 11, border: '1px solid',
                        borderColor: active ? 'var(--brand)' : 'var(--border)',
                        borderRadius: 'var(--radius-full)', cursor: 'pointer',
                        background: active ? 'var(--brand-dim)' : 'transparent',
                        color: active ? 'var(--brand)' : 'var(--text-3)',
                        fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                      }}>
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Fator UAU */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Fator UAU — o que faz esse criativo parar o scroll?</label>
                <input value={form.wow_factor} onChange={e => setForm(f => ({ ...f, wow_factor: e.target.value }))} placeholder="Ex: Formato de bolsa que ninguém nunca viu em Amsterdam" style={inputStyle} />
              </div>

              {/* CTA */}
              <div>
                <label style={labelStyle}>Estratégia de CTA</label>
                <input value={form.cta_strategy} onChange={e => setForm(f => ({ ...f, cta_strategy: e.target.value }))} placeholder="Ex: Shop now · Link na bio · Swipe up" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className="btn btn-primary">
            {saving ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Salvando…</> : <><Save size={13} /> {isEdit ? 'Salvar' : 'Criar criativo'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Creative Card ────────────────────────────────────────────────────────────

function CreativeCard({ creative, onEdit, onDelete }: {
  creative: Creative
  onEdit: () => void
  onDelete: () => void
}) {
  const [imgErr, setImgErr] = useState(false)
  const p = creative.products
  const statusColor = STATUS_COLORS[creative.status] ?? 'var(--text-4)'
  const hasPerf = creative.result_ctr || creative.result_cpc || creative.result_cpa

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Status strip */}
      <div style={{ padding: '7px 12px', background: `color-mix(in srgb, ${statusColor} 10%, transparent)`, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: statusColor, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {STATUS_LABELS[creative.status]}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <span className="badge badge-neutral" style={{ fontSize: 9 }}>{FORMAT_LABELS[creative.format]}</span>
          <span className="badge badge-neutral" style={{ fontSize: 9 }}>{creative.platform}</span>
        </div>
      </div>

      {/* Produto vinculado */}
      {p && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 7, alignItems: 'center', background: 'var(--surface-2)' }}>
          {p.images?.[0] && !imgErr
            ? <img src={p.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: 26, height: 26, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
            : <Package size={14} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          }
          <span style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>{p.name}</span>
          {scoreBadge(p.notreglr_score)}
        </div>
      )}

      {/* Title + angle */}
      <div style={{ padding: '10px 12px', flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.4 }}>{creative.title}</p>
        {creative.angle && (
          <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{creative.angle}"</p>
        )}

        {/* Triggers */}
        {creative.mental_triggers?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {creative.mental_triggers.map(t => (
              <span key={t} className="badge badge-neutral" style={{ fontSize: 9 }}>{t}</span>
            ))}
          </div>
        )}

        {/* Awareness */}
        {creative.awareness_stage && (
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
            {AWARENESS_LABELS[creative.awareness_stage] ?? creative.awareness_stage}
          </div>
        )}
      </div>

      {/* Performance metrics (if any) */}
      {hasPerf && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { label: 'CTR', value: creative.result_ctr ? `${(creative.result_ctr * 100).toFixed(2)}%` : null },
            { label: 'CPC', value: creative.result_cpc ? `€${creative.result_cpc.toFixed(2)}` : null },
            { label: 'CPA', value: creative.result_cpa ? `€${creative.result_cpa.toFixed(2)}` : null },
          ].filter(m => m.value).map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6 }}>
        <button onClick={onEdit} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>
          Editar
        </button>
        <button onClick={onDelete} className="btn btn-ghost" style={{ color: 'var(--error)', padding: '5px 8px' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type StatusFilter = 'all' | Creative['status']

export function CriativosClient() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [products, setProducts] = useState<ProductRef[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Creative | null>(null)

  const load = useCallback(async () => {
    const [cRes, pRes] = await Promise.all([
      fetch('/api/criativos'),
      fetch('/api/products'),
    ])
    if (cRes.ok) setCreatives(await cRes.json())
    if (pRes.ok) setProducts(await pRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: string) {
    await fetch('/api/criativos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setCreatives(prev => prev.filter(c => c.id !== id))
  }

  const filtered = creatives.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!c.title.toLowerCase().includes(q) && !c.products?.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const counts = Object.keys(STATUS_LABELS).reduce((acc, k) => ({
    ...acc, [k]: creatives.filter(c => c.status === k).length,
  }), {} as Record<string, number>)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            WARD / CRIATIVOS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>
            Criativos
          </h1>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn btn-primary">
          <Plus size={14} /> Novo Criativo
        </button>
      </div>
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 20, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {creatives.length} criativo{creatives.length !== 1 ? 's' : ''} · briefing → produção → publicado
      </p>

      {/* Stats strip */}
      {creatives.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_LABELS).map(([k, label]) => (
            counts[k] > 0 && (
              <div key={k} style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', border: `1px solid ${STATUS_COLORS[k]}`, background: `color-mix(in srgb, ${STATUS_COLORS[k]} 10%, transparent)` }}>
                <span style={{ fontSize: 10, color: STATUS_COLORS[k], fontFamily: 'var(--font-mono)' }}>
                  {counts[k]} {label.toLowerCase()}
                </span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar criativo ou produto…" className="form-input" style={{ paddingLeft: 30, height: 32, fontSize: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {(['all', ...Object.keys(STATUS_LABELS)] as StatusFilter[]).map(k => (
            <button key={k} onClick={() => setStatusFilter(k)} style={{
              padding: '4px 10px', fontSize: 10, border: '1px solid',
              borderColor: statusFilter === k ? (k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]) : 'var(--border)',
              borderRadius: 'var(--radius-full)', cursor: 'pointer',
              background: statusFilter === k ? `color-mix(in srgb, ${k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]} 12%, transparent)` : 'transparent',
              color: statusFilter === k ? (k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]) : 'var(--text-3)',
              fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
            }}>
              {k === 'all' ? 'Todos' : STATUS_LABELS[k]}
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
          <Megaphone size={28} style={{ color: 'var(--text-4)', marginBottom: 12 }} />
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {creatives.length === 0 ? 'Nenhum criativo. Clique em "Novo Criativo" para começar.' : 'Nenhum criativo neste filtro.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(c => (
            <CreativeCard
              key={c.id}
              creative={c}
              onEdit={() => { setEditing(c); setShowForm(true) }}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <CreativeFormModal
          products={products}
          creative={editing}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSave={() => { setShowForm(false); setEditing(null); load() }}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

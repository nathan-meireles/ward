'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Loader2, X, Save, Package, ChevronDown, Trash2, TrendingUp, Megaphone } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductRef {
  id: string; name: string; images: string[]
  notreglr_score: number | null; notreglr_label: string | null; pipeline_status: string
}
interface CreativeRef {
  id: string; title: string; format: string
}

interface Campaign {
  id: string
  product_id: string | null
  creative_id: string | null
  status: 'a_testar' | 'testando' | 'validado' | 'descartado'
  daily_budget_eur: number | null
  days_active: number
  gender_target: string | null
  age_target: string | null
  interests: string[]
  countries: string[]
  ctr: number | null
  cpc_eur: number | null
  cpm_eur: number | null
  page_views: number | null
  checkouts: number | null
  conversions: number | null
  total_spent_eur: number | null
  notes: string | null
  started_at: string | null
  ended_at: string | null
  created_at: string
  products: ProductRef | null
  creatives: CreativeRef | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  a_testar: 'A Testar', testando: 'Testando', validado: 'Validado', descartado: 'Descartado',
}
const STATUS_COLORS: Record<string, string> = {
  a_testar: 'var(--text-3)', testando: 'var(--warning)', validado: 'var(--success)', descartado: 'var(--error)',
}

const EU_COUNTRIES = ['UK', 'NL', 'BE', 'DE', 'FR', 'IE', 'ES', 'IT', 'PT', 'PL']

function fmt(val: number | null, prefix = '', decimals = 2): string {
  return val !== null ? `${prefix}${val.toFixed(decimals)}` : '—'
}

// Kill criteria check (Simo B. framework)
function killCheck(c: Campaign): { pass: boolean; note: string } | null {
  if (!c.total_spent_eur) return null
  const spent = c.total_spent_eur
  const cpc = c.cpc_eur
  const atc = c.checkouts ?? 0
  const purchases = c.conversions ?? 0

  if (spent >= 10 && spent < 20) {
    if (cpc && cpc > 1) return { pass: false, note: `CPC €${cpc.toFixed(2)} > €1 — mata` }
    if (atc === 0) return { pass: false, note: 'Nenhum ATC com €10 — mata' }
  }
  if (spent >= 20 && spent < 30 && atc === 0) return { pass: false, note: 'Nenhum ATC com €20 — mata' }
  if (spent >= 30 && spent < 60 && purchases === 0) return { pass: false, note: 'Nenhuma compra com €30 — para' }
  if (spent >= 60) {
    if (purchases < 2) return { pass: false, note: `Apenas ${purchases} compra(s) com €60 — para` }
    return { pass: true, note: `${purchases} compras com €${spent.toFixed(0)} — escalar` }
  }
  return null
}

// ─── Campaign Form Modal ──────────────────────────────────────────────────────

function CampaignFormModal({ products, creatives, campaign, onClose, onSave }: {
  products: ProductRef[]
  creatives: CreativeRef[]
  campaign?: Campaign | null
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!campaign
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    product_id: campaign?.product_id ?? '',
    creative_id: campaign?.creative_id ?? '',
    status: campaign?.status ?? 'a_testar',
    daily_budget_eur: campaign?.daily_budget_eur ?? '',
    gender_target: campaign?.gender_target ?? '',
    age_target: campaign?.age_target ?? '',
    interests: campaign?.interests?.join(', ') ?? '',
    countries: campaign?.countries ?? [] as string[],
    notes: campaign?.notes ?? '',
    // performance
    ctr: campaign?.ctr !== null ? ((campaign?.ctr ?? 0) * 100).toFixed(2) : '',
    cpc_eur: campaign?.cpc_eur ?? '',
    cpm_eur: campaign?.cpm_eur ?? '',
    page_views: campaign?.page_views ?? '',
    checkouts: campaign?.checkouts ?? '',
    conversions: campaign?.conversions ?? '',
    total_spent_eur: campaign?.total_spent_eur ?? '',
  })

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function toggleCountry(c: string) {
    setForm(f => ({
      ...f,
      countries: f.countries.includes(c) ? f.countries.filter(x => x !== c) : [...f.countries, c],
    }))
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      product_id: form.product_id || null,
      creative_id: form.creative_id || null,
      status: form.status,
      daily_budget_eur: form.daily_budget_eur !== '' ? Number(form.daily_budget_eur) : null,
      gender_target: form.gender_target || null,
      age_target: form.age_target || null,
      interests: form.interests ? form.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
      countries: form.countries,
      notes: form.notes || null,
      ctr: form.ctr !== '' ? Number(form.ctr) / 100 : null,
      cpc_eur: form.cpc_eur !== '' ? Number(form.cpc_eur) : null,
      cpm_eur: form.cpm_eur !== '' ? Number(form.cpm_eur) : null,
      page_views: form.page_views !== '' ? Number(form.page_views) : null,
      checkouts: form.checkouts !== '' ? Number(form.checkouts) : null,
      conversions: form.conversions !== '' ? Number(form.conversions) : null,
      total_spent_eur: form.total_spent_eur !== '' ? Number(form.total_spent_eur) : null,
    }
    if (isEdit && campaign) {
      await fetch('/api/campanhas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: campaign.id, ...payload }) })
    } else {
      await fetch('/api/campanhas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-alt)', fontSize: 22, fontWeight: 400, color: 'var(--text)', margin: 0 }}>
            {isEdit ? 'Editar Campanha' : 'Nova Campanha'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}><X size={16} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Produto + Criativo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Produto</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    <option value="">— Selecionar —</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Criativo</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.creative_id} onChange={e => setForm(f => ({ ...f, creative_id: e.target.value }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    <option value="">— Selecionar —</option>
                    {creatives.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Status + Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Campaign['status'] }))} style={{ ...inputStyle, appearance: 'none', paddingRight: 28 }}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Budget diário (€)</label>
                <input type="number" step="0.01" min="0" value={form.daily_budget_eur} onChange={e => setForm(f => ({ ...f, daily_budget_eur: e.target.value }))} placeholder="10.00" style={inputStyle} />
              </div>
            </div>

            {/* Targeting */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Gênero</label>
                <input value={form.gender_target} onChange={e => setForm(f => ({ ...f, gender_target: e.target.value }))} placeholder="Feminino" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Faixa etária</label>
                <input value={form.age_target} onChange={e => setForm(f => ({ ...f, age_target: e.target.value }))} placeholder="18-45" style={inputStyle} />
              </div>
            </div>

            {/* Countries */}
            <div>
              <label style={labelStyle}>Países</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {EU_COUNTRIES.map(c => (
                  <button key={c} onClick={() => toggleCountry(c)} style={{
                    padding: '4px 10px', fontSize: 11, border: '1px solid',
                    borderColor: form.countries.includes(c) ? 'var(--brand)' : 'var(--border)',
                    borderRadius: 'var(--radius-full)', cursor: 'pointer',
                    background: form.countries.includes(c) ? 'var(--brand-dim)' : 'transparent',
                    color: form.countries.includes(c) ? 'var(--brand)' : 'var(--text-3)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Interesses */}
            <div>
              <label style={labelStyle}>Interesses (separados por vírgula)</label>
              <input value={form.interests} onChange={e => setForm(f => ({ ...f, interests: e.target.value }))} placeholder="Fashion, Accessories, Style…" style={inputStyle} />
            </div>

            {/* Performance metrics */}
            <details style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <summary style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none' }}>
                Métricas de Performance (opcional)
              </summary>
              <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { key: 'total_spent_eur', label: 'Total gasto (€)', placeholder: '0.00' },
                  { key: 'ctr', label: 'CTR (%)', placeholder: '1.50' },
                  { key: 'cpc_eur', label: 'CPC (€)', placeholder: '0.75' },
                  { key: 'cpm_eur', label: 'CPM (€)', placeholder: '8.00' },
                  { key: 'checkouts', label: 'ATCs', placeholder: '0' },
                  { key: 'conversions', label: 'Compras', placeholder: '0' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={(form as Record<string, unknown>)[key] as string}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </details>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Notas</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações, hipóteses, resultados…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Salvando…</> : <><Save size={13} /> {isEdit ? 'Salvar' : 'Criar campanha'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Campaign Row ─────────────────────────────────────────────────────────────

function CampaignRow({ campaign, onEdit, onDelete }: {
  campaign: Campaign; onEdit: () => void; onDelete: () => void
}) {
  const [imgErr, setImgErr] = useState(false)
  const p = campaign.products
  const statusColor = STATUS_COLORS[campaign.status] ?? 'var(--text-3)'
  const kill = killCheck(campaign)
  const totalSpent = campaign.total_spent_eur ?? (campaign.daily_budget_eur ? campaign.daily_budget_eur * campaign.days_active : null)

  return (
    <div style={{
      display: 'grid', alignItems: 'center',
      gridTemplateColumns: '40px 200px 100px 70px 70px 70px 70px 70px 70px auto',
      gap: 10, padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      borderLeft: `3px solid ${statusColor}`,
      transition: 'background 0.1s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Thumb */}
      <div style={{ width: 34, height: 34, borderRadius: 5, overflow: 'hidden', background: 'var(--surface-2)' }}>
        {p?.images?.[0] && !imgErr
          ? <img src={p.images[0]} alt="" onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={12} style={{ color: 'var(--text-4)' }} /></div>
        }
      </div>

      {/* Product + creative */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {p?.name ?? '—'}
        </div>
        {campaign.creatives && (
          <div style={{ fontSize: 10, color: 'var(--text-4)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Megaphone size={8} style={{ marginRight: 3 }} />{campaign.creatives.title}
          </div>
        )}
      </div>

      {/* Status */}
      <span style={{ fontSize: 10, color: statusColor, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {STATUS_LABELS[campaign.status]}
      </span>

      {/* Budget */}
      <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
        {campaign.daily_budget_eur ? `€${campaign.daily_budget_eur}/d` : '—'}
      </span>

      {/* Total gasto */}
      <span style={{ fontSize: 11, color: 'var(--brand)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
        {totalSpent ? `€${totalSpent.toFixed(0)}` : '—'}
      </span>

      {/* CTR */}
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
        {campaign.ctr ? `${(campaign.ctr * 100).toFixed(2)}%` : '—'}
      </span>

      {/* CPC */}
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
        {fmt(campaign.cpc_eur, '€')}
      </span>

      {/* ATC / Compras */}
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
        {campaign.checkouts ?? '—'} / {campaign.conversions ?? '—'}
      </span>

      {/* Kill criteria */}
      <span style={{ fontSize: 10, color: kill ? (kill.pass ? 'var(--success)' : 'var(--error)') : 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
        {kill ? kill.note : '—'}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <button onClick={onEdit} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}>Editar</button>
        <button onClick={onDelete} className="btn btn-ghost" style={{ color: 'var(--error)', padding: '4px 6px' }}>
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CampanhasClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [products, setProducts] = useState<ProductRef[]>([])
  const [creatives, setCreatives] = useState<CreativeRef[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Campaign['status'] | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)

  const load = useCallback(async () => {
    const [cRes, pRes, crRes] = await Promise.all([
      fetch('/api/campanhas'),
      fetch('/api/products'),
      fetch('/api/criativos'),
    ])
    if (cRes.ok) setCampaigns(await cRes.json())
    if (pRes.ok) setProducts(await pRes.json())
    if (crRes.ok) setCreatives(await crRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: string) {
    await fetch('/api/campanhas', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const filtered = campaigns.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!c.products?.name.toLowerCase().includes(q) && !c.creatives?.title.toLowerCase().includes(q)) return false
    }
    return true
  })

  const totalSpent = campaigns.reduce((s, c) => s + (c.total_spent_eur ?? 0), 0)
  const testando = campaigns.filter(c => c.status === 'testando')
  const activeBudget = testando.reduce((s, c) => s + (c.daily_budget_eur ?? 0), 0)

  const TABLE_HEADERS = ['', 'Produto / Criativo', 'Status', 'Budget', 'Gasto', 'CTR', 'CPC', 'ATC/Comp.', 'Kill Criteria', '']

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>WARD / CAMPANHAS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1 }}>Campanhas</h1>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn btn-primary">
          <Plus size={14} /> Nova Campanha
        </button>
      </div>
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 20, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {campaigns.length} campanha{campaigns.length !== 1 ? 's' : ''}
        {activeBudget > 0 && <span style={{ color: 'var(--warning)', marginLeft: 10 }}>· €{activeBudget.toFixed(0)}/dia ativos</span>}
        {totalSpent > 0 && <span style={{ color: 'var(--brand)', marginLeft: 10 }}>· €{totalSpent.toFixed(0)} gasto total</span>}
      </p>

      {/* Quick stats */}
      {campaigns.length > 0 && (
        <div className="bento" style={{ gridTemplateColumns: 'repeat(4, 1fr)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24, border: '1px solid var(--border-input)', backgroundColor: 'rgba(255,255,255,0.12)' }}>
          {[
            { label: 'A Testar', value: String(campaigns.filter(c => c.status === 'a_testar').length), color: 'var(--text-3)' },
            { label: 'Testando', value: String(testando.length), color: 'var(--warning)' },
            { label: 'Validados', value: String(campaigns.filter(c => c.status === 'validado').length), color: 'var(--success)' },
            { label: 'Descartados', value: String(campaigns.filter(c => c.status === 'descartado').length), color: 'var(--error)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-alt)', color, lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar campanha…" className="form-input" style={{ paddingLeft: 30, height: 32, fontSize: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {(['all', ...Object.keys(STATUS_LABELS)] as Array<Campaign['status'] | 'all'>).map(k => (
            <button key={k} onClick={() => setStatusFilter(k)} style={{
              padding: '4px 10px', fontSize: 10, border: '1px solid',
              borderColor: statusFilter === k ? (k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]) : 'var(--border)',
              borderRadius: 'var(--radius-full)', cursor: 'pointer',
              background: statusFilter === k ? `color-mix(in srgb, ${k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]} 12%, transparent)` : 'transparent',
              color: statusFilter === k ? (k === 'all' ? 'var(--brand)' : STATUS_COLORS[k]) : 'var(--text-3)',
              fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
            }}>
              {k === 'all' ? 'Todas' : STATUS_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Loader2 size={28} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
          <TrendingUp size={28} style={{ color: 'var(--text-4)', marginBottom: 12 }} />
          <p style={{ color: 'var(--text-4)', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {campaigns.length === 0 ? 'Nenhuma campanha. Clique em "Nova Campanha" para começar.' : 'Nenhuma campanha neste filtro.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 200px 100px 70px 70px 70px 70px 70px 70px auto', gap: 10, padding: '8px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {TABLE_HEADERS.map((h, i) => (
              <span key={i} style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</span>
            ))}
          </div>
          {filtered.map(c => (
            <CampaignRow key={c.id} campaign={c} onEdit={() => { setEditing(c); setShowForm(true) }} onDelete={() => handleDelete(c.id)} />
          ))}
        </div>
      )}

      {showForm && (
        <CampaignFormModal
          products={products} creatives={creatives} campaign={editing}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSave={() => { setShowForm(false); setEditing(null); load() }}
        />
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

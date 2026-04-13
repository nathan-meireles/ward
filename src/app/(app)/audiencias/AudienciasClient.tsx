'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Check, X, Users, Globe } from 'lucide-react'

interface Audience {
  id: string
  name: string
  type: 'interest' | 'lookalike' | 'retargeting' | 'broad' | 'custom'
  gender: 'all' | 'female' | 'male'
  age_min: number
  age_max: number
  countries: string[]
  interests: string[]
  behaviors: string[]
  exclusions: string[]
  estimated_size_min: number | null
  estimated_size_max: number | null
  notes: string | null
  status: 'draft' | 'active' | 'paused' | 'tested'
}

const TYPE_LABEL: Record<Audience['type'], string> = {
  interest: 'Interesse',
  lookalike: 'Lookalike',
  retargeting: 'Retargeting',
  broad: 'Ampla',
  custom: 'Custom',
}
const TYPE_COLOR: Record<Audience['type'], string> = {
  interest: '#818cf8',
  lookalike: '#34d399',
  retargeting: '#f59e0b',
  broad: '#94a3b8',
  custom: '#fb7185',
}

const STATUS_LABEL: Record<Audience['status'], string> = {
  draft: 'Rascunho',
  active: 'Ativa',
  paused: 'Pausada',
  tested: 'Testada',
}
const STATUS_COLOR: Record<Audience['status'], string> = {
  draft: '#6b7280',
  active: '#22c55e',
  paused: '#f59e0b',
  tested: '#818cf8',
}

const EU_COUNTRIES = [
  { code: 'NL', name: 'Holanda' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'IE', name: 'Irlanda' },
]

const BLANK_AUDIENCE: Omit<Audience, 'id'> = {
  name: 'Nova Audiência',
  type: 'interest',
  gender: 'female',
  age_min: 24,
  age_max: 38,
  countries: ['NL', 'BE', 'GB'],
  interests: [],
  behaviors: [],
  exclusions: [],
  estimated_size_min: null,
  estimated_size_max: null,
  notes: null,
  status: 'draft',
}

function TagInput({
  label, values, onChange, placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [input, setInput] = useState('')

  function add() {
    const v = input.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setInput('')
  }

  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {values.map(v => (
          <span key={v} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)', padding: '3px 8px', fontSize: 12,
            color: 'var(--text-2)',
          }}>
            {v}
            <button onClick={() => onChange(values.filter(x => x !== v))} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-4)', padding: 0, display: 'flex',
            }}>
              <X size={10} />
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <span style={{ fontSize: 12, color: 'var(--text-4)', fontStyle: 'italic' }}>Nenhum</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'var(--surface-3)', border: '1px solid var(--border-input)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '5px 8px',
          }}
        />
        <button onClick={add} className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
          + Add
        </button>
      </div>
    </div>
  )
}

function AudienceCard({
  audience,
  onUpdate,
  onDelete,
}: {
  audience: Audience
  onUpdate: (a: Audience) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(audience)

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  function cancel() {
    setDraft(audience)
    setEditing(false)
  }

  const sizeStr = audience.estimated_size_min && audience.estimated_size_max
    ? `${(audience.estimated_size_min / 1000).toFixed(0)}K–${(audience.estimated_size_max / 1000).toFixed(0)}K`
    : null

  if (!editing) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${TYPE_COLOR[audience.type]}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{audience.name}</span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 'var(--radius-full)',
                background: `${TYPE_COLOR[audience.type]}20`,
                color: TYPE_COLOR[audience.type],
                fontWeight: 600,
              }}>
                {TYPE_LABEL[audience.type]}
              </span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 'var(--radius-full)',
                background: `${STATUS_COLOR[audience.status]}20`,
                color: STATUS_COLOR[audience.status],
                fontWeight: 600,
              }}>
                {STATUS_LABEL[audience.status]}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
                {audience.gender === 'all' ? 'Todos' : audience.gender === 'female' ? 'Feminino' : 'Masculino'}
                {' · '}
                {audience.age_min}–{audience.age_max} anos
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
                <Globe size={11} style={{ display: 'inline', marginRight: 3 }} />
                {audience.countries.join(', ')}
              </span>
              {sizeStr && (
                <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
                  <Users size={11} style={{ display: 'inline', marginRight: 3 }} />
                  {sizeStr}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={() => setEditing(true)} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: 'var(--text-4)', cursor: 'pointer', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Pencil size={12} />
            </button>
            <button onClick={() => onDelete(audience.id)} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: 'var(--text-4)', cursor: 'pointer', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Interests + behaviors */}
        {audience.interests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {audience.interests.map(i => (
              <span key={i} style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 'var(--radius-full)',
                background: 'var(--surface-3)', border: '1px solid var(--border)',
                color: 'var(--text-3)',
              }}>
                {i}
              </span>
            ))}
          </div>
        )}

        {audience.notes && (
          <div style={{ fontSize: 12, color: 'var(--text-4)', fontStyle: 'italic' }}>{audience.notes}</div>
        )}
      </div>
    )
  }

  // Edit mode
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--brand)',
      borderRadius: 'var(--radius)',
      padding: 20,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Name */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Nome
          </label>
          <input
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, fontWeight: 600, padding: '6px 10px',
            }}
          />
        </div>

        {/* Type */}
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Tipo
          </label>
          <select
            value={draft.type}
            onChange={e => setDraft(d => ({ ...d, type: e.target.value as Audience['type'] }))}
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
            }}
          >
            {(Object.keys(TYPE_LABEL) as Audience['type'][]).map(t => (
              <option key={t} value={t}>{TYPE_LABEL[t]}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Status
          </label>
          <select
            value={draft.status}
            onChange={e => setDraft(d => ({ ...d, status: e.target.value as Audience['status'] }))}
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
            }}
          >
            {(Object.keys(STATUS_LABEL) as Audience['status'][]).map(s => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Gênero
          </label>
          <select
            value={draft.gender}
            onChange={e => setDraft(d => ({ ...d, gender: e.target.value as Audience['gender'] }))}
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
            }}
          >
            <option value="all">Todos</option>
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Faixa Etária
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="number" value={draft.age_min} min={18} max={65}
              onChange={e => setDraft(d => ({ ...d, age_min: parseInt(e.target.value) }))}
              style={{
                width: 70, background: 'var(--surface-3)', border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
              }}
            />
            <span style={{ color: 'var(--text-4)' }}>–</span>
            <input type="number" value={draft.age_max} min={18} max={65}
              onChange={e => setDraft(d => ({ ...d, age_max: parseInt(e.target.value) }))}
              style={{
                width: 70, background: 'var(--surface-3)', border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
              }}
            />
          </div>
        </div>

        {/* Countries */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
            Países
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EU_COUNTRIES.map(({ code, name }) => {
              const selected = draft.countries.includes(code)
              return (
                <button
                  key={code}
                  onClick={() => setDraft(d => ({
                    ...d,
                    countries: selected
                      ? d.countries.filter(c => c !== code)
                      : [...d.countries, code],
                  }))}
                  style={{
                    padding: '5px 12px', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                    background: selected ? 'var(--brand-dim)' : 'transparent',
                    color: selected ? 'var(--brand)' : 'var(--text-3)',
                    cursor: 'pointer', fontSize: 12, fontWeight: selected ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  {selected && <Check size={10} />}
                  {code} · {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Interests */}
        <div style={{ gridColumn: '1 / -1' }}>
          <TagInput
            label="Interesses"
            values={draft.interests}
            onChange={v => setDraft(d => ({ ...d, interests: v }))}
            placeholder="Ex: Fashion, Accessories, Online Shopping..."
          />
        </div>

        {/* Behaviors */}
        <div>
          <TagInput
            label="Comportamentos"
            values={draft.behaviors}
            onChange={v => setDraft(d => ({ ...d, behaviors: v }))}
            placeholder="Ex: Engaged Shoppers..."
          />
        </div>

        {/* Exclusions */}
        <div>
          <TagInput
            label="Exclusões"
            values={draft.exclusions}
            onChange={v => setDraft(d => ({ ...d, exclusions: v }))}
            placeholder="Ex: Competitors, purchasers..."
          />
        </div>

        {/* Size estimate */}
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Tamanho estimado (min)
          </label>
          <input type="number"
            value={draft.estimated_size_min ?? ''}
            onChange={e => setDraft(d => ({ ...d, estimated_size_min: e.target.value ? parseInt(e.target.value) : null }))}
            placeholder="Ex: 500000"
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Tamanho estimado (max)
          </label>
          <input type="number"
            value={draft.estimated_size_max ?? ''}
            onChange={e => setDraft(d => ({ ...d, estimated_size_max: e.target.value ? parseInt(e.target.value) : null }))}
            placeholder="Ex: 2000000"
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px',
            }}
          />
        </div>

        {/* Notes */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
            Notas
          </label>
          <textarea
            value={draft.notes ?? ''}
            onChange={e => setDraft(d => ({ ...d, notes: e.target.value || null }))}
            rows={2}
            style={{
              width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, padding: '6px 8px', resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={save} className="btn btn-primary">Salvar</button>
        <button onClick={cancel} className="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  )
}

export function AudienciasClient() {
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<Audience['type'] | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/audiencias')
    if (res.ok) setAudiences(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/audiencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(BLANK_AUDIENCE),
    })
    if (res.ok) {
      const a = await res.json()
      setAudiences(prev => [a, ...prev])
    }
    setCreating(false)
  }

  async function handleUpdate(updated: Audience) {
    const { id, ...rest } = updated
    const res = await fetch('/api/audiencias', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...rest }),
    })
    if (res.ok) {
      const a = await res.json()
      setAudiences(prev => prev.map(x => x.id === a.id ? a : x))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar audiência?')) return
    setAudiences(prev => prev.filter(x => x.id !== id))
    await fetch('/api/audiencias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const filtered = filter === 'all' ? audiences : audiences.filter(a => a.type === filter)
  const countByType = (t: Audience['type']) => audiences.filter(a => a.type === t).length
  const activeCount = audiences.filter(a => a.status === 'active').length

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: 'var(--text)', margin: 0 }}>
            AUDIÊNCIAS
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 13, margin: '4px 0 0' }}>
            Biblioteca de públicos-alvo para Meta Ads
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} />
          {creating ? 'Criando...' : 'Nova Audiência'}
        </button>
      </div>

      {/* Summary */}
      {audiences.length > 0 && (
        <div style={{
          display: 'flex', gap: 16,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '12px 20px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{audiences.length}</span>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          {(Object.keys(TYPE_LABEL) as Audience['type'][]).filter(t => countByType(t) > 0).map(t => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: TYPE_COLOR[t], textTransform: 'uppercase', letterSpacing: 0.5 }}>{TYPE_LABEL[t]}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{countByType(t)}</span>
            </div>
          ))}
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ativas</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>{activeCount}</span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {audiences.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['all', ...Object.keys(TYPE_LABEL)] as (Audience['type'] | 'all')[]).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 12,
                border: `1px solid ${filter === t ? (t === 'all' ? 'var(--brand)' : TYPE_COLOR[t as Audience['type']]) : 'var(--border)'}`,
                background: filter === t ? (t === 'all' ? 'var(--brand-dim)' : `${TYPE_COLOR[t as Audience['type']]}15`) : 'transparent',
                color: filter === t ? (t === 'all' ? 'var(--brand)' : TYPE_COLOR[t as Audience['type']]) : 'var(--text-4)',
                fontWeight: filter === t ? 600 : 400,
              }}
            >
              {t === 'all' ? 'Todas' : TYPE_LABEL[t as Audience['type']]}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-4)', paddingTop: 60 }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', color: 'var(--text-4)',
          paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <Users size={40} strokeWidth={1} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-3)' }}>Nenhuma audiência</div>
          <div style={{ fontSize: 13 }}>Crie públicos reutilizáveis para suas campanhas</div>
          <button onClick={handleCreate} className="btn btn-primary" style={{ marginTop: 8 }}>
            Criar primeira audiência
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(a => (
            <AudienceCard
              key={a.id}
              audience={a}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

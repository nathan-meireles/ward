'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2, Copy, FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Product {
  id: string
  name: string
  images: string[]
  notreglr_score: number | null
  notreglr_label: string | null
}

interface Scenario {
  id: string
  product_id: string | null
  name: string
  daily_budget_eur: number
  cpm_eur: number
  ctr_pct: number
  cvr_pct: number
  aov_eur: number
  cog_eur: number | null
  freight_eur: number | null
  return_rate_pct: number
  notes: string | null
  products: Product | null
}

interface ScenarioCalc {
  impressions_day: number
  clicks_day: number
  cpc_eur: number
  sessions_day: number
  orders_day: number
  revenue_day: number
  cac_eur: number
  // cost breakdown
  cog_total: number
  freight_total: number
  gateway_fee: number
  checkout_fee: number
  iof_amount: number
  returns_cost: number
  total_cost: number
  gross_profit: number
  net_profit_day: number
  roas: number
  margin_pct: number
  // monthly
  orders_month: number
  revenue_month: number
  net_profit_month: number
  // break-even
  be_orders: number
  be_cac: number
  // viability
  viable: 'green' | 'yellow' | 'red'
  viability_reason: string
}

function calcScenario(s: Scenario): ScenarioCalc {
  const budget = s.daily_budget_eur
  const cpm = s.cpm_eur
  const ctr = s.ctr_pct / 100
  const cvr = s.cvr_pct / 100
  const aov = s.aov_eur
  const cog = s.cog_eur ?? 0
  const freight = s.freight_eur ?? 0
  const returnRate = s.return_rate_pct / 100

  const impressions_day = cpm > 0 ? (budget / cpm) * 1000 : 0
  const clicks_day = impressions_day * ctr
  const sessions_day = clicks_day
  const orders_day = sessions_day * cvr
  const cpc_eur = clicks_day > 0 ? budget / clicks_day : 0
  const cac_eur = orders_day > 0 ? budget / orders_day : 0

  const revenue_day = orders_day * aov

  // cost per order
  const iof_rate = 0.035
  const gateway_rate = 0.0599
  const checkout_rate = 0.005
  const baseCost = cog + freight
  const iof_per_order = baseCost * iof_rate
  const gateway_per_order = aov * gateway_rate
  const checkout_per_order = aov * checkout_rate
  const returns_per_order = aov * returnRate

  const cost_per_order = baseCost + iof_per_order + gateway_per_order + checkout_per_order + returns_per_order

  const cog_total = orders_day * cog
  const freight_total = orders_day * freight
  const iof_amount = orders_day * iof_per_order
  const gateway_fee = orders_day * gateway_per_order
  const checkout_fee = orders_day * checkout_per_order
  const returns_cost = orders_day * returns_per_order
  const total_cost = orders_day * cost_per_order + budget

  const gross_profit = revenue_day - orders_day * (baseCost + iof_per_order)
  const net_profit_day = revenue_day - total_cost
  const roas = budget > 0 ? revenue_day / budget : 0
  const margin_pct = revenue_day > 0 ? (net_profit_day / revenue_day) * 100 : 0

  const orders_month = orders_day * 30
  const revenue_month = revenue_day * 30
  const net_profit_month = net_profit_day * 30

  // break-even: how many orders needed to cover fixed costs (budget)
  const profit_per_order = aov - cost_per_order
  const be_orders = profit_per_order > 0 ? budget / profit_per_order : Infinity
  const be_cac = aov - cost_per_order > 0 ? aov - (cost_per_order) : 0

  let viable: 'green' | 'yellow' | 'red' = 'green'
  let viability_reason = 'Cenário lucrativo'

  if (net_profit_day < 0) {
    viable = 'red'
    viability_reason = 'Prejuízo mesmo com tráfego'
  } else if (margin_pct < 10) {
    viable = 'yellow'
    viability_reason = 'Margem apertada (< 10%)'
  } else if (cac_eur > aov * 0.5) {
    viable = 'yellow'
    viability_reason = 'CAC alto (> 50% do AOV)'
  } else if (orders_day < 0.5) {
    viable = 'yellow'
    viability_reason = 'Menos de 1 pedido/dia esperado'
  }

  return {
    impressions_day, clicks_day, cpc_eur, sessions_day, orders_day,
    revenue_day, cac_eur, cog_total, freight_total, gateway_fee,
    checkout_fee, iof_amount, returns_cost, total_cost, gross_profit,
    net_profit_day, roas, margin_pct, orders_month, revenue_month,
    net_profit_month, be_orders, be_cac, viable, viability_reason,
  }
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtEur(n: number) { return `€${fmt(n)}` }

const VIABLE_COLOR = { green: '#22c55e', yellow: '#f59e0b', red: '#ef4444' }
const VIABLE_BG = { green: 'rgba(34,197,94,0.1)', yellow: 'rgba(245,158,11,0.1)', red: 'rgba(239,68,68,0.1)' }

const BLANK: Omit<Scenario, 'id' | 'products'> = {
  product_id: null,
  name: 'Novo Cenário',
  daily_budget_eur: 10,
  cpm_eur: 8,
  ctr_pct: 1.5,
  cvr_pct: 1.2,
  aov_eur: 65,
  cog_eur: null,
  freight_eur: null,
  return_rate_pct: 5,
  notes: null,
}

function ScenarioCard({
  scenario,
  products,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  scenario: Scenario
  products: Product[]
  onUpdate: (s: Scenario) => void
  onDelete: (id: string) => void
  onDuplicate: (s: Scenario) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(scenario)
  const calc = calcScenario(draft)

  function field(key: keyof typeof draft, label: string, suffix = '', type = 'number') {
    const val = draft[key] as number | string | null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type={type}
            step="any"
            value={val ?? ''}
            onChange={e => setDraft(d => ({
              ...d,
              [key]: e.target.value === '' ? null : type === 'number' ? parseFloat(e.target.value) : e.target.value,
            }))}
            style={{
              background: 'var(--surface-3)',
              border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
              fontSize: 13,
              padding: '5px 8px',
              width: '100%',
            }}
          />
          {suffix && <span style={{ color: 'var(--text-4)', fontSize: 12, whiteSpace: 'nowrap' }}>{suffix}</span>}
        </div>
      </div>
    )
  }

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  const ViableIcon = calc.viable === 'green' ? TrendingUp : calc.viable === 'yellow' ? Minus : TrendingDown

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${VIABLE_COLOR[calc.viable]}`,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        cursor: 'pointer',
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{ color: 'var(--text-4)', flexShrink: 0 }}>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                padding: '3px 8px',
                width: 200,
              }}
            />
          ) : (
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{draft.name}</span>
          )}
          {draft.products && (
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-4)' }}>
              → {draft.products.name}
            </span>
          )}
        </div>

        {/* KPI pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
            {fmtEur(draft.daily_budget_eur)}/dia
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: VIABLE_COLOR[calc.viable],
            background: VIABLE_BG[calc.viable],
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}>
            ROAS {fmt(calc.roas, 2)}x
          </span>
          <span style={{
            fontSize: 12,
            color: calc.net_profit_day >= 0 ? '#22c55e' : '#ef4444',
          }}>
            {calc.net_profit_day >= 0 ? '+' : ''}{fmtEur(calc.net_profit_day)}/dia
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: VIABLE_COLOR[calc.viable],
            fontSize: 11,
          }}>
            <ViableIcon size={12} />
            <span>{calc.viability_reason}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          {editing ? (
            <>
              <button onClick={save} className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                Salvar
              </button>
              <button onClick={() => { setDraft(scenario); setEditing(false) }} className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setEditing(true); setExpanded(true) }} className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                Editar
              </button>
              <button onClick={() => onDuplicate(scenario)} title="Duplicar" style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-4)', cursor: 'pointer', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Copy size={12} />
              </button>
              <button onClick={() => onDelete(scenario.id)} title="Deletar" style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-4)', cursor: 'pointer', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Inputs grid */}
          {editing && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Parâmetros do Cenário
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {/* Product selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Produto (opcional)
                  </label>
                  <select
                    value={draft.product_id ?? ''}
                    onChange={e => setDraft(d => ({ ...d, product_id: e.target.value || null }))}
                    style={{
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border-input)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text)',
                      fontSize: 13,
                      padding: '5px 8px',
                    }}
                  >
                    <option value="">— Sem produto vinculado —</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                {field('daily_budget_eur', 'Budget diário', '€/dia')}
                {field('cpm_eur', 'CPM estimado', '€')}
                {field('ctr_pct', 'CTR esperado', '%')}
                {field('cvr_pct', 'CVR esperado', '%')}
                {field('aov_eur', 'AOV (ticket médio)', '€')}
                {field('cog_eur', 'Custo do produto (COG)', '€')}
                {field('freight_eur', 'Frete por unidade', '€')}
                {field('return_rate_pct', 'Taxa de retorno', '%')}
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                  Notas
                </label>
                <textarea
                  value={draft.notes ?? ''}
                  onChange={e => setDraft(d => ({ ...d, notes: e.target.value || null }))}
                  rows={2}
                  style={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--border-input)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    fontSize: 13,
                    padding: '6px 8px',
                    width: '100%',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          )}

          {/* Funnel metrics */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Funil Projetado (diário)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {[
                { label: 'Impressões', value: fmt(calc.impressions_day, 0), sub: 'por dia' },
                { label: 'Cliques', value: fmt(calc.clicks_day, 0), sub: 'por dia' },
                { label: 'CPC', value: fmtEur(calc.cpc_eur), sub: 'por clique' },
                { label: 'Sessões', value: fmt(calc.sessions_day, 0), sub: 'por dia' },
                { label: 'Pedidos/dia', value: fmt(calc.orders_day, 2), sub: calc.orders_day < 1 ? '⚠ menos de 1' : '' },
                { label: 'Receita/dia', value: fmtEur(calc.revenue_day), sub: '' },
                { label: 'CAC', value: fmtEur(calc.cac_eur), sub: 'custo por cliente' },
                { label: 'ROAS', value: `${fmt(calc.roas, 2)}x`, sub: `mín: ${fmt(draft.aov_eur > 0 ? draft.aov_eur / draft.daily_budget_eur : 0, 2)}x` },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                  {sub && <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{sub}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Custos */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Breakdown de Custos (diário)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Produto (COG)', value: calc.cog_total },
                  { label: 'Frete', value: calc.freight_total },
                  { label: 'IOF (3.5%)', value: calc.iof_amount },
                  { label: 'Gateway (5.99%)', value: calc.gateway_fee },
                  { label: 'Checkout (0.5%)', value: calc.checkout_fee },
                  { label: `Devoluções (${draft.return_rate_pct}%)`, value: calc.returns_cost },
                  { label: 'Ad Spend', value: draft.daily_budget_eur },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--text-3)' }}>{label}</span>
                    <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{fmtEur(value)}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0 0',
                  fontSize: 13, fontWeight: 700,
                }}>
                  <span style={{ color: 'var(--text-2)' }}>Total</span>
                  <span style={{ color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>{fmtEur(calc.total_cost)}</span>
                </div>
              </div>
            </div>

            {/* P&L */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                P&L Estimado
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Receita bruta/dia', value: calc.revenue_day, positive: true },
                  { label: '(-) Custos totais/dia', value: -calc.total_cost, positive: false },
                  { label: 'Lucro líquido/dia', value: calc.net_profit_day, highlight: true },
                  { label: 'Margem líquida', value: null, text: `${fmt(calc.margin_pct, 1)}%`, highlight: false },
                  { label: 'Lucro líquido/mês (30d)', value: calc.net_profit_month, positive: true },
                  { label: 'Break-even em', value: null, text: `${fmt(calc.be_orders, 1)} pedidos/dia`, positive: true },
                ].map(({ label, value, text, highlight }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 13,
                    fontWeight: highlight ? 700 : 400,
                  }}>
                    <span style={{ color: highlight ? 'var(--text-2)' : 'var(--text-3)' }}>{label}</span>
                    <span style={{
                      color: highlight ? (value !== null && value >= 0 ? '#22c55e' : '#ef4444') : 'var(--text)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {text ?? (value !== null ? (value >= 0 ? '+' : '') + fmtEur(value) : '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly projection */}
          <div style={{
            background: VIABLE_BG[calc.viable],
            border: `1px solid ${VIABLE_COLOR[calc.viable]}30`,
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            display: 'flex', gap: 32, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 2 }}>Receita mensal estimada</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtEur(calc.revenue_month)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 2 }}>Pedidos/mês estimados</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(calc.orders_month, 0)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 2 }}>Lucro líquido/mês</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: calc.net_profit_month >= 0 ? '#22c55e' : '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                {calc.net_profit_month >= 0 ? '+' : ''}{fmtEur(calc.net_profit_month)}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ViableIcon size={14} color={VIABLE_COLOR[calc.viable]} />
              <span style={{ fontSize: 13, color: VIABLE_COLOR[calc.viable], fontWeight: 600 }}>
                {calc.viability_reason}
              </span>
            </div>
          </div>

          {draft.notes && !editing && (
            <div style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>
              {draft.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CenariosClient() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [sRes, pRes] = await Promise.all([
      fetch('/api/cenarios'),
      fetch('/api/products'),
    ])
    if (sRes.ok) setScenarios(await sRes.json())
    if (pRes.ok) setProducts(await pRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/cenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...BLANK, name: `Cenário ${scenarios.length + 1}` }),
    })
    if (res.ok) {
      const s = await res.json()
      setScenarios(prev => [s, ...prev])
    }
    setCreating(false)
  }

  async function handleUpdate(updated: Scenario) {
    const { id, products: _p, ...rest } = updated
    const res = await fetch('/api/cenarios', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...rest }),
    })
    if (res.ok) {
      const s = await res.json()
      setScenarios(prev => prev.map(x => x.id === s.id ? { ...s, products: updated.products } : x))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar cenário?')) return
    setScenarios(prev => prev.filter(x => x.id !== id))
    await fetch('/api/cenarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function handleDuplicate(s: Scenario) {
    const { id: _id, products: _p, ...rest } = s
    const res = await fetch('/api/cenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, name: `${s.name} (cópia)` }),
    })
    if (res.ok) {
      const newS = await res.json()
      setScenarios(prev => [newS, ...prev])
    }
  }

  // Summary stats
  const avgRoas = scenarios.length > 0
    ? scenarios.reduce((acc, s) => acc + calcScenario(s).roas, 0) / scenarios.length
    : 0
  const totalBudget = scenarios.reduce((acc, s) => acc + s.daily_budget_eur, 0)
  const greenCount = scenarios.filter(s => calcScenario(s).viable === 'green').length
  const redCount = scenarios.filter(s => calcScenario(s).viable === 'red').length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: 'var(--text)', margin: 0 }}>
            CENÁRIOS
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 13, margin: '4px 0 0' }}>
            Modelagem de funil e viabilidade econômica
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} />
          {creating ? 'Criando...' : 'Novo Cenário'}
        </button>
      </div>

      {/* Summary bar */}
      {scenarios.length > 0 && (
        <div style={{
          display: 'flex', gap: 16,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '12px 20px',
          marginBottom: 20,
        }}>
          {[
            { label: 'Cenários', value: scenarios.length.toString() },
            { label: 'Budget total/dia', value: `€${fmt(totalBudget)}` },
            { label: 'ROAS médio', value: `${fmt(avgRoas, 2)}x` },
            { label: 'Viáveis', value: `${greenCount}`, color: '#22c55e' },
            { label: 'Inviáveis', value: `${redCount}`, color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: color ?? 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-4)', paddingTop: 60 }}>Carregando...</div>
      ) : scenarios.length === 0 ? (
        <div style={{
          textAlign: 'center', color: 'var(--text-4)',
          paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <FlaskConical size={40} strokeWidth={1} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-3)' }}>Nenhum cenário criado</div>
          <div style={{ fontSize: 13 }}>Modele o funil antes de investir em ads</div>
          <button onClick={handleCreate} className="btn btn-primary" style={{ marginTop: 8 }}>
            Criar primeiro cenário
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenarios.map(s => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              products={products}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

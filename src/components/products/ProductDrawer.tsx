'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ExternalLink, TrendingUp, FlaskConical, Megaphone, Megaphone as CampIcon, ChevronRight, Save, Loader2, AlertCircle, Copy, CheckCheck, Sparkles } from 'lucide-react'
import { calcPricing, calcVolumeProjections, fmtEur, fmtPct, DEFAULT_PRICING_CONFIG, type PricingInputs } from '@/lib/pricing'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductFull {
  id: string
  name: string
  line_category: string | null
  source_url: string | null
  mineracao_id: string | null
  notreglr_score: number | null
  notreglr_label: string | null
  notreglr_visual_traits: string[]
  images: string[]
  pipeline_status: 'a_testar' | 'testando' | 'validado' | 'descartado'
  status: string
  notes: string | null
  created_at: string
  // conteúdo gerado
  product_name: string | null
  hook: string | null
  features: string[] | null
  shopify_tags: string[] | null
  line_name: string | null
  content_status: string | null
  fold2_image_url: string | null
  // joined
  product_pricing: PricingRow | null
  creatives: { id: string }[]
  ad_campaigns: { id: string; status: string }[]
}

interface PricingRow {
  id: string
  product_id: string
  cog_eur: number | null
  freight_eur: number
  sale_price_eur: number | null
  coupon_pct: number
  iof_rate: number
  checkout_fee_rate: number
  gateway_fee_rate: number
  marketing_allocation_pct: number
  other_taxes_rate: number
  notes: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PIPELINE_LABELS: Record<string, string> = {
  a_testar: 'A Testar', testando: 'Testando', validado: 'Validado', descartado: 'Descartado',
}
const PIPELINE_COLORS: Record<string, string> = {
  a_testar: 'var(--text-3)', testando: 'var(--warning)', validado: 'var(--success)', descartado: 'var(--error)',
}

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

// ─── Tab: Visão Geral ─────────────────────────────────────────────────────────

function TabGeral({ product }: { product: ProductFull }) {
  const activeCampaigns = product.ad_campaigns?.filter(c => c.status === 'testando').length ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Imagens */}
      {product.images?.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {product.images.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ))}
        </div>
      )}

      {/* Score + Label */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {product.notreglr_score !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontFamily: 'var(--font-alt)', color: scoreColor(product.notreglr_score), lineHeight: 1 }}>
              {product.notreglr_score}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</div>
          </div>
        )}
        {product.notreglr_label && (
          <span className={labelBadgeClass(product.notreglr_label)} style={{ textTransform: 'capitalize' }}>
            {product.notreglr_label}
          </span>
        )}
        {product.line_category && (
          <span className="badge badge-neutral">{product.line_category}</span>
        )}
      </div>

      {/* Onde está */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Onde está
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {product.mineracao_id && (
            <ModuleBadge icon={<FlaskConical size={11} />} label="Mineração" color="var(--info)" />
          )}
          <ModuleBadge
            icon={<TrendingUp size={11} />}
            label={`Esteira: ${PIPELINE_LABELS[product.pipeline_status]}`}
            color={PIPELINE_COLORS[product.pipeline_status]}
          />
          {product.creatives?.length > 0 && (
            <ModuleBadge icon={<Megaphone size={11} />} label={`Criativos: ${product.creatives.length}`} color="var(--brand)" />
          )}
          {product.ad_campaigns?.length > 0 && (
            <ModuleBadge icon={<CampIcon size={11} />} label={`Campanhas: ${product.ad_campaigns.length}${activeCampaigns > 0 ? ` (${activeCampaigns} ativas)` : ''}`} color="var(--warning)" />
          )}
        </div>
      </div>

      {/* Traits */}
      {product.notreglr_visual_traits?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Traits visuais
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {product.notreglr_visual_traits.map(t => (
              <span key={t} className="badge badge-neutral" style={{ fontSize: 10 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Link fonte */}
      {product.source_url && (
        <a href={product.source_url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--brand)', fontSize: 12, textDecoration: 'none' }}>
          <ExternalLink size={12} /> Ver no fornecedor
        </a>
      )}
    </div>
  )
}

function ModuleBadge({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 'var(--radius-full)',
      border: `1px solid ${color}`, color, fontSize: 11,
      fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
    }}>
      {icon} {label}
    </span>
  )
}

// ─── Tab: Precificação ────────────────────────────────────────────────────────

function TabPrecificacao({ product, onPricingUpdate }: { product: ProductFull; onPricingUpdate: () => void }) {
  const p = product.product_pricing
  const [form, setForm] = useState<PricingInputs>({
    cog_eur: p?.cog_eur ?? null,
    freight_eur: p?.freight_eur ?? 0,
    sale_price_eur: p?.sale_price_eur ?? null,
    coupon_pct: p?.coupon_pct ?? 0,
    iof_rate: p?.iof_rate ?? DEFAULT_PRICING_CONFIG.iof_rate,
    checkout_fee_rate: p?.checkout_fee_rate ?? DEFAULT_PRICING_CONFIG.checkout_fee_rate,
    gateway_fee_rate: p?.gateway_fee_rate ?? DEFAULT_PRICING_CONFIG.gateway_fee_rate,
    marketing_allocation_pct: p?.marketing_allocation_pct ?? DEFAULT_PRICING_CONFIG.marketing_allocation_pct,
    other_taxes_rate: p?.other_taxes_rate ?? DEFAULT_PRICING_CONFIG.other_taxes_rate,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const calc = calcPricing(form)
  const projections = calc ? calcVolumeProjections(calc) : []

  function num(val: string) { const n = parseFloat(val); return isNaN(n) ? null : n }
  function pct(val: string) { const n = parseFloat(val); return isNaN(n) ? 0 : n / 100 }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/products/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id, ...form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onPricingUpdate()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text)',
    fontSize: 13, fontFamily: 'var(--font)', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, display: 'block',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Inputs principais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>COG (custo produto) €</label>
          <input type="number" step="0.01" min="0" style={inputStyle}
            value={form.cog_eur ?? ''} onChange={e => setForm(f => ({ ...f, cog_eur: num(e.target.value) }))} placeholder="0.00" />
        </div>
        <div>
          <label style={labelStyle}>Frete €</label>
          <input type="number" step="0.01" min="0" style={inputStyle}
            value={form.freight_eur} onChange={e => setForm(f => ({ ...f, freight_eur: num(e.target.value) ?? 0 }))} placeholder="0.00" />
        </div>
        <div>
          <label style={labelStyle}>Preço de venda €</label>
          <input type="number" step="0.01" min="0" style={inputStyle}
            value={form.sale_price_eur ?? ''} onChange={e => setForm(f => ({ ...f, sale_price_eur: num(e.target.value) }))} placeholder="0.00" />
        </div>
        <div>
          <label style={labelStyle}>Cupom %</label>
          <input type="number" step="0.1" min="0" max="100" style={inputStyle}
            value={(form.coupon_pct * 100).toFixed(1)} onChange={e => setForm(f => ({ ...f, coupon_pct: pct(e.target.value) }))} placeholder="0.0" />
        </div>
      </div>

      {/* Taxas — colapsável */}
      <details style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <summary style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none' }}>
          Taxas e Alocações (avançado)
        </summary>
        <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { key: 'iof_rate', label: 'IOF %', default: DEFAULT_PRICING_CONFIG.iof_rate },
            { key: 'gateway_fee_rate', label: 'Gateway %', default: DEFAULT_PRICING_CONFIG.gateway_fee_rate },
            { key: 'checkout_fee_rate', label: 'Checkout %', default: DEFAULT_PRICING_CONFIG.checkout_fee_rate },
            { key: 'marketing_allocation_pct', label: 'Marketing %', default: DEFAULT_PRICING_CONFIG.marketing_allocation_pct },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input type="number" step="0.01" min="0" max="100" style={inputStyle}
                value={((form[key as keyof PricingInputs] as number) * 100).toFixed(2)}
                onChange={e => setForm(f => ({ ...f, [key]: pct(e.target.value) }))}
              />
            </div>
          ))}
        </div>
      </details>

      {/* Resultado calculado */}
      {calc ? (
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 16, border: '1px solid var(--border-input)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <CalcCell label="Lucro líquido" value={fmtEur(calc.netProfit)} color={calc.netProfit > 0 ? 'var(--success)' : 'var(--error)'} />
            <CalcCell label="Margem" value={fmtPct(calc.profitMarginPct)} color={calc.profitMarginPct > 0.25 ? 'var(--success)' : calc.profitMarginPct > 0 ? 'var(--warning)' : 'var(--error)'} />
            <CalcCell label="Markup" value={`${calc.markup.toFixed(1)}x`} color="var(--text)" />
            <CalcCell label="CPA ideal" value={fmtEur(calc.cpaIdeal)} color="var(--info)" />
            <CalcCell label="CPA máx" value={fmtEur(calc.cpaMax)} color="var(--text-3)" />
            <CalcCell label="ROAS mín" value={`${calc.roasMin.toFixed(2)}x`} color="var(--brand)" />
          </div>

          {/* Detalhe de custos */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Custo total (COG+frete+IOF)', value: fmtEur(calc.totalCost) },
              { label: 'Gateway', value: fmtEur(calc.gatewayFee) },
              { label: 'Checkout', value: fmtEur(calc.checkoutFee) },
              { label: 'Marketing (aloc.)', value: fmtEur(calc.marketingBudget) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)' }}>
                <span>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-4)', fontSize: 12 }}>
          <AlertCircle size={13} /> Preencha COG e preço de venda para ver os cálculos
        </div>
      )}

      {/* Projeções de volume */}
      {projections.length > 0 && (
        <div>
          <div style={labelStyle}>Projeção de lucro por volume</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {projections.map(({ units, profit }) => (
              <div key={units} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{units.toLocaleString()} un.</div>
                <div style={{ fontSize: 14, fontFamily: 'var(--font-alt)', color: profit > 0 ? 'var(--success)' : 'var(--error)', lineHeight: 1 }}>
                  {fmtEur(profit, 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
        {saving ? <><Loader2 size={13} className="spin" /> Salvando…</> : saved ? '✓ Salvo' : <><Save size={13} /> Salvar precificação</>}
      </button>
    </div>
  )
}

function CalcCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 18, fontFamily: 'var(--font-alt)', color, lineHeight: 1 }}>{value}</div>
    </div>
  )
}

// ─── Tab: Esteira ─────────────────────────────────────────────────────────────

function TabEsteira({ product, onUpdate }: { product: ProductFull; onUpdate: () => void }) {
  const [status, setStatus] = useState(product.pipeline_status)
  const [saving, setSaving] = useState(false)

  const stages: Array<{ key: string; label: string; color: string }> = [
    { key: 'a_testar', label: 'A Testar', color: 'var(--text-3)' },
    { key: 'testando', label: 'Testando', color: 'var(--warning)' },
    { key: 'validado', label: 'Validado', color: 'var(--success)' },
    { key: 'descartado', label: 'Descartado', color: 'var(--error)' },
  ]

  async function handleMove(newStatus: string) {
    setSaving(true)
    setStatus(newStatus as typeof status)
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, pipeline_status: newStatus }),
    })
    setSaving(false)
    onUpdate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Status atual na esteira
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {stages.map(({ key, label, color }) => {
          const isActive = status === key
          return (
            <button
              key={key}
              onClick={() => handleMove(key)}
              disabled={saving || isActive}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 'var(--radius)',
                border: `1px solid ${isActive ? color : 'var(--border)'}`,
                background: isActive ? `color-mix(in srgb, ${color} 12%, transparent)` : 'var(--surface-2)',
                cursor: isActive ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? color : 'var(--border)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: isActive ? color : 'var(--text-3)', fontWeight: isActive ? 600 : 400 }}>{label}</span>
              {isActive && <span style={{ marginLeft: 'auto', fontSize: 10, color, fontFamily: 'var(--font-mono)' }}>ATUAL</span>}
              {!isActive && <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text-4)' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Criativos ───────────────────────────────────────────────────────────

const LINE_DESC: Record<string, string> = {
  'Wrong Shapes': 'sculptural, geometric, unusual-format bag',
  'The Furred': 'fuzzy, plush, fur-textured bag',
  'Color Riot': 'bold color-blocked, aggressively saturated bag',
  'Not Your Garden': 'floral-patterned, embroidered botanical bag',
  'Shell Shocked': 'shell-inspired, iridescent, marine-toned bag',
  'The Excessive': 'rhinestone-covered, crystal-embellished, beaded bag',
}

const NEGATIVE_PROMPT = `blurry bag, wrong bag shape, wrong bag color, missing bag details, deformed bag, extra limbs, bad anatomy, distorted face, artificial skin, overly smooth skin, plastic look, studio backdrop, white background, luxury editorial, stiff model pose, watermark, text, logo, low quality, pixelated, overexposed, CGI, multiple bags, fashion week aesthetic, glossy magazine look`

interface BananaPrompts {
  main: string
  negative: string
  variations: Array<{ label: string; prompt: string }>
}

function buildPrompts(product: ProductFull): BananaPrompts {
  const traits = (product.notreglr_visual_traits ?? []).slice(0, 4)
  const line = product.line_name ?? product.line_category ?? 'Wrong Shapes'
  const lineDesc = LINE_DESC[line] ?? 'statement bag'
  const bagDesc = [lineDesc, ...traits].filter(Boolean).join(', ')
  const nameNote = product.product_name ? ` ("${product.product_name}")` : ''

  const subject = `Young woman with white skin, naturally curly hair, casual European street style — preserve exact facial features, skin tone and hair texture from reference photo`
  const bag = `She is carrying the exact bag${nameNote} from the product reference image, clearly visible and prominently placed in frame. Bag: ${bagDesc}`
  const camera = `Shot on 85mm f/1.8, shallow depth of field, Canon EOS R5`
  const style = `Style: raw editorial street photography — real person energy, NOT luxury fashion campaign, NOT studio glossy, NOT model pose. Ultra-detailed, photorealistic, 4K, RAW photo, no artifacts`

  const main = `${subject}. ${bag}. Background: slightly blurred European cobblestone street, autumn atmosphere. Posture: natural, casual, mid-stride, as if caught by a street photographer. Lighting: soft natural daylight, warm golden tones, no harsh shadows. ${camera}. ${style}.`

  const vars = [
    {
      label: 'Variação 1 — Rua, andando',
      outfit: 'oversized cream linen shirt, straight-leg dark jeans, white sneakers',
      action: 'walking confidently mid-stride, bag on shoulder',
      setting: 'slightly blurred cobblestone European street, Amsterdam, autumn',
      light: 'soft natural daylight, warm golden tones',
    },
    {
      label: 'Variação 2 — Parede, parada',
      outfit: 'black turtleneck, wide-leg trousers, flat mules',
      action: 'leaning against a concrete wall, arms relaxed, bag held by top handle at side',
      setting: 'clean concrete urban wall, minimal background',
      light: 'overcast flat light, even and diffused, no harsh shadows',
    },
    {
      label: 'Variação 3 — Café exterior',
      outfit: 'cropped denim jacket, white tee, wide-leg pants',
      action: 'sitting at outdoor café table, bag placed on table in front, looking slightly off-camera',
      setting: 'European café exterior, blurred chairs and awning',
      light: 'soft morning light, warm and natural',
    },
    {
      label: 'Variação 4 — Close na bolsa',
      outfit: 'olive green oversized coat, minimal jewelry',
      action: 'close-up shot, hand holding bag up by strap toward camera, face partially visible in background, bag center-frame',
      setting: 'neutral wall or metro steps, city environment',
      light: 'crisp natural light, slight contrast, clean shadows',
    },
  ]

  return {
    main,
    negative: NEGATIVE_PROMPT,
    variations: vars.map(v => ({
      label: v.label,
      prompt: `${subject}, wearing ${v.outfit}, ${v.action}. ${bag}. Setting: ${v.setting}. Lighting: ${v.light}. ${camera}. ${style}.`,
    })),
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="btn btn-ghost" style={{ fontSize: 11, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
      {copied ? <><CheckCheck size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
    </button>
  )
}

function PromptBlock({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: accent ? 'var(--brand)' : 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <div style={{
        background: 'var(--surface-2)', border: `1px solid ${accent ? 'var(--brand-dim)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '10px 12px',
        fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6,
        fontFamily: 'var(--font)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {text}
      </div>
    </div>
  )
}

function TabCreatives({ product }: { product: ProductFull }) {
  const [prompts, setPrompts] = useState<BananaPrompts | null>(null)

  function generate() {
    setPrompts(buildPrompts(product))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Gerador de prompts Nano Banana */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Prompts — Nano Banana
          </div>
          <button onClick={generate} className="btn btn-primary" style={{ fontSize: 11, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={11} /> {prompts ? 'Regerar' : 'Gerar Prompts'}
          </button>
        </div>

        {!prompts && (
          <div style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', padding: '20px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
            Clique em "Gerar Prompts" para criar os prompts de imagem com a Stef + este produto.
          </div>
        )}

        {prompts && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PromptBlock label="Prompt Principal" text={prompts.main} accent />
            <PromptBlock label="Negative Prompt" text={prompts.negative} />

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
                Variações (trocar roupa, pose e cenário)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {prompts.variations.map(v => (
                  <PromptBlock key={v.label} label={v.label} text={v.prompt} />
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 11, color: 'var(--text-4)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-3)' }}>Como usar:</strong> suba a foto da Stef como referência 1 (peso maior) e a foto da bolsa como referência 2. Use o Prompt Principal ou uma das Variações. Negative Prompt vai no campo separado.
            </div>
          </div>
        )}
      </div>

      {/* Criativos vinculados */}
      {product.creatives?.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Criativos Vinculados
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {product.creatives.length} criativo(s) vinculado(s).
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab: Conteúdo ────────────────────────────────────────────────────────────

const CONTENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Aguardando geração',
  generating: 'Gerando…',
  done: 'Gerado',
  error: 'Erro na geração',
}

function TabConteudo({ product, onUpdate }: { product: ProductFull; onUpdate: () => void }) {
  const [rawText, setRawText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState<Partial<{
    product_name: string; hook: string; features: string; shopify_tags: string; line_name: string; fold2_image_url: string
  }>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDone = product.content_status === 'done'

  async function generate() {
    if (!rawText.trim()) { setErr('Cole o texto da página do AliExpress antes de gerar.'); return }
    setErr(''); setGenerating(true)
    const res = await fetch('/api/products/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id, raw_page_content: rawText }),
    })
    setGenerating(false)
    if (!res.ok) { const d = await res.json(); setErr(d.error ?? 'Erro'); return }
    setEditing({})
    onUpdate()
  }

  async function save() {
    setSaving(true)
    const updates: Record<string, unknown> = {}
    if (editing.product_name !== undefined) updates.product_name = editing.product_name
    if (editing.hook !== undefined) updates.hook = editing.hook
    if (editing.features !== undefined) updates.features = editing.features.split('\n').map(s => s.replace(/^[•\-]\s*/, '').trim()).filter(Boolean)
    if (editing.shopify_tags !== undefined) updates.shopify_tags = editing.shopify_tags.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    if (editing.line_name !== undefined) updates.line_name = editing.line_name
    if (editing.fold2_image_url !== undefined) updates.fold2_image_url = editing.fold2_image_url
    await fetch('/api/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: product.id, ...updates }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
    onUpdate()
  }

  const currentFeatures = editing.features ?? (product.features ?? []).join('\n')
  const currentTags = editing.shopify_tags ?? (product.shopify_tags ?? []).join(', ')
  const hasEdits = Object.keys(editing).length > 0

  const fieldStyle = {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13,
    padding: '8px 10px', fontFamily: 'var(--font)', resize: 'vertical' as const,
    outline: 'none', lineHeight: 1.5,
  }
  const labelStyle = { fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 5, display: 'block' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Status + geração */}
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 14, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isDone ? 12 : 0 }}>
          <span style={{ fontSize: 11, color: isDone ? 'var(--success)' : 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
            {CONTENT_STATUS_LABEL[product.content_status ?? 'pending'] ?? 'Pendente'}
          </span>
          {isDone && (
            <button onClick={() => setRawText('')} className="btn btn-ghost" style={{ fontSize: 11, padding: '2px 8px' }}>
              Regerar
            </button>
          )}
        </div>
        {(!isDone || rawText) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Texto da página do AliExpress</label>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={'Cole aqui o texto completo da página do produto no AliExpress.\nInclua: título, specs, materiais, dimensões, descrição do fornecedor.'}
              style={{ ...fieldStyle, minHeight: 120 }}
            />
            {err && <span style={{ fontSize: 11, color: 'var(--error)' }}>{err}</span>}
            <button onClick={generate} disabled={generating} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              {generating ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Gerando…</> : 'Gerar com Claude'}
            </button>
          </div>
        )}
      </div>

      {/* Campos gerados — editáveis */}
      {isDone && !rawText && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Nome do Produto</label>
            <input
              value={editing.product_name ?? product.product_name ?? ''}
              onChange={e => setEditing(p => ({ ...p, product_name: e.target.value }))}
              style={{ ...fieldStyle, resize: undefined }}
              placeholder="Ex: The Amsterdam Intruder"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Hook (1 frase)</label>
            <input
              value={editing.hook ?? product.hook ?? ''}
              onChange={e => setEditing(p => ({ ...p, hook: e.target.value }))}
              style={{ ...fieldStyle, resize: undefined }}
              placeholder="Ex: For people who stopped explaining their taste."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Features (1 por linha)</label>
            <textarea
              value={currentFeatures}
              onChange={e => setEditing(p => ({ ...p, features: e.target.value }))}
              style={{ ...fieldStyle, minHeight: 100 }}
              placeholder={'Holds your phone, keys, cards, and one bad decision\nMagnetic closure\n...'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Linha</label>
            <select
              value={editing.line_name ?? product.line_name ?? ''}
              onChange={e => setEditing(p => ({ ...p, line_name: e.target.value }))}
              style={{ ...fieldStyle, resize: undefined }}
            >
              {['Wrong Shapes','The Furred','Color Riot','Not Your Garden','Shell Shocked','The Excessive'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Shopify Tags (separadas por vírgula)</label>
            <input
              value={currentTags}
              onChange={e => setEditing(p => ({ ...p, shopify_tags: e.target.value }))}
              style={{ ...fieldStyle, resize: undefined }}
              placeholder="sculptural, bold-color, wrong-shapes, crossbody"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Imagem Segunda Dobra (URL)</label>
            <input
              value={editing.fold2_image_url ?? product.fold2_image_url ?? ''}
              onChange={e => setEditing(p => ({ ...p, fold2_image_url: e.target.value }))}
              style={{ ...fieldStyle, resize: undefined }}
              placeholder="https://..."
            />
          </div>

          {hasEdits && (
            <button onClick={save} disabled={saving} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              {saving ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Salvando…</> : saved ? '✓ Salvo' : 'Salvar alterações'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

type Tab = 'geral' | 'precificacao' | 'esteira' | 'criativos' | 'conteudo'

interface Props {
  productId: string | null
  onClose: () => void
  onUpdate?: () => void
}

export function ProductDrawer({ productId, onClose, onUpdate }: Props) {
  const [product, setProduct] = useState<ProductFull | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('geral')

  const fetchProduct = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    const res = await fetch('/api/products')
    const all: ProductFull[] = await res.json()
    const found = all.find(p => p.id === productId) ?? null
    setProduct(found)
    setLoading(false)
  }, [productId])

  useEffect(() => {
    if (productId) {
      setTab('geral')
      fetchProduct()
    }
  }, [productId, fetchProduct])

  // Fechar com Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!productId) return null

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: 'geral', label: 'Visão Geral' },
    { key: 'conteudo', label: 'Conteúdo' },
    { key: 'precificacao', label: 'Precificação' },
    { key: 'esteira', label: 'Esteira' },
    { key: 'criativos', label: 'Criativos' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 999, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480, background: 'var(--surface-panel)',
        borderLeft: '1px solid var(--border)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                WARD / PRODUTO
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {loading ? '…' : (product?.name ?? '—')}
              </h2>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, marginLeft: 8 }}>
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '5px 12px', fontSize: 12, border: 'none', cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)',
                  background: tab === key ? 'var(--brand-dim)' : 'transparent',
                  color: tab === key ? 'var(--brand)' : 'var(--text-3)',
                  fontWeight: tab === key ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'var(--text-4)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : product ? (
            <>
              {tab === 'geral' && <TabGeral product={product} />}
              {tab === 'conteudo' && <TabConteudo product={product} onUpdate={fetchProduct} />}
              {tab === 'precificacao' && <TabPrecificacao product={product} onPricingUpdate={fetchProduct} />}
              {tab === 'esteira' && <TabEsteira product={product} onUpdate={() => { fetchProduct(); onUpdate?.() }} />}
              {tab === 'criativos' && <TabCreatives product={product} />}
            </>
          ) : (
            <div style={{ color: 'var(--text-4)', fontSize: 13 }}>Produto não encontrado.</div>
          )}
        </div>
      </div>
    </>
  )
}

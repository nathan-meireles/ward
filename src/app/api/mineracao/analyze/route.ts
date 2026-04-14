import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── DOWNLOAD DE IMAGEM → BASE64 ───────────────────────────────────────────

async function imageToBase64(url: string): Promise<{ data: string; mediaType: ImageMediaType } | null> {
  try {
    const res = await fetch(url, {
      headers: { 'Referer': 'https://www.aliexpress.com/' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = ((res.headers.get('content-type') ?? 'image/jpeg').split(';')[0].trim()) as ImageMediaType
    return { data: base64, mediaType }
  } catch {
    return null
  }
}

// ─── ANÁLISE COM CLAUDE VISION ─────────────────────────────────────────────

const NOTREGLR_PROMPT = `Você é um curador RIGOROSO de produtos para a NOTREGLR, marca anti-fashion de bolsas femininas vendidas na Europa (€55–80).

CONCEITO: "Not regular. Not for everyone."
A NOTREGLR ri de si mesma, assume o estranho, vende IDENTIDADE — não status, não elegância, não luxo.

FILTRO PRINCIPAL (faça antes de tudo):
"Essa bolsa faria alguém parar o scroll e pensar 'que porra é essa?' — não de admiração elegante, mas de estranhamento genuíno?"
→ SIM + estranhamento real: score alto | SIM mas com ressalvas: score médio | NÃO ou elegante: score baixo

━━━ FORTE (75-100) — DNA NOTREGLR puro ━━━
Exige TODOS estes elementos:
• Formato realmente incomum que causa estranhamento genuíno (não só "diferente")
• Cor agressiva/saturada OU textura statement que domina a peça
• Design que comunica irreverência, não sofisticação
• Alguém olharia e diria "não é pra qualquer pessoa" — não "que bonito"

━━━ MÉDIO (50-74) — interessante com ressalvas ━━━
• Formato incomum MAS em cores neutras/seguras
• Textura diferente MAS design geral convencional
• Colorida MAS formato básico
• Passa o filtro mas não é destaque óbvio

━━━ FRACO (0-49) — não é NOTREGLR ━━━
• Elegância convencional de qualquer tipo
• Bolsa de festa/gala (clutch elegante, rhinestone sofisticado)
• Novelty bag literal (formato de animal realista, comida, objeto — é infantil/turístico, não anti-fashion)
• Minimalismo refinado
• Qualquer bolsa que pareceria "bonita" numa boutique ou loja de luxo
• Cores neutras (bege, camel, preto, dourado) mesmo com formato diferente

━━━ FALSOS POSITIVOS — atenção especial ━━━
• Rhinestone ELEGANTE (clutch de gala dourada) → FRACO. Rhinestone KITSCH/STATEMENT (bolsa coberta de cristais coloridos exagerados, formato incomum) → FORTE
• Shell/concha MINIMALISTA em bege → FRACO. Shell ESCULTURAL colorida e exagerada → FORTE
• Fuzzy NEUTRO (pelúcia bege discreta) → MÉDIO no máximo. Fuzzy em cor agressiva + formato incomum → FORTE
• Bordado DELICADO floral → FRACO. Bordado EXCESSIVO e saturado de cores → MÉDIO/FORTE
• Crocodilo/animal como TEXTURA em bolsa convencional → FRACO. Animal como FORMATO 3D kitsch → MÉDIO

Responda EXCLUSIVAMENTE neste formato JSON (sem texto antes ou depois):
{
  "score": <inteiro 0-100>,
  "label": "<forte|medio|fraco>",
  "reasoning": "<2-3 frases em português BR — seja direto sobre o que passa e o que não passa no filtro>",
  "visual_traits": ["<característica visual 1>", "<característica visual 2>", "<característica visual 3>"]
}

Seja RIGOROSO. Forte deve ser reservado para peças que realmente causam estranhamento. Avalie APENAS pela aparência visual.`

async function analyzeWithClaude(images: string[]): Promise<{
  score: number; label: string; reasoning: string; visual_traits: string[]
} | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const client = new Anthropic({ apiKey })
  const imageContents: Anthropic.ImageBlockParam[] = []

  for (const imgUrl of images.slice(0, 3)) {
    const img = await imageToBase64(imgUrl)
    if (img) {
      imageContents.push({
        type: 'image',
        source: { type: 'base64', media_type: img.mediaType, data: img.data },
      })
    }
    if (imageContents.length >= 2) break
  }

  if (imageContents.length === 0) return null

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [...imageContents, { type: 'text', text: NOTREGLR_PROMPT }],
      }],
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]+\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

// ─── HANDLER ───────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = sb()
    const body = await request.json()

    const {
      productId,
      url,
      title,
      images,
      price_min: priceMin,
      price_max: priceMax,
      orders_count,
      rating,
      review_count: reviewCount,
      seller_name,
      seller_positive_rate,
      fetchError,
    } = body as {
      productId: string
      url: string
      title?: string
      images?: string[]
      price_min?: number
      price_max?: number
      orders_count?: string
      rating?: number
      review_count?: number
      seller_name?: string
      seller_positive_rate?: string
      fetchError?: string
    }

    if (!productId) return NextResponse.json({ error: 'productId obrigatório' }, { status: 400 })

    const aliexpress_url = `https://www.aliexpress.com/item/${productId}.html`

    // Se não tiver imagens (fetch falhou no cliente), salvar como erro
    if (fetchError || !images?.length) {
      await supabase.from('mineracao').upsert({
        aliexpress_id: productId,
        aliexpress_url,
        title: title ?? null,
        status: 'error',
        error_msg: fetchError ?? 'Sem imagens',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'aliexpress_id' })
      return NextResponse.json({ ok: true, error: fetchError })
    }

    // Salvar como analyzing
    await supabase
      .from('mineracao')
      .upsert({
        aliexpress_id: productId,
        aliexpress_url,
        title: title ?? null,
        price_min: priceMin ?? null,
        price_max: priceMax ?? null,
        orders_count: orders_count ?? null,
        rating: rating ?? null,
        review_count: reviewCount ?? null,
        seller_name: seller_name ?? null,
        seller_positive_rate: seller_positive_rate ?? null,
        images: images ?? [],
        status: 'analyzing',
        error_msg: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'aliexpress_id' })

    // Analisar com Claude Vision
    const analysis = await analyzeWithClaude(images)

    // Buscar por aliexpress_id para garantir que temos o ID correto (evita bug com upsert retornando null)
    await supabase.from('mineracao').update({
      notreglr_score: analysis?.score ?? null,
      notreglr_label: analysis?.label ?? null,
      notreglr_reasoning: analysis?.reasoning ?? null,
      notreglr_visual_traits: analysis?.visual_traits ?? null,
      status: analysis ? 'done' : 'partial',
      updated_at: new Date().toISOString(),
    }).eq('aliexpress_id', productId)

    return NextResponse.json({ ok: true, score: analysis?.score, label: analysis?.label })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack?.slice(0, 300)}` : String(err)
    console.error('POST /api/mineracao/analyze FATAL:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

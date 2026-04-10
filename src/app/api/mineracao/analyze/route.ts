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

const NOTREGLR_PROMPT = `You are evaluating a product for NOTREGLR, an anti-fashion statement bag brand targeting European women aged 24-38.

Brand filter test: "Would this bag make someone stop scrolling and think 'what the hell is that?'"

NOTREGLR values (score higher):
- Unusual shapes (sculptural, geometric, crescent, barrel, egg, cloud, blob, loop handle)
- Bold textures (crochet, woven, furry, fringe/tassel, rhinestone, beaded, embroidered)
- Aggressive colors (color blocks, gradient, iridescent, unexpected combinations)
- Statement design that communicates identity, not status

NOTREGLR rejects (score lower):
- Generic/basic designs
- "Luxury" positioning or logo-heavy
- Elegant/refined/formal aesthetic
- Products that look like thousands of others

Analyze the product image(s) and respond in this exact JSON format:
{
  "score": <integer 0-100>,
  "label": "<forte|medio|fraco>",
  "reasoning": "<2-3 sentences explaining fit with brand in English>",
  "visual_traits": ["<trait1>", "<trait2>", "<trait3>"]
}

Rules:
- score 70-100 = forte (strong fit, passes scroll-stop test)
- score 50-69 = medio (interesting but not clear winner)
- score 0-49 = fraco (doesn't fit brand DNA)
- Base score ONLY on visual appearance, not text or title`

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
      min: priceMin,
      max: priceMax,
      orders_count,
      rating,
      reviewCount,
      fetchError,
    } = body as {
      productId: string
      url: string
      title?: string
      images?: string[]
      min?: number
      max?: number
      orders_count?: string
      rating?: number
      reviewCount?: number
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
    const { data: inserted } = await supabase
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
        images: images ?? [],
        status: 'analyzing',
        error_msg: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'aliexpress_id' })
      .select()
      .single()

    const recordId = inserted?.id

    // Analisar com Claude Vision
    const analysis = await analyzeWithClaude(images)

    await supabase.from('mineracao').update({
      notreglr_score: analysis?.score ?? null,
      notreglr_label: analysis?.label ?? null,
      notreglr_reasoning: analysis?.reasoning ?? null,
      status: analysis ? 'done' : 'partial',
      updated_at: new Date().toISOString(),
    }).eq('id', recordId ?? '')

    return NextResponse.json({ ok: true, score: analysis?.score, label: analysis?.label })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack?.slice(0, 300)}` : String(err)
    console.error('POST /api/mineracao/analyze FATAL:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

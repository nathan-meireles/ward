import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── EXTRAÇÃO DE DADOS DO HTML ─────────────────────────────────────────────

function extractProductId(url: string): string | null {
  const m = url.match(/\/item\/(\d+)/)
  return m ? m[1] : null
}

function extractTitle(html: string): string | null {
  const og = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
  if (og) return og[1].replace(/\s*[-|].*AliExpress.*$/i, '').trim()
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (title) return title[1].replace(/\s*[-|].*$/, '').trim()
  return null
}

function extractImages(html: string): string[] {
  const images: string[] = []

  // og:image (always first)
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
  if (og) images.push(og[1].split('?')[0])

  // AliExpress CDN images no JSON
  const cdnMatches = html.matchAll(/"(https:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+\.(jpg|jpeg|png|webp))"/gi)
  for (const m of cdnMatches) {
    const url = m[1].split('?')[0]
    if (!images.includes(url)) images.push(url)
    if (images.length >= 6) break
  }

  return images
}

function extractPrice(html: string): { min: number | null; max: number | null } {
  const range = html.match(/"minPrice"\s*:\s*"?([0-9.]+)"?[^}]{0,200}"maxPrice"\s*:\s*"?([0-9.]+)"?/)
  if (range) return { min: parseFloat(range[1]), max: parseFloat(range[2]) }
  const act = html.match(/"formatedActivityPrice"\s*:\s*"([^"]+)"/)
  if (act) {
    const nums = act[1].match(/[0-9]+[.,][0-9]+/g)
    if (nums) {
      const prices = nums.map(n => parseFloat(n.replace(',', '.')))
      return { min: Math.min(...prices), max: Math.max(...prices) }
    }
  }
  return { min: null, max: null }
}

function extractOrders(html: string): string | null {
  const m = html.match(/"formatTradeCount"\s*:\s*"([^"]+)"/)
  if (m) return m[1]
  const m2 = html.match(/"tradeCount"\s*:\s*"?(\d+)"?/)
  if (m2) return m2[1]
  return null
}

function extractRating(html: string): { rating: number | null; reviewCount: number | null } {
  const r = html.match(/"averageStar"\s*:\s*"?([0-9.]+)"?/)
  const c = html.match(/"totalValidNum"\s*:\s*"?(\d+)"?/)
  return {
    rating: r ? parseFloat(r[1]) : null,
    reviewCount: c ? parseInt(c[1]) : null,
  }
}

// ─── FETCH ALIEXPRESS ──────────────────────────────────────────────────────

async function fetchAliExpress(productId: string): Promise<string> {
  const targetUrl = `https://www.aliexpress.com/item/${productId}.html`
  const scraperKey = process.env.SCRAPERAPI_KEY

  // Tentativa 1: ScraperAPI (se configurada)
  if (scraperKey) {
    try {
      const proxyUrl = `https://api.scraperapi.com?api_key=${scraperKey}&url=${encodeURIComponent(targetUrl)}&render=false`
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(30000) })
      const html = await res.text()
      if (html.length > 5000 && html.includes('aliexpress')) return html
    } catch {
      // fallback para fetch direto
    }
  }

  // Tentativa 2: fetch direto com headers de browser
  const directUrls = [
    `https://www.aliexpress.com/item/${productId}.html`,
    `https://fr.aliexpress.com/item/${productId}.html`,
    `https://m.aliexpress.com/item/${productId}.html`,
  ]

  for (const url of directUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      })
      const html = await res.text()
      if (html.length > 5000) return html
    } catch {
      // tenta próxima URL
    }
  }
  throw new Error('Não foi possível acessar o produto. Configure SCRAPERAPI_KEY no Vercel para análise automática.')
}

// ─── DOWNLOAD DE IMAGEM → BASE64 ───────────────────────────────────────────

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

async function imageToBase64(url: string): Promise<{ data: string; mediaType: ImageMediaType } | null> {
  try {
    const res = await fetch(url, {
      headers: { 'Referer': 'https://www.aliexpress.com/' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const mediaType = (contentType.split(';')[0].trim() || 'image/jpeg') as ImageMediaType
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
  score: number
  label: string
  reasoning: string
  visual_traits: string[]
} | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const client = new Anthropic({ apiKey })

  // Baixa até 3 imagens
  const imageContents: Anthropic.ImageBlockParam[] = []
  for (const imgUrl of images.slice(0, 3)) {
    const img = await imageToBase64(imgUrl)
    if (img) {
      imageContents.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType,
          data: img.data,
        },
      })
    }
    if (imageContents.length >= 2) break // máx 2 imagens para não estourar tokens
  }

  if (imageContents.length === 0) return null

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            { type: 'text', text: NOTREGLR_PROMPT },
          ],
        },
      ],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]+\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

// ─── HANDLER PRINCIPAL ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
  const supabase = sb()
  const body = await request.json()
  const urls: string[] = body?.urls ?? []

  if (!urls?.length) return NextResponse.json({ error: 'URLs obrigatórias' }, { status: 400 })

  const results = []

  for (const rawUrl of urls) {
    const url = rawUrl.trim()
    if (!url) continue

    const productId = extractProductId(url)
    if (!productId) {
      results.push({ url, error: 'URL inválida' })
      continue
    }

    // Inserir como pending
    const { data: inserted } = await supabase
      .from('mineracao')
      .upsert({
        aliexpress_id: productId,
        aliexpress_url: `https://www.aliexpress.com/item/${productId}.html`,
        status: 'analyzing',
      }, { onConflict: 'aliexpress_id' })
      .select()
      .single()

    const recordId = inserted?.id

    try {
      // 1. Fetch HTML
      const html = await fetchAliExpress(productId)

      // 2. Extrair dados
      const title = extractTitle(html)
      const images = extractImages(html)
      const { min: priceMin, max: priceMax } = extractPrice(html)
      const ordersCount = extractOrders(html)
      const { rating, reviewCount } = extractRating(html)

      // 3. Analisar com Claude Vision
      const analysis = await analyzeWithClaude(images)

      // 4. Salvar resultado
      const update = {
        title,
        price_min: priceMin,
        price_max: priceMax,
        orders_count: ordersCount,
        rating,
        review_count: reviewCount,
        images,
        notreglr_score: analysis?.score ?? null,
        notreglr_label: analysis?.label ?? null,
        notreglr_reasoning: analysis?.reasoning ?? null,
        status: analysis ? 'done' : (title ? 'partial' : 'error'),
        error_msg: !analysis && !title ? 'Sem dados' : null,
        updated_at: new Date().toISOString(),
      }

      if (recordId) {
        await supabase.from('mineracao').update(update).eq('id', recordId)
      } else {
        await supabase.from('mineracao').insert({
          aliexpress_id: productId,
          aliexpress_url: `https://www.aliexpress.com/item/${productId}.html`,
          ...update,
        })
      }

      results.push({ url, productId, title, score: analysis?.score, label: analysis?.label })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      if (recordId) {
        await supabase.from('mineracao').update({ status: 'error', error_msg: msg }).eq('id', recordId)
      }
      results.push({ url, productId, error: msg })
    }

    // Delay entre produtos
    await new Promise(r => setTimeout(r, 1000))
  }

  return NextResponse.json({ results })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    console.error('POST /api/mineracao/analyze FATAL:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

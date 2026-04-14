import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// ─── Extrai imagens da página AliExpress ─────────────────────────────────────

function extractImages(html: string): string[] {
  const seen = new Set<string>()
  const lower = html.toLowerCase()

  // Verifica se é página de bot detection
  if (html.length < 5000 || lower.includes('robot') || lower.includes('captcha')) {
    return []
  }

  // Percorre o HTML procurando por trechos de CDN aliexpress
  let pos = html.indexOf('alicdn.com/kf/')
  while (pos !== -1 && seen.size < 5) {
    // Pega contexto ao redor para encontrar o início da URL
    const start = Math.max(0, pos - 15)
    const end = Math.min(html.length, pos + 180)
    const slice = html.slice(start, end)

    // Extrai o segmento ae\d+.alicdn.com/kf/HASH.ext
    const m = slice.match(/ae\d+\.alicdn\.com\/kf\/[\w.]+\.(jpg|jpeg|png|webp)/i)
    if (m) {
      seen.add(`https://${m[0]}`)
    }

    pos = html.indexOf('alicdn.com/kf/', pos + 1)
  }

  // Fallback: og:image
  if (seen.size === 0) {
    const og = html.match(/og:image[^>]*content="([^"]+)"/) ||
               html.match(/content="(https:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+)"/)
    if (og?.[1]?.includes('alicdn')) seen.add(og[1])
  }

  return Array.from(seen).slice(0, 4)
}

async function scrapeAliExpress(productId: string): Promise<string[]> {
  const url = `https://www.aliexpress.com/item/${productId}.html`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  return extractImages(html)
}

// ─── Fallback: RapidAPI com region=US ────────────────────────────────────────

async function rapidapiImages(productId: string): Promise<string[]> {
  const key = process.env.RAPIDAPI_KEY
  if (!key) return []

  const url = new URL('https://aliexpress-datahub.p.rapidapi.com/item_detail_2')
  url.searchParams.set('itemId', productId)
  url.searchParams.set('currency', 'USD')
  url.searchParams.set('region', 'US')
  url.searchParams.set('locale', 'en_US')

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com',
      'x-rapidapi-key': key,
    },
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) return []

  const json = await res.json() as Record<string, unknown>
  const item = (json?.result as Record<string, unknown>)?.item as Record<string, unknown> | undefined
  if (!item) return []

  const rawImages = (item.images as string[] | undefined) ?? []
  return rawImages
    .map((u: string) => u.startsWith('//') ? `https:${u}` : u)
    .filter((u: string) => u.includes('alicdn'))
    .slice(0, 4)
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export interface AliProductData {
  product_id: string
  title: string | null
  images: string[]
  price_min: number | null
  price_max: number | null
  orders_count: string | null
  rating: number | null
  review_count: number | null
  seller_name: string | null
  seller_positive_rate: string | null
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID numérico inválido' }, { status: 400 })
  }

  try {
    // Tentativa 1: scraping direto
    let images: string[] = []
    try {
      images = await scrapeAliExpress(id)
    } catch {
      // ignora — tenta fallback
    }

    // Tentativa 2: RapidAPI region=US
    if (images.length === 0) {
      images = await rapidapiImages(id)
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível obter imagens. Cole a URL da imagem manualmente.' }
      )
    }

    const result: AliProductData = {
      product_id: id,
      title: null,
      images,
      price_min: null,
      price_max: null,
      orders_count: null,
      rating: null,
      review_count: null,
      seller_name: null,
      seller_positive_rate: null,
    }
    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg })
  }
}

import { NextRequest, NextResponse } from 'next/server'

// ─── Fetch AliExpress product images directly ─────────────────────────────────
// Sem RapidAPI — scraping direto do HTML da página do produto.
// Extrai URLs ae01.alicdn.com que são públicas e não exigem auth.

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
}

async function fetchProductImages(productId: string): Promise<string[]> {
  const url = `https://www.aliexpress.com/item/${productId}.html`

  const res = await fetch(url, {
    headers: HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const html = await res.text()

  if (html.length < 3000) {
    throw new Error(`HTML muito curto (${html.length} chars) — possível bot detection`)
  }

  // Extrair URLs de imagem do CDN AliExpress
  // Captura qualquer variação: https://, // ou sem protocolo
  const seen = new Set<string>()

  // Regex amplo: captura o path ae\d+.alicdn.com/kf/HASH.ext independente do protocolo
  const cdnRegex = /(?:https?:)?\/\/?(ae\d+\.alicdn\.com\/kf\/[A-Za-z0-9_.%-]+\.(?:jpg|jpeg|png|webp))/gi
  for (const m of html.matchAll(cdnRegex)) {
    const normalized = `https://${m[1]}`
    seen.add(normalized)
    if (seen.size >= 6) break
  }

  // Padrão escapado: ae01.alicdn.com\/kf\/HASH.jpg (dentro de JSON strings)
  if (seen.size < 2) {
    const escapedRegex = /ae\d+\.alicdn\.com\\\/kf\\\/([A-Za-z0-9_.%-]+\.(?:jpg|jpeg|png|webp))/gi
    for (const m of html.matchAll(escapedRegex)) {
      seen.add(`https://ae01.alicdn.com/kf/${m[1]}`)
      if (seen.size >= 6) break
    }
  }

  // Fallback og:image
  if (seen.size === 0) {
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/) ||
                    html.match(/content="([^"]+)"\s+property="og:image"/)
    if (ogMatch?.[1]) seen.add(ogMatch[1])
  }

  const images = Array.from(seen)
    .filter(u => u.includes('alicdn.com'))
    .slice(0, 4)

  if (images.length === 0) {
    throw new Error('Nenhuma imagem encontrada no HTML')
  }

  return images
}

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
    const images = await fetchProductImages(id)
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
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

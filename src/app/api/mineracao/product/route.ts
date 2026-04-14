import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// ─── CF Worker proxy ─────────────────────────────────────────────────────────
// IPs da Cloudflare edge não são bloqueados pelo AliExpress.
// Worker: https://ali-proxy.nathan-meireles.workers.dev

const CF_WORKER = 'https://ali-proxy.nathan-meireles.workers.dev'

function extractImages(html: string): string[] {
  const seen = new Set<string>()

  if (html.length < 5000) return []

  let pos = html.indexOf('alicdn.com/kf/')
  while (pos !== -1 && seen.size < 5) {
    const start = Math.max(0, pos - 15)
    const slice = html.slice(start, Math.min(html.length, pos + 180))
    const m = slice.match(/ae\d+\.alicdn\.com\/kf\/[\w.]+\.(jpg|jpeg|png|webp)/i)
    if (m) seen.add(`https://${m[0]}`)
    pos = html.indexOf('alicdn.com/kf/', pos + 1)
  }

  // Fallback og:image
  if (seen.size === 0) {
    const og = html.match(/og:image[^>]*content="([^"]+)"/) ||
               html.match(/content="(https:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+)"/)
    if (og?.[1]?.includes('alicdn')) seen.add(og[1])
  }

  return Array.from(seen).slice(0, 4)
}

async function fetchViaWorker(productId: string): Promise<string[]> {
  const target = encodeURIComponent(`https://www.aliexpress.com/item/${productId}.html`)
  const res = await fetch(`${CF_WORKER}?url=${target}`, {
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`Worker HTTP ${res.status}`)
  const html = await res.text()
  return extractImages(html)
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
    const images = await fetchViaWorker(id)

    if (images.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem encontrada para este produto' })
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

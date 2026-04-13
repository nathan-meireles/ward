import { NextRequest, NextResponse } from 'next/server'

// ─── AliExpress product data via RapidAPI DataHub ─────────────────────────────
// item_detail_2 → title, price, images
// item_review   → rating, reviewCount
// Chamadas em paralelo por produto.

const RAPIDAPI_HOST = 'aliexpress-datahub.p.rapidapi.com'
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`

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

function rapidapiHeaders(): Record<string, string> {
  return {
    'x-rapidapi-host': RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.RAPIDAPI_KEY ?? '',
  }
}

async function fetchDetail(productId: string): Promise<{
  title: string | null
  images: string[]
  price_min: number | null
  price_max: number | null
}> {
  const url = new URL(`${RAPIDAPI_BASE}/item_detail_2`)
  url.searchParams.set('itemId', productId)
  url.searchParams.set('currency', 'EUR')
  url.searchParams.set('region', 'NL')
  url.searchParams.set('locale', 'en_US')

  const res = await fetch(url.toString(), {
    headers: rapidapiHeaders(),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`item_detail_2 HTTP ${res.status}`)
  const json = await res.json() as Record<string, unknown>
  const item = (json?.result as Record<string, unknown>)?.item as Record<string, unknown> | undefined

  if (!item) return { title: null, images: [], price_min: null, price_max: null }

  const title = String(item.title ?? '').trim() || null

  const rawImages = (item.images as string[] | undefined) ?? []
  const images = rawImages.map(u => u.startsWith('//') ? `https:${u}` : u).filter(Boolean).slice(0, 6)

  const skuDef = ((item.sku as Record<string, unknown>)?.def as Record<string, unknown>) ?? {}
  const priceStr = String(skuDef.promotionPrice ?? skuDef.price ?? '')
  const nums = priceStr.match(/[\d.]+/g)?.map(Number) ?? []
  const price_min = nums.length ? Math.min(...nums) : null
  const price_max = nums.length ? Math.max(...nums) : null

  return { title, images, price_min, price_max }
}

async function fetchReviews(productId: string): Promise<{
  rating: number | null
  review_count: number | null
}> {
  const url = new URL(`${RAPIDAPI_BASE}/item_review`)
  url.searchParams.set('itemId', productId)
  url.searchParams.set('page', '1')

  const res = await fetch(url.toString(), {
    headers: rapidapiHeaders(),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) return { rating: null, review_count: null }
  const json = await res.json() as Record<string, unknown>
  const base = (json?.result as Record<string, unknown>)?.base as Record<string, unknown> | undefined

  if (!base) return { rating: null, review_count: null }

  const stats = base.reviewStats as Record<string, unknown> | undefined
  const rating = stats?.evarageStar != null ? Number(stats.evarageStar) : null
  const review_count = base.totalResults != null ? Number(base.totalResults) : null

  return { rating, review_count }
}

async function fetchProductData(productId: string): Promise<AliProductData> {
  const [detail, reviews] = await Promise.all([
    fetchDetail(productId),
    fetchReviews(productId),
  ])

  return {
    product_id: productId,
    title: detail.title,
    images: detail.images,
    price_min: detail.price_min,
    price_max: detail.price_max,
    orders_count: null, // não disponível via RapidAPI DataHub
    rating: reviews.rating,
    review_count: reviews.review_count,
    seller_name: null,
    seller_positive_rate: null,
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Valid numeric product id required' }, { status: 400 })
  }

  if (!process.env.RAPIDAPI_KEY) {
    return NextResponse.json({ error: 'RAPIDAPI_KEY não configurado' }, { status: 500 })
  }

  try {
    const data = await fetchProductData(id)
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

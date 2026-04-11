import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ─── AliExpress DS API ────────────────────────────────────────────────────────
// Endpoint: POST https://api-sg.aliexpress.com/sync
// Method:   aliexpress.ds.product.get
// Docs:     openservice.aliexpress.com

const ALI_API = 'https://api-sg.aliexpress.com/sync'

function signRequest(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort()
  const str = sorted.map(k => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', secret).update(str).digest('hex').toUpperCase()
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

async function fetchProductFromApi(productId: string): Promise<AliProductData> {
  const appKey = process.env.ALIEXPRESS_APP_KEY
  const appSecret = process.env.ALIEXPRESS_APP_SECRET

  if (!appKey || !appSecret) throw new Error('AliExpress API credentials not configured')

  const params: Record<string, string> = {
    method: 'aliexpress.ds.product.get',
    app_key: appKey,
    timestamp: Date.now().toString(),
    sign_method: 'sha256',
    target_currency: 'USD',
    target_language: 'EN',
    ship_to_country: 'NL',
    product_id: productId,
  }

  params.sign = signRequest(params, appSecret)

  const res = await fetch(ALI_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })

  const json = await res.json()
  const resp = json?.aliexpress_ds_product_get_response

  if (!resp || resp.rsp_code !== 200) {
    throw new Error(`API error: ${resp?.rsp_msg ?? JSON.stringify(json).slice(0, 200)}`)
  }

  const result = resp.result
  const base = result?.ae_item_base_info_dto ?? {}
  const media = result?.ae_multimedia_info_dto ?? {}
  const skus: Array<Record<string, string>> =
    result?.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o ?? []
  const store = result?.ae_store_info ?? {}

  // Images: semicolon-separated string
  const images: string[] = (media.image_urls ?? '')
    .split(';')
    .map((u: string) => u.trim())
    .filter(Boolean)
    .slice(0, 6)

  // Price: min/max across all SKUs
  const prices = skus
    .map((s) => parseFloat(s.sku_price ?? s.offer_sale_price ?? '0'))
    .filter((n) => n > 0)

  const price_min = prices.length ? Math.min(...prices) : null
  const price_max = prices.length ? Math.max(...prices) : null

  const rating = base.avg_evaluation_rating ? parseFloat(base.avg_evaluation_rating) : null
  const review_count = base.evaluation_count ? parseInt(base.evaluation_count) : null
  const orders_count = base.order_count ? String(base.order_count) : null

  const positive = store.communication_rating ?? store.positive_num
  const seller_positive_rate = positive ? `${positive}%` : null

  return {
    product_id: productId,
    title: base.subject ?? null,
    images,
    price_min,
    price_max,
    orders_count,
    rating,
    review_count,
    seller_name: store.store_name ?? null,
    seller_positive_rate,
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Valid numeric product id required' }, { status: 400 })
  }

  try {
    const data = await fetchProductFromApi(id)
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

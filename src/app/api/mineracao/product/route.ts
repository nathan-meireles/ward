import { NextRequest, NextResponse } from 'next/server'

// ─── AliExpress product data via server-side fetch ────────────────────────────
// Fetches aliexpress.com from Vercel datacenter.
// Title extracted from og:title / <title> tag.
// Images extracted from alicdn.com CDN URLs embedded in the JS bundle.
// Price/orders/rating are JS-rendered and not available without OAuth.

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Cookie': 'aep_usuc_f=site=glo&c_tp=USD&region=NL&b_locale=en_US; intl_locale=en_US; xman_us_f=x_locale=en_US&x_site=glo',
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

function extractTitle(html: string): string | null {
  // og:title (both attribute orderings)
  let m = html.match(/property=["']og:title["'][^>]+content=["']([^"']{5,})["']/i)
  if (!m) m = html.match(/content=["']([^"']{5,})["'][^>]+property=["']og:title["']/i)
  if (m) {
    const t = m[1].replace(/\s*[-|–].*AliExpress.*$/i, '').trim()
    if (t.length > 5) return t
  }
  // subject key in embedded JSON
  const s = html.match(/"subject"\s*:\s*"([^"]{10,300})"/)
  if (s) return s[1]
  // <title> tag
  const t = html.match(/<title[^>]*>([^<]{10,}?)<\/title>/i)
  if (t) {
    const clean = t[1].replace(/\s*[-|–].*AliExpress.*$/i, '').replace(/\s*[-|–].*$/, '').trim()
    if (clean.length > 5) return clean
  }
  return null
}

function extractImages(html: string): string[] {
  const seen = new Set<string>()
  const images: string[] = []

  // og:image
  const og = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (og) {
    const u = og[1].split('?')[0]
    seen.add(u); images.push(u)
  }

  // alicdn.com CDN URLs embedded in the JS bundle
  const text = html
  let idx = 0
  while (images.length < 8) {
    const start = text.indexOf('alicdn.com/kf/', idx)
    if (start === -1) break
    // walk forward to find end of URL
    let end = start
    while (end < text.length && !/[\s"'\\<>]/.test(text[end])) end++
    const raw = text.slice(start, end)
    // strip query string and trailing garbage
    const clean = 'https://' + raw.replace(/\?.*$/, '').replace(/[^a-zA-Z0-9/._%:-].*$/, '')
    if (/\.(jpg|jpeg|png|webp)$/i.test(clean) && !seen.has(clean)) {
      seen.add(clean); images.push(clean)
    }
    idx = end
  }

  return images.slice(0, 6)
}

async function fetchProductData(productId: string): Promise<AliProductData> {
  const url = `https://www.aliexpress.com/item/${productId}.html`
  const res = await fetch(url, {
    headers: HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  if (html.length < 2000) throw new Error(`Página muito curta (${html.length} chars)`)

  return {
    product_id: productId,
    title: extractTitle(html),
    images: extractImages(html),
    price_min: null,
    price_max: null,
    orders_count: null,
    rating: null,
    review_count: null,
    seller_name: null,
    seller_positive_rate: null,
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Valid numeric product id required' }, { status: 400 })
  }

  try {
    const data = await fetchProductData(id)
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

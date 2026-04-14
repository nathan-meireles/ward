import { NextRequest, NextResponse } from 'next/server'

// Busca imagens diretamente do HTML da página AliExpress.
// Extrai URLs ae01.alicdn.com — públicas, sem auth.

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

async function fetchAliImages(productId: string): Promise<string[]> {
  const pageUrl = `https://www.aliexpress.com/item/${productId}.html`

  const res = await fetch(pageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const html = await res.text()

  if (html.length < 5000) {
    throw new Error(`Página bloqueada (${html.length} chars)`)
  }

  const seen = new Set<string>()

  // Extrai todos os caminhos ae\d+.alicdn.com/kf/HASH.ext do HTML
  // Evita ranges complexos no character class usando [^/\s"'\\]
  const idx = 0
  const lines = html.split('\n')
  for (const line of lines) {
    const pos = line.indexOf('alicdn.com/kf/')
    if (pos === -1) continue

    // Pega o trecho antes para incluir o domínio
    const start = Math.max(0, pos - 20)
    const segment = line.slice(start, pos + 200)

    // Regex simples sem character class problemático
    const m = segment.match(/ae\d+\.alicdn\.com\/kf\/\S+?\.(jpg|jpeg|png|webp)/i)
    if (m) {
      // Limpa chars inválidos no final (", ', \, ), etc)
      const clean = m[0].replace(/[^a-zA-Z0-9_./-]/g, '')
      if (clean.includes('alicdn.com') && clean.length > 40) {
        seen.add(`https://${clean}`)
      }
    }
    if (seen.size >= 4) break
  }
  void idx

  // Fallback: og:image
  if (seen.size === 0) {
    const og = html.match(/og:image[^>]+content="([^"]+)"/) ||
               html.match(/content="(https:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+)"/)
    if (og?.[1]) seen.add(og[1])
  }

  const images = Array.from(seen).filter(u => u.startsWith('https://ae'))

  if (images.length === 0) throw new Error('Nenhuma imagem encontrada')

  return images
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID numérico inválido' }, { status: 400 })
  }

  try {
    const images = await fetchAliImages(id)
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

import { NextRequest, NextResponse } from 'next/server'

// Proxy server-side para o AliExpress.
// Roda no Vercel (datacenter próximo a BR/EU) → evita redirect loop para aliexpress.us
// que ocorre com IPs dos EUA (CF Worker).

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Cookie': 'aep_usuc_f=site=glo&c_tp=USD&region=US&b_locale=en_US; intl_locale=en_US; xman_us_f=x_locale=en_US&x_site=glo',
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url')
  if (!target) return new NextResponse('url param required', { status: 400 })
  if (!target.includes('aliexpress.com')) return new NextResponse('Only AliExpress URLs', { status: 403 })

  try {
    // Normalize to www.aliexpress.com
    const u = new URL(target)
    if (u.hostname !== 'www.aliexpress.com' && u.hostname !== 'aliexpress.com') {
      u.hostname = 'www.aliexpress.com'
    }

    const res = await fetch(u.toString(), { headers: HEADERS, redirect: 'follow' })
    const html = await res.text()
    return new NextResponse(html, {
      status: res.status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return new NextResponse(`Proxy error: ${msg}`, { status: 502 })
  }
}

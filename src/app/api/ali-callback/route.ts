import { NextRequest, NextResponse } from 'next/server'

// ─── AliExpress OAuth Callback ────────────────────────────────────────────────
// Redirect URI: https://ward.notreglr.com/api/ali-callback
// Recebe o code, troca pelo access_token, exibe na tela para copiar.

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error || !code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#09090A;color:#F4F4F4">
        <h2 style="color:#f87171">Erro OAuth</h2>
        <p>${error ?? 'Code não recebido'}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const appKey    = process.env.ALIEXPRESS_APP_KEY!
  const appSecret = process.env.ALIEXPRESS_APP_SECRET!

  try {
    const res = await fetch('https://oauth.aliexpress.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appKey,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://ward.notreglr.com/api/ali-callback',
      }).toString(),
    })
    const data = await res.json()

    if (data.access_token) {
      const expires = new Date(Date.now() + (data.expire_time ?? 0)).toISOString()
      return new NextResponse(
        `<html><body style="font-family:monospace;padding:40px;background:#09090A;color:#F4F4F4">
          <h2 style="color:#DDD1BB">✅ Token gerado com sucesso</h2>
          <p style="color:#6E6E6E;margin-bottom:24px">Copie os valores abaixo e cole no .env.local e no Vercel.</p>
          <div style="background:#151517;padding:20px;border-radius:8px;border:1px solid rgba(255,255,255,0.12)">
            <p style="color:#6E6E6E;font-size:12px;margin:0 0 8px">ALIEXPRESS_ACCESS_TOKEN=</p>
            <p style="color:#DDD1BB;word-break:break-all;margin:0 0 20px">${data.access_token}</p>
            ${data.refresh_token ? `<p style="color:#6E6E6E;font-size:12px;margin:0 0 8px">ALIEXPRESS_REFRESH_TOKEN=</p>
            <p style="color:#DDD1BB;word-break:break-all;margin:0 0 20px">${data.refresh_token}</p>` : ''}
            <p style="color:#6E6E6E;font-size:12px;margin:0 0 8px">Expira em:</p>
            <p style="color:#DDD1BB;margin:0">${expires}</p>
          </div>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#09090A;color:#F4F4F4">
        <h2 style="color:#f87171">Erro ao trocar code por token</h2>
        <pre style="background:#151517;padding:16px;border-radius:8px">${JSON.stringify(data, null, 2)}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#09090A;color:#F4F4F4">
        <h2 style="color:#f87171">Erro</h2><p>${msg}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

/**
 * AliExpress OAuth — gera access_token para a conta AliExpress de Nathan.
 * Execução: node scripts/ali-oauth.mjs
 *
 * Fluxo:
 *  1. Abre URL de autorização no terminal
 *  2. Nathan faz login na conta AliExpress e autoriza o app
 *  3. Cole o "code" que aparece na URL de redirect
 *  4. Script troca o code pelo access_token + refresh_token
 *  5. Copie o access_token para ALIEXPRESS_ACCESS_TOKEN no .env.local
 */

import crypto from 'crypto'
import http from 'http'
import { createInterface } from 'readline'

const APP_KEY    = '531810'
const APP_SECRET = 'PAwsNebq2msnCbz0QrNsFeaOLqibLfpU'
// Redirect para localhost — precisa estar cadastrado no painel do app AliExpress
// Se não estiver, use REDIRECT_LOCAL=false e cole o code manualmente
const REDIRECT_URI = 'http://localhost:9988/callback'

function sign(params) {
  const sorted = Object.keys(params).sort()
  const str = sorted.map(k => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', APP_SECRET).update(str).digest('hex').toUpperCase()
}

async function exchangeCode(code) {
  const params = {
    client_id: APP_KEY,
    client_secret: APP_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  }
  const res = await fetch('https://oauth.aliexpress.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })
  return res.json()
}

// Sobe servidor local para capturar redirect automático
function waitForCode() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost:9988')
      const code = url.searchParams.get('code')
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end('<h2>Pode fechar esta aba. Volte ao terminal.</h2>')
      server.close()
      resolve(code)
    })
    server.listen(9988)
  })
}

async function main() {
  const authUrl = `https://oauth.aliexpress.com/authorize?response_type=code&client_id=${APP_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=ward&sp=ae`

  console.log('\n=== AliExpress OAuth ===\n')
  console.log('1. Abra esta URL no navegador (pode copiar e colar):')
  console.log('\n' + authUrl + '\n')
  console.log('2. Faça login na sua conta AliExpress e autorize o app.')
  console.log('3. O script vai capturar o token automaticamente via redirect.\n')

  let code
  try {
    code = await Promise.race([
      waitForCode(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 120000))
    ])
  } catch {
    // fallback manual
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    code = await new Promise(r => rl.question('Não capturou automaticamente. Cole o "code" da URL de redirect: ', ans => { rl.close(); r(ans.trim()) }))
  }

  if (!code) {
    console.error('Code não encontrado.')
    process.exit(1)
  }

  console.log('\nTrocando code por access_token...')
  const result = await exchangeCode(code)
  console.log('\nResposta da API:', JSON.stringify(result, null, 2))

  if (result.access_token) {
    console.log('\n✅ Sucesso! Adicione ao .env.local:')
    console.log(`ALIEXPRESS_ACCESS_TOKEN=${result.access_token}`)
    if (result.refresh_token) {
      console.log(`ALIEXPRESS_REFRESH_TOKEN=${result.refresh_token}`)
      console.log(`ALIEXPRESS_TOKEN_EXPIRES=${Date.now() + (result.expire_time ?? 0)}`)
    }
  } else {
    console.error('\n❌ Erro:', result)
  }
}

main()

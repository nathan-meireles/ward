import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const NOTREGLR_PROMPT = `You are evaluating a product for NOTREGLR, an anti-fashion statement bag brand targeting European women aged 24-38.

Brand filter test: "Would this bag make someone stop scrolling and think 'what the hell is that?'"

NOTREGLR values (score higher):
- Unusual shapes (sculptural, geometric, crescent, barrel, egg, cloud, blob, loop handle)
- Bold textures (crochet, woven, furry, fringe/tassel, rhinestone, beaded, embroidered)
- Aggressive colors (color blocks, gradient, iridescent, unexpected combinations)
- Statement design that communicates identity, not status

NOTREGLR rejects (score lower):
- Generic/basic designs
- "Luxury" positioning or logo-heavy
- Elegant/refined/formal aesthetic
- Products that look like thousands of others

Analyze the product image and respond in this exact JSON format:
{
  "score": <integer 0-100>,
  "label": "<forte|medio|fraco>",
  "reasoning": "<2-3 sentences explaining fit with brand in English>",
  "visual_traits": ["<trait1>", "<trait2>", "<trait3>"]
}

Rules:
- score 70-100 = forte (strong fit, passes scroll-stop test)
- score 50-69 = medio (interesting but not clear winner)
- score 0-49 = fraco (doesn't fit brand DNA)
- Base score ONLY on visual appearance`

export async function POST(request: NextRequest) {
  try {
    const { id, imageUrl } = await request.json() as { id: string; imageUrl: string }
    if (!id || !imageUrl) return NextResponse.json({ error: 'id e imageUrl obrigatórios' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY não configurada' }, { status: 500 })

    // Download imagem
    const imgRes = await fetch(imageUrl, {
      headers: { 'Referer': 'https://www.aliexpress.com/' },
      signal: AbortSignal.timeout(15000),
    })
    if (!imgRes.ok) return NextResponse.json({ error: `Imagem inacessível: ${imgRes.status}` }, { status: 400 })

    const buffer = await imgRes.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = ((imgRes.headers.get('content-type') ?? 'image/jpeg').split(';')[0].trim()) as ImageMediaType

    // Analisar com Claude
    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: NOTREGLR_PROMPT },
        ],
      }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]+\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Claude não retornou JSON válido' }, { status: 500 })
    const analysis = JSON.parse(jsonMatch[0])

    // Salvar no banco
    const supabase = sb()
    await supabase.from('mineracao').update({
      images: [imageUrl],
      notreglr_score: analysis.score,
      notreglr_label: analysis.label,
      notreglr_reasoning: analysis.reasoning,
      status: 'done',
      error_msg: null,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    return NextResponse.json({ ok: true, analysis })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

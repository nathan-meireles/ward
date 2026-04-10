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

const NOTREGLR_PROMPT = `Você é um curador de produtos para a NOTREGLR, marca anti-fashion de bolsas femininas vendidas na Europa (€55–80).

CONCEITO DA MARCA: "Not regular. Not for everyone."
A NOTREGLR não tenta parecer luxo — ela ri de si mesma, assume o estranho e vende identidade, não status.

FILTRO PRINCIPAL — faça esta pergunta antes de tudo:
"Essa bolsa faria alguém parar o scroll e pensar 'que porra é essa?'"
→ Se SIM: score alto. Se NÃO: score baixo.

PONTUA ALTO (características desejadas):
- Formato incomum: escultural, geométrico, crescent bag, barrel, egg, blob, loop handle, abstract shape
- Textura que chama atenção: crochê, tecido estruturado, pelúcia, franjas, rhinestone, beads, bordado
- Cor agressiva ou combinação inusitada: color block, gradiente, iridescente, cores saturadas
- Design que comunica personalidade, não elegância
- Algo que claramente NÃO estaria em uma loja convencional

PONTUA BAIXO (não é NOTREGLR):
- Design genérico ou básico (bolsa preta simples, tote comum)
- Estética de luxo ou elegância tradicional
- Logo visível de marca conhecida
- Parece igual a milhares de outras bolsas
- Minimalismo sem personalidade

Responda EXCLUSIVAMENTE neste formato JSON (sem texto antes ou depois):
{
  "score": <inteiro 0-100>,
  "label": "<forte|medio|fraco>",
  "reasoning": "<2-3 frases em português BR explicando o fit com a marca>",
  "visual_traits": ["<característica visual 1>", "<característica visual 2>", "<característica visual 3>"]
}

Critérios de label:
- forte (70-100): passa no teste do scroll, DNA NOTREGLR claro
- medio (50-69): interessante mas não é destaque óbvio
- fraco (0-49): não comunica a identidade da marca

Avalie APENAS pela aparência visual. Ignore título e texto.`

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
      notreglr_visual_traits: analysis.visual_traits ?? null,
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

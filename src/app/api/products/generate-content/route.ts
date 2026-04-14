/**
 * POST /api/products/generate-content
 * Gera conteúdo de produto (nome, hook, features, tags, linha) com Claude.
 * O usuário cola o texto bruto da página do AliExpress para dar contexto real.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const LINES = [
  'Wrong Shapes',
  'The Furred',
  'Color Riot',
  'Not Your Garden',
  'Shell Shocked',
  'The Excessive',
] as const

const SYSTEM_PROMPT = `You are a copywriter for NOTREGLR, an anti-fashion statement accessories brand selling in Europe (€55–80).

Brand DNA: "Not regular. Not for everyone."
Voice: direct, slightly irreverent, never tries to sound elegant or luxurious. Sells IDENTITY, not status. Laughs at itself. Speaks to someone who is done explaining their taste.

Available product lines:
- Wrong Shapes — sculptural, geometric, unusual formats (crescent, egg, barrel, abstract)
- The Furred — fuzzy, plush, fur-like textures
- Color Riot — aggressive colors, color-blocking, saturated gradients
- Not Your Garden — floral patterns, embroidered botanicals
- Shell Shocked — shell-inspired, marine, iridescent
- The Excessive — rhinestone, beaded, crystal-covered

You will receive raw product information (from the supplier page) and brand visual analysis. Use both to generate copy that sounds like NOTREGLR wrote it — not like a generic product description.`

const USER_PROMPT_TEMPLATE = (rawContent: string, visualTraits: string[], reasoning: string) => `
Here is the raw product information from the supplier page:
---
${rawContent.slice(0, 3000)}
---

Visual analysis already done:
Traits: ${visualTraits.join(', ') || 'not available'}
Brand fit note: ${reasoning || 'not available'}

Generate the following in JSON format:

{
  "product_name": "<2-4 word conceptual English name in NOTREGLR voice. NOT a generic description. Think: a nickname, a concept, an attitude. Examples: 'The Amsterdam Intruder', 'Wrong Shape Club', 'The Loud One', 'Shell We Not'. No words like 'bag', 'purse', 'handbag'.>",

  "hook": "<1 sentence, max 12 words. An identity statement — not a promise or feature. The customer reads this and feels it's true about themselves. Examples: 'For people who stopped explaining their taste.' / 'The bag that makes strangers ask questions.' / 'Not everyone will get it. That's the point.' NO luxury language, no 'will make you', no adjectives like stunning or gorgeous.>",

  "features": [
    "<Feature 1 — functional or character, direct. E.g.: 'Holds your phone, keys, cards, and one bad decision'>",
    "<Feature 2>",
    "<Feature 3>",
    "<Feature 4 — only if distinct from above>",
    "<Feature 5 — only if distinct from above>"
  ],

  "shopify_tags": ["<4-8 lowercase tags: line slug, style, color, use, material hints>"],

  "line_name": "<exactly one of: Wrong Shapes | The Furred | Color Riot | Not Your Garden | Shell Shocked | The Excessive>"
}

Rules:
- product_name: attitude over description. Could sound like a person's nickname or an inside joke.
- hook: premissa irrefutável (verifiable feeling, not a promise). Short. Punchy.
- features: mix of functional (what fits, closure, strap type) and character (what the shape communicates). 3-5 bullets. Never use: stunning, gorgeous, premium, luxurious, elevate, perfect for.
- shopify_tags: lowercase, hyphen-separated if multi-word. Include line name slug.
- line_name: pick best fit from the 6 options.

Respond ONLY with valid JSON. No text before or after.`

export async function POST(request: NextRequest) {
  try {
    const { product_id, raw_page_content } = await request.json() as {
      product_id: string
      raw_page_content: string
    }

    if (!product_id) return NextResponse.json({ error: 'product_id obrigatório' }, { status: 400 })
    if (!raw_page_content?.trim()) return NextResponse.json({ error: 'raw_page_content obrigatório' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY não configurada' }, { status: 500 })

    const supabase = sb()

    // Busca dados do produto (visual traits + reasoning da mineração)
    const { data: product } = await supabase
      .from('products')
      .select('id, notreglr_visual_traits, mineracao_id')
      .eq('id', product_id)
      .single()

    let visualTraits: string[] = product?.notreglr_visual_traits ?? []
    let reasoning = ''

    if (product?.mineracao_id) {
      const { data: m } = await supabase
        .from('mineracao')
        .select('notreglr_reasoning, notreglr_visual_traits')
        .eq('id', product.mineracao_id)
        .single()
      if (m?.notreglr_reasoning) reasoning = m.notreglr_reasoning
      if (m?.notreglr_visual_traits?.length) visualTraits = m.notreglr_visual_traits
    }

    // Marca como gerando
    await supabase.from('products').update({ content_status: 'generating' }).eq('id', product_id)

    // Chama Claude
    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: USER_PROMPT_TEMPLATE(raw_page_content, visualTraits, reasoning),
      }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const match = text.match(/\{[\s\S]+\}/)
    if (!match) {
      await supabase.from('products').update({ content_status: 'error' }).eq('id', product_id)
      return NextResponse.json({ error: 'Claude não retornou JSON válido' }, { status: 500 })
    }

    const generated = JSON.parse(match[0])
    if (!LINES.includes(generated.line_name)) generated.line_name = 'Wrong Shapes'

    // Salva no banco
    await supabase.from('products').update({
      product_name: generated.product_name ?? null,
      hook: generated.hook ?? null,
      features: generated.features ?? null,
      shopify_tags: generated.shopify_tags ?? null,
      line_name: generated.line_name ?? null,
      line_category: generated.line_name ?? null,
      content_status: 'done',
    }).eq('id', product_id)

    return NextResponse.json({ ok: true, generated })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

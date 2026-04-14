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

const NOTREGLR_PROMPT = `Você é um curador RIGOROSO de produtos para a NOTREGLR, marca anti-fashion de bolsas femininas vendidas na Europa (€55–80).

CONCEITO: "Not regular. Not for everyone."
A NOTREGLR ri de si mesma, assume o estranho, vende IDENTIDADE — não status, não elegância, não luxo.

FILTRO PRINCIPAL (faça antes de tudo):
"Essa bolsa faria alguém parar o scroll e pensar 'que porra é essa?' — não de admiração elegante, mas de estranhamento genuíno?"
→ SIM + estranhamento real: score alto | SIM mas com ressalvas: score médio | NÃO ou elegante: score baixo

━━━ FORTE (75-100) — DNA NOTREGLR puro ━━━
Exige TODOS estes elementos:
• Formato realmente incomum que causa estranhamento genuíno (não só "diferente")
• Cor agressiva/saturada OU textura statement que domina a peça
• Design que comunica irreverência, não sofisticação
• Alguém olharia e diria "não é pra qualquer pessoa" — não "que bonito"

━━━ MÉDIO (50-74) — interessante com ressalvas ━━━
• Formato incomum MAS em cores neutras/seguras
• Textura diferente MAS design geral convencional
• Colorida MAS formato básico
• Passa o filtro mas não é destaque óbvio

━━━ FRACO (0-49) — não é NOTREGLR ━━━
• Elegância convencional de qualquer tipo
• Bolsa de festa/gala (clutch elegante, rhinestone sofisticado)
• Novelty bag literal (formato de animal realista, comida, objeto — é infantil/turístico, não anti-fashion)
• Minimalismo refinado
• Qualquer bolsa que pareceria "bonita" numa boutique ou loja de luxo
• Cores neutras (bege, camel, preto, dourado) mesmo com formato diferente

━━━ FALSOS POSITIVOS — atenção especial ━━━
• Rhinestone ELEGANTE (clutch de gala dourada) → FRACO. Rhinestone KITSCH/STATEMENT (bolsa coberta de cristais coloridos exagerados, formato incomum) → FORTE
• Shell/concha MINIMALISTA em bege → FRACO. Shell ESCULTURAL colorida e exagerada → FORTE
• Fuzzy NEUTRO (pelúcia bege discreta) → MÉDIO no máximo. Fuzzy em cor agressiva + formato incomum → FORTE
• Bordado DELICADO floral → FRACO. Bordado EXCESSIVO e saturado de cores → MÉDIO/FORTE
• Crocodilo/animal como TEXTURA em bolsa convencional → FRACO. Animal como FORMATO 3D kitsch → MÉDIO

Responda EXCLUSIVAMENTE neste formato JSON (sem texto antes ou depois):
{
  "score": <inteiro 0-100>,
  "label": "<forte|medio|fraco>",
  "reasoning": "<2-3 frases em português BR — seja direto sobre o que passa e o que não passa no filtro>",
  "visual_traits": ["<característica visual 1>", "<característica visual 2>", "<característica visual 3>"]
}

Seja RIGOROSO. Forte deve ser reservado para peças que realmente causam estranhamento. Avalie APENAS pela aparência visual.`

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

    // Salvar no banco — NÃO sobrescrever images existentes, apenas adicionar se estava vazio
    const supabase = sb()
    const { data: existing } = await supabase.from('mineracao').select('images').eq('id', id).single()
    const currentImages: string[] = existing?.images ?? []
    const updatedImages = currentImages.includes(imageUrl) ? currentImages : [imageUrl, ...currentImages].slice(0, 4)

    await supabase.from('mineracao').update({
      images: updatedImages,
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

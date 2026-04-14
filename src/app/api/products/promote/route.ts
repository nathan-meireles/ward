/**
 * POST /api/products/promote
 * Promove produto da mineracao para products (esteira).
 * Conteúdo (product_name, hook, features etc.) é gerado separadamente
 * via POST /api/products/generate-content após o usuário colar o texto do AliExpress.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { mineracao_id } = body

  if (!mineracao_id) {
    return NextResponse.json({ error: 'mineracao_id obrigatório' }, { status: 400 })
  }

  const supabase = sb()

  // Já existe na esteira?
  const { data: existing } = await supabase
    .from('products')
    .select('id, pipeline_status, content_status, product_name')
    .eq('mineracao_id', mineracao_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ product: existing, already_exists: true })
  }

  // Busca dados da mineração
  const { data: m, error: mErr } = await supabase
    .from('mineracao')
    .select('*')
    .eq('id', mineracao_id)
    .single()

  if (mErr || !m) {
    return NextResponse.json({ error: 'Produto não encontrado na mineração' }, { status: 404 })
  }

  // Cria o produto — conteúdo será gerado depois pelo usuário
  const { data: product, error: pErr } = await supabase
    .from('products')
    .insert({
      project_id: 'notreglr',
      name: m.title ?? `Produto ${m.aliexpress_id ?? mineracao_id.slice(0, 8)}`,
      source_url: m.aliexpress_url ?? null,
      mineracao_id,
      notreglr_score: m.notreglr_score ?? null,
      notreglr_label: m.notreglr_label ?? null,
      notreglr_visual_traits: m.notreglr_visual_traits ?? [],
      images: m.images ?? [],
      pipeline_status: 'a_testar',
      status: 'evaluating',
      content_status: 'pending',
    })
    .select()
    .single()

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

  // Cria pricing vazio com COG inicial
  await supabase.from('product_pricing').insert({
    product_id: product.id,
    cog_eur: m.price_min ?? null,
  })

  return NextResponse.json({ product, already_exists: false }, { status: 201 })
}

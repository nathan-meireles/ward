/**
 * POST /api/products/promote
 * Promove um produto da tabela mineracao para a tabela products (esteira).
 * Se já existe um produto com esse mineracao_id, retorna o existente.
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

  // Verifica se já existe
  const { data: existing } = await supabase
    .from('products')
    .select('id, pipeline_status')
    .eq('mineracao_id', mineracao_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ product: existing, already_exists: true })
  }

  // Busca dados da mineração
  const { data: mineracao, error: mErr } = await supabase
    .from('mineracao')
    .select('*')
    .eq('id', mineracao_id)
    .single()

  if (mErr || !mineracao) {
    return NextResponse.json({ error: 'Produto não encontrado na mineração' }, { status: 404 })
  }

  // Cria o produto
  const { data: product, error: pErr } = await supabase
    .from('products')
    .insert({
      project_id: 'notreglr',
      name: mineracao.title ?? `Produto ${mineracao.aliexpress_id ?? mineracao_id.slice(0, 8)}`,
      source_url: mineracao.aliexpress_url ?? null,
      mineracao_id: mineracao_id,
      notreglr_score: mineracao.notreglr_score ?? null,
      notreglr_label: mineracao.notreglr_label ?? null,
      notreglr_visual_traits: mineracao.notreglr_visual_traits ?? [],
      images: mineracao.images ?? [],
      pipeline_status: 'a_testar',
      status: 'evaluating',
    })
    .select()
    .single()

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

  // Cria pricing vazio com valores padrão
  await supabase.from('product_pricing').insert({
    product_id: product.id,
    cog_eur: mineracao.price_min ?? null,
  })

  return NextResponse.json({ product, already_exists: false }, { status: 201 })
}

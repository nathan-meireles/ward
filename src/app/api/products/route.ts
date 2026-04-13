import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/products — lista todos os produtos com pricing e contagem de módulos
export async function GET(request: NextRequest) {
  const supabase = sb()
  const { searchParams } = new URL(request.url)
  const pipeline_status = searchParams.get('pipeline_status')
  const status = searchParams.get('status')

  let query = supabase
    .from('products')
    .select(`
      *,
      product_pricing(*),
      creatives(id),
      ad_campaigns(id, status)
    `)
    .order('created_at', { ascending: false })

  if (pipeline_status) query = query.eq('pipeline_status', pipeline_status)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/products — cria produto manualmente
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('products')
    .insert({
      project_id: 'notreglr',
      name: body.name,
      line_category: body.line_category ?? null,
      source_url: body.source_url ?? null,
      mineracao_id: body.mineracao_id ?? null,
      notreglr_score: body.notreglr_score ?? null,
      notreglr_label: body.notreglr_label ?? null,
      notreglr_visual_traits: body.notreglr_visual_traits ?? [],
      images: body.images ?? [],
      pipeline_status: body.pipeline_status ?? 'a_testar',
      status: body.status ?? 'evaluating',
      notes: body.notes ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Cria registro de pricing vazio automaticamente
  await supabase.from('product_pricing').insert({ product_id: data.id })

  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/products — atualiza produto
export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/products
export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const supabase = sb()

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/**
 * GET  /api/products/pricing?product_id=xxx  — busca pricing de um produto
 * PUT  /api/products/pricing                  — salva/atualiza pricing
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const product_id = searchParams.get('product_id')
  if (!product_id) return NextResponse.json({ error: 'product_id obrigatório' }, { status: 400 })

  const supabase = sb()
  const { data, error } = await supabase
    .from('product_pricing')
    .select('*')
    .eq('product_id', product_id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { product_id, ...fields } = body

  if (!product_id) return NextResponse.json({ error: 'product_id obrigatório' }, { status: 400 })

  const supabase = sb()

  // Upsert: atualiza se existe, cria se não existe
  const { data, error } = await supabase
    .from('product_pricing')
    .upsert(
      { product_id, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'product_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

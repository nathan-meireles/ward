import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  const supabase = sb()
  const { data, error } = await supabase
    .from('scenarios')
    .select('*, products(id, name, images, notreglr_score, notreglr_label)')
    .eq('project_id', 'notreglr')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      project_id: 'notreglr',
      product_id: body.product_id ?? null,
      name: body.name,
      daily_budget_eur: body.daily_budget_eur ?? 10,
      cpm_eur: body.cpm_eur ?? 8,
      ctr_pct: body.ctr_pct ?? 1.5,
      cvr_pct: body.cvr_pct ?? 1.2,
      aov_eur: body.aov_eur ?? 65,
      cog_eur: body.cog_eur ?? null,
      freight_eur: body.freight_eur ?? null,
      return_rate_pct: body.return_rate_pct ?? 5,
      notes: body.notes ?? null,
    })
    .select('*, products(id, name, images)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('scenarios')
    .update(updates)
    .eq('id', id)
    .select('*, products(id, name, images)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const supabase = sb()

  const { error } = await supabase.from('scenarios').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

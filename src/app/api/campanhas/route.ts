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
    .from('ad_campaigns')
    .select('*, products(id, name, images, notreglr_score, notreglr_label, pipeline_status), creatives(id, title, format)')
    .eq('project_id', 'notreglr')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('ad_campaigns')
    .insert({
      project_id: 'notreglr',
      product_id: body.product_id ?? null,
      creative_id: body.creative_id ?? null,
      status: body.status ?? 'a_testar',
      daily_budget_eur: body.daily_budget_eur ?? null,
      days_active: body.days_active ?? 0,
      gender_target: body.gender_target ?? null,
      age_target: body.age_target ?? null,
      interests: body.interests ?? [],
      countries: body.countries ?? [],
      notes: body.notes ?? null,
      started_at: body.started_at ?? null,
    })
    .select('*, products(id, name, images), creatives(id, title, format)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const supabase = sb()

  // Auto-compute days_active if total_spent is being updated
  if (updates.daily_budget_eur && updates.total_spent_eur) {
    updates.days_active = Math.round(updates.total_spent_eur / updates.daily_budget_eur)
  }

  const { data, error } = await supabase
    .from('ad_campaigns')
    .update(updates)
    .eq('id', id)
    .select('*, products(id, name, images), creatives(id, title, format)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const supabase = sb()

  const { error } = await supabase.from('ad_campaigns').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

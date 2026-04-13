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
    .from('audiences')
    .select('*')
    .eq('project_id', 'notreglr')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('audiences')
    .insert({
      project_id: 'notreglr',
      name: body.name,
      type: body.type ?? 'interest',
      gender: body.gender ?? 'all',
      age_min: body.age_min ?? 18,
      age_max: body.age_max ?? 45,
      countries: body.countries ?? [],
      interests: body.interests ?? [],
      behaviors: body.behaviors ?? [],
      exclusions: body.exclusions ?? [],
      estimated_size_min: body.estimated_size_min ?? null,
      estimated_size_max: body.estimated_size_max ?? null,
      notes: body.notes ?? null,
      status: body.status ?? 'draft',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('audiences')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const supabase = sb()

  const { error } = await supabase.from('audiences').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

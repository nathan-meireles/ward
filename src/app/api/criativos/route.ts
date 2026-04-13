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
    .from('creatives')
    .select('*, products(id, name, images, notreglr_score, notreglr_label, pipeline_status)')
    .eq('project_id', 'notreglr')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('creatives')
    .insert({
      project_id: 'notreglr',
      product_id: body.product_id ?? null,
      title: body.title,
      brief: body.brief ?? null,
      format: body.format ?? 'image',
      platform: body.platform ?? 'both',
      angle: body.angle ?? null,
      status: body.status ?? 'briefing',
      checklist: body.checklist ?? {},
      persona_description: body.persona_description ?? null,
      mental_triggers: body.mental_triggers ?? [],
      awareness_stage: body.awareness_stage ?? null,
      wow_factor: body.wow_factor ?? null,
      cta_strategy: body.cta_strategy ?? null,
      swipe_refs: body.swipe_refs ?? [],
    })
    .select('*, products(id, name, images, notreglr_score, notreglr_label)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('creatives')
    .update(updates)
    .eq('id', id)
    .select('*, products(id, name, images, notreglr_score, notreglr_label)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const supabase = sb()

  const { error } = await supabase.from('creatives').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

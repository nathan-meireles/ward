/**
 * GET /api/pricing-config        — busca config global do projeto
 * PUT /api/pricing-config        — atualiza config global
 */
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
    .from('pricing_config')
    .select('*')
    .eq('project_id', 'notreglr')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const supabase = sb()

  const { data, error } = await supabase
    .from('pricing_config')
    .upsert(
      { project_id: 'notreglr', ...body, updated_at: new Date().toISOString() },
      { onConflict: 'project_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

import { NextRequest, NextResponse } from 'next/server'
import { fetchAdById } from '@/lib/meta/adLibrary'

export async function GET(request: NextRequest) {
  const adId = request.nextUrl.searchParams.get('id')
  if (!adId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const token = process.env.META_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'META_ACCESS_TOKEN not configured' }, { status: 500 })
  }

  try {
    const ad = await fetchAdById(adId, token)
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }
    return NextResponse.json(ad)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * Busca dados de um anúncio específico na Meta Ad Library pelo ID.
 * Usado pelo Swipe File para auto-preencher ao colar uma URL.
 */

const BASE_URL = 'https://graph.facebook.com/v21.0/ads_archive'

const FIELDS = [
  'id',
  'page_id',
  'page_name',
  'ad_creative_bodies',
  'ad_creative_link_titles',
  'ad_creative_link_captions',
  'ad_snapshot_url',
  'ad_delivery_start_time',
  'ad_delivery_stop_time',
  'impressions',
  'publisher_platforms',
].join(',')

export interface MetaAdData {
  id: string
  page_name: string
  page_url: string
  title: string
  body: string
  destination_domain: string | null
  snapshot_url: string
  status: 'ACTIVE' | 'INACTIVE'
  days_running: number
  start_date: string | null
  platforms: string[]
}

function daysAgo(dateStr: string): number {
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function fixMojibake(s: string): string {
  if (!s) return s
  try { return decodeURIComponent(escape(s)) } catch { return s }
}

export async function fetchAdById(adId: string, accessToken: string): Promise<MetaAdData | null> {
  // Ad Library doesn't support direct ID lookup — use search_terms with the ID
  // Alternative: search for exact page by searching the ad ID as string
  const params = new URLSearchParams({
    access_token: accessToken,
    search_terms: adId,
    ad_active_status: 'ALL',
    ad_reached_countries: JSON.stringify(['NL', 'BE', 'DE', 'FR', 'GB', 'IE', 'US']),
    fields: FIELDS,
    limit: '10',
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error(`Meta API error: ${res.status}`)

  const data = await res.json()
  const ads: any[] = data.data ?? []

  // Find the exact ad by ID
  const ad = ads.find((a) => a.id === adId) ?? ads[0]
  if (!ad) return null

  const isActive = !ad.ad_delivery_stop_time
  const startDate = ad.ad_delivery_start_time ?? null
  const rawCaption = (ad.ad_creative_link_captions ?? []).find((c: string) => c?.trim())
  const destinationDomain = rawCaption?.trim().replace(/^www\./i, '') ?? null

  return {
    id: ad.id,
    page_name: ad.page_name ?? '',
    page_url: ad.page_id
      ? `https://www.facebook.com/${ad.page_id}`
      : `https://www.facebook.com/search/pages/?q=${encodeURIComponent(ad.page_name ?? '')}`,
    title: fixMojibake((ad.ad_creative_link_titles ?? []).join(' ').trim()),
    body: fixMojibake((ad.ad_creative_bodies ?? []).join(' ').trim()),
    destination_domain: destinationDomain,
    snapshot_url: ad.ad_snapshot_url ?? '',
    status: isActive ? 'ACTIVE' : 'INACTIVE',
    days_running: startDate ? daysAgo(startDate) : 0,
    start_date: startDate,
    platforms: ad.publisher_platforms ?? [],
  }
}

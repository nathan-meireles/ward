import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractMetaAdId(url: string): string | null {
  try {
    const u = new URL(url)
    // https://www.facebook.com/ads/library/?id=XXXX
    const id = u.searchParams.get('id')
    if (id && /^\d+$/.test(id)) return id
  } catch {
    // not a URL — maybe raw ID
    if (/^\d+$/.test(url.trim())) return url.trim()
  }
  return null
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function daysAgo(dateStr: string): number {
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Bebas_Neue, Calistoga } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const calistoga = Calistoga({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-calistoga',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NOTREGLR — Central de Operações',
  description: 'Plataforma interna NOTREGLR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`h-full ${plusJakarta.variable} ${bebasNeue.variable} ${calistoga.variable}`}
    >
      <body className={`min-h-full ${plusJakarta.className}`}>{children}</body>
    </html>
  )
}

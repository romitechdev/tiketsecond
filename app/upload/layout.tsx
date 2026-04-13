import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiketsecond.com'

export const metadata: Metadata = {
  title: 'Jual Tiket Kereta | TiketSecond',
  description: 'Posting tiket kereta Anda di marketplace TiketSecond. Mudah, cepat, dan aman. Jukkan foto tiket, harga, dan nomor WA untuk dihubungi pembeli.',
  keywords: ['jual tiket', 'posting tiket', 'jual tiket kereta online'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Jual Tiket Kereta - TiketSecond',
    description: 'Posting dan jual tiket kereta Anda dengan mudah di platform TiketSecond.',
    url: `${baseUrl}/upload`,
    type: 'website',
  },
}

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

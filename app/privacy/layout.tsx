import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiketsecond.com'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | TiketSecond',
  description: 'Pelajari bagaimana TiketSecond menggunakan dan melindungi data pribadi Anda. Kebijakan privasi lengkap dan transparan.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Kebijakan Privasi - TiketSecond',
    description: 'Informasi lengkap tentang bagaimana kami melindungi privasi Anda.',
    url: `${baseUrl}/privacy`,
    type: 'website',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

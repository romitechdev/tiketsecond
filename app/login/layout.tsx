import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiketsecond.com'

export const metadata: Metadata = {
  title: 'Masuk | TiketSecond',
  description: 'Masuk ke akun TiketSecond Anda dengan email atau Google. Akses aman menggunakan Supabase Auth.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Masuk - TiketSecond',
    description: 'Masuk ke akun TiketSecond Anda untuk mulai membeli atau menjual tiket kereta.',
    url: `${baseUrl}/login`,
    type: 'website',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

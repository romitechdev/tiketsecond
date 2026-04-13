import type { Metadata } from 'next'
import { Viewport } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Navbar from '@/components/Navbar'

// const inter = Inter({ subsets: ['latin'] })
const inter = { className: '' }

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiketsecond.com'

export const metadata: Metadata = {
  title: {
    template: '%s | TiketSecond',
    default: 'TiketSecond - Jual Beli Tiket Kereta Preloved',
  },
  description: 'Marketplace tiket kereta terlengkap di Indonesia. Cari, beli, dan jual tiket kereta dengan harga terjangkau, proses cepat, dan transaksi aman.',
  keywords: ['tiket kereta', 'tiket preloved', 'jual tiket kereta', 'marketplace kereta', 'tiket murah', 'sistem otomatis'],
  authors: [{ name: 'TiketSecond Team' }],
  creator: 'TiketSecond',
  publisher: 'TiketSecond',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
    languages: {
      id: `${baseUrl}/id`,
      en: `${baseUrl}/en`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'TiketSecond',
    title: 'TiketSecond - Marketplace Tiket Kereta Terlengkap',
    description: 'Cari, beli, dan jual tiket kereta dengan harga terjangkau dan proses cepat. Sistem otomatis untuk urbanis modern.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'TiketSecond - Marketplace Tiket Kereta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TiketSecond - Marketplace Tiket Kereta',
    description: 'Jual beli tiket kereta preloved dengan aman dan terpercaya.',
    images: [`${baseUrl}/og-image.jpg`],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen flex flex-col text-black antialiased`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-[1400px] mx-auto pb-16">
            {children}
          </main>
          
          <footer className="mt-auto border-t-4 border-black py-8">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-black">
                &copy; {new Date().getFullYear()} TIKETSECOND. SEMUA HAK CIPTA DILINDUNGI.
              </p>
              
              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest underline-offset-4">
                <a href="/upload" className="hover:underline">Jadwal</a>
                <a href="#" className="hover:underline">Stasiun</a>
                <a href="#" className="hover:underline">Dukungan</a>
                <a href="/privacy" className="hover:underline">Privasi</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}

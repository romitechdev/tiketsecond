import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiketsecond.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/admin',
          '/activity',
          '/my-tickets',
          '/*?*sort=',
          '/*?*filter=',
        ],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: ['/'],
      },
      {
        userAgent: 'GoogleBot',
        allow: ['/'],
        crawlDelay: 0.5,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

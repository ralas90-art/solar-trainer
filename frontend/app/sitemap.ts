import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://solar-trainer.vercel.app'

  const routes = [
    '',
    '/pricing',
    '/enterprise',
    '/solar-sales-training-assessment',
    '/contact',
    '/privacy',
    '/terms',
    '/acceptable-use',
    '/cookie-policy',
    '/refund-policy',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as any,
    priority: route === '' ? 1 : 0.8,
  }))
}

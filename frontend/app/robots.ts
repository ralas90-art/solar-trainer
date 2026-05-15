import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/manager',
        '/my-training',
        '/settings',
        '/api',
        '/onboarding',
        '/ai-simulator',
        '/certifications',
        '/leaderboards',
        '/team-hub',
        '/kpis',
      ],
    },
    sitemap: 'https://solar-trainer.vercel.app/sitemap.xml',
  }
}

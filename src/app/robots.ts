import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gita-guidance.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/journal/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

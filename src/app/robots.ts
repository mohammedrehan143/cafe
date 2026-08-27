import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zafiroo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/menu', '/track'],
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/menu', '/track'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

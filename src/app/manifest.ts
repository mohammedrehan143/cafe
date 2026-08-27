import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zafiroo Gourmet Artisan Cafe & Cloud Kitchen',
    short_name: 'Zafiroo',
    description: 'Specialty coffees, loaded triple-cooked cheesy fries, thick milkshakes & molten bakes delivered fresh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#4A2818',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

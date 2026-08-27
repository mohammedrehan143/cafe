import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Gourmet Menu | Handcrafted Coffee, Fries, Shakes & Bakes | Zafiroo',
  description: 'Explore our complete artisan menu: Single-Origin Specialty Coffees, Crispy Loaded Cheesy Fries, Creamy Thick Milkshakes, Brioche Sandwiches, Sourdough Pizzas & Molten Lava Brownies.',
  keywords: [
    'zafiroo menu',
    'zafiroo cafe menu',
    'coffee menu bengaluru',
    'cheesy fries indiranagar',
    'kitkat shake',
    'chocolate lava cake',
    'specialty coffee prices',
    'online food order bengaluru'
  ],
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'Zafiroo Full Gourmet Menu | Handcrafted Coffees & Artisan Eats',
    description: 'Specialty Arabica coffees, triple-cooked loaded fries, thick shakes & molten bakes. Fast kitchen dispatch.',
    url: 'https://zafiroo.com/menu',
    siteName: 'Zafiroo Gourmet Cafe & Kitchen',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Zafiroo Gourmet Food & Coffee Menu',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

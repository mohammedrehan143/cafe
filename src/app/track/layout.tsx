import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order Live | Realtime Kitchen & Courier Dispatch | Zafiroo',
  description: 'Track your live Zafiroo kitchen order in realtime. Check chef preparation, packaging seal, assigned courier contact, ETA and live WhatsApp doorstep pin.',
  keywords: [
    'track zafiroo order',
    'zafiroo live tracking',
    'order status zafiroo',
    'cloud kitchen live tracking bengaluru'
  ],
  alternates: {
    canonical: '/track',
  },
  openGraph: {
    title: 'Live Order Tracker | Zafiroo Gourmet Kitchen',
    description: 'Realtime order tracking with live stage pipeline, courier contact & WhatsApp location sharing.',
    url: 'https://zafiroo.com/track',
    siteName: 'Zafiroo Gourmet Cafe & Kitchen',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Zafiroo Live Order Tracking',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

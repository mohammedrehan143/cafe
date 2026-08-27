import type { Metadata } from "next";
import { Asap_Condensed, Poppins, Space_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import { OrderProvider } from "@/context/OrderContext";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import "./globals.css";

const asapCondensed = Asap_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-asap",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-calligraphy",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zafiroo.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Zafiroo | Gourmet Artisan Cafe, Specialty Brews & Cloud Kitchen",
    template: "%s | Zafiroo Gourmet Cafe",
  },
  description: "Handcrafted specialty coffees, thick milkshakes, triple-fried cheesy fries, artisan sandwiches, stone-baked pizzas & molten lava desserts delivered fresh.",
  keywords: [
    "zafiroo",
    "zafiroo cafe",
    "zafiroo kitchen",
    "specialty coffee delivery",
    "cheesy fries indiranagar",
    "kitkat shake",
    "artisan pizza bengaluru",
    "chocolate lava brownie",
    "bengaluru cloud kitchen",
    "specialty cafe indiranagar",
    "fast gourmet food delivery"
  ],
  authors: [{ name: "Zafiroo Culinary Studio" }],
  creator: "Zafiroo Kitchen",
  publisher: "Zafiroo Cafe",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Zafiroo | Gourmet Artisan Cafe, Specialty Brews & Cloud Kitchen",
    description: "Handcrafted specialty coffees, thick milkshakes, loaded crispy fries, artisan sandwiches, stone-baked pizzas & molten lava desserts delivered fresh.",
    url: baseUrl,
    siteName: "Zafiroo Gourmet Cafe & Kitchen",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Zafiroo Gourmet Cafe & Kitchen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zafiroo | Gourmet Artisan Cafe & Cloud Kitchen",
    description: "Specialty coffees, loaded fries, thick milkshakes & molten bakes delivered piping hot.",
    images: ["https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "12.9784;77.6408",
    "ICBM": "12.9784, 77.6408",
  },
};

const jsonLdRestaurant = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Zafiroo Gourmet Cafe & Artisan Kitchen",
  "image": [
    "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
  ],
  "@id": "https://zafiroo.com",
  "url": "https://zafiroo.com",
  "telephone": "+91 90196 31104",
  "priceRange": "₹₹",
  "servesCuisine": [
    "Specialty Coffee",
    "Gourmet Cafe",
    "Artisan Burgers & Fries",
    "Thick Shakes",
    "Desserts & Pastries"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "100 Feet Road, Indiranagar",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "postalCode": "560038",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 12.9784,
    "longitude": 77.6408
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "23:30"
    }
  ],
  "hasMenu": "https://zafiroo.com/menu",
  "acceptsReservations": "False",
  "potentialAction": {
    "@type": "OrderAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://zafiroo.com/menu",
      "inLanguage": "en",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    "deliveryMethod": [
      "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
      "http://purl.org/goodrelations/v1#DeliveryModeMail"
    ]
  }
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zafiroo",
  "url": "https://zafiroo.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://zafiroo.com/menu?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${asapCondensed.variable} ${poppins.variable} ${spaceMono.variable} ${dancingScript.variable} ${playfair.variable}`}>
      <head>
        {/* Google Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRestaurant) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="font-sans bg-[#FFF8F0] text-[#1C1917] antialiased selection:bg-[#4A2818] selection:text-white">
        {/* Global Thin Top Scroll Progress Indicator */}
        <ScrollProgressBar />
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  );
}

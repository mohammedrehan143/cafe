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

export const metadata: Metadata = {
  title: "Zafiroo | Gourmet Artisan Cafe, Specialty Brews & Cloud Kitchen",
  description: "Specialty coffees, thick milkshakes, triple-fried cheesy fries, artisan sandwiches, stone-baked pizzas & molten lava desserts delivered fresh.",
  keywords: ["zafiroo", "zafiroo cafe", "zafiroo kitchen", "specialty coffee delivery", "cheesy fries", "kitkat shake", "artisan pizza", "chocolate lava brownie", "bengaluru cafe"],
  openGraph: {
    title: "Zafiroo | Gourmet Artisan Cafe, Specialty Brews & Cloud Kitchen",
    description: "Handcrafted specialty coffees, thick milkshakes, loaded crispy fries, artisan sandwiches, stone-baked pizzas & molten lava desserts delivered fresh.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Zafiroo Gourmet Cafe & Kitchen",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${asapCondensed.variable} ${poppins.variable} ${spaceMono.variable} ${dancingScript.variable} ${playfair.variable}`}>
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

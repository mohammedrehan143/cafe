import type { Metadata } from "next";
import { Asap_Condensed, Poppins, Space_Mono } from "next/font/google";
import { OrderProvider } from "@/context/OrderContext";
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

export const metadata: Metadata = {
  title: "Zoffers | India's Gourmet Cloud Kitchen & Artisan Culinary Studio",
  description: "Artisan crispy baguettes, charcoal-grilled spiced specialties, and single-origin Chikmagalur sea salt coffees. Handcrafted across Bengaluru, Mumbai & Delhi with live order tracking & Razorpay checkout.",
  keywords: ["zoffers", "cloud kitchen india", "gourmet sandwich delivery", "crispy baguette", "filter coffee delivery", "bengaluru cloud kitchen", "mumbai food delivery", "sea salt coffee"],
  openGraph: {
    title: "Zoffers | India's Gourmet Cloud Kitchen & Artisan Culinary Studio",
    description: "Gourmet culinary craft and crispy artisan creations, delivered hot to your door across India.",
    images: [
      {
        url: "https://banhmivietnam.xyz/img/Hero%20banh%20mi.png",
        width: 1200,
        height: 630,
        alt: "Zoffers Cloud Kitchen India",
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
    <html lang="en" className={`${asapCondensed.variable} ${poppins.variable} ${spaceMono.variable}`}>
      <body className="font-sans bg-[#FFF8F0] text-[#1C1917] antialiased selection:bg-[#E23727] selection:text-white">
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  );
}

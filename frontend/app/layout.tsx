import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  title: "Zephyr | Environmental Health Monitor & Alerts",
  description: "Track local air quality, pollen levels, UV index and get personalized health recommendations based on your environment. Stay informed about how weather affects your well-being.",
  keywords: "environmental health, air quality index, pollen tracker, UV index monitor, weather health alerts, environmental monitoring, health app",
  openGraph: {
    title: "Zephyr - Your Personal Environmental Health Monitor",
    description: "Get real-time alerts about environmental conditions affecting your health. Track air quality, pollen, UV exposure and more at your exact location.",
    images: [
      {
        url: "/hero/photo-collage.webp",
        width: 1200,
        height: 630,
        alt: "Zephyr environmental health dashboard preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zephyr - Environmental Health Monitor & Alerts",
    description: "Stay informed about environmental factors affecting your health with personalized alerts and recommendations.",
    images: ["/hero/main_hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  alternates: {
    canonical: "https://zephyr-health.vercel.app",
    languages: {
      "en-US": "https://zephyr-health.vercel.app",
    },
  },
  verification: {
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="forest">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}

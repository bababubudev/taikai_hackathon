import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Environmental Health Dashboard | Zephyr",
  description: "Monitor real-time environmental factors affecting your health including air quality, pollen, UV index, and more. Get personalized recommendations based on your location and health profile.",
  keywords: "environmental health dashboard, personal health monitor, air quality dashboard, weather health tracking",
  openGraph: {
    title: "Your Personal Environmental Health Dashboard | Zephyr",
    description: "Track real-time environmental health metrics tailored to your location. Get insights and recommendations for better health.",
    images: ["/main/photo-collage.webp"],
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
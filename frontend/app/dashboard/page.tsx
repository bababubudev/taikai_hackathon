import DashboardView from "@/components/dashboard/DashboardView";
import StructuredData from "@/components/StructuredData";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Zephyr Dashboard",
    "applicationCategory": "HealthApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "operatingSystem": "Web",
    "description": "Interactive dashboard showing personalized environmental health metrics at your location."
  };

  return (
    <>
      <StructuredData data={dashboardSchema} />
      <DashboardView />
    </>
  );
}
import Main from "@/components/Main";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zephyr Environmental Health Monitor",
    "url": "https://zephyr-health.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://zephyr-health.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Monitor real-time environmental factors affecting your health and get personalized recommendations based on your location."
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <StructuredData data={homePageSchema} />
      <Main />
    </div>
  );
}

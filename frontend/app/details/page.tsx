"use client";

import DashboardSidebar from "@/components/details/DashboardSidebar";
import StatsOverview from "@/components/details/StatsOverview";
import MapComponent from "@/components/MapComponent";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

interface DetailPageProps {
  currentTab?: string;
}

function DetailPage({ currentTab = "overview" }: DetailPageProps) {
  const [activeTab, setActiveTab] = useState(currentTab);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          // Fall back to IP-based geolocation or default location
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <StatsOverview />
        );

      case "map":
        return <MapComponent
          position={userLocation || [61.4971, 23.7526]}
          value={0.062}
          status={2}
        />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-4 lg:p-8">
        <div className="lg:hidden flex items-center gap-4 mb-4">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
        </div>

        {renderContent()}
      </div>

      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}

export default DetailPage;
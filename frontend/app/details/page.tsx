"use client";

import DashboardSidebar from "@/components/details/ui/DashboardSidebar";
import StatsOverview from "@/components/details/StatsOverview";
import { useEffect, useState } from "react";
import MapView from "@/components/details/MapView";
import { WeatherDataProvider } from "@/providers/WeatherDataContext";
import { Location } from "@/lib/types";
import PollenOverview from "@/components/details/PollenOverview";

function DetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
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
          <StatsOverview
            userLocation={userLocation}
          />
        );

      case "map":
        return (
          <MapView
            isLoading={isLocating}
            userLocation={userLocation}
          />
        )
      case "pollen-overview":
        return (
          <PollenOverview />
        )
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <WeatherDataProvider initialForecastHour={1}>
      <div className="drawer lg:drawer-open min-h-full">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4 lg:p-8 lg:pt-24">
          <div className="lg:hidden flex items-center gap-4 mb-4 ">
            <label htmlFor="dashboard-drawer" className="z-100 btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          {renderContent()}
        </div>

        <div className="drawer-side z-10">
          <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </WeatherDataProvider>

  );
}

export default DetailPage;
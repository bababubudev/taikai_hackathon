"use client"

import React from "react";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {

  return (
    <div className="pt-8 w-80 min-h-full bg-base-200 text-base-content">
      <div className="flex flex-col h-full">
        <div>
          <ul className="space-y-4">
            <li>
              <button
                className={`flex items-center p-2 w-full text-2xl font-light ${activeTab === "overview" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("overview")}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-2 w-full text-2xl font-light ${activeTab === "weather" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("map")}
              >
                Map
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-2 w-full text-2xl font-light ${activeTab === "health-risks" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("health-risks")}
              >
                Health Risks
              </button>
            </li>
          </ul>
        </div>


      </div>
    </div>
  );
}
"use client"

import React from "react";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {

  return (
    <div className="pt-24 w-56 min-h-full bg-base-100 lg:bg-transparent text-base-content">
      <div className="flex flex-col h-full">
        <div>
          <ul>
            <li>
              <button
                className={`flex items-center p-4 w-full text-2xl font-light ${activeTab === "overview" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("overview")}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-4 w-full text-2xl font-light ${activeTab === "map" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("map")}
              >
                My Location
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-4 w-full text-2xl font-light ${activeTab === "pollen-overview" ? "text-primary" : "hover:bg-base-300"}`}
                onClick={() => onTabChange("pollen-overview")}
              >
                Pollen
              </button>
            </li>
          </ul>
        </div>


      </div>
    </div>
  );
}
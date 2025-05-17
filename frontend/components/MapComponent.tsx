"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { SeverityStatus } from "@/lib/types";

interface MapComponentProp {
  position: LatLngExpression;
  value: number;
  status: SeverityStatus;
  statusMessage?: string;
}

const MapComponent = ({ position, value, status, statusMessage }: MapComponentProp) => {
  const getSeverityColor = () => {
    switch (status) {
      case SeverityStatus.HIGH:
        return "#ff6368";
      case SeverityStatus.MEDIUM:
        return "#ffbf00";
      case SeverityStatus.LOW:
        return "#00b5fb";
    }
  }

  // Fix Leaflet icon issues in Next.js
  useEffect(() => {
    // Fix the missing icon issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={11}
      className="min-h-96 w-full rounded-lg shadow-md"
    >
      <TileLayer
        attribution=''
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* User location marker */}
      <Marker position={position}>
        <Popup>
          <div className="text-2xl">Current location</div><br />
          Current UV Index: {value} <br />
          {statusMessage}
        </Popup>
      </Marker>

      {/* UV Index visualization as a circle */}
      <Circle
        center={position}
        pathOptions={{
          fillColor: getSeverityColor(),
          fillOpacity: 0.1,
          color: getSeverityColor()
        }}
        radius={50_000}
      />
    </MapContainer>
  );
};

export default MapComponent;
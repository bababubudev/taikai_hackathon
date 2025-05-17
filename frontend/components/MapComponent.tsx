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
}

const MapComponent = ({ position, value, status }: MapComponentProp) => {
  const getPopupMessage = () => {
    switch (status) {
      case SeverityStatus.HIGH:
        return "High UV alert! Apply sunscreen.";
      case SeverityStatus.MEDIUM:
        return "Moderate UV in your area. Sunscreen reccomnended";
      case SeverityStatus.LOW:
        return "Low UV in your area"
    }
  }

  // Fix Leaflet icon issues in Next.js
  useEffect(() => {
    // Fix the missing icon issue
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
      zoom={13}
      className="h-96 w-full rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />

      {/* User location marker */}
      <Marker position={position}>
        <Popup>
          Your location <br />
          Current UV Index: {value} <br />
          {getPopupMessage()}
        </Popup>
      </Marker>

      {/* UV Index visualization as a circle */}
      <Circle
        center={position}
        pathOptions={{
          fillColor: status === SeverityStatus.HIGH ? "#ff3333" : "#33ff33",
          fillOpacity: 0.1,
          color: status === SeverityStatus.HIGH ? "#cc0000" : "#00cc00"
        }}
        radius={1000}
      />
    </MapContainer>
  );
};

export default MapComponent;
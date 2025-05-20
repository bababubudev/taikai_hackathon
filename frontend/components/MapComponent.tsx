"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { SeverityStatus } from "@/lib/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";


// Updated MapComponent with responsive controls
interface MapComponentProp {
  position: LatLngExpression;
  currentDetail: string;
  value: number;
  status: SeverityStatus;
  statusMessage?: string;
}

function ResponsiveMapControls() {
  const map = useMap();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      map.scrollWheelZoom.disable();

      const enableMapInteractions = () => {
        map.scrollWheelZoom.enable();
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();

        map.getContainer().removeEventListener("touchstart", enableMapInteractions);
      };

      map.getContainer().addEventListener("touchstart", enableMapInteractions);
    } else {
      map.scrollWheelZoom.enable();
    }

    map.invalidateSize();
  }, [isMobile, map]);

  return null;
}

const MapComponent = ({ position, currentDetail, value, status, statusMessage }: MapComponentProp) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  return (
    <div className="relative">
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-base-300 bg-opacity-70 text-center text-sm p-1 rounded-t-lg">
          Tap map to enable interactions
        </div>
      )}
      <MapContainer
        center={position}
        zoom={isMobile ? 10 : 11}
        className="min-h-72 md:min-h-96 w-full rounded-lg shadow-md"
        zoomControl={!isMobile}
        attributionControl={false}
      >
        <ResponsiveMapControls />

        <TileLayer
          attribution=''
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* User location marker */}
        <Marker position={position}>
          <Popup>
            <div className="text-lg font-medium">Current location</div>
            <div className="text-sm mt-1">
              {currentDetail}: {value} <br />
              {statusMessage}
            </div>
          </Popup>
        </Marker>

        <Circle
          center={position}
          pathOptions={{
            fillColor: getSeverityColor(),
            fillOpacity: 0.1,
            color: getSeverityColor()
          }}
          radius={isMobile ? 40_000 : 50_000}
        />

        <div className="leaflet-control leaflet-control-attribution leaflet-control-attribution-custom">
          <a href="https://www.arcgis.com" target="_blank" rel="noopener">ArcGIS</a>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
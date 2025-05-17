import { LatLngExpression } from "leaflet";
import MapComponent from "../MapComponent";
import GeneralCard from "./ui/GeneralCard";
import { MdWindPower } from "react-icons/md";
import { useState } from "react";
import { SeverityStatus } from "@/lib/types";

interface MapViewProps {
  isLoading: boolean;
  userLocation: LatLngExpression | null;
}

function MapView({ isLoading, userLocation = null }: MapViewProps) {
  const [currentDetail, setCurrentDetail] = useState("uv");

  const getCurrentStatus = (): { value: number, status: SeverityStatus } => {
    switch (currentDetail) {
      case "uv":
        return { value: 0.01, status: 2 };
      case "aqi":
        return { value: 0.11, status: 1 };
      case "fp":
        return { value: 0.9, status: 2 };
      default:
        return { value: 0, status: 0 };
    }
  }

  const currentStatus = getCurrentStatus().status;

  const getPopupMessage = () => {
    switch (currentStatus) {
      case SeverityStatus.HIGH:
        return "High UV alert! Apply sunscreen.";
      case SeverityStatus.MEDIUM:
        return "Moderate UV in your area. Sunscreen reccomnended";
      case SeverityStatus.LOW:
        return "Low UV in your area"
    }
  }

  const getCurrentAlertType = () => {
    switch (currentStatus) {
      case SeverityStatus.HIGH:
        return "alert-error";
      case SeverityStatus.MEDIUM:
        return "alert-warning";
      case SeverityStatus.LOW:
        return "alert-success";
      default:
        return "alert-info";
    }
  }

  return (
    <div className="relative min-h-[320px]">
      {!isLoading ? (
        <div className="grid lg:grid-cols-[2fr_1fr] grid-cols-1 gap-4">
          <MapComponent
            position={userLocation || [61.4971, 23.7526]}
            value={getCurrentStatus().value}
            status={getCurrentStatus().status}
            statusMessage={getPopupMessage()}
          />
          <div className="grid gap-4 shadow-md">
            <div className="collapse collapse-plus bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-3" defaultChecked onChange={() => setCurrentDetail("uv")} />
              <div className="collapse-title font-semibold">UV Index Summary</div>
              <div className="collapse-content space-y-4">
                <GeneralCard
                  description="Current UV Level"
                  measurement="0.69"
                  unit={<>mW/cm<sup>2</sup></>}
                />
                <div role="alert" className={`alert ${getCurrentAlertType} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-3" onChange={() => setCurrentDetail("aqi")} />
              <div className="collapse-title font-semibold">Air quality index</div>
              <div className="collapse-content text-sm">
                <GeneralCard
                  description="Air Quality Index"
                  measurement="69"
                  unit={<></>}
                  icon={MdWindPower}
                  color="bg-blue-600/30"
                />
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-3" onChange={() => setCurrentDetail("fp")} />
              <div className="collapse-title font-semibold">Particulates</div>
              <div className="collapse-content text-sm">
                <GeneralCard
                  description="Fine Particles (≤ 2.5 µm)"
                  measurement="4.4"
                  unit={<>µg/m<sup>3</sup></>}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      )}
    </div>
  )
}

export default MapView;
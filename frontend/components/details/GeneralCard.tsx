import React from "react";
import { IconType } from "react-icons";

interface GeneralStatCardProp {
  description: string;
  measurement: string;
  unit: string;
  icon: IconType;
  color?: string;
}


function GeneralCard({ description, measurement, unit, icon, color = "bg-primary/20" }: GeneralStatCardProp) {
  const Icon = icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex">
                <h3 className="text-6xl font-bold">{measurement}</h3>
                <p className="text-xl text-light">{unit}</p>
              </div>
              <p className="text-2xl font-light">{description}</p>
            </div>
            <div className={`${color} p-8 rounded-full text-6xl`}>
              <Icon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralCard;
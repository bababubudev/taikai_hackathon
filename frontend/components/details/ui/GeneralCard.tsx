import React, { JSX } from "react";
import { IconType } from "react-icons";

interface GeneralStatCardProp {
  description: string;
  measurement: string;
  unit: string | JSX.Element;
  icon?: IconType;
  color?: string;
}


function GeneralCard({ description, measurement, unit, icon, color = "bg-primary/20" }: GeneralStatCardProp) {
  const Icon = icon;

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex">
              <h3 className="text-6xl font-bold">{measurement}</h3>
              <p className="text-2xl text-light opacity-60"><sup>{unit}</sup></p>
            </div>
            <p className="text-2xl font-light">{description}</p>
          </div>
          {Icon && (
            <div className={`${color} p-4 rounded-full text-6xl`}>
              <Icon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralCard;
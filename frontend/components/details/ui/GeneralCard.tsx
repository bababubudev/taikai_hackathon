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
    <div className={`card shadow-md ${color}`}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex gap-2">
              <h3 className="text-lg font-bold">{measurement}</h3>
              <p className="text-light opacity-60"><sup>{unit}</sup></p>
            </div>
            <p className="text-sm font-light">{description}</p>
          </div>
          {Icon && (
            <div className={`${color} p-2 rounded-full text-2xl shadow-md overflow-hidden`}>
              <Icon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralCard;
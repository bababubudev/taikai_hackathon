"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimeSelectorProp {
  currentHour: number;
  onChange: (hour: number) => void;
}

function TimeSelector({ currentHour, onChange }: TimeSelectorProp) {
  const [showSelector, setShowSelector] = useState(false);
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    updateLocalTime();

    const interval = setInterval(updateLocalTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateLocalTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setLocalTime(`${hours}:${minutes}`);
  };

  const selectCurrentHour = () => {
    const now = new Date();
    onChange(now.getHours());
    setShowSelector(false);
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="relative">
      <button
        className="btn btn-sm btn-primary flex items-center gap-2"
        onClick={() => setShowSelector(!showSelector)}
        aria-label="Select forecast hour"
      >
        <Clock size={16} />
        <span>Forecast: {formatHour(currentHour)}</span>
      </button>

      {showSelector && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-base-200 rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Select Hour</h3>
            <div className="badge badge-soft">{localTime}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${currentHour === index ? 'btn-primary btn-soft' : 'btn-soft hover:bg-base-300'
                  }`}
                onClick={() => {
                  onChange(index);
                  setShowSelector(false);
                }}
              >
                {formatHour(index)}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="btn btn-sm btn-soft"
              onClick={() => setShowSelector(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-sm btn-soft btn-secondary"
              onClick={selectCurrentHour}
            >
              Use Current Hour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeSelector;
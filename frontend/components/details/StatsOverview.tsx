import GeneralCard from "./GeneralCard";
import { FaWeight, FaTemperatureLow } from "react-icons/fa";

function StatsOverview() {
  return (
    <div>
      <GeneralCard
        description="Prabesh weight"
        measurement="58"
        unit="KG"
        icon={FaWeight}
        color="bg-secondary/30"
      />
      <GeneralCard
        description="Tampere"
        measurement="16"
        unit="°"
        icon={FaTemperatureLow}
        color="bg-primary/30"
      />
    </div>
  );
}

export default StatsOverview;
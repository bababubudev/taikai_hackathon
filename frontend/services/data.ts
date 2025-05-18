import { Location, ZephyrData } from "@/lib/types";

export async function fetchWeatherData(location: Location): Promise<ZephyrData[]> {
  const res = await fetch(`/api/weather?lat=${location.lat}&lng=${location.lng}`);
  if (!res.ok) throw new Error("Network error fetching weather data");
  return res.json();
}

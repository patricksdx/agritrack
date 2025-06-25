import { Cloud, Droplets, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

export default function Temperatura() {
  const [temp, setTemp] = useState<number | null>(null);
  const [humedad, setHumedad] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`;
        const res = await fetch(url);
        const data = await res.json();
        setTemp(data.current_weather.temperature);
        const now = new Date();
        const hourIndex = data.hourly.time.findIndex((t: string) => t.startsWith(now.toISOString().slice(0, 13)));
        setHumedad(data.hourly.relative_humidity_2m[hourIndex] || null);
      } catch {
        setTemp(null);
        setHumedad(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="w-full bg-background rounded-lg shadow-2xl p-6 my-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-8 h-8 text-blue-500" />
          <h3 className="text-lg font-semibold">Condiciones Actuales</h3>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Thermometer className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-sm text-gray-600">Temperatura</p>
            <p className="text-xl font-semibold">
              {loading ? "..." : temp !== null ? `${temp}°C` : "No disponible"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Droplets className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Humedad</p>
            <p className="text-xl font-semibold">
              {loading ? "..." : humedad !== null ? `${humedad}%` : "No disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Cloud, Droplets, Thermometer } from "lucide-react";

export default function Temperatura() {
  return (
    <div className="w-full bg-background rounded-lg shadow-2xl p-6 my-4">
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
            <p className="text-xl font-semibold">24°C</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Droplets className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Humedad</p>
            <p className="text-xl font-semibold">65%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

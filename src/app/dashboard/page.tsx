"use client";

import CardPlanta from "@/components/secundarios/dashboard/cardPlanta";
import Temperatura from "@/components/secundarios/dashboard/temperatura";
import { Suspense, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { pb } from "@/services/pocketbase";
import { PlantasProvider, usePlantas } from "@/lib/provider/plantasProvider";
import Image from "next/image";
import AgregarPlanta from "@/components/secundarios/dashboard/agregarPlanta";

export default function DashboardPage() {
  return (
    <PlantasProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </PlantasProvider>
  );
}

function Dashboard() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });
  const { plantas, refetch } = usePlantas();
  const [search, setSearch] = useState("");


  const filteredPlantas = plantas.filter((planta) =>
    planta.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const plantasMenosHumedad = [...plantas]
    .filter((p) => typeof p.humedad === "number")
    .sort((a, b) => (a.humedad ?? 9999) - (b.humedad ?? 9999))
    .slice(0, 3);


  return (
    <div>
      <AgregarPlanta refetch={refetch} setSearch={setSearch} />
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 mt-10">
          {filteredPlantas.map((planta) => (
            <div key={planta.id} className="flex-[0_0_66%] h-[28rem] min-w-0">
              <CardPlanta planta={planta} />
            </div>
          ))}
        </div>
      </div>
      <Temperatura />
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Plantas con menor humedad</h3>
          <div className="flex flex-col gap-3">
            {plantasMenosHumedad.map((planta) => (
              <div key={planta.id} className="flex items-center bg-blue-50 rounded-lg p-3 gap-4 shadow-lg border">
                <Image
                  src={pb.files.getURL(planta, planta.foto as string)}
                  alt={planta.nombre || "Planta sin foto"}
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-base">{planta.nombre}</div>
                  <div className="text-sm text-gray-600">Humedad: <span className="font-bold">{planta.humedad ?? "-"}%</span></div>
                  <div className="text-xs text-gray-500">Ubicación: {planta.ubicacion || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

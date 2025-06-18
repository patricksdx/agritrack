"use client";

import CardPlanta from "@/components/secundarios/dashboard/cardPlanta";
import CardResumen from "@/components/secundarios/dashboard/cardResumen";
import Nav from "@/components/secundarios/dashboard/nav";
import Temperatura from "@/components/secundarios/dashboard/temperatura";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const searchParams = useSearchParams();
  const isPendientes = searchParams.get("pendientes") !== null;
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const words = isPendientes ? `Pendientes` : `Mis Plantas`;

  const plantas = [
    { id: 1, nombre: "Planta 1" },
    { id: 2, nombre: "Planta 2" },
    { id: 3, nombre: "Planta 3" },
    { id: 4, nombre: "Planta 4" },
    { id: 5, nombre: "Planta 5" },
  ];

  return (
    <div>
      <TextGenerateEffect words={words} />
      <Nav />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {plantas.map((planta) => (
            <div key={planta.id} className="flex-[0_0_66%] min-w-0">
              <CardPlanta />
            </div>
          ))}
        </div>
      </div>

      <Temperatura />
      <div>
        {isPendientes ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Tareas Pendientes</h2>
            <CardResumen />
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Recientes Añadidos</h2>
            <CardResumen />
          </div>
        )}
      </div>
    </div>
  );
}

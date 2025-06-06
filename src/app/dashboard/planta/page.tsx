"use client";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Droplets, Sun, Thermometer } from "lucide-react";
import Image from "next/image";

export default function DashboardPlantaPage() {
  // Datos de ejemplo - estos vendrían de tu API
  const planta = {
    nombre: "Monstera Deliciosa",
    nombreCientifico: "Monstera deliciosa",
    imagen: "/monstera.jpg", // Asegúrate de tener esta imagen en tu carpeta public
    cuidados: {
      agua: "Moderada",
      temperatura: "20-25°C",
      luz: "Indirecta brillante",
    },
    recomendaciones: [
      "Regar cuando el suelo esté seco al tacto",
      "Mantener en un lugar con buena ventilación",
      "Limpiar las hojas regularmente",
    ],
    cuidadosEspecificos: [
      {
        titulo: "Riego",
        descripcion:
          "Regar moderadamente, permitiendo que el suelo se seque entre riegos",
      },
      {
        titulo: "Luz",
        descripcion: "Prefiere luz indirecta brillante, evitar el sol directo",
      },
      {
        titulo: "Humedad",
        descripcion: "Mantener humedad ambiental alta, ideal entre 60-80%",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título y nombre científico */}
      <div className="mb-8">
        <TextGenerateEffect words={planta.nombre} />
        <p className="text-gray-500 text-lg mt-2">{planta.nombreCientifico}</p>
      </div>

      {/* Imagen */}
      <div className="w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          width={800}
          height={800}
          src={planta.imagen}
          alt={planta.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sección de cuidados básicos */}
      <div className="bg-primary rounded-t-4xl absolute left-0">
        <div className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Cuidados Básicos
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Droplets className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Agua</p>
                <p className="text-white font-semibold">
                  {planta.cuidados.agua}
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Thermometer className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Temperatura</p>
                <p className="text-white font-semibold">
                  {planta.cuidados.temperatura}
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Sun className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Luz</p>
                <p className="text-white font-semibold">
                  {planta.cuidados.luz}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de recomendaciones */}
        <div className="text-white p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Recomendaciones</h2>
          <ul className="space-y-3">
            {planta.recomendaciones.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p>{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de cuidados específicos */}
        <div className="text-white p-6">
          <h2 className="text-2xl font-semibold mb-6">Cuidados Específicos</h2>
          <div className="grid gap-6">
            {planta.cuidadosEspecificos.map((cuidado, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{cuidado.titulo}</h3>
                <p className="">{cuidado.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

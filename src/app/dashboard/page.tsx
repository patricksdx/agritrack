"use client";

import CardPlanta from "@/components/secundarios/dashboard/cardPlanta";
import Nav from "@/components/secundarios/dashboard/nav";
import Temperatura from "@/components/secundarios/dashboard/temperatura";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { pb } from "@/services/pocketbase";
import { createPlanta } from "@/services/api/planta";
import { Planta } from "@/services/interfaz/planta";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BuscarPlanta from "@/components/secundarios/dashboard/buscarPlanta";
import { PlantasProvider, usePlantas } from "@/lib/provider/plantasProvider";

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
  const searchParams = useSearchParams();
  const isPendientes = searchParams.get("pendientes") !== null;
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });
  const words = isPendientes ? `Pendientes` : `Mis Plantas`;
  const { plantas, refetch } = usePlantas();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user = pb.authStore.model || pb.authStore.record;
  const form = useForm<Partial<Planta>>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      ubicacion: "",
    },
  });

  const filteredPlantas = plantas.filter((planta) =>
    planta.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // PLANTAS CON MENOS HUMEDAD (top 3)
  const plantasMenosHumedad = [...plantas]
    .filter((p) => typeof p.humedad === "number")
    .sort((a, b) => (a.humedad ?? 9999) - (b.humedad ?? 9999))
    .slice(0, 3);

  const onSubmit = async (data: Partial<Planta>) => {
    if (!user?.id) return;
    const plantaData = { ...data, Users: user.id };
    const result = await createPlanta(plantaData);
    if (result) {
      toast.success("Planta creada correctamente");
      setOpen(false);
      form.reset();
      refetch();
    } else {
      toast.error("Error al crear la planta");
    }
  };

  return (
    <div>
      <TextGenerateEffect words={words} />
      <Nav />
      <div className="flex justify-between items-center mb-2 gap-2">
        <BuscarPlanta onSearch={setSearch} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Agregar Planta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nueva planta</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Nombre" {...form.register("nombre", { required: true })} />
              <Input placeholder="Descripción" {...form.register("descripcion")} />
              <Input placeholder="Ubicación" {...form.register("ubicacion")} />
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {filteredPlantas.map((planta) => (
            <div key={planta.id} className="flex-[0_0_66%] h-[30rem] overflow-hidden min-w-0">
              <CardPlanta planta={planta} />
            </div>
          ))}
        </div>
      </div>
      <Temperatura />
      <div>
        {/* PLANTAS CON MENOS HUMEDAD */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Plantas con menor humedad</h3>
          <div className="flex flex-col gap-3">
            {plantasMenosHumedad.map((planta) => (
              <div key={planta.id} className="flex items-center bg-blue-50 rounded-lg p-3 gap-4 shadow">
                <img
                  src={planta.foto ? planta.foto : "/images/planta.png"}
                  alt={planta.nombre}
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

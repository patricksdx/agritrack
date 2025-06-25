"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlantasByUser, updatePlanta, deletePlanta } from "@/services/api/planta";
import { Planta } from "@/services/interfaz/planta";
import { pb } from "@/services/pocketbase";
import { Droplets, Sun, Thermometer, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showAlertDialog } from "@/lib/context/AlertDialogContext";

function DashboardPlanta() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantaId = searchParams.keys().next().value || "";
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const form = useForm<Partial<Planta>>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      ubicacion: "",
      tipo: "",
    },
  });

  const fetchPlanta = async () => {
    const user = pb.authStore.model || pb.authStore.record;
    if (!user?.id) return;
    const plantas = await getPlantasByUser(user.id);
    const found = plantas.find((p) => p.id === plantaId);
    setPlanta(found || null);
    if (found) {
      form.reset({
        nombre: found.nombre,
        descripcion: found.descripcion,
        ubicacion: found.ubicacion,
        tipo: found.tipo,
      });
    }
  };

  useEffect(() => {
    fetchPlanta();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: Partial<Planta>) => {
    if (!planta) return;
    const updated = await updatePlanta(planta.id, data);
    if (updated) {
      toast.success("Planta actualizada");
      setEditOpen(false);
      fetchPlanta();
    } else {
      toast.error("Error al actualizar");
    }
  };

  const onDelete = async () => {
    if (!planta) return;
    showAlertDialog({
      title: "¿Estás seguro?",
      description: "Esta acción no se puede deshacer",
      variant: "destructive",
      confirmable: true,
      action: async () => {
        const ok = await deletePlanta(planta.id);
        if (ok) {
          toast.success("Planta eliminada");
          router.push("/dashboard");
        } else {
          toast.error("Error al eliminar");
        }
      }
    })
  };

  if (!planta) return <div className="p-8">Cargando planta...</div>;

  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">{planta.nombre}</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Borrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar planta</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Nombre" {...form.register("nombre", { required: true })} />
              <Input placeholder="Descripción" {...form.register("descripcion")} />
              <Input placeholder="Ubicación" {...form.register("ubicacion")} />
              <Select
                value={form.watch("tipo")}
                onValueChange={(value: string) => form.setValue("tipo", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo de planta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo</SelectLabel>
                    <SelectItem value="interior">Interior</SelectItem>
                    <SelectItem value="exterior">Exterior</SelectItem>
                    <SelectItem value="suculenta">Suculenta</SelectItem>
                    <SelectItem value="arbol">Árbol</SelectItem>
                    <SelectItem value="flor">Flor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          width={800}
          height={800}
          src={pb.files.getURL(planta, planta.foto as string)}
          alt={planta.nombre}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="bg-primary rounded-t-4xl absolute left-0">
        <div className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">Datos</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Droplets className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Humedad</p>
                <p className="text-white font-semibold">{planta.humedad ?? "-"}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Thermometer className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Temperatura</p>
                <p className="text-white font-semibold">{planta.temparatura ?? "-"}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-between items-center gap-3">
              <Sun className="w-8 h-8 text-white" />
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/80 text-sm">Luz</p>
                <p className="text-white font-semibold">{planta.luz ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Descripción</h2>
          <p>{planta.descripcion || "Sin descripción"}</p>
        </div>
        <div className="text-white p-6">
          <h2 className="text-2xl font-semibold mb-6">Ubicación</h2>
          <p>{planta.ubicacion || "Sin ubicación"}</p>
        </div>
      </div>
    </div >
  );
}

export default function DashboardPlantaPage() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardPlanta /></Suspense>;
}

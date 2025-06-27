"use client";

import React, { useEffect, useState } from "react";
import { getTareasByUser } from "@/services/api/tarea";
import { createTarea } from "@/services/api/tarea";
import { Tarea } from "@/services/interfaz/tarea";
import { pb } from "@/services/pocketbase";
import { Button } from "@/components/ui/button";
import { deleteTarea } from "@/services/api/tarea";
import { updateTarea } from "@/services/api/tarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PendientesPage() {
  const [usuario, setUsuario] = useState<any>(null); // puedes tiparlo si sabes el tipo
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaProgramada, setFechaProgramada] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  useEffect(() => {
    const user = pb.authStore.model || pb.authStore.record;
    if (!user?.id) return;

    setUsuario(user); // guardamos el usuario

    const fetchTareas = async () => {
      const data = await getTareasByUser(user.id);

      // Filtrar solo las tareas NO completadas
      const tareasIncompletas = data.filter((t) => !t.completada);

      // Ordenar las tareas por fecha si aún lo deseas
      const tareasOrdenadas = tareasIncompletas.sort((a, b) => {
        const fechaA = a.fecha_programada
          ? new Date(a.fecha_programada).getTime()
          : Infinity;
        const fechaB = b.fecha_programada
          ? new Date(b.fecha_programada).getTime()
          : Infinity;
        return fechaA - fechaB;
      });

      setTareas(tareasOrdenadas);
    };

    fetchTareas();
  }, []);

  const handleGuardar = async () => {
    if (!usuario?.id) {
      console.error("Usuario no autenticado.");
      return;
    }

    const nuevaTarea: Partial<Tarea> = {
      tipo,
      descripcion,
      fecha_programada: fechaProgramada,
      User: usuario.id
    };

    const creada = await createTarea(nuevaTarea);
    if (creada) {
      setTareas((prev) => [...prev, creada]);
      setTipo("");
      setDescripcion("");
      setFechaProgramada("");
      setModalAbierto(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Tareas Pendientes</h2>
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <Button>Agregar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[90%] max-w-[95vw] mx-auto">
            <DialogHeader>
              <DialogTitle>Nueva Tarea</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Input
                  id="tipo"
                  className="col-span-3"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="descripcion"
                  className="col-span-3"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha" className="text-right">
                  Fecha
                </Label>
                <Input
                  type="date"
                  id="fecha"
                  className="col-span-3"
                  value={fechaProgramada}
                  onChange={(e) => setFechaProgramada(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // ⬅️ Esto limita al día de hoy en adelante
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleGuardar}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tareas.map((tarea, index) => (
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                key={`${tarea.descripcion || ""}-${
                  tarea.fecha_programada || ""
                }-${index}`}
                className="bg-white shadow-md rounded-2xl p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {tarea.tipo || "Sin tipo"}
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Descripción:</span>{" "}
                  {tarea.descripcion || "Sin descripción"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Fecha:</span>{" "}
                  {tarea.fecha_programada 
                    ? new Date(tarea.fecha_programada).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "Sin fecha"}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={async () => {
                  const fechaHoy = new Date().toISOString().split("T")[0];

                  // Actualiza en la base de datos
                  const actualizada = await updateTarea(tarea.id || "", {
                    completada: true,
                    fecha_completada: fechaHoy,
                  });

                  if (actualizada) {
                    setTareas((prev) => prev.filter((t) => t.id !== tarea.id));
                  }
                }}
                className="text-green-600 focus:bg-green-50"
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar como completada
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setTareaEditando(tarea);
                  setModalEditarAbierto(true);
                }}
                className="text-blue-600 focus:bg-blue-50"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </ContextMenuItem>

              <ContextMenuItem
                onClick={async () => {
                  const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar esta tarea?"
                  );
                  if (!confirmacion) return;
                  const eliminado = await deleteTarea(tarea.id || "");
                  if (eliminado) {
                    setTareas((prev) => prev.filter((t) => t.id !== tarea.id));
                  }
                }}
                className="text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      {/* Modal para editar tarea */}
      <Dialog open={modalEditarAbierto} onOpenChange={setModalEditarAbierto}>
        <DialogContent className="sm:max-w-md w-[90%] max-w-[95vw] mx-auto">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tipo" className="text-right">
                Tipo
              </Label>
              <Input
                id="edit-tipo"
                className="col-span-3"
                value={tareaEditando?.tipo || ""}
                onChange={(e) =>
                  setTareaEditando((prev) =>
                    prev ? { ...prev, tipo: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="edit-descripcion"
                className="col-span-3"
                value={tareaEditando?.descripcion || ""}
                onChange={(e) =>
                  setTareaEditando((prev) =>
                    prev ? { ...prev, descripcion: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fecha" className="text-right">
                Fecha
              </Label>
              <Input
                type="date"
                id="edit-fecha"
                className="col-span-3"
                min={new Date().toISOString().split("T")[0]}
                value={
                  tareaEditando?.fecha_programada
                    ? new Date(tareaEditando.fecha_programada)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setTareaEditando((prev) =>
                    prev ? { ...prev, fecha_programada: e.target.value } : prev
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!tareaEditando?.id) return;

                const actualizada = await updateTarea(tareaEditando.id, {
                  tipo: tareaEditando.tipo,
                  descripcion: tareaEditando.descripcion,
                  fecha_programada: tareaEditando.fecha_programada,
                });

                if (actualizada) {
                  setTareas((prev) =>
                    prev.map((t) => (t.id === actualizada.id ? actualizada : t))
                  );
                  setModalEditarAbierto(false);
                  setTareaEditando(null);
                }
              }}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

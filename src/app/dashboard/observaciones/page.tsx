"use client";

import React, { useEffect, useState } from "react";
import {
  getObservacionesByUser,
  createObservacion,
  updateObservacion,
  deleteObservacion,
} from "@/services/api/observaciones";
import * as XLSX from "xlsx";
import { Observaciones } from "@/services/interfaz/observaciones";
import { pb } from "@/services/pocketbase";
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
import { Trash2, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ObservacionesPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [observaciones, setObservaciones] = useState<Observaciones[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [editando, setEditando] = useState<Observaciones | null>(null);

  const [observacion, setObservacion] = useState("");
  const [humedad, setHumedad] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [luz, setLuz] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    const user = pb.authStore.model || pb.authStore.record;
    if (!user?.id) return;
    setUsuario(user);

    const fetchObservaciones = async () => {
      const data = await getObservacionesByUser(user.id);
      setObservaciones(data);
    };

    fetchObservaciones();
  }, []);

  const handleGuardar = async () => {
    const nueva: Partial<Observaciones> = {
      userId: usuario.id,
      observacion,
      humedad: parseFloat(humedad),
      temperatura: parseFloat(temperatura),
      luz: parseFloat(luz),
    };

    const creada = await createObservacion(nueva);
    if (creada) {
      setObservaciones((prev) => [creada, ...prev]);
      setObservacion("");
      setHumedad("");
      setTemperatura("");
      setLuz("");
      setModalAbierto(false);
    }
  };
  const exportarObservacionesExcel = async () => {
    if (!usuario?.id) {
      alert("Usuario no identificado.");
      return;
    }
    // Trae todas las observaciones del usuario directamente de la API
    const todas = await getObservacionesByUser(usuario.id);
    if (!todas.length) {
      alert("No hay observaciones para exportar.");
      return;
    }
    const datos = todas.map((obs) => ({
      Observación: obs.observacion,
      Humedad: `${obs.humedad} %`,
      Temperatura: `${obs.temperatura} °C`,
      Luz: `${obs.luz} luz`,
      Fecha: obs.created
        ? new Date(obs.created).toLocaleDateString("es-ES")
        : new Date().toLocaleDateString("es-ES"),
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Observaciones");
    XLSX.writeFile(libro, "observaciones.xlsx");
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 rounded px-2 py-1"
            onClick={exportarObservacionesExcel}
            title="Exportar observaciones"
          >
            <Download className="w-5 h-5 text-gray-700" />
            <span className="text-lg font-bold text-gray-800">
              Observaciones
            </span>
          </button>
        </div>
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <Button>Agregar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Observación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {[
                {
                  id: "observacion",
                  label: "Observación",
                  value: observacion,
                  setValue: setObservacion,
                },
                {
                  id: "humedad",
                  label: "Humedad",
                  value: humedad,
                  setValue: setHumedad,
                },
                {
                  id: "temperatura",
                  label: "Temperatura",
                  value: temperatura,
                  setValue: setTemperatura,
                },
                { id: "luz", label: "Luz", value: luz, setValue: setLuz },
              ].map(({ id, label, value, setValue }) => (
                <div key={id} className="flex flex-col">
                  <Label htmlFor={id} className="mb-1">
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type={id !== "observacion" ? "number" : "text"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={handleGuardar}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {observaciones.map((obs, index) => (
          <ContextMenu key={obs.id || index}>
            <ContextMenuTrigger>
              <div className="bg-white shadow-md rounded-2xl p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {obs.observacion || "Sin texto"}
                </h3>
                <p>
                  <strong>Humedad:</strong> {obs.humedad ?? "-"}
                </p>
                <p>
                  <strong>Temperatura:</strong> {obs.temperatura ?? "-"}
                </p>
                <p>
                  <strong>Luz:</strong> {obs.luz ?? "-"}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                className="text-blue-600"
                onClick={() => {
                  setEditando(obs);
                  setModalEditarAbierto(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </ContextMenuItem>
              <ContextMenuItem
                className="text-red-600"
                onClick={async () => {
                  const confirmacion = window.confirm(
                    "¿Eliminar esta observación?"
                  );
                  if (confirmacion && obs.id) {
                    const eliminado = await deleteObservacion(obs.id);
                    if (eliminado) {
                      setObservaciones((prev) =>
                        prev.filter((o) => o.id !== obs.id)
                      );
                    }
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {/* Modal de edición */}
      <Dialog open={modalEditarAbierto} onOpenChange={setModalEditarAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Observación</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              {
                id: "e-observacion",
                label: "Observación",
                field: "observacion",
              },
              { id: "e-humedad", label: "Humedad", field: "humedad" },
              {
                id: "e-temperatura",
                label: "Temperatura",
                field: "temperatura",
              },
              { id: "e-luz", label: "Luz", field: "luz" },
            ].map(({ id, label, field }) => (
              <div key={id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={id} className="text-right">
                  {label}
                </Label>
                <Input
                  id={id}
                  type={field === "observacion" ? "text" : "number"}
                  className="col-span-3"
                  value={editando?.[field as keyof Observaciones] ?? ""}
                  onChange={(e) =>
                    setEditando((prev) =>
                      prev
                        ? {
                            ...prev,
                            [field]:
                              field === "observacion"
                                ? e.target.value
                                : parseFloat(e.target.value),
                          }
                        : prev
                    )
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!editando?.id) return;
                const actualizado = await updateObservacion(
                  editando.id,
                  editando
                );
                if (actualizado) {
                  setObservaciones((prev) =>
                    prev.map((o) => (o.id === actualizado.id ? actualizado : o))
                  );
                  setModalEditarAbierto(false);
                  setEditando(null);
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

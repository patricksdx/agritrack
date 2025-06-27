"use client";

import { useEffect, useRef, useState } from "react";
import { pb } from "@/services/pocketbase";
import { getTareasByUser } from "@/services/api/tarea";
import { Tarea } from "@/services/interfaz/tarea";
import { toast } from "sonner";

export default function TareasAlertas() {
  const [usuario, setUsuario] = useState<any>(null);
  const seMostroToast = useRef(false); // 👈 bandera para mostrar solo una vez

  useEffect(() => {
    const user = pb.authStore.model || pb.authStore.record;
    if (!user?.id || seMostroToast.current) return;

    setUsuario(user);

    const fetchTareas = async () => {
      const data = await getTareasByUser(user.id);

      const tareasIncompletas = data.filter((t) => !t.completada);

      const tareasOrdenadas = tareasIncompletas.sort((a, b) => {
        const fechaA = a.fecha_programada
          ? new Date(a.fecha_programada).getTime()
          : Infinity;
        const fechaB = b.fecha_programada
          ? new Date(b.fecha_programada).getTime()
          : Infinity;
        return fechaA - fechaB;
      });

      const ahora = new Date();
      tareasOrdenadas.forEach((tarea) => {
        if (tarea.fecha_programada) {
          const fechaTarea = new Date(tarea.fecha_programada);
          if (fechaTarea <= ahora) {
            toast(`Tarea pendiente: ${tarea.descripcion}`, {
              description: `Programada para: ${fechaTarea.toLocaleDateString()}`,
              duration: 5000,
            });
          }
        }
      });

      seMostroToast.current = true; // 👈 evita que se muestre otra vez
    };

    fetchTareas();
  }, []);

  return null;
}

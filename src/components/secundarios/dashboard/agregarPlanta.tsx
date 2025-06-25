"use client";

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
import { useRef, useState } from "react";
import { pb } from "@/services/pocketbase";

type AgregarPlantaProps = {
    refetch: () => void;
    setSearch: (search: string) => void;
};

export default function AgregarPlanta({ refetch, setSearch }: AgregarPlantaProps) {
    const [open, setOpen] = useState(false);
    const user = pb.authStore.model || pb.authStore.record;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<Partial<Planta>>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            ubicacion: "",
        },
    });

    const onSubmit = async (data: Partial<Planta>) => {
        if (!user?.id) return;

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.error("Por favor, sube una imagen de la planta.");
            return;
        }

        const formData = new FormData();
        formData.append("imagen", file);
        formData.append("nombre", data.nombre || "");
        formData.append("descripcion", data.descripcion || "");

        try {
            const res = await fetch("/api/analizar", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (result?.output) {
                toast.info("Análisis IA: " + result.output);
            }

            const plantaData = { ...data, Users: user.id };
            const saveResult = await createPlanta(plantaData);

            if (saveResult) {
                toast.success("Planta creada correctamente");
                setOpen(false);
                form.reset();
                refetch();
            } else {
                toast.error("Error al crear la planta");
            }
        } catch (error) {
            toast.error("Error en el análisis o guardado");
            console.error(error);
        }
    };

    return (
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
                        <Input type="file" accept="image/*" ref={fileInputRef} required />
                        <DialogFooter>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

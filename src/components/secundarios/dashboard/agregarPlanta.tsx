"use client";

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
import { getBase64 } from "@/lib/utils/getBase64";
import Image from "next/image";
import PocketBase from "pocketbase";
import { Planta } from "@/services/interfaz/planta";

const pb = new PocketBase("https://pb.jarjacha.com");

type AgregarPlantaProps = {
    refetch: () => void;
    setSearch: (search: string) => void;
};

export default function AgregarPlanta({ refetch, setSearch }: AgregarPlantaProps) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [iaThinking, setIaThinking] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const user = pb.authStore.model || pb.authStore.record;

    const form = useForm({
        defaultValues: {
            nombre: "",
            descripcion: "",
            ubicacion: "",
        },
    });

    const onImageChange = () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: Partial<Planta>) => {
        if (!user?.id) return;

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.error("Por favor, sube una imagen.");
            return;
        }

        try {
            const base64Image = await getBase64(file);
            const prompt = `
Un usuario cultivador urbano ha proporcionado:

- Nombre: ${data.nombre}
- Descripción breve: ${data.descripcion}
- Ubicación: ${data.ubicacion}

Basado en esto y la imagen proporcionada, proporciona:
1. Una descripción detallada de la planta.
2. Consejos de cuidados específicos para departamentos.
3. Datos relevantes como luz, riego, temperatura ideal.
`;

            setIaThinking(true);

            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "gemma3",
                    prompt,
                    images: [base64Image],
                    stream: false,
                }),
            });

            const result = await res.json();
            setIaThinking(false);

            console.log("📦 Análisis IA:", result.response);

            const iaDescripcion = result.response?.trim() || "Descripción generada por IA";

            const plantaData = {
                nombre: data.nombre,
                descripcion: iaDescripcion,
                ubicacion: data.ubicacion,
                Users: user.id,
                adquisicion: new Date().toISOString(),
                fecha_riego: new Date().toISOString(),
                humedad: 0,
                humedad_clima: 0,
                luz: 0,
                temparatura: 0,
                latitud: 0,
                longitud: 0,
            };

            await pb.collection("Plantas").create(plantaData);
            toast.success("Planta registrada con éxito 🚀");
            form.reset();
            setPreview(null);
            setOpen(false);
            refetch();
        } catch (err) {
            console.error(err);
            toast.error("Error al generar descripción o guardar");
            setIaThinking(false);
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
                        <DialogTitle>Nueva Planta</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Input placeholder="Nombre" {...form.register("nombre", { required: true })} />
                        <Input placeholder="Descripción breve" {...form.register("descripcion")} />
                        <Input placeholder="Ubicación" {...form.register("ubicacion")} />
                        <Input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={onImageChange}
                            required
                        />
                        {preview && (
                            <Image src={preview} alt="Previsualización" width={200} height={200} className="rounded-lg" />
                        )}
                        {iaThinking && (
                            <p className="italic text-muted-foreground animate-pulse">
                                Pensando como un botánico experto... 🌱
                            </p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={iaThinking}>
                                {iaThinking ? "Analizando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

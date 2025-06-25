import { Planta } from "@/services/interfaz/planta";
import { pb } from "@/services/pocketbase";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardPlantaProps {
  planta: Planta;
}

export default function CardPlanta({ planta }: CardPlantaProps) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/dashboard/planta?${id}`);
  };

  return (
    <div
      onClick={() => handleClick(planta.id)}
      className="flex flex-col justify-between gap-4 p-4 border-2 bg-primary text-secondary w-full h-full rounded-xl"
    >
      <Image priority src={pb.files.getURL(planta, planta.foto as string)} alt={planta.nombre} width={200} height={200} className="scale-145 mb-10 h-1/2 object-cover" />
      <div className="flex flex-col justify-between gap-2 h-1/2">
        <p className="text-lg font-semibold">{planta.nombre}</p>
        <p className="text-sm">{planta.descripcion || "Sin descripción"}</p>
        <p className="text-xs">Ubicación: {planta.ubicacion || "Sin ubicación"}</p>
      </div>
    </div>
  );
}

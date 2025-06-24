import { Planta } from "@/services/interfaz/planta";
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
      className="flex flex-col gap-4 p-4 border-2 bg-primary text-secondary w-full h-full rounded-lg"
    >
      <Image src={planta.foto ? planta.foto : "/images/planta.png"} alt={planta.nombre} width={200} height={200} />
      <div>{planta.nombre}</div>
      <div>{planta.descripcion || "Sin descripción"}</div>
      <div>{planta.ubicacion || "Sin ubicación"}</div>
      <div>{planta.created ? new Date(planta.created).toLocaleDateString() : ""}</div>
    </div>
  );
}

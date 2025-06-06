import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CardPlanta() {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/dashboard/planta?${id}`);
  };

  return (
    <div
      onClick={() => handleClick("1")}
      className="flex flex-col gap-4 p-4 border-2 bg-primary text-secondary w-full rounded-lg"
    >
      <Image src="/images/planta.png" alt="Planta" width={200} height={200} />
      <div>Nombre de la planta</div>
      <div>Estado de la planta</div>
      <div>Fecha de la última actualización</div>
      <div>Descripcion</div>
    </div>
  );
}

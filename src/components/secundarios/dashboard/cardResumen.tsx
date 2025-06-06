import Image from "next/image";

export default function CardResumen() {
  return (
    <div className="w-full bg-gray-300 rounded-lg p-2 flex">
      <div>
        <Image src="/images/planta.png" alt="Planta" width={100} height={100} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Resumen de la planta</h3>
          <p>Estado de la planta</p>
        </div>
      </div>
    </div>
  );
}

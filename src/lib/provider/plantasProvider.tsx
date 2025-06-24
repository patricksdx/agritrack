import { createContext, useContext, useEffect, useState } from "react";
import { Planta } from "@/services/interfaz/planta";
import { getPlantasByUser } from "@/services/api/planta";
import { pb } from "@/services/pocketbase";

interface PlantasContextType {
    plantas: Planta[];
    refetch: () => Promise<void>;
}

const PlantasContext = createContext<PlantasContextType | undefined>(undefined);

export function usePlantas() {
    const ctx = useContext(PlantasContext);
    if (!ctx) throw new Error("usePlantas debe usarse dentro de PlantasProvider");
    return ctx;
}

export function PlantasProvider({ children }: { children: React.ReactNode }) {
    const [plantas, setPlantas] = useState<Planta[]>([]);
    const user = pb.authStore.model || pb.authStore.record;
    const refetch = async () => {
        const result = await getPlantasByUser(user?.id || "");
        setPlantas(result);
    };
    useEffect(() => {
        refetch();
        // eslint-disable-next-line
    }, []);
    return (
        <PlantasContext.Provider value={{ plantas, refetch }}>
            {children}
        </PlantasContext.Provider>
    );
} 
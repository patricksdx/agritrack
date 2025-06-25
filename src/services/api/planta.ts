import { pb } from "../pocketbase";
import { Planta } from "../interfaz/planta";

export const getPlantasByUser = async (userId: string): Promise<Planta[]> => {
  try {
    const result = await pb.collection("Plantas").getFullList<Planta>({
      filter: `Users = "${userId}"`,
      sort: "-created",
      requestKey: null,
    });
    return result;
  } catch (error) {
    console.error("Error al obtener plantas:", error);
    return [];
  }
};

export const createPlanta = async (
  data: Partial<Planta>
): Promise<Planta | null> => {
  try {
    const result = (await pb.collection("Plantas").create(data)) as Planta;
    return result;
  } catch (error) {
    console.error("Error al crear planta:", error);
    return null;
  }
};

export const updatePlanta = async (
  id: string,
  data: Partial<Planta>
): Promise<Planta | null> => {
  try {
    const result = (await pb.collection("Plantas").update(id, data)) as Planta;
    return result;
  } catch (error) {
    console.error("Error al actualizar planta:", error);
    return null;
  }
};

export const deletePlanta = async (id: string): Promise<boolean> => {
  try {
    await pb.collection("Plantas").delete(id);
    return true;
  } catch (error) {
    console.error("Error al eliminar planta:", error);
    return false;
  }
};

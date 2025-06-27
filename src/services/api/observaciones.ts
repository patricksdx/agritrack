import { pb } from "../pocketbase";
import { Observaciones } from "../interfaz/observaciones";

export const getObservacionesByUser = async (userId: string): Promise<Observaciones[]> => {
  try {
    const result = await pb.collection("Observaciones").getFullList<Observaciones>({
      filter: `userId = "${userId}"`,
      sort: "-created",
      requestKey: null,
    });
    return result;
  } catch (error) {
    console.error("Error al obtener observaciones:", error);
    return [];
  }
};

// Crear una observación
export const createObservacion = async (
  data: Partial<Observaciones>
): Promise<Observaciones | null> => {
  try {
    const result = await pb.collection("Observaciones").create(data) as Observaciones;
    return result;
  } catch (error) {
    console.error("Error al crear observación:", error);
    return null;
  }
};

// Actualizar una observación
export const updateObservacion = async (
  id: string,
  data: Partial<Observaciones>
): Promise<Observaciones | null> => {
  try {
    const result = await pb.collection("Observaciones").update(id, data) as Observaciones;
    return result;
  } catch (error) {
    console.error("Error al actualizar observación:", error);
    return null;
  }
};

 export const deleteObservacion = async (id: string): Promise<boolean> => {
  try {
    await pb.collection("Observaciones").delete(id);
    return true;
  } catch (error) {
    console.error("Error al eliminar observación:", error);
    return false;
  }
};

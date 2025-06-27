import { pb } from "../pocketbase";
import { Tarea } from "../interfaz/tarea";

export const getTareasByUser = async (userId: string): Promise<Tarea[]> => {
  try {
    const result = await pb.collection("Tareas").getFullList<Tarea>({
      filter: `User = "${userId}"`,
      sort: "-fecha_programada",
      requestKey: null,
    });
    return result;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return [];
  }
};

export const createTarea = async (
  data: Partial<Tarea>
): Promise<Tarea | null> => {
  try {
    const result = (await pb.collection("Tareas").create(data)) as Tarea;
    return result;
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return null;
  }
};

export const updateTarea = async (
  id: string,
  data: Partial<Tarea>
): Promise<Tarea | null> => {
  try {
    const result = (await pb.collection("Tareas").update(id, data)) as Tarea;
    return result;
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return null;
  }
};


export const deleteTarea = async (id: string): Promise<boolean> => {
  try {
    await pb.collection("Tareas").delete(id);
    return true;
  } catch (error) {
    console.error("Error al eliminar planta:", error);
    return false;
  }
};